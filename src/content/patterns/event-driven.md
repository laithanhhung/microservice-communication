---
title: "Event-Driven with Message Broker"
---

**Characteristics**:
- Services communicate asynchronously via events.
- A **Message Broker** (e.g., Kafka, RabbitMQ) routes messages.
- Publisher emits events without knowing subscribers.

**Pros**:
- Loose coupling and high scalability.
- Better fault tolerance (broker buffers messages).

**Cons**:
- Complexity in debugging and tracing flows.
- eventual consistency challenges.
