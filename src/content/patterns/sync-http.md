---
title: "Request Response over HTTP"
---

**Characteristics**:
- Standard REST or gRPC communication.
- Client waits (blocks) until the server responds.
- **API Gateway** often acts as the entry point.

**Pros**:
- Easy to understand and implement.
- Real-time feedback for users.

**Cons**:
- Blocking calls can cascade failures (latency chains).
- Tight coupling in terms of availability (if B is dow, A fails).
