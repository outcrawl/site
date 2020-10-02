---
title: Why Microservices Should Be Idempotent
author: tin-rabzelj
tags:
  - Microservices
  - Architecture
description: This article gives an argument on why microservices should be idempotent.
---

This article gives an argument on why services in microservices architecture should always be idempotent.
It might be obvious, but I don't see this mentioned often.
Key takeaway is that we need idempotence for retry logic.

# Byzantine faults

A [Byzantine fault](https://en.wikipedia.org/wiki/Byzantine_fault) is a condition of a system, where components may fail and there is unreliable information if a component has failed.
If a system is able to overcome these faults and continue to operate, it has [Byzantine fault tolerance](https://academy.binance.com/en/articles/byzantine-fault-tolerance-explained) property.
An example of such a system is Bitcoin.

Specialized Byzantine problem is the [Two Generals' Problem](https://en.wikipedia.org/wiki/Two_Generals%27_Problem), which shows impossibility of reaching consensus between two generals with finite number of messages.
Arbitrary communication failures may cause messages and corresponding acknowledgments to be dropped.
Solving it would require exchanging potentially infinite number of messages, which is impractical.
This also explains why exactly-once semantics is not possible.

# Inter-service communication

Within microservices architecture, remote procedure calls and event handlers may fail due to connection issues.
Such failures are called [transient faults](https://docs.microsoft.com/en-us/azure/architecture/best-practices/transient-faults) and include the momentary loss of network connectivity to components and services, the temporary unavailability of a service, or timeouts that arise when a service is busy.

To increase availability of our system we should define a retry mechanism.
Retrying remote calls can be achieved by leveraging service mesh tools such as [Linkerd](https://linkerd.io/) or [Istio](https://istio.io/).
Processing events is already retryable when using message brokers or data streaming tools that guarantee at-least-once delivery.

# Idempotence

Because retries can happen, services should always be idempotent&mdash;that is $f(x)=f(f(x))$.
Idempotence is required to prevent any unwanted side effects.
It also allows us to replay any request for debugging purposes.

Queries usually don't change the state of a system, so they're already idempotent.

Some operations, such as marking a blog post as draft, are naturally idempotent.
Setting a post's state can be repeated multiple times to the same result and without side effects.

Other operations need to be refactored to support retries, either naturally or explicitly.
Explicit idempotence can be provided for any operation by using "request id" to check if operation has already been executed.
A great example are Stripe's [Idempotent Requests](https://stripe.com/docs/api/idempotent_requests).

# Considerations

Errors need to be correctly classified as violations of business rules or transient faults.
If request fails due to rule violation, it doesn't make sense to retry it.

Observability is important.
Whether we're using centralized logging or tracing, logs should be interpreted with retries in mind.
Log lines are correlated by using a unique request ID.
Retries can propagate through downstream services and cause duplicate logs within a single request&mdash;and consequently harder to parse.

Similarly, analytics and metrics can contain duplicate records.
Retries should be properly considered for all pieces of infrastructure.

# Conclusion

Basically, everything should be idempotent.
Retries should not have side effects.
