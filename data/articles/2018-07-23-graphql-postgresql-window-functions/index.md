---
title: N+1 Queries in GraphQL Using PostgreSQL Window Functions
author: tin-rabzelj
tags:
  - GraphQL
  - PostgreSQL
  - Go
description: This article shows how to query nested fields on GraphQL server by leveraging PostgreSQL's window functions.
cover: ./cover.jpg
---

This article shows how to query nested fields on a GraphQL server by leveraging PostgreSQL's [window functions](https://www.postgresql.org/docs/9.3/static/functions-window.html).

Full source code is available on [GitHub](https://github.com/tinrab/curly-waddle).

# N+1 problem

Let's say we need to execute a GraphQL query such as this:

```graphql
{
  users {
    id
    name
    posts(pagination: {skip: 0, take: 3}) {
      id
      createdAt
      body
    }
  }
}
```

Top level SQL statement looks like this:

```sql
SELECT "id", "name" FROM "users";
```

Then for each user, we would need to fetch its posts separately.

```sql
SELECT "id", "name" FROM "posts" WHERE "user_id" = 1
ORDER BY "created_at"
OFFSET 0 LIMIT 3;

SELECT "id", "name" FROM "posts" WHERE "user_id" = 2
ORDER BY "created_at"
OFFSET 0 LIMIT 3;

SELECT "id", "name" FROM "posts" WHERE "user_id" = 3
ORDER BY "created_at"
OFFSET 0 LIMIT 3;

-- ...
```

This is necessary, because it's impossible to filter out posts with a condition in an inner scope, which in this case is a scope bounded by user's ID.

Window functions solve this exact problem, and can help with retrieval of the same data, but with a lot fewer select statements.

# Data

The app used to exemplify these nested queries is a simple blogging platform where users can publish blog posts.

GraphQL schema for the public API looks like this:

[graphql/schema.graphql](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/schema.graphql)

```graphql
scalar Time

input Pagination {
  skip: Int!
  take: Int!
}

type User {
  id: String!
  name: String!
  posts(pagination: Pagination): [Post!]!
}

type Post {
  id: String!
  body: String!
  createdAt: Time!
  user: User
}

input CreateUserInput {
  name: String!
}

input CreatePostInput {
  userId: String!
  body: String!
}

type Mutation {
  createUser(input: CreateUserInput!): User
  createPost(input: CreatePostInput!): Post
}

type Query {
  users(pagination: Pagination): [User!]!
  posts(pagination: Pagination): [Post!]!
}
```

Data model is as simple as it gets.

[db/up.sql](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/db/up.sql)

```sql
CREATE TABLE "users"
(
  "id"   CHAR(27)    NOT NULL,
  "name" VARCHAR(64) NOT NULL,

  PRIMARY KEY ("id")
);

CREATE TABLE "posts"
(
  "id"         CHAR(27)                 NOT NULL,
  "user_id"    CHAR(27)                 NOT NULL,
  "body"       TEXT                     NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,

  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
  ON DELETE CASCADE
);
```

The `read_user_posts` function performs the select query for each user's posts, where IDs of all users are passed in inside `user_ids` array parameter.

```sql
DROP FUNCTION IF EXISTS read_user_posts( INT, INT );
CREATE OR REPLACE FUNCTION read_user_posts("user_ids" CHAR(27)[], "skip" INT, "take" INT)
  RETURNS TABLE(
    "id"         CHAR(27),
    "user_id"    CHAR(27),
    "body"       TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE
  ) AS $$
BEGIN
  RETURN QUERY
  SELECT
    "up"."id",
    "up"."user_id",
    "up"."body",
    "up"."created_at"
  FROM (
    SELECT
      "p"."id",
      "p"."user_id",
      "p"."body",
      "p"."created_at",
      ROW_NUMBER()
      OVER (
        PARTITION BY "p"."user_id"
        ORDER BY "p"."id" ) AS "row_number"
    FROM "posts" "p"
    WHERE "p"."user_id" = ANY ("user_ids")
    ORDER BY "p"."id"
  ) "up"
  WHERE "up"."row_number" BETWEEN "skip" + 1 AND "take" + "skip";
END;
$$
LANGUAGE plpgsql;
```

The inner select statement returns results similar to these:

| id       | user_id  | body                                                             | created_at                 | row_number |
|----------|----------|------------------------------------------------------------------|----------------------------|------------|
| 9ri6w2CX | bOdn59pf | quo laudantium voluptas omnis dolorem.                           | 2019-08-29 11:55:44.666937 |      1     |
| sMJTJ4qW | fdeNC5Nu | asperiores blanditiis quia nostrum molestias voluptate iste eos. | 2020-03-13 15:45:44.762905 |      1     |
| FlctHynh | bOdn59pf | voluptatem aspernatur ratione aut et autem.                      | 2018-10-31 16:19:44.922746 |      2     |
| OCYSH4GJ | bOdn59pf | aliquam sit tempore unde.                                        | 2019-08-05 07:25:44.317995 |      3     |
| gdqHlLch | fdeNC5Nu | veritatis ut qui facilis porro facere rem doloribus.             | 2019-09-16 23:01:44.887833 |      2     |

Notice how `row_number` increments for each post by the same user. Because it's partitioned by user ID, it can be used in our GraphQL query.

# GraphQL server

GraphQL server is implemented with the [vektah/gqlgen](https://github.com/vektah/gqlgen) package.

[graphql/graph.go](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/graph.go)

```go
//go:generate gorunpkg github.com/vektah/gqlgen

package graphql
```

Some configuration is necessary in order for `gqlgen` to generate a resolver for user's nested `posts` field.

[graphql/gqlgen.yml](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/gqlgen.yml)

```yaml
schema: schema.graphql
models:
  Post:
    model: github.com/tinrab/curly-waddle/graphql.Post
  User:
    model: github.com/tinrab/curly-waddle/graphql.User
    fields:
      posts:
resolver: true
```

Here are our models.

[graphql/models.go](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/models.go)

```go
package graphql

import (
  "time"
)

type Post struct {
  ID        string    `json:"id"`
  Body      string    `json:"body"`
  CreatedAt time.Time `json:"createdAt"`
  User      User      `json:"user"`
}

type User struct {
  ID    string `json:"id"`
  Name  string `json:"name"`
  Posts []Post `json:"posts"`
}
```

To generate GraphQL implementation simply run the following command.

```bash
go generate graphql/graph.go
```

The `GraphQLServer` struct must implement generated `ResolverRoot` interface.

[graphql/graph.go](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/graph.go)

```go
//go:generate gorunpkg github.com/vektah/gqlgen

package graphql

import (
  "database/sql"
)

type GraphQLServer struct {
  db *sql.DB
}

func NewGraphQLServer(db *sql.DB) *GraphQLServer {
  return &GraphQLServer{
    db: db,
  }
}

func (s *GraphQLServer) Mutation() MutationResolver {
  return &mutationResolver{
    server: s,
  }
}

func (s *GraphQLServer) Query() QueryResolver {
  return &queryResolver{
    server: s,
  }
}

func (s *GraphQLServer) User() UserResolver {
  return &userResolver{
    server: s,
  }
}
```

## Query resolver

Retrieval of users and their posts includes three steps. First, fetch all users while taking pagination into account. Then, enqueue every user's ID into a "loader", which can be read from the context. Finally, respond to nested `posts` query by using this loader to lazily load posts grouped by user ID.

This is essentially a pattern used by [DataLoader](https://github.com/facebook/dataloader).

[graphql/query_resolver.go](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/query_resolver.go)

```go
package graphql

import (
  "context"
)

type queryResolver struct {
  server *GraphQLServer
}

func (r *queryResolver) Users(ctx context.Context, pagination *Pagination) ([]User, error) {
  if pagination == nil {
    pagination = &Pagination{
      Skip: 0,
      Take: 100,
    }
  }

  // Query users
  rows, err := r.server.db.QueryContext(
    ctx,
    "SELECT id, name FROM users OFFSET $1 LIMIT $2",
    pagination.Skip,
    pagination.Take,
  )
  if err != nil {
    return nil, err
  }

  user := &User{}
  var users []User
  var userIDs []string

  // Read all users
  for rows.Next() {
    err = rows.Scan(&user.ID, &user.Name)
    if err != nil {
      return nil, err
    }
    users = append(users, *user)
    userIDs = append(userIDs, user.ID)
  }

  // Enqueue user IDs
  postLoader := ctx.Value(postLoaderKey{}).(*PostLoader)
  if postLoader != nil {
    postLoader.Enqueue(userIDs)
  }

  return users, nil
}
```

Inside user resolver, return posts by using a loader.

[graphql/user_resolver.go](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/user_resolver.go)

```go
package graphql

import (
  "context"
)

type userResolver struct {
  server *GraphQLServer
}

func (r *userResolver) Posts(ctx context.Context, obj *User, pagination *Pagination) ([]Post, error) {
  postLoader := ctx.Value(postLoaderKey{}).(*PostLoader)
  return postLoader.Query(ctx, obj.ID, pagination)
}
```

The `PostLoader` caches all posts for the duration of the request.

[graphql/post_loader.go](https://github.com/tinrab/curly-waddle/blob/1c5604bc2a4a440663dc4d1680730039e0f82bd3/graphql/post_loader.go)

```go
package graphql

import (
  "context"
  "database/sql"
  "net/http"
  "sync"
  "time"

  "github.com/lib/pq"
)

type PostLoader struct {
  pagination Pagination
  userIDs    []string
  data       map[string][]Post
  db         *sql.DB
  mutex      sync.Mutex
}

func NewPostLoader(db *sql.DB) *PostLoader {
  return &PostLoader{
    pagination: Pagination{
      Skip: 0,
      Take: 10,
    },
    data:  make(map[string][]Post),
    db:    db,
    mutex: sync.Mutex{},
  }
}
```

The `Enqueue` function appends user IDs to `data` map as keys.

```go
func (p *PostLoader) Enqueue(userIDs []string) {
  p.mutex.Lock()
  defer p.mutex.Unlock()

  for _, userID := range userIDs {
    p.data[userID] = []Post{}
  }
}
```

The `Query` function can be used to query individual user's posts. It only executes the query if data wasn't already fetched, and it does so for all users at once.

```go
func (p *PostLoader) Query(ctx context.Context, userID string, pagination *Pagination) ([]Post, error) {
  p.mutex.Lock()
  defer p.mutex.Unlock()

  if p.loaded {
    return p.data[userID], nil
  }

  if len(p.data) == 0 {
    return nil, nil
  }

  if pagination != nil {
    p.pagination = *pagination
  }

  var userIDs []string
  for userID := range p.data {
    userIDs = append(userIDs, userID)
  }
  err := p.load(userIDs)
  if err != nil {
    return nil, err
  }
  p.loaded = true

  userLoader := ctx.Value(userLoaderKey{}).(*UserLoader)
  if userLoader != nil {
    userLoader.Enqueue(userIDs)
  }

  return p.data[userID], nil
}
```

Here's a helper function which performs the actual query.

```go
func (p *PostLoader) load() error {
  if len(p.userIDs) == 0 {
    return nil
  }

  p.mutex.Lock()
  defer p.mutex.Unlock()

  rows, err := p.db.Query(
    "SELECT id, user_id, created_at, body FROM read_user_posts ($1, $2, $3)",
    pq.Array(p.userIDs),
    p.pagination.Skip,
    p.pagination.Take,
  )
  if err != nil {
    return err
  }

  post := Post{}
  var userID string
  for rows.Next() {
    err = rows.Scan(&post.ID, &userID, &post.CreatedAt, &post.Body)
    if err != nil {
      return err
    }

    if _, ok := p.data[userID]; !ok {
      p.data[userID] = []Post{}
    }
    p.data[userID] = append(p.data[userID], Post{
      ID:        post.ID,
      CreatedAt: post.CreatedAt,
      Body:      post.Body,
      User: User{
        ID: userID,
      },
    })
  }

  p.userIDs = []string{}

  return nil
}
```

# Conclusion

To test the server out, first start the database:

```bash
docker-compose up -d
```

Optionally, insert fake data:

```bash
vgo run ./cmd/fakedata/main.go
```

And start the GraphQL server:

```bash
vgo run .
```

Send a query to `http://localhost:8080/graphql`, for example this:

```graphql
{
  users(pagination: {skip: 0, take: 3}) {
    id
    name
    posts(pagination: {skip: 0, take: 2}) {
      id
      createdAt
      body
    }
  }
}
```

Here's a `curl` command:

```bash
curl localhost:8080/graphql -XPOST -d '{"query":"{users(pagination:{skip:0,take:3}){id,name,posts(pagination:{skip:0,take:2}){id,createdAt,body,}}}"}'
```

Complete source code of this project is available on [GitHub](https://github.com/tinrab/curly-waddle).
