Mình sẽ viết cho bạn một **Design Document chuẩn để xây website học Microservice Communication bằng Astro**.
Document này giống kiểu **tech spec / product design doc** mà các team dev dùng trước khi code.

Bạn có thể lưu file này thành:

```
website-design.md
```

---

# Website Design Document

## Microservice Communication Learning Platform

---

# 1. Project Overview

## Purpose

Website này được thiết kế để giúp developers học **Microservice Communication Patterns** thông qua:

* structured learning modules
* interactive diagrams
* quizzes
* real-world architecture examples

Thay vì chỉ đọc bài blog, website biến nội dung thành **interactive learning experience**.

---

## Target Users

Primary audience:

* Backend developers
* System design learners
* Computer science students
* Engineers preparing for system design interviews

---

## Learning Goals

Sau khi học xong website, người dùng sẽ:

* hiểu các communication patterns trong microservices
* biết khi nào dùng synchronous vs asynchronous
* hiểu trade-offs của mỗi pattern
* áp dụng kiến thức vào system design

---

# 2. Website Architecture

Website có cấu trúc **documentation style learning platform**.

Layout:

```id="layout_arch"
┌──────────────────────────────┐
│ Navbar                       │
├──────────────┬───────────────┤
│ Sidebar      │ Content Area  │
│ Navigation   │               │
│              │               │
│              │               │
└──────────────┴───────────────┘
```

---

## Key Components

### 1. Navbar

Purpose:

* brand logo
* navigation
* search
* theme switch

Example:

```id="navbar_example"
[Logo] Microservice Learning

Docs
Architecture
Quiz
GitHub
```

---

### 2. Sidebar Navigation

Sidebar chứa **learning modules**.

Example:

```id="sidebar_example"
Introduction

Challenges

Communication Patterns
   - Synchronous
   - Asynchronous

Async Patterns
   - Shared Data
   - Async Request Response
   - Event Driven

Technology Choices

Summary

Quiz
```

Behavior:

* sticky sidebar
* active section highlight
* smooth scroll

---

### 3. Content Area

Content hiển thị **learning module**.

Structure:

```id="content_structure"
Title

Concept Explanation

Example

Diagram

Real World Application

System Design Insight
```

---

# 3. Page Structure

Một module học có layout chuẩn.

Example:

```id="module_layout"
# Event Driven Communication

Concept Explanation

Example

Diagram

Real World Application

Trade-offs

Quiz
```

---

## Content Blocks

### Explanation

Giải thích khái niệm.

---

### Example

Ví dụ đơn giản.

---

### Diagram

Architecture flow.

Example:

```id="diagram_example"
Order Service
     ↓
Kafka Topic
     ↓
Payment Service
Inventory Service
```

---

### Real World Application

Ví dụ công ty thật.

Example:

* Amazon order processing
* Uber ride matching
* Netflix recommendation pipeline

---

### Trade-offs

Phân tích ưu nhược điểm.

Example:

| Pros      | Cons                 |
| --------- | -------------------- |
| decoupled | harder debugging     |
| scalable  | eventual consistency |

---

# 4. Learning Features

## 1. Interactive Diagrams

Diagram có thể:

* highlight flow
* show step by step communication

Example:

```id="interactive_flow"
Client
  ↓
API Gateway
  ↓
Service
```

---

## 2. Collapsible Deep Dive

Section nâng cao có thể mở rộng.

Example:

```
Deep Dive ▼
```

---

## 3. Quiz Section

Quiz giúp reinforcement learning.

Example:

```
Question

Which pattern supports decoupled microservices?

A REST
B Event Driven
C GraphQL
D SOAP
```

---

## 4. Architecture Cheat Sheet

Summary page.

Example:

| Pattern | Use Case         |
| ------- | ---------------- |
| REST    | request-response |
| gRPC    | high performance |
| Kafka   | event streaming  |

---

# 5. UI / Visual Design

Design style:

**AI / futuristic theme**

Inspired by:

* Vercel
* OpenAI
* Linear
* Arc Browser

---

## Color Palette

Background:

```
#050510
#0b0b1a
#111126
```

Accent colors:

```
electric blue
neon purple
cyan glow
```

---

## Design Principles

UI phải:

* clean
* readable
* developer focused
* futuristic

---

## Components Style

Cards:

```
background: rgba(20,20,40,0.6)
backdrop blur
soft glow border
```

---

## Typography

Recommended fonts:

```
Inter
Space Grotesk
Satoshi
```

---

# 6. Tech Stack

Frontend Framework:

```
Astro
```

Styling:

```
TailwindCSS
```

Components:

```
Astro components
```

Optional libraries:

```
Lenis (smooth scroll)
GSAP (animations)
```

---

## File Structure

Recommended project structure:

```
src/

components/
Sidebar.astro
Navbar.astro
Quiz.astro
Diagram.astro
ContentSection.astro

layouts/
MainLayout.astro

pages/
index.astro

content/
modules/
01-introduction.md
02-challenges.md
03-patterns.md
```

---

# 7. Interaction Logic

Sidebar click behavior:

```
click section
↓
update active state
↓
show corresponding content
↓
hide other sections
```

---

Example state:

```
activeSection = "event-driven"
```

---

# 8. Performance Considerations

Website cần tối ưu:

### Fast loading

Use:

```
static generation
Astro partial hydration
```

---

### Lightweight JavaScript

Chỉ dùng JS cho:

* sidebar navigation
* quiz logic
* animations

---

### Lazy loading diagrams

Tránh render nặng.

---

# 9. Future Enhancements

Các feature có thể thêm sau:

### Architecture Playground

User build microservice architecture.

---

### Scenario Based Learning

Ví dụ:

```
Design a ride matching system.
Which pattern should you choose?
```

---

### System Design Interview Mode

Case studies:

* Uber
* Netflix
* Amazon

---

# 10. Success Metrics

Website thành công nếu:

* users hiểu system design concepts
* quiz completion rate cao
* average session time cao
* users return to learn more

---

# 11. Development Roadmap

### Phase 1

Basic learning site:

* sidebar
* content modules
* diagrams

---

### Phase 2

Interactive features:

* quizzes
* animations
* deep dive sections

---

### Phase 3

Advanced learning tools:

* architecture playground
* system design challenges

---

# Final Vision

Website này trở thành:

```
Interactive System Design Learning Platform
```

Không chỉ là blog mà là **developer learning experience**.

---