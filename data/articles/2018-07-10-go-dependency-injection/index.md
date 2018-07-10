---
title: Dependency Injection in Go
author: tin-rabzelj
tags:
  - Go
description: An article describing a simple dependency injection package for Go.
cover: ./cover.jpg
---

I have written a small utility package to handle dependency injection in Go (it's in [tinrab/kit](https://github.com/tinrab/kit), among other things). The goal was simplicity and for it to fit well in my current side project.

Some potentially useful features (like optional dependencies) are not yet implemented.

What follows is a possible use case when writing tests for services.

# Declaring services

First step is to declare an interface, and at least one struct that implements it, for every dependency.

## Database

The `SQLDatabase` interface will represent a database connection using Go's `database/sql` package. The actual database is handled withing unexported struct `mySQLDatabase`, which uses [mysql](github.com/go-sql-driver/mysql) driver to connect to a MySQL server.

```go
package main

import (
  "database/sql"

  _ "github.com/go-sql-driver/mysql"
  "github.com/tinrab/kit"
)

type SQLDatabase interface {
  kit.Dependency
  SQL() *sql.DB
}

type mySQLDatabase struct {
  address string
  conn    *sql.DB
}

func NewMySQLDatabase(address string) SQLDatabase {
  return &mySQLDatabase{
    address: address,
  }
}

func (db *mySQLDatabase) SQL() *sql.DB {
  return db.conn
}
```

The `Open` and `Close` functions are required by `kit.Dependency` interface.

```go
func (db *mySQLDatabase) Open() error {
  conn, err := sql.Open("mysql", db.address)
  if err != nil {
    return err
  }
  db.conn = conn
  return nil
}

func (db *mySQLDatabase) Close() {
  db.conn.Close()
}
```

## User repository

User repository will manage users of this application.

Declare a struct to hold user's data.

```go
type User struct {
  ID   uint64
  Name string
}
```

Declare `UserRepository` interface and `mySQLUserRepository` struct.

```go
package main

import "github.com/tinrab/kit"

type UserRepository interface {
  kit.Dependency
  GetUserByID(id uint64) (*User, error)
}

type mySQLUserRepository struct {
  Database SQLDatabase `inject:"database"`
}

func NewMySQLUserRepository() UserRepository {
  return &mySQLUserRepository{}
}

func (r *mySQLUserRepository) Open() error {
  return nil
}

func (r *mySQLUserRepository) Close() {
}
```

Note the `inject` tag on `Database` field. The value of `database` means that the dependency with a name `database` will be injected into this field. A value of `SQLDatabase` will be available after the `Open` function gets called.

Continue by implementing the rest of the interface.

```go
func (r *mySQLUserRepository) GetUserByID(id uint64) (*User, error) {
  user := &User{}
  err := r.Database.SQL().QueryRow("SELECT * FROM users WHERE id = ?", id).
    Scan(&user.ID, &user.Name)
  if err != nil {
    return nil, err
  }
  return user, nil
}
```

## Post repository

Post repository is very similar to the user repository.

```go
type Post struct {
  ID     uint64
  UserID uint64
  Title  string
  Body   string
}
```

Declare the interface and a struct.

```go
package main

import "github.com/tinrab/kit"

type PostRepository interface {
  kit.Dependency
  GetPostsByUser(userID uint64) ([]Post, error)
}

type mySQLPostRepository struct {
  Database SQLDatabase `inject:"database"`
}

func NewMySQLPostRepository() PostRepository {
  return &mySQLPostRepository{}
}

func (r *mySQLPostRepository) Open() error {
  return nil
}

func (r *mySQLPostRepository) Close() {
}
```

The `GetPostsByUser` function queries posts by user's ID.

```go
func (r *mySQLPostRepository) GetPostsByUser(userID uint64) ([]Post, error) {
  rows, err := r.Database.SQL().Query("SELECT * FROM posts WHERE user_id = ?", userID)
  if err != nil {
    return nil, err
  }

  var post Post
  var posts []Post
  for rows.Next() {
    err = rows.Scan(&post.ID, &post.UserID, &post.Title, &post.Body)
    if err != nil {
      return nil, err
    }
    posts = append(posts, post)
  }

  return posts, nil
}
```

## Blog service

The blog service uses previously implemented repositories to provide an API for reading user profiles.

```go
package main

import "github.com/tinrab/kit"

type UserProfile struct {
  User  User
  Posts []Post
}

type BlogService interface {
  kit.Dependency
  GetUserProfile(userID uint64) (*UserProfile, error)
}

type blogServiceImpl struct {
  UserRepository UserRepository `inject:"user.repository"`
  PostRepository PostRepository `inject:"post.repository"`
}

func NewBlogService() BlogService {
  return &blogServiceImpl{}
}

func (*blogServiceImpl) Open() error {
  return nil
}

func (*blogServiceImpl) Close() {
}
```

Both fields should contain non-nil instances, if properly resolved.

```go
func (s *blogServiceImpl) GetUserProfile(userID uint64) (*UserProfile, error) {
  user, err := s.UserRepository.GetUserByID(userID)
  if err != nil {
    return nil, err
  }
  posts, err := s.PostRepository.GetPostsByUser(userID)
  if err != nil {
    return nil, err
  }
  return &UserProfile{
    User:  *user,
    Posts: posts,
  }, nil
}
```

# Resolving dependencies

To inject all dependencies, first provide them by name, then call `Resolve` function.

```go
di := kit.NewDependencyInjection()

di.Provide("database", NewMySQLDatabase("root:123456@tcp(127.0.0.1:3306)/blog"))
di.Provide("user.repository", NewMySQLUserRepository())
di.Provide("post.repository", NewMySQLPostRepository())
di.Provide("blog.service", NewBlogService())

if err := di.Resolve(); err != nil {
  log.Fatal(err)
}
```

`Resolve` will first call `Open` function of every dependency, and then inject them based on tags.

A dependency can be retrieved by name and used freely.

```go
blogService := di.Get("blog.service").(BlogService)

profile, err := blogService.GetUserProfile(1)
if err != nil {
  log.Fatal(err)
}

fmt.Println(profile.User.Name)
for _, post := range profile.Posts {
  fmt.Println(post.Title, "-", post.Body)
}
```

# Testing

Dependency injection is especially helpful during testing.

Here, user and post repositories are mocked in order to test blog service.

Write a fake repository that implements the `UserRepository` interface.

```go
package main

import (
  "errors"
  "testing"

  "github.com/stretchr/testify/assert"
  "github.com/tinrab/kit"
)

type userRepositoryStub struct {
  users map[uint64]*User
}

func (r *userRepositoryStub) Open() error {
  r.users = map[uint64]*User{
    1: &User{ID: 1, Name: "User1"},
    2: &User{ID: 2, Name: "User2"},
    3: &User{ID: 3, Name: "User3"},
  }
  return nil
}

func (r *userRepositoryStub) Close() {
}

func (r *userRepositoryStub) GetUserByID(id uint64) (*User, error) {
  if user, ok := r.users[id]; ok {
    return user, nil
  }
  return nil, errors.New("User not found")
}
```

And the same for `PostRepository` interface.

```go
type postRepositoryStub struct {
  postsByUserID map[uint64][]Post
}

func (r *postRepositoryStub) Open() error {
  r.postsByUserID = map[uint64][]Post{
    1: []Post{
      Post{ID: 1, UserID: 1, Title: "A", Body: "A"},
      Post{ID: 2, UserID: 1, Title: "B", Body: "B"},
    },
  }
  return nil
}

func (r *postRepositoryStub) Close() {
}

func (r *postRepositoryStub) GetPostsByUser(userID uint64) ([]Post, error) {
  if posts, ok := r.postsByUserID[userID]; ok {
    return posts, nil
  }
  return []Post{}, nil
}
```

Here's how a unit test could look like.

```go
package main

import (
  "errors"
  "testing"

  "github.com/stretchr/testify/assert"
  "github.com/tinrab/kit"
)

func TestBlog(t *testing.T) {
  di := kit.NewDependencyInjection()

  di.Provide("database", NewMySQLDatabase("root:123456@tcp(127.0.0.1:3306)/blog"))
  di.Provide("user.repository", &userRepositoryStub{})
  di.Provide("post.repository", &postRepositoryStub{})
  di.Provide("blog.service", NewBlogService())

  if err := di.Resolve(); err != nil {
    t.Fatal(err)
  }

  blogService := di.Get("blog.service").(BlogService)
  profile, err := blogService.GetUserProfile(1)
  if err != nil {
    t.Fatal(err)
  }

  assert.Equal(t, "User1", profile.User.Name)
  assert.Equal(t, uint64(1), profile.Posts[0].UserID)
  assert.Equal(t, "A", profile.Posts[0].Title)
  assert.Equal(t, "A", profile.Posts[0].Body)
  assert.Equal(t, uint64(1), profile.Posts[1].UserID)
  assert.Equal(t, "B", profile.Posts[1].Title)
  assert.Equal(t, "B", profile.Posts[1].Body)
}
```

# Wrapping up

Hopefully with this, my `main` functions wont be millions of lines long.

Check out the [tinrab/kit](https://github.com/tinrab/kit) repository, if you're interested.
