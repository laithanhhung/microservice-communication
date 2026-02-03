---
title: "Async Request Response"
---

**Characteristics**:
- Client sends a request but doesn't wait for immediate processing.
- Often uses **Queues** to decouple the request acceptance from processing.
- The response might be returned via a callback or separate channel.

**Pros**:
- Non-blocking: Client is free to do other work.
- Load leveling: spikes in traffic are buffered.

**Cons**:
- More complex error handling.
- Not suitable for real-time user interactions requiring immediate feedback.
