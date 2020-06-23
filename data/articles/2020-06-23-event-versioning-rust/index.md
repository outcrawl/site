---
title: Event Versioning with Rust
author: tin-rabzelj
tags:
  - Rust
  - Event-driven
  - Architecture
description: A simple way to version events by using enums and serde in Rust.
---

When working with event-driven systems, which contain long-lived events or event-sourced persistence, there will be cases where multiple versions of a single event's schema will have to be consumed.

For a side project of mine, I wanted to have a straightforward way to serialize and deserialize versioned events.
Here's my current solution.

These are dependencies used.

```toml
[dependencies]
lazy_static = "1.4.0"
serde = { version = "1.0.112", features = ["derive"] }
serde_json = "1.0.55"
chrono = { version = "0.4.11", features = ["serde"] }
regex = "1.3.9"
```

# Initial version

Suppose we are developing a blog.
Struct `ArticleCreated` describes an event when a new article is created.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ArticleCreated {
    pub id: u64,
    pub title: String,
    pub state: u8,
}
```

We wrap this struct in the `Event` enum, where variants determine event's type.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum Event {
    #[serde(rename = "article/created")]
    ArticleCreated(ArticleCreated),
}
```

Specifying `tag` and `content` attributes will tag representation with `type` field and put content under `payload` field.
See [Adjacently tagged](https://serde.rs/enum-representations.html#adjacently-tagged).

Similarly, we declare an enum for versioned events.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "version")]
pub enum VersionedEvent {
    #[serde(rename = "v1")]
    V1(Event),
}
```

We can now serialize an instance of this enum.

```rust
let event = VersionedEvent::V1(Event::ArticleCreated(ArticleCreated {
    id: 314159,
    title: String::from("How to write Rust"),
    state: 1,
}));
let event_str = serde_json::to_string_pretty(&event).unwrap();
println!("{}", &event_str);
```

Here's the resulting JSON representation.

```json
{
  "version": "v1",
  "type": "article/created",
  "payload": {
    "id": 314159,
    "title": "How to write Rust",
    "state": 1
  }
}
```

# Version bump

Now we need to release a new version of `ArticleCreated` event.
Some changes, like adding a new field, are probably backwards compatible and don't require a new version.
Let us consider cases when we have to.

Rename previous `ArticleCreated` to `ArticleCreatedV1` and `Event` to `EventV1`.
I prefer having simpler name for the latest version.

Here's the new event struct.

```rust
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ArticleState {
    Draft,
    Published,
    Archived,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ArticleCreated {
    pub article_id: String,
    pub title: String,
    pub slug: String,
    pub state: ArticleState,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<DateTime<Utc>>,
}
```

The latest event enum is now `Event`, and the old one is `EventV1`.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum EventV1 {
    #[serde(rename = "article/created")]
    ArticleCreated(ArticleCreatedV1),
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum Event {
    #[serde(rename = "article/created")]
    ArticleCreated(ArticleCreated),
}
```

Declare a new version in `VersionedEvent`.

```rust
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "version")]
pub enum VersionedEvent {
    #[serde(rename = "v1")]
    V1(EventV1),
// highlight-start
    #[serde(rename = "v2")]
    V2(Event),
// highlight-end
}
```

We want a function for converting old events to newer ones.
This can be done by implementing the `From` trait.

```rust
lazy_static! {
    static ref SLUG_REGEX: Regex = Regex::new(r#"\s+"#).unwrap();
}

impl From<EventV1> for Event {
    fn from(event: EventV1) -> Self {
        match event {
            EventV1::ArticleCreated(event) => Event::ArticleCreated(ArticleCreated {
                article_id: event.id.to_string(),
                title: event.title.clone(),
                slug: format!(
                    "{}-{}",
                    SLUG_REGEX.replace_all(&event.title, "-").to_lowercase(),
                    event.id
                ),
                state: match event.state {
                    1 => ArticleState::Published,
                    2 => ArticleState::Archived,
                    _ => ArticleState::Draft,
                },
                created_at: None,
            }),
        }
    }
}
```

New field `slug` gets a value generated from `title` and `id`.
Field `state` is now an enum.
Optional field `created_at` gets assigned a `None`.

A helper function `migrate` can convert any versioned event to the latest one.
Sometimes this is called "upcasting".

```rust
impl VersionedEvent {
    pub fn migrate(self) -> Self {
        match &self {
            VersionedEvent::V1(event) => VersionedEvent::V2(Event::from(event.clone())),
            VersionedEvent::V2(_) => self,
        }
    }
}
```

Later versions can follow this pattern for each event type.

We can now serialize an older event, then deserialize it into the latest version.

```rust
let event = VersionedEvent::V1(EventV1::ArticleCreated(ArticleCreatedV1 {
    id: 314159,
    title: String::from("How to write Rust"),
    state: 1,
}));
let event_str = serde_json::to_string_pretty(&event).unwrap();

let event = serde_json::from_str::<VersionedEvent>(&event_str)
    .unwrap()
    .migrate();
let str = serde_json::to_string_pretty(&event).unwrap();
println!("{}", &str);
```

Which produces the following.

```json
{
  "version": "v2",
  "type": "article/created",
  "payload": {
    "article_id": "314159",
    "title": "How to write Rust",
    "slug": "how-to-write-rust-314159",
    "state": "Published"
  }
}
```

We could add more implementations of `From` to make working with event structs easier.

For example, adding:

```rust
impl From<VersionedEvent> for ArticleCreated {
    fn from(event: VersionedEvent) -> Self {
       // ...
    }
}
```

would make it possible to do:

```rust
let article_created: ArticleCreated = event.into();
```

without the need for pattern matching.

# Conclusion

It is important to note that consumers would have to know how to deserialize any version of an event.
Before a producer begins publishing newer events, we would have to upgrade all consumers to be able to read them.

Another option is to publish previous versions alongside current ones, and let consumers handle whichever version they can.
Older version would be marked as deprecated.
When all consumers are up-to-date, they could switch to only reading the latest events.

Here's a cool eBook on this topic: [Versioning in an Event Sourced System](https://leanpub.com/esversioning).
It's incomplete, but contains good information.
