---
title: "Build a Todo List with Angular and Google App Engine - Part 1"
slug: "todo-list-angular-google-app-engine-part-1"
author: "tin-rabzelj"
tags: ["Go", "Google App Engine"]
date: "2017-08-30"
description: "The world needs more todo lists. Let us deliver another one."
keywords: ["Todo List", "Angular", "Go", "Google App Engine"]
---

The world needs more todo lists. Let us deliver another one.

This project was developed on Ubuntu 17.04 using the following technologies:

* Angular 4.3.6
* Angular CLI 1.3.2 ([Installation](https://github.com/angular/angular-cli) instructions)
* Google Cloud SDK 169.0.0 ([Installation](https://cloud.google.com/sdk/docs/) instructions, also install `google-cloud-sdk-app-engine-go` component)
* Angular Material 2 (2.0.0-beta.8)

A quick preview of finished product.

{{< image name="finished.gif" simple="true" fit="false" >}}

In the first part you'll create a back-end service using Google App Engine, and in the second part a front-end app using Angular.

# Getting started

To authenticate users with Google, you need to [create a Google API Console project](https://developers.google.com/identity/sign-in/web/devconsole-project) and obtain your client ID. Under **Authorized JavaScript origins** enter all URIs you'll be using. That includes `http://localhost:4200` for Angular development server and `https://[PROJECT_ID].appspot.com` for hosting on Google App Engine.

Create a project directory for your back-end service containing `app.yaml` file.

{{< code lang="yaml" >}}
runtime: go
api_version: go1
handlers:
- url: /.*
  script: _go_app
env_variables:
  CLIENT_ID: '[CLIENT_ID]'
{{< /code >}}

# Signing in users

To begin, you'll create an endpoint for signing in Google users. ID tokens will be validated using Google's `tokeninfo` endpoint and subsequent requests will carry custom session token. This approach is only sufficient for **development**. For production, you'll want to use a JWT library and Google's public keys. See [Authenticate with a backend server](https://developers.google.com/identity/sign-in/web/backend-auth).

Install necessary Go packages.

{{< terminal >}}
go get github.com/rs/cors \
github.com/gorilla/mux
{{< /terminal >}}

Create `app.go` file.

{{< code lang="go" >}}
package todo

var (
	clientID string
)

func init() {
	// Read configuration environment variables
	clientID = os.Getenv("CLIENT_ID")
	// Register routes
	r := mux.NewRouter()
	r.HandleFunc("/api/signin", signInHandler).
		Methods("POST")
	// Start HTTP server
	http.Handle("/", cors.AllowAll().Handler(r))
}
{{< /code >}}

{{% note %}}
Imports are skipped for brevity. Use [goimports](https://godoc.org/golang.org/x/tools/cmd/goimports) tool to add them. Code editors, such as [Visual Studio Code](https://code.visualstudio.com/) have plugins for it.
{{% /note %}}

## Sign-in handler

Write a couple of utility functions inside `utility.go` file for future use.

{{< code lang="go" >}}
package todo
func responseError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
func responseJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
func readJSON(rc io.ReadCloser, v interface{}) error {
	defer rc.Close()
	data, err := ioutil.ReadAll(rc)
	if err != nil {
		return err
	}
	err = json.Unmarshal(data, v)
	if err != nil {
		return err
	}
	return nil
}
{{< /code >}}

Declare `signInHandler` handler function inside `signin_handler.go` file.

{{< code lang="go" >}}
package todo

type SignInResponse struct {
	UserID       string `json:"userId"`
	SessionToken string `json:"sessionToken"`
}

func signInHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	// Verify ID token provided in header
	token := r.Header.Get("Authorization")
	userID, err := verifyToken(ctx, token)
	if err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Invalid ID token", http.StatusBadRequest)
		return
	}
	// Generate a new session token and store it in Memcache
	sessionToken := generateSessionToken()
	if err := memcache.Set(ctx, &memcache.Item{
		Key:        "session:" + sessionToken,
		Value:      []byte(userID),
		Expiration: 10 * time.Hour,
	}); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not start user session", http.StatusInternalServerError)
		return
	}
	// Return session data
	responseJSON(w, SignInResponse{userID, sessionToken})
}
{{< /code >}}

The code above verifies ID token by calling `verifyToken` function, which returns user's ID. If validation is successful, a new session token is generated and cached in Memcache for 1 hour.

Declare the `verifyToken` function inside `signin_handler.go`.

{{< code lang="go" >}}
func verifyToken(ctx context.Context, token string) (string, error) {
	client := urlfetch.Client(ctx)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token)
	if err != nil {
		return "", err
	}
	var bodyJSON map[string]interface{}
	if err := readJSON(resp.Body, &bodyJSON); err != nil {
		return "", err
	}
	if aud, ok := bodyJSON["aud"].(string); ok {
		if clientID != aud {
			return "", errors.New("Invalid client ID")
		}
	} else {
		return "", errors.New("Invalid ID token")
	}
	if sub, ok := bodyJSON["sub"].(string); ok {
		return sub, nil
	}
	return "", errors.New("Invalid ID token")
}
{{< /code >}}

With the current version of Google App Engine you have to import context from `golang.org/x/net/context`. Later it will work with just a standard `context`.

Also declare the `generateSessionToken` function.

{{< code lang="go" >}}
var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-")
func generateSessionToken() string {
	const n = 64
	data := make([]byte, n)
	rand.Read(data)
	token := make([]rune, n)
	for i := range data {
		token[i] = letters[int(data[i])%len(letters)]
	}
	return string(token)
}
{{< /code >}}

This simply creates a string of 64 random characters.

## Authentication middleware

To simplify authentication code, declare a new handler type, which extends `http.HandlerFunc`. For this, create a new file `auth.go`.

{{< code lang="go" >}}
package todo

type AuthenticatedHandler func(context.Context, http.ResponseWriter, *http.Request, string)
{{< /code >}}

`AuthenticatedHandler` receives the context, user's ID as a string and parameters from the standard handler.

Now create a middleware between authenticated handler functions and the old `http.HandlerFunc`.

{{< code lang="go" >}}
func authenticate(handler AuthenticatedHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := appengine.NewContext(r)
		// Get session token from header
		sessionToken := r.Header.Get("Authorization")
		if len(sessionToken) == 0 {
			responseError(w, "Invalid session token", http.StatusUnauthorized)
			return
		}
		// Fetch user's ID from Memcache
		sessionItem, err := memcache.Get(ctx, "session:"+sessionToken)
		if err != nil {
			log.Errorf(ctx, "%v", err)
			responseError(w, "Could not authenticate", http.StatusUnauthorized)
			return
		}
		// Call handler function
		userID := string(sessionItem.Value)
		handler(ctx, w, r, userID)
	}
}
{{< /code >}}

The code above checks Memcache for existing session and fetches the ID of user making the request. It then forwards data to the supplied handler function.

To see how it works, declare a dummy handler and update the `init` function inside `app.go` file.

{{< code lang="go" mark="8-9,13-15" >}}
func init() {
	// Read configuration environment variables
	clientID = os.Getenv("CLIENT_ID")
	// Register routes
	r := mux.NewRouter()
	r.HandleFunc("/api/signin", signInHandler).
		Methods("POST")
	r.HandleFunc("/api/hello", authenticate(helloHandler)).
		Methods("GET")
	// Start HTTP server
	http.Handle("/", cors.AllowAll().Handler(r))
}
func helloHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, userID string) {
	responseJSON(w, "Hello, "+userID)
}
{{< /code >}}

Test it using cURL. You can obtain the ID token using [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).

{{< terminal >}}
curl localhost:8080/api/signin -X POST \
-H 'Authorization:[ID_TOKEN]'
curl localhost:8080/api/hello \
-H 'Authorization:[SESSION_TOKEN]'
{{< /terminal >}}

You should be getting your own Google ID in the response body.

# Todo handlers

Users can create, read, update and delete their own todos. Each use case will be implemented in its own handler function.

Declare `Todo` struct inside `todo_handlers.go` file.

{{< code lang="go" >}}
package todo

type Todo struct {
	ID        string    `json:"id" datastore:"-"`
	UserID    string    `json:"userId"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"createdAt"`
}
{{< /code >}}

The `ID` field has `datastore` tag set to `"-"`, which tells Datastore to ignore this field when inserting. Each Datastore entity already has `datastore.Key` associated with it, but auto generated ID will be of type `int64`. Declared `ID` field will be used for encoding in JSON, where integers can't be correctly expressed with double-precision floating-point numbers.

## Create

Write `createTodoHandler` handler function. 

{{< code lang="go" >}}
func createTodoHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, userID string) {
	// Read todo from request body
	var todo Todo
	if err := readJSON(r.Body, &todo); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not read todo", http.StatusBadRequest)
		return
	}
	todo.UserID = userID
	todo.CreatedAt = time.Now()
	// Store todo
	key := datastore.NewIncompleteKey(ctx, "Todo", nil)
	if key, err := datastore.Put(ctx, key, &todo); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not create todo", http.StatusInternalServerError)
	} else {
		todo.ID = strconv.FormatInt(key.IntID(), 10)
		responseJSON(w, todo)
	}
}
{{< /code >}}

Update the `init` function inside `app.go` file to register `createTodoHandler` handler.

{{< code lang="go" >}}
r.HandleFunc("/api/todos", authenticate(createTodoHandler)).
  Methods("POST")
{{< /code >}}

See if it works.

{{< terminal >}}
curl localhost:8080/api/todos \
-H 'Authorization:[SESSION_TOKEN]' \
-d '{"title":"write more code"}'
{{< /terminal >}}

## Read

Declare `listTodosHandler` handler function which reads todos made by the current user and orders them by creation time.

{{< code lang="go" >}}
func listTodosHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, userID string) {
	var todos []Todo
	// Query todos by user's ID and order them by creation time
	query := datastore.NewQuery("Todo").
		Filter("UserID =", userID).
		Order("-CreatedAt")
	// Execute query
	if keys, err := query.GetAll(ctx, &todos); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not read todos", http.StatusInternalServerError)
	} else {
		// Return empty array instead of 'null'
		if len(todos) == 0 {
			responseJSON(w, []Todo{})
			return
		}
		// Set string IDs
		for i := range todos {
			todos[i].ID = strconv.FormatInt(keys[i].IntID(), 10)
		}
		responseJSON(w, todos)
	}
}
{{< /code >}}

Ordering by `CreatedAt` field requires setting up an index. A new file is created automatically by development Google App Engine server, if not, you can do it manually by creating a `index.yaml` file inside project directory with the following content.

{{< code lang="yaml" >}}
indexes:
- kind: Todo
  properties:
  - name: UserID
  - name: CreatedAt
    direction: desc
{{< /code >}}

Update the `init` function.

{{< code lang="go" >}}
r.HandleFunc("/api/todos", authenticate(listTodosHandler)).
  Methods("GET")
{{< /code >}}

Try it out.

{{< terminal >}}
curl localhost:8080/api/todos \
-H 'Authorization:[SESSION_TOKEN]'
{{< /terminal >}}

## Update

Updating is a bit more complex. You need to check if requested todo exists and belongs to the current user before updating its title. Todo's ID is passed in as a path variable and new title inside request body.

{{< code lang="go" >}}
func updateTodoHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, userID string) {
	// Parse ID
	id := mux.Vars(r)["id"]
	todoID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		responseError(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}
	// Get old todo
	var todo Todo
	if err := getOwningTodo(ctx, userID, todoID, &todo); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not read old todo", http.StatusBadRequest)
		return
	}
	// Read new todo from request body
	var newTodo Todo
	if err := readJSON(r.Body, &newTodo); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not read request body", http.StatusBadRequest)
		return
	}
	// Update todo
	todo.Title = newTodo.Title
	key := datastore.NewKey(ctx, "Todo", "", todoID, nil)
	if _, err := datastore.Put(ctx, key, &todo); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not update todo", http.StatusInternalServerError)
		return
	}
	todo.ID = id
	responseJSON(w, todo)
}
{{< /code >}}

Also declare a utility function which reads a todo by ID and checks if it belongs to the current user.

{{< code lang="go" >}}
func getOwningTodo(ctx context.Context, userID string, id int64, todo *Todo) error {
	// Fetch todo
	key := datastore.NewKey(ctx, "Todo", "", id, nil)
	if err := datastore.Get(ctx, key, todo); err != nil {
		return err
	}
	// Check if it belongs to the current user
	if todo.UserID != userID {
		return errors.New("Not own todo")
	}
	return nil
}
{{< /code >}}

Update the `init` function.

{{< code lang="go" >}}
r.HandleFunc("/api/todos/{id}", authenticate(updateTodoHandler)).
  Methods("POST")
{{< /code >}}

Make sure it works.

{{< terminal >}}
curl localhost:8080/api/todos/[TODO_ID] -H 'Authorization:[SESSION_TOKEN]' \
-d '{"title":"new title"}'
{{< /terminal >}}

## Delete

Similarly as with updating, deleting requires checking validity before performing the deletion.

{{< code lang="go" >}}
func deleteTodoHandler(ctx context.Context, w http.ResponseWriter, r *http.Request, userID string) {
	// Parse ID
	id := mux.Vars(r)["id"]
	todoID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		responseError(w, "Invalid todo ID", http.StatusBadRequest)
		return
	}
	// Get todo to check if it can be deleted
	var todo Todo
	if err := getOwningTodo(ctx, userID, todoID, &todo); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not read todo", http.StatusInternalServerError)
		return
	}
	// Delete todo
	key := datastore.NewKey(ctx, "Todo", "", todoID, nil)
	if err := datastore.Delete(ctx, key); err != nil {
		log.Errorf(ctx, "%v", err)
		responseError(w, "Could not delete todo", http.StatusInternalServerError)
		return
	}
	todo.ID = id
	responseJSON(w, todo)
}
{{< /code >}}

Register it in the `init` function.

{{< code lang="go" >}}
r.HandleFunc("/api/todos/{id}", authenticate(deleteTodoHandler)).
  Methods("DELETE")
{{< /code >}}

Try deleting an existing todo.

{{< terminal >}}
curl localhost:8080/api/todos/[TODO_ID] -X DELETE \
-H 'Authorization:[SESSION_TOKEN]'
{{< /terminal >}}

# Wrapping up

That's it for the back-end. In the next part you'll create the front-end and deploy it to the Google App Engine.

Second part: coming soon.

Source code for this tutorial is available on [GitHub](https://github.com/tinrab/todo-angular-appengine).
