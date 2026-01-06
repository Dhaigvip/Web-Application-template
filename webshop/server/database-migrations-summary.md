# Database Migration Process (Summary)

## Goal
Create and evolve the database schema in a **safe, repeatable, versioned** way, independent of Docker.

---

## Core Rules
1. Database schema is managed **only via migrations**
2. Application **never** auto-creates or changes tables
3. Migrations are **versioned, incremental, and immutable**
4. Docker is **optional** and **not used** to run migrations
5. With `prisma+postgres://`, migrations run on the **host or CI**, not inside containers

---

## Tools Used
- PostgreSQL
- Prisma ORM
- Prisma Postgres / Data Proxy (`prisma+postgres://`)
- Docker (runtime only, optional)

---

## Migration Workflow (V001 Example)

### Step 1: Define Schema
- Edit: `server/prisma/schema.prisma`
- This file is the **source of truth**
- V001 included:
  - Product
  - Category
  - ProductCategory
  - Attribute

---

### Step 2: Generate Migration SQL (No DB Access)
```bash
npx prisma migrate diff   --from-empty   --to-schema-datamodel prisma/schema.prisma   --script > prisma/migrations/V001_initial_catalog_schema.sql
```

---

### Step 3: Store Migration
Create:
```
server/prisma/migrations/
└── V001_initial_catalog_schema/
    └── migration.sql
```

Move generated SQL into `migration.sql`.

---

### Step 4: Apply Migration (Host Machine)
```bash
npx prisma migrate deploy
```

- Applies all pending migrations
- Records them in `_prisma_migrations`
- Safe for production

---

## Where to Run Migrations

| Environment | Run Migrations |
|-----------|----------------|
| Local dev | ✅ Yes |
| CI/CD | ✅ Yes |
| Docker container | ❌ No |
| App startup | ❌ No |

---

## Docker’s Role
- Used to run the application
- NOT used for schema creation or updates

---

## Result After V001
- Database schema is live
- Version is recorded
- Ready for additive migrations (V002+)

---

## Next Step
Migration V002:
- AttributeValue
- ProductAttribute
- Faceted-search indexes
