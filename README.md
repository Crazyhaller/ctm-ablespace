# Collaborative Task Manager

Production-ready full-stack task management app with real-time collaboration.

## Tech Stack

Frontend:

- React + Vite + TypeScript
- Tailwind CSS
- React Query
- React Hook Form + Zod
- Socket.io client

Backend:

- Node.js + Express + TypeScript
- PostgreSQL + Prisma
- JWT (HttpOnly cookies)
- Socket.io
- Jest

## Features

- User authentication & profile management
- Full task CRUD with priority & status
- Real-time task updates and assignment notifications
- Dashboard with filters and overdue detection
- Clean MVC architecture
- Unit-tested backend logic

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Backend

```bash
cd frontend
npm install
npm run dev
```

## Architecture Notes

- Controllers → Services → Repositories

- Zod validation on all boundaries

- Real-time events handled centrally

- Server bootstrap separated for test safety
