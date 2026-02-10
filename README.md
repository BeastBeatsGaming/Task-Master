# Task Master

A simple MERN task manager with authentication. Create, update, complete, and delete todos from a clean dashboard UI.

## Features

- JWT-based auth (register/login/logout)
- Personal todo list per user
- Create, update status, and delete tasks
- Responsive React UI

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs

## Project Structure

- client/ - React app (Vite)
- server/ - Express API

## Getting Started

### 1) Install dependencies

From the repo root:

```
npm run install:all
```

### 2) Configure environment variables

Create a file at server/.env using the template:

```
cp server/.env.example server/.env
```

Update values in server/.env:

- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN (optional, default 1d)

### 3) Run the app

From the repo root:

```
npm run dev
```

- Client runs on the Vite default port (usually 5173)
- Server runs on the port in server/.env (default 5001)

## Scripts

From the repo root:

- npm run dev - run client and server together
- npm run build:client - build the client
- npm run build:server - build the server
- npm run start:server - run the built server

## API (server)

Base URL: http://localhost:5001

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/todos
- POST /api/todos
- PUT /api/todos/:id
- DELETE /api/todos/:id

## Notes

- Do not commit .env files. Use server/.env.example as a template.
