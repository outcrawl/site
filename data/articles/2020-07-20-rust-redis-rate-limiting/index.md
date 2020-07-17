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

# Fixed time window

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
            .cmd("INCRBY")
            .arg(&key)
            .arg(1)
            .cmd("EXPIRE")
            .arg(&key)
            .arg(size.as_secs())
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

rate_limiter
    .record_fixed_window("test", "user1", size)
    .await?;
let count = rate_limiter
    .fetch_fixed_window("test", "user1", size)
    .await?;
assert_eq!(count, 1);
```

# Sliding time window

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
    pub async fn record_sliding_window(
        &mut self,
        resource: &str,
        subject: &str,
        size: Duration,
    ) -> Result<u64, Box<dyn Error>> {
        let now = SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap();
        let key = format!("{}:{}:{}", KEY_PREFIX, resource, subject);

        let (count,): (u64,) = redis::pipe()
            .atomic()
            .cmd("ZREMRANGEBYSCORE")
            .arg(&key)
            .arg(0)
            .arg((now.as_millis() - size.as_millis()) as u64)
            .ignore()
            .cmd("ZADD")
            .arg(&key)
            .arg(now.as_millis() as u64)
            .arg(now.as_millis() as u64)
            .ignore()
            .cmd("ZCARD")
            .arg(&key)
            .cmd("EXPIRE")
            .arg(&key)
            .arg(size.as_secs())
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
    pub async fn fetch_sliding_window(
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
        .record_sliding_window("test", "user1", size)
        .await?;
    tokio::time::delay_for(Duration::from_millis(50)).await;
}
let count = rate_limiter.fetch_sliding_window("test", "user1").await?;
assert_eq!(count, 3);

tokio::time::delay_for(size).await;
let count = rate_limiter
    .record_sliding_window("test", "user1", size)
    .await?;
assert_eq!(count, 1);
```

# Conclusion

Source code can be found on [GitHub](https://github.com/tinrab/rusty-redis-rate-limiting).
