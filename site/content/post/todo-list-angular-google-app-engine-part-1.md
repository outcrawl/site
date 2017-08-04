---
title: "Build a Todo List with Angular and Google App Engine - Part 1"
slug: "todo-list-angular-google-app-engine-part-1"
author: "tin-rabzelj"
tags: ["Angular", "Typescript", "Go"]
date: "2017-07-27"
thumbnail: "todo-list-angular-google-app-engine"
description: "The world needs more todo lists. Let us deliver another one."
keywords: ["Todo List", "Angular", "Go", "App Engine"]
---

The world needs more todo lists. Let us deliver another one.

This project was developed on Ubuntu 17.04 using the following technologies:

* Angular 4.3.1
* Angular CLI 1.3.0-rc.3 ([Installation](https://github.com/angular/angular-cli) instructions)
* Google Cloud SDK 161.0.0 ([Installation](https://cloud.google.com/sdk/docs/) instructions, also install `google-cloud-sdk-app-engine-go` component)
* Bootstrap 4.0.0-alpha.6

A quick preview of finished product.

{{< image name="finished.gif" >}}

# Getting started

Users will sign in with their Google account. Follow [this](https://developers.google.com/identity/sign-in/web/devconsole-project) guide to create a new Google API Console project and obtain your Client ID. Under **Authorized JavaScript origins** enter `http://localhost:4200`, `http://localhost:8080` and `https://[YOUR_PROJECT_ID].appspot.com`.

Create a folder for the server-side code.

{{< terminal >}}
mkdir server
cd server
{{< /terminal >}}

All source files will be created inside that folder.

# Back-end service

Create `app.yaml` file.

{{< code lang="yaml" >}}
runtime: go
api_version: go1
handlers:
- url: /.*
  script: _go_app
env_variables:
  CLIENT_ID: 'YOUR_CLIENT_ID'
{{< /code >}}

Replace `YOUR_CLIENT_ID` with your actual Client ID so it can be passed in as a environment variable.

Create `app.go` file, which will be the main entry point for your service.

{{< code lang="go" >}}
package todo
func init() {
	r := mux.NewRouter()
	r.HandleFunc("/api/hello", hello).Methods("GET")
	http.Handle("/api/", cors.AllowAll().Handler(r))
}
func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hello, world")
}
{{< /code >}}

Use `init` function, and not the usual `main` function. You'll also have to install 2 Go packages.

{{< terminal output="2" >}}
go get github.com/gorilla/mux \
github.com/rs/cors
{{< /terminal >}}

{{% info %}}
Set up your text editor to use [goimports](https://godoc.org/golang.org/x/tools/cmd/goimports) tool, which will auto import all necessary packages. [Visual Studio Code](https://code.visualstudio.com/) does this nicely with [Go](https://marketplace.visualstudio.com/items?itemName=lukehoban.Go) extension.
{{% /info %}}

With [gorilla/mux](https://github.com/gorilla/mux) package dealing with HTTP will be less cumbersome. Enabling cross-origin HTTP requests (CORS) with [rs/cors](https://github.com/rs/cors) package avoids some problems while developing.

Open another terminal window, navigate to project's root folder, run the following commands and keep the server running.

{{< terminal >}}
dev_appserver.py .
{{< /terminal >}}

At this point, your back-end service should work properly. Test it with cURL.

{{< terminal output="2" >}}
curl localhost:8080/api/hello
hello, world
{{< /terminal >}}

## Signing in users

Instead of using JWT, you'll design your own system. A secret token will be auto-generated string consisting of 64 random alphanumeric characters, "_" and "-". Sessions will be stored inside Memcache.

First create a new source file `utility.go` for some utility functions. Write the `generateToken` function, which generates a session token.

{{< code lang="go" >}}
var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-")

func generateToken() string {
	data := make([]byte, 64)
	rand.Read(data)
	token := make([]rune, 64)
	for i := range data {
		token[i] = letters[int(data[i])%len(letters)]
	}
	return string(token)
}
{{< /code >}}

Make sure you're using rand from `crypto/rand` package and not `math/rand`.

Writing a HTTP response requires setting headers, changing status code upon error, and serializing response data to JSON. Implement a couple of helper functions inside `utility.go` for writing success and failure responses.

{{< code lang="go" >}}
func responseError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func responseJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
{{< /code >}}

It's also handy to have a function, which parser JSON from POST or PUT request's body into a map.

{{< code lang="go" >}}
func readJSON(rc io.ReadCloser) (map[string]interface{}, error) {
	defer rc.Close()
	data, err := ioutil.ReadAll(rc)
	if err != nil {
		return nil, err
	}
	var jsonData map[string]interface{}
	err = json.Unmarshal(data, &jsonData)
	if err != nil {
		return nil, err
	}
	return jsonData, nil
}
{{< /code >}}

That's enough of helper functions. Update the `app.go` file to handle the sign-in route and read the Client ID environment variable.

{{< code lang="go" line="1-3,6,8" >}}
var (
	clientID string
)

func init() {
	clientID = os.Getenv("CLIENT_ID")
	r := mux.NewRouter()
	r.HandleFunc("/api/signin/{token}", signin).Methods("GET")
	http.Handle("/api/", cors.AllowAll().Handler(r))
}
{{< /code >}}

JWT Token, returned by Google API, is passed in as a named parameter to a HTTP GET request.

Declare the `signin` handler inside `app.go` file.

{{< code lang="go" >}}
type User struct {
	ID           string `json:"id"`
  SessionToken string `json:"sessionToken"`
}

func signin(w http.ResponseWriter, r *http.Request) {
  vars := mux.Vars(r)
	googleToken := vars["token"]
	ctx := appengine.NewContext(r)
	userID, err := verifyToken(ctx, googleToken)
	if err != nil {
		responseError(w, "", http.StatusBadRequest)
		return
	}
	responseJSON(w, signInResult{userID})
}
{{< /code >}}

If auto-import tool imports `context` package, change it to `golang.org/x/net/context`.

You don't know which user supplied token belongs to. An easy way to validate the token is by using Google's `tokeninfo` endpoint ([more info](https://developers.google.com/identity/sign-in/web/backend-auth)). Making a HTTP GET or POST request to `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=[ID_TOKEN]` returns JSON data in the following format.

{{< code lang="json" >}}
{
 "iss": "https://accounts.google.com",
 "sub": "110169484474386276334",
 "azp": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
 "aud": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
 "iat": "1433978353",
 "exp": "1433981953",
 "email": "testuser@gmail.com",
 "email_verified": "true",
 "name" : "Test User",
 "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
 "given_name": "Test",
 "family_name": "User",
 "locale": "en"
}
{{< /code >}}

This method of verifying tokens is only meant for testing, and not for production use. You're interested in `sub` field, which is short for "Subject"&mdash;a user. To verify that this token actually came from your client, you need to check if `aud` field matches your Client ID. Write a function that does all of that in `app.go` file.

{{< code lang="go" >}}
const tokenInfoURL = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="

func verifyToken(ctx context.Context, token string) (string, error) {
	client := urlfetch.Client(ctx)
	resp, err := client.Get(tokenInfoURL + token)
	if err != nil {
		return "nil", err
	}
	bodyJSON, err := readJSON(resp.Body)
	if err != nil {
		return "", err
	}
	if aud, ok := bodyJSON["aud"].(string); ok {
		if clientID != aud {
			return "", errors.New("invalid client id")
		}
	} else {
		return "", errors.New("invalid id token")
	}
	if sub, ok := bodyJSON["sub"].(string); ok {
		return sub, nil
	}
	return "", errors.New("invalid id token")
}
{{< /code >}}

`verifyToken` function returns user's ID if validation succeeded. Test it out using cURL.

{{< terminal output="2" >}}
curl localhost:8080/api/signin/[YOUR_ID_TOKEN]
{"userId":"111217297807827209130"}
{{< /terminal >}}

{{% info %}}
You can obtain Google ID token using [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/). You'll need to include `https://developers.google.com/oauthplayground` URL under **Authorized redirect URIs** in your Google API Console's project.
{{% /info %}}

By having access to user's ID, session can now be stored inside Memcache. Update the `signin` handler to store and return generated session token.

{{< code lang="go" line="10-20" >}}
func signin(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	googleToken := vars["token"]
	ctx := appengine.NewContext(r)
	userID, err := verifyToken(ctx, googleToken)
	if err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	}
	token := generateToken()
	session := &memcache.Item{
		Key:        userID,
		Value:      []byte(token),
		Expiration: 1 * time.Hour,
	}
	if err := memcache.Set(ctx, session); err != nil {
		responseError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	responseJSON(w, User{userID, token})
}
{{< /code >}}

Having your own session tokens wont require calling Google APIs on every request. All you have to do is call Memcache to retrieve it. You also gain control of expiration time. In the example above, expiration is set to 1 hour. You can change this as you wish.

To insert sessions into Memcache use `memcache.Set` functions, not `memcache.Add`. The latter will only insert items which don't already exist. If user signs in again before session expires, it should simply reset with a newly generated token.

Test it out.

{{< terminal output="2-5" >}}
curl localhost:8080/api/signin/[YOUR_ID_TOKEN]
{
  "userId": "111217297807827209130",
  "sessionToken": "[GENERATED_SESSION_TOKEN]"
}
{{< /terminal >}}

On each request to `localhost:8080/api/signin/[YOUR_ID_TOKEN]`, the session token should change.

Now create a function to authenticate all necessary requests. Each request will carry user's ID and session token in header fields. You need to read these headers, check them against those inside Memcache, and respond accordingly.

{{< code lang="go" >}}
type HandlerFunc func(http.ResponseWriter, *http.Request)
type TodoHandler func(http.ResponseWriter, *http.Request, context.Context, string)

func authenticate(handler TodoHandler) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("X-User-ID")
		sessionToken := r.Header.Get("X-Session-Token")
		ctx := appengine.NewContext(r)
		if len(userID) == 0 || len(sessionToken) == 0 {
			responseError(w, "unauthenticated", http.StatusBadRequest)
			return
		}
		session, err := memcache.Get(ctx, userID)
		if err != nil || string(session.Value) != sessionToken {
			responseError(w, "unauthenticated", http.StatusBadRequest)
			return
		}
		handler(w, r, ctx, userID)
	}
}
{{< /code >}}

The above code validates session token by checking equality with the stored key-value pair. If validation succeeds, it calls `handler` function passed in as a parameter. This can be thought of as middleware. The `TodoHandler` function type is an extension of default handler type with the context and user's ID. Here's an example usage.

{{< code lang="go" >}}
func init() {
	clientID = os.Getenv("CLIENT_ID")
	r := mux.NewRouter()
	r.HandleFunc("/api/signin/{token}", signin).Methods("GET")
	r.HandleFunc("/api/test", authenticate(test)).Methods("GET")
	http.Handle("/api/", cors.AllowAll().Handler(r))
}

func test(w http.ResponseWriter, r *http.Request, ctx context.Context, userID string) {
	fmt.Fprintf(w, "Test was called by %s.\n", userID)
}
{{< /code >}}

You can now wrap `authenticate` function around any handler you wish only to be accessible to signed in users.

Issuing a request to `localhost:8080/api/test` produces the following response.

{{< terminal output="2-4" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/test
Test was called by 111217297807827209130.
{{< /terminal >}}

You'll need to be signed in of course.

# Todo CRUD

Time to introduce actual todos. You'll create one handler for each CRUD operation. All of them will conform to `TodoHandler` type. Todos will be stored in Datastore&mdash;a NoSQL document database.

Declare `Todo` struct type inside `todo.go` file.

{{< code lang="go" >}}
package todo

type Todo struct {
	ID        string    `json:"id" datastore:"-"`
	UserID    string    `json:"userId"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"createdAt"`
}
{{< /code >}}

Along with other fields, `ID` field is ignored by setting `datastore` tag to `"-"`. That's because every entity already has a key associated with it. You'll only use `ID` field when responding with JSON.

## Create

Declare the `create` handler.

{{< code lang="go" >}}
func create(w http.ResponseWriter, r *http.Request, ctx context.Context, userID string) {
	body, err := readJSON(r.Body)
	if err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	}

	var title string
	var ok bool
	if title, ok = body["title"].(string); !ok {
		responseError(w, "invalid json", http.StatusBadRequest)
		return
	}

	todo := &Todo{
		UserID:    userID,
		Title:     title,
		CreatedAt: time.Now(),
	}

	key := datastore.NewIncompleteKey(ctx, "Todo", nil)
	if newKey, err := datastore.Put(ctx, key, todo); err != nil {
		responseError(w, err.Error(), http.StatusInternalServerError)
	} else {
		todo.ID = strconv.FormatInt(newKey.IntID(), 10)
		responseJSON(w, todo)
	}
}
{{< /code >}}

After inserting with `datastore.Put` a generated key gets returned. Upon success, you set todo's ID to a key's integer ID and then serialize it to JSON. You have to convert the ID to a string, otherwise it exceeds maximum integer value under IEEE 754 data type.

Register this handler inside `init` function for HTTP POST request to `/api/todos`.

{{< code lang="go" >}}
r.HandleFunc("/api/todos", authenticate(create)).Methods("POST")
{{< /code >}}

See if it works.

{{< terminal output="2-5" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos \
-d '{"title":"sleep"}'
{"id":"5865619656278016","userId":"[YOUR_USER_ID]","title":"sleep","createdAt":"2017-07-28T03:48:34.686988035Z"}
{{< /terminal >}}

Having the server running, create a couple of todos, and navigate to <http://localhost:8000/datastore?kind=Todo> with your browser to see if they exist.

## Read

You'll need a way of getting all todos of signed-in user sorted by `CreatedAt` field. Declare `getAll` handler.

{{< code lang="go" >}}
func getAll(w http.ResponseWriter, r *http.Request, ctx context.Context, userID string) {
	var todos []Todo
	if keys, err := datastore.NewQuery("Todo").
		Filter("UserID =", userID).
		Order("-CreatedAt").
		GetAll(ctx, &todos); err != nil {
		responseError(w, err.Error(), http.StatusInternalServerError)
	} else {
		if len(todos) == 0 {
			responseJSON(w, []Todo{})
			return
		}
		for i := range todos {
			todos[i].ID = strconv.FormatInt(keys[i].IntID(), 10)
		}
		responseJSON(w, todos)
	}
}
{{< /code >}}

After retrieving todos you have to set their IDs, because that field wasn't stored in Datastore. Converting 64-bit IDs to strings is necessary to avoid data loss in JSON. 

Add the following line to the `init` function inside `app.go` file.

{{< code lang="go" >}}
r.HandleFunc("/api/todos", authenticate(getAll)).Methods("GET")
{{< /code >}}

Datastore requires indexes to be defined for fields included in queries. Development App Engine server will automatically create definitions for indexes. If not, manually create `index.yaml` file with the following content.

{{< code lang="yaml" >}}
indexes:
- kind: Todo
  properties:
  - name: UserID
  - name: CreatedAt
    direction: desc
{{< /code >}}

Now create some todos and fetch them using cURL.

{{< terminal output="2-23" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos
[
   {
      "id":"6192449487634432",
      "userId":"111217297807827209130",
      "title":"eat",
      "createdAt":"2017-07-28T03:59:18.094468Z"
   },
   {
      "id":"5066549580791808",
      "userId":"111217297807827209130",
      "title":"sleep",
      "createdAt":"2017-07-28T03:59:11.626507Z"
   },
   {
      "id":"5629499534213120",
      "userId":"111217297807827209130",
      "title":"conquer the world",
      "createdAt":"2017-07-28T03:48:34.686988Z"
   }
]
{{< /terminal >}}

## Update

Users can only update their own todos. Create a utility function `getOwnTodo` which gets a todo by ID and checks if it belongs to the current user.

{{< code lang="go" >}}
func getOwnTodo(ctx context.Context, userID string, strID string) (*Todo, *datastore.Key, error) {
	id, err := strconv.ParseInt(strID, 10, 64)
	if err != nil {
		return nil, nil, errors.New("invalid id")
	}
	key := datastore.NewKey(ctx, "Todo", "", id, nil)
	todo := &Todo{}
	if err := datastore.Get(ctx, key, todo); err != nil {
		return nil, nil, errors.New("todo not found")
	}
	if todo.UserID != userID {
		return nil, nil, errors.New("not own todo")
	}
	todo.ID = strID
	return todo, key, nil
}
{{< /code >}}

Declare the `update` handler. You need to validate provided data, get a todo with `getOwnTodo`, and update its title. Updated todo is returned upon success.

{{< code lang="go" >}}
func update(w http.ResponseWriter, r *http.Request, ctx context.Context, userID string) {
	vars := mux.Vars(r)
	id := vars["id"]
	body, err := readJSON(r.Body)
	if err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	}
	var title string
	var ok bool
	if title, ok = body["title"].(string); !ok || len(title) == 0 {
		responseError(w, "invalid json", http.StatusBadRequest)
		return
	}
	if todo, key, err := getOwnTodo(ctx, userID, id); err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
	} else {
		todo.Title = title
		if _, err := datastore.Put(ctx, key, todo); err != nil {
			responseError(w, "could not update", http.StatusInternalServerError)
			return
		}
		responseJSON(w, todo)
	}
}
{{< /code >}}

Update the `init` function. HTTP PUT request is usually used for updating items.

{{< code lang="go" >}}
r.HandleFunc("/api/todos/{id}", authenticate(update)).Methods("PUT")
{{< /code >}}

Try updating one of the todos.

{{< terminal output="2-11" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos/[TODO_ID] \
-X PUT \
-d '{"title":"buy things to survive"}'
{
  "createdAt": "2017-07-28T03:59:11.626507Z",
  "id": "5302669702856704",
  "title": "buy things to survive",
  "userId": "111217297807827209130"
}
{{< /terminal >}}

## Delete

Same as with updating, you need to check if the current user is allowed to delete a todo. Implement the `delete` handler.

{{< code lang="go" >}}
func delete(w http.ResponseWriter, r *http.Request, ctx context.Context, userID string) {
	vars := mux.Vars(r)
	id := vars["id"]
	if todo, key, err := getOwnTodo(ctx, userID, id); err == nil {
		if err := datastore.Delete(ctx, key); err != nil {
			responseError(w, "could not delete", http.StatusBadRequest)
			return
		}
		responseJSON(w, todo)
	} else {
		responseError(w, err.Error(), http.StatusBadRequest)
	}
}
{{< /code >}}

Lastly, update the `init` function.

{{< code lang="go" >}}
r.HandleFunc("/api/todos/{id}", authenticate(delete)).Methods("DELETE")
{{< /code >}}

Try deleting one of the todos.

{{< terminal output="2-4" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos/[TODO_ID] \
-X DELETE
{{< /terminal >}}

# Wrapping up

That's it for the back-end. In the next part you'll create the front-end and deploy it to the Google App Engine.

Second part: [Build a Todo List with Angular and Google App Engine - Part 2](/todo-list-angular-google-app-engine-part-2).

Source code for this tutorial is available on [GitHub](https://github.com/tinrab/todo-angular-appengine).

<!-- If you have any questions or suggestions leave them in the comments below. -->
