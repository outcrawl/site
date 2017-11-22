---
title: Build an Image Recognition API with Go and TensorFlow
layout: article
date: "2017-10-18"
author: tin-rabzelj
tags:
  - Go
  - TensorFlow
description: This tutorial shows how to build an image recognition service in Go using pre-trained TensorFlow Inception-V3 model. The service will run inside a Docker container, use TensorFlow Go package to process images and return labels that best describe them.
cover: ./cover.jpg
---

This tutorial shows how to build an image recognition service in Go using pre-trained TensorFlow [Inception-V3](https://arxiv.org/abs/1512.00567) model. The service will run inside a Docker container, use TensorFlow Go [package](https://godoc.org/github.com/tensorflow/tensorflow/tensorflow/go) to process images and return labels that best describe them.

Full source code is available on [GitHub](https://github.com/tinrab/go-tensorflow-image-recognition).

# Getting started

Install [Docker](https://docs.docker.com/engine/installation/) and
[Docker Compose](https://docs.docker.com/compose/install/).

# Configure container

Inside project's root directory create `docker-compose.yaml` file.

```yaml
version: '3.3'
services:
  api:
    container_name: 'api'
    build: './api'
    ports:
      - '8080:8080'
    volumes:
      - './api:/go/src/app'
```

Create `api/Dockerfile` file. It uses official [TensorFlow](https://hub.docker.com/r/tensorflow/tensorflow/) Docker image as its base image. You'll also need to install TensorFlow C library to use Go bindings.

```docker
FROM tensorflow/tensorflow
# Install TensorFlow C library
RUN curl -L \
   "https://storage.googleapis.com/tensorflow/libtensorflow/libtensorflow-cpu-linux-x86_64-1.3.0.tar.gz" | \
   tar -C "/usr/local" -xz
RUN ldconfig
# Hide some warnings
ENV TF_CPP_MIN_LOG_LEVEL 2
```

Next, in the same file, install Go itself. This configuration is copied from official Docker [golang](https://hub.docker.com/r/_/golang/) image.

```docker
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    gcc \
    libc6-dev \
    make \
    pkg-config \
    wget \
    git \
  && rm -rf /var/lib/apt/lists/*

ENV GOLANG_VERSION 1.9.1
RUN set -eux; \
  \
  dpkgArch="$(dpkg --print-architecture)"; \
  case "${dpkgArch##*-}" in \
    amd64) goRelArch='linux-amd64'; goRelSha256='07d81c6b6b4c2dcf1b5ef7c27aaebd3691cdb40548500941f92b221147c5d9c7' ;; \
    armhf) goRelArch='linux-armv6l'; goRelSha256='65a0495a50c7c240a6487b1170939586332f6c8f3526abdbb9140935b3cff14c' ;; \
    arm64) goRelArch='linux-arm64'; goRelSha256='d31ecae36efea5197af271ccce86ccc2baf10d2e04f20d0fb75556ecf0614dad' ;; \
    i386) goRelArch='linux-386'; goRelSha256='2cea1ce9325cb40839601b566bc02b11c92b2942c21110b1b254c7e72e5581e7' ;; \
    ppc64el) goRelArch='linux-ppc64le'; goRelSha256='de57b6439ce9d4dd8b528599317a35fa1e09d6aa93b0a80e3945018658d963b8' ;; \
    s390x) goRelArch='linux-s390x'; goRelSha256='9adf03574549db82a72e0d721ef2178ec5e51d1ce4f309b271a2bca4dcf206f6' ;; \
    *) goRelArch='src'; goRelSha256='a84afc9dc7d64fe0fa84d4d735e2ece23831a22117b50dafc75c1484f1cb550e'; \
      echo >&2; echo >&2 "warning: current architecture ($dpkgArch) does not have a corresponding Go binary release; will be building from source"; echo >&2 ;; \
  esac; \
  \
  url="https://golang.org/dl/go${GOLANG_VERSION}.${goRelArch}.tar.gz"; \
  wget -O go.tgz "$url"; \
  echo "${goRelSha256} *go.tgz" | sha256sum -c -; \
  tar -C /usr/local -xzf go.tgz; \
  rm go.tgz; \
  \
  if [ "$goRelArch" = 'src' ]; then \
    echo >&2; \
    echo >&2 'error: UNIMPLEMENTED'; \
    echo >&2 'TODO install golang-any from jessie-backports for GOROOT_BOOTSTRAP (and uninstall after build)'; \
    echo >&2; \
    exit 1; \
  fi; \
  \
  export PATH="/usr/local/go/bin:$PATH"; \
  go version

ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH

RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
```

Install necessary Go packages.

```docker
RUN go get github.com/tensorflow/tensorflow/tensorflow/go \
  github.com/tensorflow/tensorflow/tensorflow/go/op \
  github.com/julienschmidt/httprouter
```

Download Inception model archive to the `/model` directory inside the container and extract it.

```docker
RUN mkdir -p /model && \
  wget "https://storage.googleapis.com/download.tensorflow.org/models/inception5h.zip" -O /model/inception.zip && \
  unzip /model/inception.zip -d /model && \
  chmod -R 777 /model
```

Create a user.

```docker
RUN adduser --disabled-password --gecos '' api
USER api
```

Copy over source files, install the app and run it.

```docker
WORKDIR "/go/src/app"
COPY . .
RUN go install -v ./...
CMD [ "app" ]
```

Create `ap/main.go` file.

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, Gophers")
}
```

Now build the container and make sure everything works.

```
$ docker-compose -f docker-compose.yaml up --build
```

# Loading TensorFlow model

Extracted files inside `/model` include a serialized TensorFlow graph and a list of all labels, which can be inferred from images. You need to read these files and parse them.

Declare some variables and update the `main` function.

```go{1-4,7-10}
var (
  graph  *tf.Graph
  labels []string
)

func main() {
  if err := loadModel(); err != nil {
    log.Fatal(err)
    return
  }
}
```

<note>
Imports are skipped for brevity. You can use [goimports](https://godoc.org/golang.org/x/tools/cmd/goimports) tool to add them. Your code editor most likely has a plugin for it.
</note>

Write the `loadModel` function.

```go
func loadModel() error {
  // Load inception model
  model, err := ioutil.ReadFile("/model/tensorflow_inception_graph.pb")
  if err != nil {
    return err
  }
  graph = tf.NewGraph()
  if err := graph.Import(model, ""); err != nil {
    return err
  }
  // Load labels
  labelsFile, err := os.Open("/model/imagenet_comp_graph_label_strings.txt")
  if err != nil {
    return err
  }
  defer labelsFile.Close()
  scanner := bufio.NewScanner(labelsFile)
  // Labels are separated by newlines
  for scanner.Scan() {
    labels = append(labels, scanner.Text())
  }
  if err := scanner.Err(); err != nil {
    return err
  }
  return nil
}
```

# Uploading images

Write some utility functions for later use.

```go
func responseError(w http.ResponseWriter, message string, code int) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(code)
  json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func responseJSON(w http.ResponseWriter, data interface{}) {
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(data)
}
```

Register a new HTTP handler inside `main` function.

```go{6-8}
func main() {
  if err := loadModel(); err != nil {
    log.Fatal(err)
    return
  }
  r := httprouter.New()
  r.POST("/recognize", recognizeHandler)
  log.Fatal(http.ListenAndServe(":8080", r))
}
```

Write `recognizeHandler` function. Image files will be located under form key "image".

```go
func recognizeHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  // Read image
  imageFile, header, err := r.FormFile("image")
  // Will contain filename and extension
  imageName := strings.Split(header.Filename, ".")
  if err != nil {
    responseError(w, "Could not read image", http.StatusBadRequest)
    return
  }
  defer imageFile.Close()
  var imageBuffer bytes.Buffer
  // Copy image data to a buffer
  io.Copy(&imageBuffer, imageFile)

  // ...
}
```

# Normalizing images

Before classifying an image, you need to convert it to a tensor and normalize it, because Inception model expects it to be in a certain format.

In the `recognizeHandler` call `makeTensorFromImage`, passing in the buffer and file extension.

```go
tensor, err := makeTensorFromImage(&imageBuffer, imageName[:1][0])
if err != nil {
  responseError(w, "Invalid image", http.StatusBadRequest)
  return
}
```

Write `makeTensorFromImage` function which runs an image tensor through the normalization graph.

```go
func makeTensorFromImage(imageBuffer *bytes.Buffer, imageFormat string) (*tf.Tensor, error) {
  tensor, err := tf.NewTensor(imageBuffer.String())
  if err != nil {
    return nil, err
  }
  graph, input, output, err := makeTransformImageGraph(imageFormat)
  if err != nil {
    return nil, err
  }
  session, err := tf.NewSession(graph, nil)
  if err != nil {
    return nil, err
  }
  defer session.Close()
  normalized, err := session.Run(
    map[tf.Output]*tf.Tensor{input: tensor},
    []tf.Output{output},
    nil)
  if err != nil {
    return nil, err
  }
  return normalized[0], nil
}
```

Write `makeTransformImageGraph` function to construct a graph which scales images to 224x224 and normalizes their pixel values.

```go
func makeTransformImageGraph(imageFormat string) (graph *tf.Graph, input, output tf.Output, err error) {
  const (
    H, W  = 224, 224
    Mean  = float32(117)
    Scale = float32(1)
  )
  s := op.NewScope()
  input = op.Placeholder(s, tf.String)
  // Decode PNG or JPEG
  var decode tf.Output
  if imageFormat == "png" {
    decode = op.DecodePng(s, input, op.DecodePngChannels(3))
  } else {
    decode = op.DecodeJpeg(s, input, op.DecodeJpegChannels(3))
  }
  // Div and Sub perform (value-Mean)/Scale for each pixel
  output = op.Div(s,
    op.Sub(s,
      // Resize to 224x224 with bilinear interpolation
      op.ResizeBilinear(s,
        // Create a batch containing a single image
        op.ExpandDims(s,
          // Use decoded pixel values
          op.Cast(s, decode, tf.Float),
          op.Const(s.SubScope("make_batch"), int32(0))),
        op.Const(s.SubScope("size"), []int32{H, W})),
      op.Const(s.SubScope("mean"), Mean)),
    op.Const(s.SubScope("scale"), Scale))
  graph, err = s.Finalize()
  return graph, input, output, err
}
```

# Running inference

Back in `recognizeHandler` function, run normalized image tensor through the Inception model graph.

```go
session, err := tf.NewSession(graph, nil)
if err != nil {
  log.Fatal(err)
}
defer session.Close()
output, err := session.Run(
  map[tf.Output]*tf.Tensor{
    graph.Operation("input").Output(0): tensor,
  },
  []tf.Output{
    graph.Operation("output").Output(0),
  },
  nil)
if err != nil {
  responseError(w, "Could not run inference", http.StatusInternalServerError)
  return
}
```

The `output[0].Value()` tensor now contains probabilities of each label. The probability represents how well a label describes the image.

## Finding best labels

Lastly, return top 5 labels.

Declare some structs to hold the response data.

```go
type ClassifyResult struct {
  Filename string        `json:"filename"`
  Labels   []LabelResult `json:"labels"`
}

type LabelResult struct {
  Label       string  `json:"label"`
  Probability float32 `json:"probability"`
}
```

Write `findBestLabels` function which finds best labels and their probabilities.

```go
type ByProbability []LabelResult
func (a ByProbability) Len() int           { return len(a) }
func (a ByProbability) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByProbability) Less(i, j int) bool { return a[i].Probability > a[j].Probability }

func findBestLabels(probabilities []float32) []LabelResult {
  // Make a list of label/probability pairs
  var resultLabels []LabelResult
  for i, p := range probabilities {
    if i >= len(labels) {
      break
    }
    resultLabels = append(resultLabels, LabelResult{Label: labels[i], Probability: p})
  }
  // Sort by probability
  sort.Sort(ByProbability(resultLabels))
  // Return top 5 labels
  return resultLabels[:5]
}
```

Write the response at the end of `recognizeHandler` function.

```go
responseJSON(w, ClassifyResult{
  Filename: header.Filename,
  Labels:   findBestLabels(output[0].Value().([][]float32)[0]),
})
```

Rebuild the container.

```
$ docker-compose -f docker-compose.yaml up -d --build
```

Try calling the `localhost:8080/recognize` endpoint with a couple of images.

```
$ curl localhost:8080/recognize -F 'image=@./cat.jpg'
{
  "filename": "cat.jpg",
  "labels": [
    { "label": "Egyptian cat", "probability": 0.39229771 },
    { "label": "weasel", "probability": 0.19872947 },
    { "label": "Arctic fox", "probability": 0.14527217 },
    { "label": "tabby", "probability": 0.062454574 },
    { "label": "kit fox", "probability": 0.043656528 }
  ]
}
```

# Wrapping up

You now have a fully working image recognition service. If you want it to focus on a more niche domain (use specific labels instead of general ones), look into transfer learning [here](https://www.tensorflow.org/tutorials/image_retraining). You can find more TensorFlow [models](https://github.com/tensorflow/models) and [examples](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/examples) and try to implement them in Go.

Full source code is available on [GitHub](https://github.com/tinrab/go-tensorflow-image-recognition).
