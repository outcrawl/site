---
title: Multi-Stage Docker Builds for Kubernetes
author: tin-rabzelj
tags:
  - Docker
  - Kubernetes
description: Building and compiling apps inside a Docker image can produce very large images. To reduce the size, build pipeline can be split into multiple stages, where the final image only contains built binaries. This article shows how to set up a Docker image with services developed in Go, maintain multiple services inside a single image and how to use the image with Kubernetes.
cover: ./cover.jpg
---

Building and compiling apps inside a Docker image can produce very large images. To reduce the size, build pipeline can be split into multiple stages, where the final image only contains built binaries. This article shows how to set up a Docker image with services developed in Go, maintain multiple services inside a single image and how to use the image with Kubernetes.

# Prerequisites

Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), [Docker](https://docs.docker.com/engine/installation/), and [Minikube](https://github.com/kubernetes/minikube) to run Kubernetes locally.

Run Minikube, or configure `kubectl` for some other provider.

```bash
minikube start [--vm-driver=&lt;driver&gt;]
```

# Developing services

Install [golang/dep](https://github.com/golang/dep), a tool for dependency management. Using it will simplify building Docker images.

```bash
go get -u github.com/golang/dep/cmd/dep
```

Create `first` directory, and initialize `dep` inside it.

```bash
mkdir first && cd first
dep init
```

Create `first/main.go`, and write a simple HTTP server.

```go
package main

import (
  "fmt"
  "net/http"
)

func main() {
  r := http.NewServeMux()
  r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "first")
  })
  http.ListenAndServe(":3000", r)
}
```

Create another service inside `second` directory, which returns a string `"second"`.

You can develop any number of services in a similar fashion. Each in a separate subdirectory.

# Build "all-in-one" image

Create a `Dockerfile` inside project's root directory.

```dockerfile
# Build stage
FROM golang:1.9.2-alpine3.6 AS build
# Support CGO and SSL
RUN apk --no-cache add gcc g++ make ca-certificates
WORKDIR /go/src/app
# Copy each service
COPY first first
COPY second second
# Compile them
RUN go install ./...

# Production build stage
FROM alpine:3.6
WORKDIR /usr/bin
# Copy built binaries
COPY --from=build /go/bin .
```

Each `FROM` instruction begins a new stage. The first stage is named "build". In the final stage, binaries get copied from the first stage by setting the `--from=build`.

For this example, the image will be pushed to [Docker Hub](https://hub.docker.com/).

Log-in with your Docker account.

```bash
docker login
```

Run the following command; replacing `<username>` with your Docker Hub username and `<image>` with repository's name.

```bash
docker build -t &lt;username&gt;/&lt;image&gt;
```

Push it to Docker Hub.

```bash
docker push &lt;username&gt;/&lt;image&gt;
```

# Deploy to Kubernetes

Create `first.yaml` file; replacing `<username>` and `<image>`.

The `spec.containers[].command` field sets the default executable, in this case "first". To run another service, you'd simply change this field to some other service, which was compiled in the same Docker image.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: tutorial
  labels:
    app: tutorial
spec:
  selector:
    matchLabels:
      app: tutorial
  replicas: 3
  template:
    metadata:
      labels:
        app: tutorial
    spec:
      containers:
      - name: tutorial
        image: docker.io/<username>/<image>
        command: ["first"]
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: tutorial
spec:
  type: LoadBalancer
  selector:
    app: tutorial
  ports:
  - port: 3000
```

Create resources.

```bash
kubectl apply -f first.yaml
```

Try calling the service.

```bash{outputLines:2}
curl $(minikube service tutorial --url)
first
```

# Wrapping up

Using multi-stage Docker builds can help you drastically reduce the size of Docker images. It's also helpful to keep multiple services inside a single image, because it makes your build pipeline easier to maintain.
