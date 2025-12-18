# Collaborative Task Manager

A production-ready full-stack task management application with real-time collaboration, assignment notifications, and a clean, testable backend.

---

## Table of Contents

- [Quick Start](#quick-start)
- [API](#api)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Realtime (Socket.io)](#realtime-socketio)
- [Testing](#testing)
- [Trade-offs & Assumptions](#trade-offs--assumptions)
- [Contributing](#contributing)

---

## Quick Start

Prerequisites: Node.js (>=18), npm, and a running PostgreSQL database.

### Backend

1. Copy .env example and set DATABASE_URL, JWT_SECRET and PORT if needed.
2. Install and run:

```bash
cd backend
npm install
# run migrations (if needed)
# npx prisma migrate dev --name init
npm run dev
```

The backend will be available on http://localhost:4000 by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and authenticate to use the app.

---

## API

Base: `http://localhost:4000`

Authentication

- POST /api/v1/auth/register — Register a user
- POST /api/v1/auth/login — Login (sets HttpOnly JWT cookie)
- POST /api/v1/auth/logout — Logout (clears cookie)

Tasks

- GET /api/v1/tasks — Get dashboard tasks (creator or assigned)
- POST /api/v1/tasks — Create task (creatorId inferred from cookie)
  - body: { title, description, dueDate (ISO), priority, assignedToId? }
- PATCH /api/v1/tasks/:id — Update task (creator can update fields; assignee can update status only)
  - body: partial { title?, description?, dueDate?, priority?, status?, assignedToId? }
- DELETE /api/v1/tasks/:id — Delete task (creator only)

Users

- GET /api/v1/users — List users (used for assignment dropdown)

Notes

- Validation: request payloads are validated using Zod. All date fields should be ISO strings.
- Authentication: JWT is sent/stored in an HttpOnly cookie to protect against XSS.

---

## Architecture & Design Decisions

Project structure follows a clear MVC-inspired layering:

- Controllers: parse/validate inputs (Zod), normalize payloads, handle responses and errors.
- Services: business logic, validation that depends on data persistence or multiple repositories.
- Repositories: thin Prisma wrappers that perform DB CRUD operations.

Why PostgreSQL + Prisma?

- PostgreSQL is a reliable, production-grade relational DB that suits the app's needs.
- Prisma provides a type-safe, ergonomic DB layer and great developer DX, with migrations and generated types.

JWT & Auth

- We use JWT stored in HttpOnly cookies to protect tokens from XSS. The server validates tokens and injects `req.userId` via an authentication middleware.

Service layer rationale

- Business rules (e.g., "assignee must exist", "only creator can delete") are implemented in services so controllers remain thin and easy to test.
- This also simplifies unit testing (services can be tested with mocked repositories).

Testing

- Unit tests are implemented with Jest. Services that emit socket events are tested by mocking the socket server API so sockets don't require an active server during unit tests.

---

## Realtime (Socket.io)

Socket.io is used to keep clients in sync and notify users of relevant events:

- Connection: clients authenticate via a small handshake that includes `userId` and then connect only when authenticated.
- Events:
  - `task:assigned` — Emitted to the newly assigned user (targeted via socket ID map).
  - `task:deleted` — Sent to creator and assignee as appropriate.
  - `task:updated` — Broadcast to all connected clients so UI lists can refresh; the payload includes `creatorId` and `updatedById` so clients can show role-specific toasts (e.g., creator gets notified when assignee changes status).

Server-side implementation notes:

- The server maintains a map of userId -> socketId when clients connect. Targeted emits use this map.
- Broadcast emits use `io.emit('task:updated', payload)` for cache invalidation and UI refresh.

Frontend implementation notes:

- A small `useTaskSockets` hook listens for `task:updated`, `task:assigned`, and `task:deleted` and invalidates React Query cache for `['tasks']` to keep the UI fresh.
- A separate `useNotifications` hook attaches toast handlers and shows contextual messages (e.g., "New task assigned", "Task updated by assignee").
- To avoid duplicate toasts we attach listeners once and avoid reattaching on reconnect.

---

## Testing

- Backend: `cd backend && npm test` (Jest runs unit tests for services and controllers)
- Frontend: run the dev server and verify UI interactions; unit tests are not included for UI in this repo.

---

## Trade-offs & Assumptions

- Notifications: we rely on a simple targeted emit for assignment & deletion and a broadcast for updates (to keep UI caches coherent). This minimizes duplicate messages while keeping relevance.
- Assignee permissions: assignees can update task status only; creators remain the source of truth for other fields. This simplifies authorization logic.
- Authentication cookie approach: HttpOnly cookies are secure against XSS but require CSRF considerations for production; for this prototype we assume same-origin deployment or additional CSRF protection.
- Scaling sockets: the simple in-memory map (userId -> socketId) is sufficient for a single server but will need moving to a shared store (Redis) when scaling across instances.

---
