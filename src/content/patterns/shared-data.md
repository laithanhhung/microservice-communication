---
title: "Communication with Shared Data"
---

**Characteristics**:
- Microservices share a common database or file storage.
- One service writes data, and others read it.

**Pros**:
- Simple to implement for legacy systems.
- Low latency for data access.

**Cons**:
- Strong coupling between services (schema changes break consumers).
- Performance bottlenecks on the shared resource.
