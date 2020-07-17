---
title: Rate Limiting in Rust Using Redis
author: tin-rabzelj
tags:
  - Rust
  - Redis
description: This article shows how to perform rate limiting in Rust using Redis.
cover: ./cover.jpg
---



Source code can be found on [GitHub](https://github.com/tinrab/rusty-redis-rate-limiting).

Here are dependencies used.

```toml
[dependencies]
redis = "0.16.0"
futures = "0.3.5"
tokio = { version = "0.2.21", features = ["full"] }
```

# Setting up

```yaml
version: "3.8"

services:
  redis:
    container_name: redis
    image: redis:6.0.5-alpine
    ports:
      - 6379:6379
```

```rust
pub struct RateLimiter {
    conn: Connection,
}

impl RateLimiter {
    pub async fn create(redis_address: &str) -> Result<Self, Box<dyn Error>> {
        let client = redis::Client::open(redis_address).unwrap();
        let conn = client.get_async_connection().await?;

        Ok(RateLimiter { conn })
    }
    // ...
}
```

# Fixed window

[INCRBY](https://redis.io/commands/incrby)
[EXPIRE](https://redis.io/commands/expire)

```
MULTI
INCRBY {key} 1
EXPIRE {key} {window_size}
EXEC
```

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

```rust
let mut rate_limiter = RateLimiter::create("redis://127.0.0.1:6379/").await?;
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

# Sliding log

```
MULTI
ZREMRANGEBYSCORE {key} 0 {now - window_size}
ZADD {key} {now} {now}
ZCARD {key}
EXPIRE {key} {window_size}
EXEC
```

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

```rust
let mut rate_limiter = RateLimiter::create("redis://127.0.0.1:6379/").await?;
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

# Sliding window

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
        let next_window = current_window + size_secs;
        Ok(Self::sliding_window_count(
            previous_count,
            current_count,
            next_window,
            now,
            size,
        ))
    }
    // ...
}
```

```rust
impl RateLimiter {
    // ...
    fn sliding_window_count(
        previous: Option<u64>,
        current: Option<u64>,
        next_window: u64,
        now: Duration,
        size: Duration,
    ) -> u64 {
        let weight = 1.0
            - ((Duration::from_secs(next_window).as_millis() - now.as_millis()) as f64
                / size.as_millis() as f64);
        current.unwrap_or(0) + (previous.unwrap_or(0) as f64 * weight).round() as u64
    }
    // ...
}
```

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
        let next_window = current_window + size_secs;
        Ok(Self::sliding_window_count(
            previous_count,
            current_count,
            next_window,
            now,
            size,
        ))
    }
    // ...
}
```

```rust
let mut rate_limiter = RateLimiter::create("redis://127.0.0.1:6379/").await?;
let size = Duration::from_secs(1);

for _ in 0..3 {
    rate_limiter
        .record_sliding_window("test", "user1", size)
        .await?;
}
let count = rate_limiter
    .fetch_sliding_window("test", "user1", size)
    .await?;
assert_eq!(count, 3);

tokio::time::delay_for(size * 2).await;
rate_limiter
    .record_sliding_window("test", "user1", size)
    .await?;
let count = rate_limiter
    .fetch_sliding_window("test", "user1", size)
    .await?;
assert_eq!(count, 1);
```

# Conclusion

Source code can be found on [GitHub](https://github.com/tinrab/rusty-redis-rate-limiting).
