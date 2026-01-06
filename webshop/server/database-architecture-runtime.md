# Database Architecture & Runtime Overview

## Purpose
This document explains **where the database runs**, how it relates to the server, and how Docker and non-Docker setups work together.

This avoids confusion such as:
- "Is the DB inside the server?"
- "Do server and DB run on the same instance?"
- "Where is my data actually stored?"

---

## High-Level Architecture

```
Client (Browser)
      ↓
Server / API (Node.js)
      ↓
PostgreSQL Database
```

- Client never talks to the database
- Server never contains the database
- Database is always a separate process/service

---

## Current Local Setup

Your current `DATABASE_URL`:

```
postgresql://webshop:webshop@localhost:55432/webshop?schema=public
```

### Meaning

| Part | Meaning |
|----|-------|
| `localhost` | Database runs on your local machine |
| `55432` | Host port mapped to PostgreSQL |
| `webshop` | Database name |
| `webshop:webshop` | DB user & password |

---

## Where the Database Is Running

In local development, PostgreSQL runs in **its own Docker container**.

```
Your Machine
┌──────────────────────────────┐
│ Docker                       │
│                              │
│  ┌──────────────┐            │
│  │ PostgreSQL   │            │
│  │ (port 5432)  │            │
│  └──────────────┘            │
│        ▲                     │
│        │ mapped to            │
│        ▼                     │
│   localhost:55432             │
└──────────────────────────────┘
```

---

## Is the Database in the Same Instance as the Server?

No.

Even when:
- Both run on the same machine
- Both run via Docker

They are still:
- Separate processes
- Separate lifecycles
- Separate responsibilities

---

## Non-Docker Setup

You can run everything without Docker:

- PostgreSQL installed locally or managed in the cloud
- Server runs via Node.js
- Client runs via Vite or static hosting

Only the `DATABASE_URL` changes.

---

## Production Setup (Typical)

```
Browser
   ↓
API Server (Docker / VM / PaaS)
   ↓
Managed PostgreSQL (Cloud)
```

---

## Key Rule

> **The server owns the data model.  
> The database owns the data.  
> They never own each other’s lifecycle.**

---

## Summary

- Database is always separate from the server
- Docker does not change architecture
- Current DB runs locally via Docker on port `55432`
- Production DB will run remotely with no code changes

---

## Related Docs

- database-migrations-summary.md
- docker-non-docker-workflow.md
