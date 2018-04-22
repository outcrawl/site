---
title: How to Build a Search Service with Go and Elasticsearch
author: tin-rabzelj
tags:
  - Go
  - Elasticsearch
  - Docker
description: This article shows how to build a simple search service in Go by using Elasticsearch.
cover: ./cover.jpg
---

This article shows how to build a simple search service in Go using [Elasticsearch](https://www.elastic.co/). The service will run inside a local Docker machine along side Elasticsearch instance. If you're only interested in the source code, you can find it on [GitHub](https://github.com/tinrab/go-elasticsearch-example).

# Getting started

If you haven't already, install [Docker](https://docs.docker.com/install/), [Go](https://golang.org/doc/install) and [golang/dep](https://github.com/golang/dep) dependency management tool.

Create a directory for your project inside `$GOPATH`.

# Configure services

Create `docker-compose.yaml` file with the following contents.

```yaml
version: '3.5'
services:
  search_api:
    container_name: 'search_api'
    build: './search-api'
    restart: 'on-failure'
    ports:
      - '8080:8080'
    depends_on:
      - elasticsearch
  elasticsearch:
    container_name: 'elasticsearch'
    image: 'docker.elastic.co/elasticsearch/elasticsearch:6.2.3'
    ports:
      - '9200:9200'
```

This defines two services. The `search_api` service will host your Go app on port 8080, while `elasticsearch` will run the official [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html) Docker image.

Create a subdirectory called `search-api` and initialize the project with `dep`.

```
$ mkdir search-api
$ cd search-api
$ dep init
```

Write the Dockerfile for `search_api` service inside `search-api` directory.

```go
FROM golang:1.10.0

RUN adduser --disabled-password --gecos '' api
USER api

WORKDIR /go/src/app
COPY . .

RUN go install -v ./...

CMD [ "app" ]
```

# Connecting to Elasticsearch

Create an entry point `main.go` file inside `search-api` directory.

```go
package main

import (
  "encoding/json"
  "fmt"
  "log"
  "net/http"
  "strconv"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/olivere/elastic"
  "github.com/teris-io/shortid"
)
```

Declare Elasticsearch index and type names.

```go
const (
  elasticIndexName = "documents"
  elasticTypeName  = "document"
)
```

An index is a collection of documents with varying types. This example defines only one type called `document`.

Declare the main struct for a document to be indexed.

```go
type Document struct {
  ID        string    `json:"id"`
  Title     string    `json:"title"`
  CreatedAt time.Time `json:"created_at"`
  Content   string    `json:"content"`
}
```

Elasticsearch has to know how document's fields should be treated and what data they represent. This is accomplished by manually defining a [mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html), or as it's used in this article, leave it to Elasticsearch with [Dynamic Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-mapping.html).

Inside `main` function, create a Elasticsearch client.

```go
var (
  elasticClient *elastic.Client
)

func main() {
  var err error
  for {
    elasticClient, err = elastic.NewClient(
      elastic.SetURL("http://elasticsearch:9200"),
      elastic.SetSniff(false),
    )
    if err != nil {
      log.Println(err)
      time.Sleep(3 * time.Second)
    } else {
      break
    }
  }
  // ...
}
```

There is a time difference between a Docker container starting up and the service inside it being ready to connect to. For that reason, the code above tries reconnecting to `elasticsearch` service every 3 seconds, if it fails initially.

Another way of solving this would be to write a simple Bash script, which "pings" some service until it is ready, and then runs your app. You can change the value of [CMD](https://docs.docker.com/engine/reference/builder/#cmd) instruction to be your Bash script.

# Inserting documents

You'll need a way of creating documents before you can search for them.

Inside `main` function run the HTTP server using [gin-gonic/gin](https://github.com/gin-gonic/gin) framework. Map the `/documents` endpoint to the `createDocumentsEndpoint` handler function.

```go
r := gin.Default()
r.POST("/documents", createDocumentsEndpoint)
if err = r.Run(":8080"); err != nil {
  log.Fatal(err)
}
```

Declare a struct which represents a single document in request body.

```go
type DocumentRequest struct {
  Title   string `json:"title"`
  Content string `json:"content"`
}
```

Write a helper function for responding with an error.

```go
func errorResponse(c *gin.Context, code int, err string) {
  c.JSON(code, gin.H{
    "error": err,
  })
}
```

Declare `createDocumentsEndpoint` handler function and read documents from request body into an array.

```go
func createDocumentsEndpoint(c *gin.Context) {
  var docs []DocumentRequest
  if err := c.BindJSON(&docs); err != nil {
    errorResponse(c, http.StatusBadRequest, "Malformed request body")
    return
  }
  // ...
}
```

Set an unique ID and time of creation for each document then insert them into Elasticsearch using [bulk](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html) operation.

```go
bulk := elasticClient.
  Bulk().
  Index(elasticIndexName).
  Type(elasticTypeName)
for _, d := range docs {
  doc := Document{
    ID:        shortid.MustGenerate(),
    Title:     d.Title,
    CreatedAt: time.Now().UTC(),
    Content:   d.Content,
  }
  bulk.Add(elastic.NewBulkIndexRequest().Id(doc.ID).Doc(doc))
}
if _, err := bulk.Do(c.Request.Context()); err != nil {
  log.Println(err)
  errorResponse(c, http.StatusInternalServerError, "Failed to create documents")
  return
}
c.Status(http.StatusOK)
```

# Searching

Register a new `/search` endpoint inside `main` function.

```go{3}
r := gin.Default()
r.POST("/documents", createDocumentsEndpoint)
r.GET("/search", searchEndpoint)
if err = r.Run(":8080"); err != nil {
  log.Fatal(err)
}
```

Write the `searchEndpoint` handler function and parse necessary parameters. Parameters `skip` and `take` are used to limit the number of returned documents and enable basic pagination.

```go
func searchEndpoint(c *gin.Context) {
  // Parse request
  query := c.Query("query")
  if query == "" {
    errorResponse(c, http.StatusBadRequest, "Query not specified")
    return
  }
  skip := 0
  take := 10
  if i, err := strconv.Atoi(c.Query("skip")); err == nil {
    skip = i
  }
  if i, err := strconv.Atoi(c.Query("take")); err == nil {
    take = i
  }
  // ...
}
```

Then perform a multi match query on fields `title` and `content`. Here, parameters `minimum_should_match` and `fuzziness` are set to some "magic" numbers. Refer to the [docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html) to see other possible settings.

```go
esQuery := elastic.NewMultiMatchQuery(query, "title", "content").
  Fuzziness("2").
  MinimumShouldMatch("2")
result, err := elasticClient.Search().
  Index(elasticIndexName).
  Query(esQuery).
  From(skip).Size(take).
  Do(c.Request.Context())
if err != nil {
  log.Println(err)
  errorResponse(c, http.StatusInternalServerError, "Something went wrong")
  return
}
// ...
```

Finally, create a response object with total number of hits, time taken in milliseconds, and all documents in the range determined by `skip` and `take` parameters.

```go
res := SearchResponse{
  Time: fmt.Sprintf("%d", result.TookInMillis),
  Hits: fmt.Sprintf("%d", result.Hits.TotalHits),
}
docs := make([]DocumentResponse, 0)
for _, hit := range result.Hits.Hits {
  var doc DocumentResponse
  json.Unmarshal(*hit.Source, &doc)
  docs = append(docs, doc)
}
res.Documents = docs
c.JSON(http.StatusOK, res)
```

# Wrapping up

Inside `search-api` directory ensure all dependencies are properly set up.

```
$ cd search-api
$ dep ensure
```

Build and run both services using Docker Compose.

```
$ docker-compose up -d --build
```

Upload a couple of fake documents, for example, documents found inside [fake-data.json](https://raw.githubusercontent.com/tinrab/go-elasticsearch-example/master/fake-data.json) file.

```
$ curl -X POST http://localhost:8080/documents -d @fake-data.json -H "Content-Type: application/json"
```

Try it out.

```
$ curl http://localhost:8080/search?query=exercitation+est+officia
{
  "time": "42",
  "hits": "43",
  "documents": [{
      "title": "Exercitation est officia fugiat labore deserunt est id voluptate magna.",
      "created_at": "2018-03-21T15:22:48.7830606Z",
      "content": "..."
    },
    // ...
  ]
}
```

Entire source code is available on [GitHub](https://github.com/tinrab/go-elasticsearch-example).
