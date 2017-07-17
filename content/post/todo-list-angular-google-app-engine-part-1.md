---
title: "Build a Todo List with Angular and Google App Engine - Part 1"
slug: "todo-list-angular-google-app-engine-part-1"
author: "tin-rabzelj"
tags: ["Angular", "Typescript", "Go"]
date: "2017-10-02"
thumbnail: "todo-list-angular-google-app-engine"
---

The world needs more Todo lists.

This project was developed on Ubuntu 17.04 using the following technologies:

* Angular 4.1.3
* Angular CLI 1.1.1 ([Installation](https://github.com/angular/angular-cli) instructions)
* Google Cloud SDK 158.0.0 ([Installation](https://cloud.google.com/sdk/docs/) instructions, also install `google-cloud-sdk-app-engine-go` component)
* Bootstrap 4.0.0-alpha.6

A quick preview of finished product:

{{< image name="finished.gif" >}}

# Getting started

Users will sign in with their Google account, therefore you need a Google API Console project to call Google APIs. Follow [this](https://developers.google.com/identity/sign-in/web/devconsole-project) guide to create a new project and obtain your Client ID. Under **Authorized JavaScript origins** enter `http://localhost:4200`, `http://localhost:8080` and `https://[YOUR_PROJECT_ID].appspot.com`.
 
Create a main folder for the back-end code.

{{< terminal >}}
mkdir server
cd server
{{< /terminal >}}

All other source files will be created inside that folder.

# Back-end service

Developing apps on App Engine requires a presence of `app.yaml` file. Create it and paste in the following.

{{< code lang="yaml" >}}
runtime: go
api_version: go1
handlers:
- url: /.*
  script: _go_app
env_variables:
  CLIENT_ID: 'YOUR_CLIENT_ID'
{{< /code >}}

Replace `YOUR_CLIENT_ID` with your actual Client ID, which you obtained at the start. It will be passed in as a environment variable.

Create a `app.go` file, which is the main entry point for your todo service.

{{< code lang="go" >}}
package todo
func init() {
	router := httprouter.New()
	router.GET("/api/hello", hello)
	http.Handle("/api/", cors.AllowAll().Handler(router))
}
func hello(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintln(w, "hello, world")
}
{{< /code >}}

Use `init` function as an entry point, and not the usual `main` function. You'll also have to install 2 Go packages.

{{< terminal >}}
go get github.com/julienschmidt/httprouter
github.com/rs/cors
{{< /terminal >}}

{{% blockquote %}}
Set up your text editor to use [goimports](https://godoc.org/golang.org/x/tools/cmd/goimports) tool, which will auto import all necessary packages. [Visual Studio Code](https://code.visualstudio.com/) does this nicely with [Go](https://marketplace.visualstudio.com/items?itemName=lukehoban.Go) extension.
{{% /blockquote %}}

With [julienschmidt/httprouter](https://github.com/julienschmidt/httprouter) package dealing with HTTP will be less cumbersome. Enabling cross-origin HTTP requests (CORS) with [rs/cors](https://github.com/rs/cors) package avoids some problems while developing and testing.

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

Before implementing functions handling operations with todos, you need a way to authenticate users with your back-end service. App Engine provides its own in-memory cache service called Memcache. You'll use it to hold users' sessions. To learn more about Memcache, see [official documentation](https://cloud.google.com/appengine/docs/standard/go/memcache/).

Memcache is a key-value store, capable of caching values for keys with optional expiration time. That's a perfect fit for user sessions. Instead of using popular JWT, you'll design your own system. A key will simply be the user's ID, given by the Google API. A value will be a secret token&mdash;auto-generated string consisting of 64 random alphanumeric characters, "_" and "-".

To start off, first create a new source file `utility.go` for some utility functions. Write a `generateToken` function, which generates our session token.

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

{{% blockquote %}}
Skim through some answers on [Stack Overflow](https://stackoverflow.com/questions/22892120/how-to-generate-a-random-string-of-a-fixed-length-in-golang) for better ways of doing exactly this.
{{% /blockquote %}}

Writing a HTTP response requires setting headers, changing status code upon error, and serializing response data to JSON. Implement a couple of helper functions inside `utility.go` for writing a success and error HTTP responses.

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
func readJSON(rc io.ReadCloser) (map[string]string, error) {
	defer rc.Close()
	data, err := ioutil.ReadAll(rc)
	if err != nil {
		return nil, err
	}
	var jsonData map[string]string
	err = json.Unmarshal(data, &jsonData)
	if err != nil {
		return nil, err
	}
	return jsonData, nil
}
{{< /code >}}

That's enough of helper functions. Update the `init` function inside `app.go` to handle the sign-in route and read the Client ID environment variable.

{{< code lang="go" line="1-3,6,8" >}}
var (
	clientID string
)

func init() {
	clientID = os.Getenv("CLIENT_ID")
	router := httprouter.New()
	router.GET("/api/signin/:token", signin)
	http.Handle("/api/", cors.AllowAll().Handler(router))
}
{{< /code >}}

The token, returned by Google API, is passed in as a named parameter to a HTTP GET request.

Declare a `signin` handler inside `app.go` file.

{{< code lang="go" >}}
type signInResult struct {
	UserID       string `json:"user_id"`
}

func signin(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	googleToken := p.ByName("token")
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

You get user's token from `httprouter.Params` by name, but you don't know which user this token belongs to. An easy way to validate the token is by using Google's `tokeninfo` endpoint ([more info](https://developers.google.com/identity/sign-in/web/backend-auth)). Making a HTTP GET or POST request to `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=[ID_TOKEN]` returns a HTTP 200 response, where the body contains JSON in the following format.

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
	if aud, ok := bodyJSON["aud"]; ok {
		if clientID != aud {
			return "", errors.New("invalid client id")
		}
	} else {
		return "", errors.New("invalid id token")
	}
	if sub, ok := bodyJSON["sub"]; ok {
		return sub, nil
	}
	return "", errors.New("invalid id token")
}
{{< /code >}}

`verifyToken` function returns user's ID if validation succeeded. Test it out using cURL.

{{< terminal output="2" >}}
curl localhost:8080/api/signin/[YOUR_ID_TOKEN]
{"user_id":"111217297807827209130"}
`
{{< /terminal >}}

{{% blockquote %}}
You can obtain Google ID token using [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/). You'll need to include `https://developers.google.com/oauthplayground` URL under **Authorized redirect URIs** in your Google API Console's project.
{{% /blockquote %}}

By having access to user's ID, session can now be stored inside Memcache. Update the `signin` handler and `signInResult` struct to store and return  your own generated session token.

{{< code lang="go" line="3,14-21" >}}
type signInResult struct {
	UserID       string `json:"user_id"`
	SessionToken string `json:"session_token"`
}

func signin(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	googleToken := p.ByName("token")
	ctx := appengine.NewContext(r)
	userID, err := verifyToken(ctx, googleToken)
	if err != nil {
		responseError(w, "", http.StatusBadRequest)
		return
	}
	token := generateToken()
	session := &memcache.Item{
		Key:        userID,
		Value:      []byte(token),
		Expiration: 10 * time.Minute,
	}
	if err := memcache.Set(ctx, session); err != nil {
		responseError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	responseJSON(w, signInResult{userID, token})
}
{{< /code >}}

Having your own session tokens wont require calling Google APIs on every request. All you have to do is call Memcache to retrieve it. You also gain control of expiration time. In the example above, expiration is set to 10 minutes. You can change this as you wish.

To insert sessions into Memcache use `memcache.Set` functions, not `memcache.Add`. The latter will only insert items which don't already exist. If user signs in again before session expires, it should simply reset with a newly generated token.

Test it out.

{{< terminal output="2-5" >}}
curl localhost:8080/api/signin/[YOUR_ID_TOKEN]
{
  "user_id": "111217297807827209130",
  "session_token": "Ccy1N9RCKjt_SfcBFNK3R4Rd877lxUlXdR5Hcr-scHuSAGPECci8eMlmu3xcOsVJ"
}
{{< /terminal >}}

On each request to `localhost:8080/api/signin/[YOUR_ID_TOKEN]`, the session token should change.

Now create a function to authenticate all requests for Todos. Each request will carry user's ID and session token in header fields. You need to read these headers, check them against those inside Memcache, and respond appropriately.

{{< code lang="go" >}}
type todoHandler func(http.ResponseWriter, *http.Request, httprouter.Params, context.Context, string)

func authenticate(handler todoHandler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
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

		handler(w, r, p, ctx, userID)
	}
}
{{< /code >}}

The above code validates session token by checking equality with the stored key-value pair. If validation succeeds, it calls `handler` function passed in as a parameter. This can be thought of as a middleware. It returns `httprouter.Handle`, which is required for `httprouter` package, and takes in your own `todoHandler` function type. The new handler type gets a context and user's ID as parameters, along default things. Here's an example.

{{< code lang="go" >}}
func init() {
	clientID = os.Getenv("CLIENT_ID")
	router := httprouter.New()
	router.GET("/api/signin/:token", signin)
	router.GET("/api/test", authenticate(test))
	http.Handle("/api/", cors.AllowAll().Handler(router))
}

func test(w http.ResponseWriter, r *http.Request, p httprouter.Params, ctx context.Context, userID string) {
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

Time to introduce actual todos. You'll create one handler for each CRUD operation. All of them will conform to `todoHandler` type. Todos will be stored using Datastore&mdash;a NoSQL document database.

Create a new file `todo.go` and declare a todo struct.

{{< code lang="go" >}}
package todo

type Todo struct {
	ID        string    `json:"id" datastore:"-"`
	UserID    string    `json:"user_id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
}
{{< /code >}}

Entities are stored using keys inside Datastore. Each key consists of a `kind` (usually entity's name) and `identifier` (a unique value). You'll let Datastore generate a unique key on its own.

Along with JSON tags for renaming fields, there's a `datastore` tag set to "-" for `ID` field. That makes Datastore ignore it when inserting entities. The reason is that there's already a `Key` field present, so there's no need for an extra "identifier" field. You'll only use `ID` field when responding with JSON.

## Create

Declare a `create` handler.

{{< code lang="go" >}}
func create(w http.ResponseWriter, r *http.Request, p httprouter.Params, ctx context.Context, userID string) {
	body, err := readJSON(r.Body)
	if err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	}
	var title string
	var ok bool
	if title, ok = body["title"]; !ok {
		responseError(w, "invalid json", http.StatusBadRequest)
		return
	}
	responseJSON(w, "success")
}
{{< /code >}}

It's using a utility `readJSON` function, declared earlier, to read todo's data from request's body. Currently it only validates the JSON data.

Make router inside the `init` function call this handler upon HTTP POST request to `/api/todos` endpoint.

{{< code lang="go" >}}
router.POST("/api/todos", authenticate(create))
{{< /code >}}

See if it works.

{{< terminal output="2-4" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos \
-d '{"title":"sleep"}'
"valid"
{{< /terminal >}}

You're setting data after the `-d` flag. Try it with malformed data.

{{< terminal output="2-5" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos \
-d '{"x":42}'
{"error":"invalid json"}
{{< /terminal >}}

Time to insert todos into the Datastore. Remove the final line from `create` handler and replace it with the following.

{{< code lang="go" >}}
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
{{< /code >}}

After inserting with `datastore.Put` a generated key gets returned. Upon success, you set todo's ID to a key's integer ID and then serialize it to JSON. You have to convert the ID to a string, otherwise it exceeds maximum integer value under IEEE 754 data type.

Having the server running, create a couple of todos, and navigate to [http://localhost:8000/datastore?kind=Todo](http://localhost:8000/datastore?kind=Todo) with your browser to see if they exist.

## Read

You'll need a way of getting all todos of signed-in user sorted by `CreatedAt` field. Declare `getAll` handler.

{{< code lang="go" >}}
func getAll(w http.ResponseWriter, r *http.Request, p httprouter.Params, ctx context.Context, userID string) {
	var todos []Todo
	if keys, err := datastore.NewQuery("Todo").Filter("UserID =", userID).Order("-CreatedAt").GetAll(ctx, &todos); err != nil {
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
router.GET("/api/todos", authenticate(getAll))
{{< /code >}}

Datastore requires indexes to be defined for fields included in queries. Development App Engine server will automatically create definitions for indexes. If not, create a file `index.yaml` with the following content.

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
      "user_id":"111217297807827209130",
      "title":"eat",
      "created_at":"2017-06-25T12:00:39.981107Z"
   },
   {
      "id":"5066549580791808",
      "user_id":"111217297807827209130",
      "title":"sleep",
      "created_at":"2017-06-25T12:00:36.557198Z"
   },
   {
      "id":"5629499534213120",
      "user_id":"111217297807827209130",
      "title":"conquer the world",
      "created_at":"2017-06-25T12:00:27.306217Z"
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
func update(w http.ResponseWriter, r *http.Request, p httprouter.Params, ctx context.Context, userID string) {
	body, err := readJSON(r.Body)
	if err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	}
	var title string
	var ok bool
	if title, ok = body["title"]; !ok || len(title) == 0 {
		responseError(w, "invalid json", http.StatusBadRequest)
		return
	}
	if todo, key, err := getOwnTodo(ctx, userID, p.ByName("id")); err != nil {
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

Update the `init` function. HTTP Put request is usually used for updating items.

{{< code lang="go" >}}
router.PUT("/api/todos/:id", authenticate(update))
{{< /code >}}

Try updating one of the todos.

{{< terminal output="2-11" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos/[TODO_ID] \
-X PUT \
-d '{"title":"buy things to survive"}'
{
  "id": "5066549580791808",
  "user_id": "111217297807827209130",
  "title": "buy things to survive",
  "created_at": "2017-06-25T12:00:36.557198Z"
}
{{< /terminal >}}

## Delete

Deleting todos is similar to updating them. You need to check if current user is allowed to delete it. Implement the `delete` handler.

{{< code lang="go" >}}
func delete(w http.ResponseWriter, r *http.Request, p httprouter.Params, ctx context.Context, userID string) {
	if _, key, err := getOwnTodo(ctx, userID, p.ByName("id")); err != nil {
		responseError(w, err.Error(), http.StatusBadRequest)
		return
	} else if err := datastore.Delete(ctx, key); err != nil {
		responseError(w, "could not delete", http.StatusBadRequest)
		return
	}
	responseJSON(w, "")
}
{{< /code >}}

Finally, update the `init` function.

{{< code lang="go" >}}
router.DELETE("/api/todos/:id", authenticate(delete))
{{< /code >}}

Try deleting one of the todos.

{{< terminal output="2-11" >}}
curl -H "X-User-ID:[YOUR_USER_ID]" \
-H "X-Session-Token:[YOUR_SESSION_TOKEN]" \
localhost:8080/api/todos/[TODO_ID] \
-X DELETE
`
{{< /terminal >}}

# Wrapping up

That's it for the back-end. In the next part you'll create the front-end and deploy it to the Google App Engine. Check it out: [Build a Todo List with Angular and Google App Engine - Part 2](/todo-list-angular-google-app-engine-part-2).

Source code for this tutorial along with finished product is available on [GitHub](https://github.com/tinrab/todo-angular-appengine).

If you have any questions or suggestions leave them in the comments below.
