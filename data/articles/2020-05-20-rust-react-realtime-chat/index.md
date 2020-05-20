---
title: Building a Real-time Chat App in Rust and React
author: tin-rabzelj
tags:
  - Rust
  - React
  - WebSockets
description: This article shows how to build a real-time chat app in Rust.
cover: ./cover.jpg
---

This article covers building a chat app in Rust using [asynchronous code](https://rust-lang.github.io/async-book/).

Source code can be found on [GitHub](https://github.com/tinrab/rusty-chat).

[Cargo.toml](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/Cargo.toml) file below contains all the dependencies we'll need.

```toml
[package]
name = "rusty-chat"
version = "0.1.0"
authors = ["Tin Rabzelj <tin@flinect.com>"]
edition = "2018"

[dependencies]
serde = { version = "1.0.105", features = ["derive"] }
serde_json = "1.0.50"
log = "0.4.8"
env_logger = "0.7.1"
chrono = { version = "0.4.11", features = ["serde"] }
regex = "1.3.7"
lazy_static = "1.4.0"
uuid = { version = "0.8.1", features = ["serde", "v4"] }
futures = "0.3.5"
tokio = { version = "0.2.20", features = ["full"] }
warp = "0.2.2"
```

# Data modeling

First, let's declare base structs to represent chat's data model.

Each user will have a unique ID and a name [model/user.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/model/user.rs).

```rust
#[derive(Debug, Clone, PartialEq)]
pub struct User {
    pub id: Uuid,
    pub name: String,
}

impl User {
    pub fn new(id: Uuid, name: &str) -> Self {
        User {
            id,
            name: String::from(name),
        }
    }
}
```

Chat message needs an ID, author, timestamp and text content itself [model/message.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/model/message.rs).
Crate [chrono](https://crates.io/crates/chrono), among other things, provides tools for working with UTC time zone and serialization using ISO 8601 format, which we'll need later on.

```rust
#[derive(Debug, Clone)]
pub struct Message {
    pub id: Uuid,
    pub user: User,
    pub body: String,
    pub created_at: DateTime<Utc>,
}

impl Message {
    pub fn new(id: Uuid, user: User, body: &str, created_at: DateTime<Utc>) -> Self {
        Message {
            id,
            user,
            body: String::from(body),
            created_at,
        }
    }
}
```

Chat will have a single message feed, which holds messages sorted by time of creation [model/feed.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/model/feed.rs).

`messages_iter` function returns an [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html) over underlying `Vec<Message>`.
This enables reading messages without cloning them and potentially allows replacing protected data structure with something more appropriate than `Vec`, if need arises.

```rust
#[derive(Default)]
pub struct Feed {
    messages: Vec<Message>,
}

impl Feed {
    pub fn add_message(&mut self, message: Message) {
        self.messages.push(message);
        self.messages.sort_by_key(|message| message.created_at)
    }

    pub fn messages_iter(&self) -> impl Iterator<Item = &Message> {
        self.messages.iter()
    }
}
```

# Defining API schema

Client app and server will communicate using the WebSocket protocol and text-based JSON messages.
Transmitted messages will have a `type` property to specify their type, and a `payload` property for all other serialized fields.
We'll also differentiate between inputs and outputs.
Inputs are directly read from client's WebSocket connections, whereas outputs are written to one or several clients.

Here is how the `Input` enum is defined in [proto.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/proto.rs).

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload", rename_all = "camelCase")]
pub enum Input {
    #[serde(rename = "join")]
    Join(JoinInput),
    #[serde(rename = "post")]
    Post(PostInput),
}
```

Along with a separate struct for each message.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JoinInput {
    pub name: String,
}
// ...
```

`Output` enum is similar.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum Output {
    #[serde(rename = "error")]
    Error(OutputError),
    #[serde(rename = "alive")]
    Alive,
    #[serde(rename = "joined")]
    Joined(JoinedOutput),
    #[serde(rename = "user-joined")]
    UserJoined(UserJoinedOutput),
    #[serde(rename = "user-left")]
    UserLeft(UserLeftOutput),
    #[serde(rename = "posted")]
    Posted(PostedOutput),
    #[serde(rename = "user-posted")]
    UserPosted(UserPostedOutput),
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(tag = "code")]
pub enum OutputError {
    #[serde(rename = "name-taken")]
    NameTaken,
    #[serde(rename = "invalid-name")]
    InvalidName,
    #[serde(rename = "not-joined")]
    NotJoined,
    #[serde(rename = "invalid-message-body")]
    InvalidMessageBody,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserPostedOutput {
    pub message: MessageOutput,
}
// ...
```

Specifying `serde` attribute as `#[serde(tag = "type", content = "payload", rename_all = "camelCase")]` will make serialization work with desired `type`/`payload` format.
We also want fields to be camel-cased for easier usage with front-end Javascript app.

See [Enum representations](https://serde.rs/enum-representations.html).

By using [serde_json](https://docs.serde.rs/serde_json/) crate, JSON messages can now be deserialized into `Input` enum.

```json
{
    "type": "join",
    "payload": {
        "name": "John"
    }
}
```

```rust
let input: Input = serde_json::from_str(r#"{"type": "join", "payload": {"name": "John"}}"#).unwrap();
assert_eq!(input, Input::Join(JoinInput { name: String::from("John") }));
```

Serialization also works as expected.

```rust
let output = Output::UserPosted(UserPostedOutput::new(MessageOutput::new(
    Uuid::nil(),
    UserOutput::new(Uuid::nil(), "John"),
    "Hello",
    Utc.timestamp_millis_opt(0).unwrap(),
)));
let json = serde_json::to_string(&output).unwrap();
println!("{}", json);
```

```json
{
    "type": "user-posted",
    "payload": {
        "message": {
            "id": "00000000-0000-0000-0000-000000000000",
            "user": {
                "id": "00000000-0000-0000-0000-000000000000",
                "name": "John"
            },
            "body": "Hello",
            "createdAt": "1970-01-01T00:00:00Z"
        }
    }
}
```

To associate messages with clients, we also declare `InputParcel` and `OutputParcel` structs.

```rust
#[derive(Debug, Clone)]
pub struct InputParcel {
    pub client_id: Uuid,
    pub input: Input,
}

#[derive(Debug, Clone)]
pub struct OutputParcel {
    pub client_id: Uuid,
    pub output: Output,
}
```

`InputParcel::client_id` is ID of a client who sent the message, while `OutputParcel::client_id` is target client's ID we want send message to.

# Core logic

All domain logic will be located in the `Hub` struct.
Its job is to process incoming messages and broadcast necessary updates.

The two relevant features of our chat app are "joining" and "posting".
To join, a user needs to provide his name.
Once joined, he is able to post messages to the main feed.
Users will be notified on all new messages and if anyone else joined or left the chat.
Output variant of `Output::Alive` will be periodically sent out and can be used for checking if server is up and running.

Let's declare `Hub` struct inside [hub.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/hub.rs).

```rust
const OUTPUT_CHANNEL_SIZE: usize = 16;

#[derive(Clone, Copy, Default)]
pub struct HubOptions {
    pub alive_interval: Option<Duration>,
}

pub struct Hub {
    alive_interval: Option<Duration>,
    output_sender: broadcast::Sender<OutputParcel>,
    users: RwLock<HashMap<Uuid, User>>,
    feed: RwLock<Feed>,
}

impl Hub {
    pub fn new(options: HubOptions) -> Self {
        let (output_sender, _) = broadcast::channel(OUTPUT_CHANNEL_SIZE);
        Hub {
            alive_interval: options.alive_interval,
            output_sender,
            users: Default::default(),
            feed: Default::default(),
        }
    }
    // ...
}
```

Using `HubOptions` here is a bit redundant, but it helps to separate domain-level options which could be read-in from an external configuration in the future.
`output_sender` will be used to broadcast outputs from the hub.
We wrap `users` and `feed` inside `RwLock`, because many concurrent tasks will access their values and not necessary modify them.
`Mutex` would block tasks wanting to read if a single task holds the lock.

Let's write some utility functions.
`send` function sends an `output` to all joined users.

```rust
impl Hub {
    // ...
    async fn send(&self, output: Output) {
        if self.output_sender.receiver_count() == 0 {
            return;
        }
        self.users.read().await.keys().for_each(|user_id| {
            self.output_sender
                .send(OutputParcel::new(*user_id, output.clone()))
                .unwrap();
        });
    }
    // ...
}
```

`send_targeted` and `send_ignored` functions are used to send outputs to a specific user or every user except one.

```rust
impl Hub {
    // ...
    fn send_targeted(&self, client_id: Uuid, output: Output) {
        if self.output_sender.receiver_count() > 0 {
            self.output_sender
                .send(OutputParcel::new(client_id, output))
                .unwrap();
        }
    }

    async fn send_ignored(&self, ignored_client_id: Uuid, output: Output) {
        if self.output_sender.receiver_count() == 0 {
            return;
        }
        self.users
            .read()
            .await
            .values()
            .filter(|user| user.id != ignored_client_id)
            .for_each(|user| {
                self.output_sender
                    .send(OutputParcel::new(user.id, output.clone()))
                    .unwrap();
            });
    }

    fn send_error(&self, client_id: Uuid, error: OutputError) {
        self.send_targeted(client_id, Output::Error(error));
    }
    // ...
}
```

Listeners will be able to subscribe to hub's updates with `subscribe`.
This will be used to publish outputs to clients.
When user disconnect we'll call `on_disconnect` to remove him from the list.

```rust
impl Hub {
    // ...
    pub fn subscribe(&self) -> broadcast::Receiver<OutputParcel> {
        self.output_sender.subscribe()
    }

    pub async fn on_disconnect(&self, client_id: Uuid) {
        // Remove user on disconnect
        if self.users.write().await.remove(&client_id).is_some() {
            self.send_ignored(client_id, Output::UserLeft(UserLeftOutput::new(client_id)))
                .await;
        }
    }
    // ...
}
```

`tick_alive` function periodically sends `Output::Alive` messages to every user.

```rust
impl Hub {
    // ...
    async fn tick_alive(&self) {
        let alive_interval = if let Some(alive_interval) = self.alive_interval {
            alive_interval
        } else {
            return;
        };
        loop {
            time::delay_for(alive_interval).await;
            self.send(Output::Alive).await;
        }
    }
    // ...
}
```

## Joining

Let's write the main entry point into the hub as `run` function.
It creates futures for both sub routines, `self.tick_alive` and `self.process` for each item in `receiver`, and awaits for at least one of them to finish using `tokio::select!`.
`process` function will delegate processing of each input command from `receiver` to a separate function.

```rust
impl Hub {
    // ...
    pub async fn run(&self, receiver: UnboundedReceiver<InputParcel>) {
        let ticking_alive = self.tick_alive();
        let processing = receiver.for_each(|input_parcel| self.process(input_parcel));
        tokio::select! {
            _ = ticking_alive => {},
            _ = processing => {},
        }
    }

    async fn process(&self, input_parcel: InputParcel) {
        match input_parcel.input {
            Input::Join(input) => self.process_join(input_parcel.client_id, input).await,
            Input::Post(input) => self.process_post(input_parcel.client_id, input).await,
        }
    }
    // ...
}
```

When joining, we need to verify that user's chosen name is unique.
We get current users by calling `self.users.read().await`, which locks the users map with a read-only lock.

```rust
impl Hub {
    // ...
    async fn process_join(&self, client_id: Uuid, input: JoinInput) {
        let user_name = input.name.trim();

        // Check if user's name is taken
        if self
            .users
            .read()
            .await
            .values()
            .any(|user| user.name == user_name)
        {
            self.send_error(client_id, OutputError::NameTaken);
            return;
        }
    // ...
}
```

Next, we need to validate user's name.
This is done with a simple regex.

```rust
// highlight-start
lazy_static! {
    static ref USER_NAME_REGEX: Regex = Regex::new("[A-Za-z\\s]{4,24}").unwrap();
}
// highlight-end

async fn process_join(&self, client_id: Uuid, input: JoinInput) {
// ...
// highlight-start
    // Validate user name
    if !USER_NAME_REGEX.is_match(user_name) {
        self.send_error(client_id, OutputError::InvalidName);
        return;
    }
// highlight-end
// ...
}
```

If everything checks out, we insert a new user into `users` map by obtaining a write lock.

```rust
async fn process_join(&self, client_id: Uuid, input: JoinInput) {
// ...
// highlight-start
    let user = User::new(client_id, user_name);
    self.users.write().await.insert(client_id, user.clone());
// highlight-end
// ...
}
```

Finally, we notify the user with a success message and other users about a new member.

```rust
async fn process_join(&self, client_id: Uuid, input: JoinInput) {
// ...
// highlight-start
    // Report success to user
    let user_output = UserOutput::new(client_id, user_name);
    let other_users = self
        .users
        .read()
        .await
        .values()
        .filter_map(|user| {
            if user.id != client_id {
                Some(UserOutput::new(user.id, &user.name))
            } else {
                None
            }
        })
        .collect();
    let messages = self
        .feed
        .read()
        .await
        .messages_iter()
        .map(|message| {
            MessageOutput::new(
                message.id,
                UserOutput::new(message.user.id, &message.user.name),
                &message.body,
                message.created_at,
            )
        })
        .collect();
    self.send_targeted(
        client_id,
        Output::Joined(JoinedOutput::new(
            user_output.clone(),
            other_users,
            messages,
        )),
    );
    // Notify others that someone joined
    self.send_ignored(
        client_id,
        Output::UserJoined(UserJoinedOutput::new(user_output)),
    )
    .await;
// highlight-end
}
```

## Posting

To post a message we need to validate it and check if author exists as joined user.

```rust
// highlight-next-line
const MAX_MESSAGE_BODY_LENGTH: usize = 256;

impl Hub {
    // ...
    async fn process_post(&self, client_id: Uuid, input: PostInput) {
        // Verify that user exists
        let user = if let Some(user) = self.users.read().await.get(&client_id) {
            user.clone()
        } else {
            self.send_error(client_id, OutputError::NotJoined);
            return;
        };

        // Validate message body
        if input.body.is_empty() || input.body.len() > MAX_MESSAGE_BODY_LENGTH {
            self.send_error(client_id, OutputError::InvalidMessageBody);
            return;
        }
    // ...
}
```

We add a new message to the feed.

```rust
async fn process_post(&self, client_id: Uuid, input: PostInput) {
    // ...
// highlight-start
        let message = Message::new(Uuid::new_v4(), user.clone(), &input.body, Utc::now());
        self.feed.write().await.add_message(message.clone());
// highlight-end
    // ...
}
```

At the end, we send out notifications.

```rust
async fn process_post(&self, client_id: Uuid, input: PostInput) {
    // ...
// highlight-start
    let message_output = MessageOutput::new(
        message.id,
        UserOutput::new(user.id, &user.name),
        &message.body,
        message.created_at,
    );
    // Report post status
    self.send_targeted(
        client_id,
        Output::Posted(PostedOutput::new(message_output.clone())),
    );
    // Notify everybody about new message
    self.send_ignored(
        client_id,
        Output::UserPosted(UserPostedOutput::new(message_output)),
    )
    .await;
}
```

# WebSocket server

Server will hold WebSocket connections and forward messages between clients and the hub.

Let's declare the `Server` struct inside [server.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/server.rs).

```rust
use std::sync::Arc;

use futures::{StreamExt, TryStreamExt};
use log::{error, info};
use tokio::signal;
use tokio::sync::mpsc;
use tokio::sync::mpsc::UnboundedSender;
use tokio::time::Duration;
use warp::Filter;
use warp::ws::WebSocket;

use crate::client::Client;
use crate::hub::{Hub, HubOptions};
use crate::proto::InputParcel;

pub struct Server {
    port: u16,
    hub: Arc<Hub>,
}

impl Server {
    pub fn new(port: u16) -> Self {
        Server {
            port,
            hub: Arc::new(Hub::new(HubOptions {
                alive_interval: Some(Duration::from_secs(5)),
            })),
        }
    }
    // ...
}
```

To run a server, we set up a HTTP router using [warp](https://crates.io/crates/warp) crate.
We have a single route `/feed` that listens for WebSocket connections.
When a connection is established and upgraded to a WebSocket, we delegate it to `Server::process_client` in a separate task.

```rust
impl Server {
    // ...
    pub async fn run(&self) {
        let (input_sender, input_receiver) = mpsc::unbounded_channel::<InputParcel>();
        let hub = self.hub.clone();

        let feed = warp::path("feed")
            .and(warp::ws())
            .and(warp::any().map(move || input_sender.clone()))
            .and(warp::any().map(move || hub.clone()))
            .map(
                move |ws: warp::ws::Ws,
                      input_sender: UnboundedSender<InputParcel>,
                      hub: Arc<Hub>| {
                    ws.on_upgrade(move |web_socket| async move {
                        tokio::spawn(Self::process_client(hub, web_socket, input_sender));
                    })
                },
            );

        let shutdown = async {
            tokio::signal::ctrl_c()
                .await
                .expect("failed to install CTRL+C signal handler");
        };
        let (_, serving) =
            warp::serve(feed).bind_with_graceful_shutdown(([127, 0, 0, 1], self.port), shutdown);

        let running_hub = self.hub.run(input_receiver);

        tokio::select! {
            _ = serving => {},
            _ = running_hub => {},
        }
    }
    // ...
}
```

Similarly, as in `Hub`, we await for `serving` and `running_hub` futures.

## Handling clients

`process_client` function describes the entire lifetime of a client.
We obtain a stream (inbound) and a sink (outbound) for a WebSocket connection with `web_socket.split()`.
Using `Client::read_input` and `Client::write_output` we forward messages from and to a client.

```rust
impl Server {
    // ...
    async fn process_client(
        hub: Arc<Hub>,
        web_socket: WebSocket,
        input_sender: UnboundedSender<InputParcel>,
    ) {
        let output_receiver = hub.subscribe();
        let (ws_sink, ws_stream) = web_socket.split();
        let client = Client::new();

        info!("Client {} connected", client.id);

        let reading = client
            .read_input(ws_stream)
            .try_for_each(|input_parcel| async {
                input_sender.send(input_parcel).unwrap();
                Ok(())
            });

        let (tx, rx) = mpsc::unbounded_channel();
        tokio::spawn(rx.forward(ws_sink));
        let writing = client
            .write_output(output_receiver.into_stream())
            .try_for_each(|message| async {
                tx.send(Ok(message)).unwrap();
                Ok(())
            });

        if let Err(err) = tokio::select! {
            result = reading => result,
            result = writing => result,
        } {
            error!("Client connection error: {}", err);
        }

        hub.on_disconnect(client.id).await;
        info!("Client {} disconnected", client.id);
    }
    // ...
}
```

Client itself needs a unique ID to make it distinguishable from others in domain logic.
Client is declared inside [client.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/client.rs).

```rust
use std::{error, result};

use futures::stream::SplitStream;
use futures::{future, Stream, StreamExt, TryStream, TryStreamExt};
use uuid::Uuid;
use warp::filters::ws::WebSocket;

use crate::error::{Error, Result};
use crate::proto::{InputParcel, OutputParcel};

#[derive(Clone, Copy, Default)]
pub struct Client {
    pub id: Uuid,
}

impl Client {
    pub fn new() -> Self {
        Client { id: Uuid::new_v4() }
    }
    // ...
}
```

Reading from a WebSocket stream requires deserialization of JSON messages into our `Input` enum.

```rust
impl Client {
    pub fn read_input(
        &self,
        stream: SplitStream<WebSocket>,
    ) -> impl Stream<Item = Result<InputParcel>> {
        let client_id = self.id;
        stream
            // Take only text messages
            .take_while(|message| {
                future::ready(if let Ok(message) = message {
                    message.is_text()
                } else {
                    false
                })
            })
            // Deserialize JSON messages into proto::Input
            .map(move |message| match message {
                Err(err) => Err(Error::System(err.to_string())),
                Ok(message) => {
                    let input = serde_json::from_str(message.to_str().unwrap())?;
                    Ok(InputParcel::new(client_id, input))
                }
            })
    }
    // ...
}
```

To write `Output` enum to a client we simply serialize it to JSON.
Here we also filter out messages based on `client_id`.

```rust
impl Client {
    // ...
    pub fn write_output<S, E>(&self, stream: S) -> impl Stream<Item = Result<warp::ws::Message>>
    where
        S: TryStream<Ok = OutputParcel, Error = E> + Stream<Item = result::Result<OutputParcel, E>>,
        E: error::Error,
    {
        let client_id = self.id;
        stream
            // Skip irrelevant parcels
            .try_filter(move |output_parcel| future::ready(output_parcel.client_id == client_id))
            // Serialize to JSON
            .map_ok(|output_parcel| {
                let data = serde_json::to_string(&output_parcel.output).unwrap();
                warp::ws::Message::text(data)
            })
            .map_err(|err| Error::System(err.to_string()))
    }
    // ...
}
```

## Running

To run the server we create it and call `Server::run` inside [main.rs](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/src/main.rs).

```rust
#[tokio::main]
async fn main() {
    env_logger::init();

    let server = Server::new(8080);
    server.run().await;
}
```

# React app

Front-end app can be found in [frontend](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/frontend) directory.

By using [redux](https://redux.js.org/) and [redux-saga](https://redux-saga.js.org/) we communicate with the server using read/write loops and reacting to actions wherever needed.
Here's an excerpt of our API saga [api/saga.ts](https://github.com/tinrab/rusty-chat/tree/e85566ac29df426a2119b3dc4b212846eb04d59c/frontend/src/api/saga.ts).

```ts
function* connectWebSocket(): Generator<StrictEffect> {
    const webSocket = new WebSocket(config.webSocketUrl);
    const webSocketChannel = (yield call(createWebSocketChannel, webSocket)) as EventChannel<Output>;
    yield fork(read, webSocketChannel);
    yield fork(write, webSocket);
}

function* read(webSocketChannel: EventChannel<Output>): Generator<StrictEffect> {
    while (true) {
        const output = (yield take(webSocketChannel)) as Output;
        yield put(apiActions.read(output));
    }
}

function* write(webSocket: WebSocket): Generator<StrictEffect> {
    while (true) {
        const action = (yield take(ApiActionType.Write)) as WriteApiAction;
        webSocket.send(JSON.stringify(action.payload));
    }
}
```

Types `WriteApiAction` and `ReadApiAction` are defined as such.

```ts
export type WriteApiAction = {
    type: ApiActionType.Write;
    payload: Input;
};

export type ReadApiAction = {
    type: ApiActionType.Read;
    payload: Output;
};
```

`Input` and `Output` types follow the same schema as the message protocol on the server.

```ts
export enum OutputType {
    Error = 'error',
    Alive = 'alive',
    Joined = 'joined',
    UserJoined = 'user-joined',
    UserLeft = 'user-left',
    Posted = 'posted',
    UserPosted = 'user-posted',
}

export type UserOutput = {
    id: string;
    name: string;
};

export type MessageOutput = {
    id: string;
    user: UserOutput;
    body: string;
    createdAt: Date,
};

export type JoinedOutput = {
    type: OutputType.Joined;
    payload: {
        user: UserOutput;
        others: UserOutput[];
        messages: MessageOutput[];
    };
};
// ...

export type Output =
    ErrorOutput |
    AliveOutput |
    JoinedOutput |
    UserJoinedOutput |
    UserLeftOutput |
    PostedOutput |
    UserPostedOutput;
```

This allows casting JSON such as `{"type":"joined","payload":{"name":"John"}}` to `Output` type and subsequently to `JoinedOutput`.

To perform an API call, in a style of request/reply, we first dispatch a `WriteApiAction` and wait for any `ReadApiAction`.

Here's the procedure for joining.

```ts
yield put(apiActions.write(apiProto.join(action.payload.name)));

while (true) {
    const read = (yield take(ApiActionType.Read)) as ReadApiAction;

    if (read.payload.type === OutputType.Error) {
        yield put(userActions.joined({ error: true, code: read.payload.payload.code }));
        break;
    } else if (read.payload.type === OutputType.Joined) {
        const output = read.payload.payload;
        yield put(userActions.joined({
            error: false,
            user: output.user,
            others: output.others,
            messages: output.messages,
        }));
        break;
    }
}
```

This approach is simple, but not quite bulletproof.
For example, there could be other error actions flying around, so we would need to define a correlation between actions within a single "transaction".

# Conclusion

To run the chat app, first start the server.

```bash
RUST_LOG=info cargo run
```

Then start the front-end app.

```bash
cd frontend && nvm use && npm install
npm run start
```

Now you can open <http://localhost:3000/> in multiple tabs and try it out.

Source code can be found on [GitHub](https://github.com/tinrab/rusty-chat).
