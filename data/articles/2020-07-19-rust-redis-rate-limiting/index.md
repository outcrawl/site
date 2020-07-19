---
title: Rate Limiting in Rust Using Redis
author: tin-rabzelj
tags:
  - Rust
  - Redis
description: This article shows how to perform rate limiting in Rust using Redis.
cover: ./cover.jpg
---

Rate limiting involves limiting the amount of traffic to an API, typically to a certain request count within some time period.
This article describes the fixed window, sliding log and sliding window approaches to rate limiting, which can all be implemented within a single Redis [transaction](https://redis.io/topics/transactions).

Source code is on [GitHub](https://github.com/tinrab/rusty-redis-rate-limiting).

Here are the dependencies used.

```toml
[dependencies]
redis = "0.16.0"
futures = "0.3.5"
tokio = { version = "0.2.21", features = ["full"] }
```

# Setting up

Firstly, we need to establish a connection to a Redis server.

For local development, we can use Docker Compose and declare a Redis container inside [docker-compose.yaml](https://github.com/tinrab/rusty-redis-rate-limiting/blob/63b8bf4483f154f6a16b72e1275553b5c13dd679/docker-compose.yaml).

```yaml
version: "3.8"

services:
  redis:
    container_name: redis
    image: redis:6.0.5-alpine
    ports:
      - "6379:6379"
```

Then run it.

```bash
docker-compose up -d --build
```

Redis server is now running locally on port 6379.

We declare the `RateLimiter` struct and create a connection to Redis ([src/rate_limiter.rs](https://github.com/tinrab/rusty-redis-rate-limiting/blob/63b8bf4483f154f6a16b72e1275553b5c13dd679/src/rate_limiter.rs)).

```rust
pub struct RateLimiter {
    conn: Connection,
}

impl RateLimiter {
    pub async fn open(redis_address: &str) -> Result<Self, Box<dyn Error>> {
        let client = redis::Client::open(redis_address).unwrap();
        let conn = client.get_async_connection().await?;
        Ok(RateLimiter { conn })
    }
    // ...
}
```

# Fixed window

A fixed window is a time span between $t_0$ and $t_1$.
Its duration or size equals $s=t_1-t_0$.
We simply count requests within this time span.

Counting is done by storing key-value pairs for every consecutive window, where keys are window identifiers and values are counters.
We can use Redis [INCRBY](https://redis.io/commands/incrby)/[INCR](https://redis.io/commands/incr) and [EXPIRE](https://redis.io/commands/expire) commands to atomically count requests.

```
MULTI
INCRBY {key} 1
EXPIRE {key} {window_size}
EXEC
```

We can expire keys when a window's time passes, which is determined by its size (in seconds).

Each key has to contain a window identifier, so we can query them based on time.
One way is to use current time in seconds $t$ rounded to window's size: $s\left\lfloor \frac{t}{s} \right\rfloor$.
This allows constructing a key based on current time by simply rounding down to the nearest window.

Let's implement this for our `RateLimiter` struct.

```rust
impl RateLimiter {
    // ...
    pub async fn record_fixed_window(
        &mut self,
        resource: &str,
        subject: &str,
        size: Duration,
    ) -> Result<u64, Box<dyn Error>> {
        let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
        let window = (now.as_secs() / size.as_secs()) * size.as_secs();
        let key = format!("{}:{}:{}:{}", KEY_PREFIX, resource, subject, window);

        let (count,): (u64,) = redis::pipe()
            .atomic()
            .incr(&key, 1)
            .expire(&key, size.as_secs() as usize)
            .ignore()
            .query_async(&mut self.conn)
            .await?;
        Ok(count)
    }
    // ...
}
```

Parameter `resource` determines a tracked API resource and `subject` is a client calling it.
Subject can be client's public API key.
Call to `.incr(&key, 1)` will return the value after the increment.

We can also fetch the current request count without incrementing it.

```rust
impl RateLimiter {
    // ...
    pub async fn fetch_fixed_window(
        &mut self,
        resource: &str,
        subject: &str,
        size: Duration,
    ) -> Result<u64, Box<dyn Error>> {
        let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
        let window = (now.as_secs() / size.as_secs()) * size.as_secs();
        let key = format!("{}:{}:{}:{}", KEY_PREFIX, resource, subject, window);

        let count: u64 = self.conn.get(key).await?;
        Ok(count)
    }
    // ...
}
```

Here's an example of how this can be used ([examples/fixed_window.rs](https://github.com/tinrab/rusty-redis-rate-limiting/blob/63b8bf4483f154f6a16b72e1275553b5c13dd679/examples/fixed_window.rs)).

```rust
let mut rate_limiter = RateLimiter::open("redis://127.0.0.1:6379/").await?;
let size = Duration::from_secs(1);

for i in 1..=3 {
    let count = rate_limiter
        .record_fixed_window("test", "user1", size)
        .await?;
    assert_eq!(count, i);
}

tokio::time::delay_for(size).await;

let count = rate_limiter
    .record_fixed_window("test", "user1", size)
    .await?;
assert_eq!(count, 1);
```

The fixed window algorithm is simple and efficient, but it's not always accurate.
If there's a large traffic spike at the end of a time span, then at the start of next time span the actual count could be greater than allowed one.
Similarly, rate limit quota can be "starved" if there's a traffic spike at the beginning of a longer time span.

# Sliding log

Sliding log algorithm uses a sorted set to store every request sorted by time.
To check request count, we remove all elements older than current time window and count remaining ones.

Redis has built-in support for sorted sets.
We can use [ZADD](https://redis.io/commands/zadd) command to add a new element to the set, sorted by a score, which is request time in milliseconds.
The value of an element doesn't matter, but it could be a cost specific to API resources.
Meaning, some resources are more expensive to use than others.
Elements can be removed with [ZREMRANGEBYSCORE](https://redis.io/commands/zremrangebyscore) command, where `max` parameter is time of the previous window.
By using [ZCARD](https://redis.io/commands/zcard) command, we can get window's count.

```
MULTI
ZREMRANGEBYSCORE {key} 0 {now - window_size}
ZADD {key} {now} {now}
ZCARD {key}
EXPIRE {key} {window_size}
EXEC
```

Let's implement this in `record_sliding_log` function.

```rust
impl RateLimiter {
    // ...
    pub async fn record_sliding_log(
        &mut self,
        resource: &str,
        subject: &str,
        size: Duration,
    ) -> Result<u64, Box<dyn Error>> {
        let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
        let key = format!("{}:{}:{}", KEY_PREFIX, resource, subject);

        let (count,): (u64,) = redis::pipe()
            .atomic()
            .zrembyscore(&key, 0, (now.as_millis() - size.as_millis()) as u64)
            .ignore()
            .zadd(&key, now.as_millis() as u64, now.as_millis() as u64)
            .ignore()
            .zcard(&key)
            .expire(&key, size.as_secs() as usize)
            .ignore()
            .query_async(&mut self.conn)
            .await?;
        Ok(count)
    }
    // ...
}
```

Querying for the count uses `zcard`.

```rust
impl RateLimiter {
    // ...
    pub async fn fetch_sliding_log(
        &mut self,
        resource: &str,
        subject: &str,
    ) -> Result<u64, Box<dyn Error>> {
        let key = format!("{}:{}:{}", KEY_PREFIX, resource, subject);

        let count: u64 = self.conn.zcard(key).await?;
        Ok(count)
    }
    // ...
}
```

Here's how this can be used ([examples/sliding_log.rs](https://github.com/tinrab/rusty-redis-rate-limiting/blob/63b8bf4483f154f6a16b72e1275553b5c13dd679/examples/sliding_log.rs)).

```rust
let mut rate_limiter = RateLimiter::open("redis://127.0.0.1:6379/").await?;
let size = Duration::from_secs(1);

for _ in 0..3 {
    rate_limiter
        .record_sliding_log("test", "user1", size)
        .await?;
    tokio::time::delay_for(Duration::from_millis(300)).await;
}
let count = rate_limiter.fetch_sliding_log("test", "user1").await?;
assert_eq!(count, 3);

tokio::time::delay_for(Duration::from_millis(600)).await;
let count = rate_limiter
    .record_sliding_log("test", "user1", size)
    .await?;
assert_eq!(count, 2);
```

Sliding log improves upon the fixed window, because it counts request more accurately at windows' boundaries.
Disadvantage is that it must store every request, which makes it not very scalable.

# Sliding window

For sliding window we keep two consecutive fixed windows and calculate weighted request count between them.
The current window's count is equal to $n_{t_0}+n_{t_{-1}}(1-\frac{t_1-t_0}{s})$, where $n_t$ is window's count at time $t$.

Implementation extends the fixed window with additional key for a previous window $t_{-1}$.
We must ensure that keys don't expire too soon, which is why the expiration is double the window's size.

Let's implement `record_sliding_window` function.

```rust
impl RateLimiter {
    // ...
    pub async fn record_sliding_window(
        &mut self,
        resource: &str,
        subject: &str,
        size: Duration,
    ) -> Result<u64, Box<dyn Error>> {
        let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
        let size_secs = size.as_secs();

        let current_window = (now.as_secs() / size_secs) * size_secs;
        let previous_window = (now.as_secs() / size_secs) * size_secs - size_secs;
        let current_key = format!("{}:{}:{}:{}", KEY_PREFIX, resource, subject, current_window);
        let previous_key = format!(
            "{}:{}:{}:{}",
            KEY_PREFIX, resource, subject, previous_window
        );

        let (previous_count, current_count): (Option<u64>, Option<u64>) = redis::pipe()
            .atomic()
            .get(&previous_key)
            .incr(&current_key, 1)
            .expire(&current_key, (size_secs * 2) as usize)
            .ignore()
            .query_async(&mut self.conn)
            .await?;
        Ok(Self::sliding_window_count(
            previous_count,
            current_count,
            now,
            size,
        ))
    }
    // ...
}
```

When we increment keys, we also fetch previous and current counts and calculate the weighted count.

Here's a helper function to calculate the final window count.

```rust
impl RateLimiter {
    // ...
    pub fn sliding_window_count(
        previous: Option<u64>,
        current: Option<u64>,
        now: Duration,
        size: Duration,
    ) -> u64 {
        let current_window = (now.as_secs() / size.as_secs()) * size.as_secs();
        let next_window = current_window + size.as_secs();
        let weight = (Duration::from_secs(next_window).as_millis() - now.as_millis()) as f64
            / size.as_millis() as f64;
        current.unwrap_or(0) + (previous.unwrap_or(0) as f64 * weight).round() as u64
    }
    // ...
}
```

`fetch_sliding_window` function queries both counts and calculates the weighted count.

```rust
impl RateLimiter {
    // ...
    pub async fn fetch_sliding_window(
        &mut self,
        resource: &str,
        subject: &str,
        size: Duration,
    ) -> Result<u64, Box<dyn Error>> {
        let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
        let size_secs = size.as_secs();

        let current_window = (now.as_secs() / size_secs) * size_secs;
        let previous_window = (now.as_secs() / size_secs) * size_secs - size_secs;
        let current_key = format!("{}:{}:{}:{}", KEY_PREFIX, resource, subject, current_window);
        let previous_key = format!(
            "{}:{}:{}:{}",
            KEY_PREFIX, resource, subject, previous_window
        );

        let (previous_count, current_count): (Option<u64>, Option<u64>) =
            self.conn.get(vec![previous_key, current_key]).await?;
        Ok(Self::sliding_window_count(
            previous_count,
            current_count,
            now,
            size,
        ))
    }
    // ...
}
```

Here is an example ([examples/sliding_window.rs](https://github.com/tinrab/rusty-redis-rate-limiting/blob/63b8bf4483f154f6a16b72e1275553b5c13dd679/examples/sliding_window.rs)).

```rust
let mut rate_limiter = RateLimiter::open("redis://127.0.0.1:6379/").await?;
let size = Duration::from_secs(1);

for _ in 0..5 {
    rate_limiter
        .record_sliding_window("test", "user1", size)
        .await?;
}
let count = rate_limiter
    .fetch_sliding_window("test", "user1", size)
    .await?;
assert_eq!(count, 5);

tokio::time::delay_for(size).await;

rate_limiter
    .record_sliding_window("test", "user1", size)
    .await?;
let count = rate_limiter
    .fetch_sliding_window("test", "user1", size)
    .await?;

let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
let expected_count = RateLimiter::sliding_window_count(Some(5), Some(1), now, size);
assert_eq!(count, expected_count);
```

The sliding window algorithm is practically as efficient as fixed window.
It comes with additional constant cost for holding an extra key-value pair and some math.
As with fixed windows, performance and accuracy can be altered by tweaking the window's size.

# Conclusion

These were a couple of rate limiting algorithms that can be implemented atomically with Redis.
Another two relevant ones are the token bucket and the leaky bucket, which we could implement with Lua scripting for atomicity.

Also, here's a Redis module for rate limiting worth checking out: [redis-cell](https://github.com/brandur/redis-cell).

Source code is on [GitHub](https://github.com/tinrab/rusty-redis-rate-limiting).

**References**

- [Basic Rate Limiting](https://redislabs.com/redis-best-practices/basic-rate-limiting/).
- [How to Design a Scalable Rate Limiting Algorithm](https://konghq.com/blog/how-to-design-a-scalable-rate-limiting-algorithm/).
