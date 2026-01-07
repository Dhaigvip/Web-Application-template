# Admin Catalog Architecture (Read vs Write)

This project intentionally splits the **Admin Catalog backend** into two separate services:

- `AdminCatalogService` — **WRITE / COMMANDS**
- `AdminCatalogReadService` — **READ / QUERIES**

This is a **deliberate architectural decision**, not duplication.

---

## Why this split exists

Catalog systems tend to rot when **state changes** and **data presentation** are mixed in the same service.

This project avoids that by applying a **lightweight CQRS pattern**:

> **Commands change state.  
> Queries describe state.  
> They must not be mixed.**

---

## AdminCatalogService (WRITE / COMMANDS)

**Responsibility:**  
Change system state while enforcing business rules.

### Examples
- Create product (draft)
- Update product details
- Assign product categories
- Set product attribute values
- Activate / deactivate products
- Enforce catalog invariants

### Characteristics
- Mutates the database
- Enforces validation and invariants
- Throws errors on invalid operations
- Explicit, command-style methods
- Never shaped for UI convenience

### Design rule
> If a method changes data, it belongs here.

---

## AdminCatalogReadService (READ / QUERIES)

**Responsibility:**  
Provide management views for Admin UI.

### Examples
- List products (including drafts)
- Fetch product edit payload
- Return full category tree (including inactive)
- Return attribute definitions and values

### Characteristics
- **Never mutates data**
- **Never enforces business rules**
- Shapes data for UI consumption
- Optimized for pagination and filtering
- Safe to cache or optimize independently

### Design rule
> If a method only reads data, it belongs here.

---

## Why not one service?

Using a single service for both reads and writes leads to:

- Business rules coupled to UI needs
- Fragile refactors
- Large, unclear services
- Accidental rule violations
- Difficulty adding caching or search later

Splitting early prevents these issues entirely.

---

## This is not over-engineering

- No separate databases
- No message buses
- No event sourcing
- No framework overhead

Just **clear intent boundaries**.

This pattern is widely used in:
- Commerce platforms
- CMS systems
- Enterprise admin backends

---

## Module structure


Each service is:
- Small
- Focused
- Easy to reason about
- Easy to test

---

## Invariants live in WRITE services only

Rules such as:
- One primary category per product
- Attribute type enforcement
- Publishing prerequisites

**must never appear in read services**.

Read services assume data is already valid.

---

## Guiding principle (summary)

> **Write services protect correctness.  
> Read services serve convenience.  
> Mixing them breaks both.**

This split keeps the catalog stable, scalable, and maintainable long-term.
