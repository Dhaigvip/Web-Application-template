# Docker & Non-Docker Workflow Summary

## Purpose
This document explains how Docker is used in this project, when it is optional, and how to run the system **with or without Docker**.

---

## Core Principle

> **Docker is a packaging and runtime option, not a requirement.**

The application must run:
- With Docker
- Without Docker
- In mixed environments

With **no code changes**.

---

## What Docker Is Used For

Docker is used for:
- Packaging the client (SPA) for production
- Packaging the server (API) for production
- Running the full stack locally with one command
- Ensuring environment consistency

Docker is **NOT** used for:
- Creating database schemas
- Running database migrations
- Managing database versions

---

## Components Overview

| Component | Docker Role |
|--------|-------------|
| Client (SPA) | Optional (static hosting also supported) |
| Server (API) | Optional (can run via Node directly) |
| Database | Optional (can be managed or local) |
| Migrations | ❌ Never run in Docker |

---

## Docker-Based Workflow

### Start Full Stack
```bash
docker-compose up --build
```

Runs:
- PostgreSQL
- Server API
- Client SPA

Access:
- Client: http://localhost:5173
- API: http://localhost:4100

---

### Stop Stack
```bash
docker-compose down
```

---

## Non-Docker Workflow

### Database
- Use managed PostgreSQL OR local PostgreSQL
- Database connection provided via `DATABASE_URL`

---

### Server (API)

```bash
cd server
npm install
npm run build
npm run start
```

Server runs on configured port (default 4100).

---

### Client (SPA)

```bash
cd client
npm install
npm run dev
```

Client runs on http://localhost:5173.

---

## Hybrid Workflow (Common in Production)

| Layer | How It Runs |
|----|-------------|
| Client | CDN / Static Hosting |
| Server | Docker / VM / PaaS |
| Database | Managed PostgreSQL |
| Migrations | CI/CD or Host |

---

## Environment Configuration

All configuration is via environment variables.

Example:
```env
API_PORT=4100
DATABASE_URL=...
API_BASE_URL=http://localhost:4100
```

No Docker-specific values are hardcoded in code.

---

## Prisma + Docker Important Rule

Because this project uses:
```
prisma+postgres://
```

Rules:
- Migrations run on **host or CI**
- Migrations do **not** run inside Docker
- Containers assume schema is already applied

This avoids OpenSSL and native binary issues.

---

## Deployment Guarantee

This setup guarantees:
- No Docker lock-in
- Cloud-friendly deployment
- Safe database upgrades
- Consistent behavior across environments

---

## Final Rule

> **Docker is optional infrastructure.  
> Database schema management is external and explicit.**
