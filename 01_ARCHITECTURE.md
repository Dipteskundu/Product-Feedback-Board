# 01_ARCHITECTURE.md — Product Feedback Board

> **Role of this document:** This is the source of truth for what the system is, how it's structured, what data it stores, and what API contract connects frontend to backend. `02_UI_IMPLEMENTATION_PLAN.md` builds the frontend against the contracts defined here. `03_IMPLEMENTATION_ROADMAP.md` sequences the build order referencing both documents. Do not deviate from decisions in this file without updating it — all three documents must stay internally consistent.

---

## 1. Application Description

Product Feedback Board is a full-stack web application where users submit, browse, filter, vote on, and delete product feedback items. It is designed and documented to production-engineering standards despite being a portfolio-scale project — every architectural decision below has explicit reasoning, not just a chosen default.

There is no login/authentication in this version. Users are tracked via an **anonymous actor identity** (a server-issued, cookie-based UUID) so that features like "one vote per person" and "only the creator can delete their item" work correctly without requiring accounts. The system is deliberately designed so real authentication can be added later as an additive change, not a rewrite (see §6).

## 2. Feature List

| Feature | Description |
|---|---|
| Submit feedback | Title, description, category, priority — creates a new feedback item |
| Feedback grid | All feedback displayed as cards in a responsive grid |
| Filter by category + priority | Both filters apply simultaneously (AND logic), server-side |
| Upvote / downvote | One vote per actor per item; vote is changeable (up ↔ down) |
| Delete with confirmation | Creator-only deletion, gated behind a confirmation modal |
| Vote count display | Upvote count and downvote count shown on every card |

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | React 18 (Vite) | Not Next.js — no SSR/SEO requirement; SPA is simpler and sufficient. See §5 for structure. |
| Frontend state (server) | TanStack Query | Caching, refetch, optimistic updates for all server data |
| Frontend state (client) | React Context (`actorId` only) + local `useState` | No Redux/Zustand — client state is small and non-interdependent |
| Frontend routing | React Router | Filters sync to URL search params, not JS state |
| Backend framework | Express (Node.js) | Separate server, not Next.js route handlers |
| Backend architecture | MVC + Service layer | See §7 |
| Database | MongoDB (Mongoose ODM) | See §4 for schema |
| Validation | Zod or Joi (route-level) + Mongoose schema constraints (backstop) | Two-layer validation, see §8 |

## 4. Data Model

### 4.1 `feedback` Collection

```
{
  _id: ObjectId,
  title: String,              // required, trim, minlength: 5, maxlength: 100
  description: String,        // required, trim, minlength: 10, maxlength: 1000
  category: String,           // enum: ["Bug", "Feature", "Improvement"], required
  priority: String,           // enum: ["Low", "Medium", "High"], required, no default — must be explicitly chosen
  createdByActorId: ObjectId, // ref: Actor, required — set server-side, never trusted from client input
  status: String,             // enum: ["Open", "Planned", "In Progress", "Done"], default: "Open"
  upvoteCount: Number,        // default: 0, denormalized cache — see §4.4
  downvoteCount: Number,      // default: 0, denormalized cache — see §4.4
  createdAt: Date,
  updatedAt: Date,
}
```

**Note on `status`:** not in the original feature list, included as a low-cost, high-value extensibility field (see `03_IMPLEMENTATION_ROADMAP.md` §"Out-of-scope production features"). Safe to omit in a minimal build; do not remove if already scaffolded, since retrofitting it later touches more files than including it now.

### 4.2 `votes` Collection

```
{
  _id: ObjectId,
  feedbackId: ObjectId,   // ref: Feedback, required
  actorId: ObjectId,      // ref: Actor, required
  voteType: String,       // enum: ["up", "down"], required
  createdAt: Date,
  updatedAt: Date,
}
```

This collection is the **source of truth** for votes. `feedback.upvoteCount`/`downvoteCount` are a denormalized cache derived from this collection — never the other way around.

### 4.3 `actors` Collection

```
{
  _id: ObjectId,
  type: String,     // enum: ["anonymous", "registered"], default: "anonymous"
  createdAt: Date,
}
```

Intentionally minimal. When real authentication is added, `registered` actors gain additional fields (`email`, `passwordHash`, etc.) — this collection's shape and the `_id` every other collection references does not change. This is the concrete mechanism behind "auth-ready without a rewrite."

### 4.4 Vote Counter Consistency (Mandatory — Correctness Requirement)

`upvoteCount`/`downvoteCount` MUST be updated atomically with the vote upsert. Do not implement as two separate operations (read vote state, then `$inc` the counter) — this creates a race condition under concurrent votes that will silently desynchronize the cached counters from the true vote data in the `votes` collection. Implement via a MongoDB transaction wrapping the upsert + counter update, or derive the counter delta from the upsert's returned previous-state so the increment/decrement only fires when `voteType` actually changes.

### 4.5 Indexes

| Collection | Index | Purpose |
|---|---|---|
| `feedback` | `{ category: 1, priority: 1, createdAt: -1 }` compound | Serves the combined filter + default-sort query in one index — see note below |
| `votes` | `{ feedbackId: 1, actorId: 1 }` unique compound | Enforces one vote per actor per item at the database level; enables upsert-based vote casting |
| `votes` | `{ actorId: 1 }` | Supports future "my votes" lookups |

**Important:** The compound index on `feedback` must include all three fields in this order. Two separate indexes (`{category, priority}` and `{createdAt}`) do **not** serve a query that filters AND sorts together — MongoDB can only use one index per query clause efficiently. This single compound index is a corrected decision from earlier design iteration; if any earlier scaffold created two separate indexes, replace them with this one.

## 5. Frontend Architecture — Layered Structure

Full folder structure and component-level detail live in `02_UI_IMPLEMENTATION_PLAN.md`. Summary of the layering principle for context:

```
shared → entities → features → widgets → pages → app
```

A layer may only import from layers to its left:
- `entities/feedback` — pure representation of a feedback item (card, badges, base data fetch). No knowledge of any feature.
- `features/*` — one feature per user action: `submit-feedback`, `vote-on-feedback`, `delete-feedback`, `filter-feedback`. Features never import each other directly.
- `widgets/feedback-board` — the only layer allowed to compose entity + all features together.

This is Feature-Sliced Design applied deliberately, not incidentally — see `02_UI_IMPLEMENTATION_PLAN.md` §1 for the full reasoning and folder tree.

## 6. Identity Model (Actor Pattern)

Every write is attributed to an `actorId`, resolved server-side, regardless of whether real authentication exists yet:

- **Middleware `resolveActor`** runs before every request. Reads an actor identity from an httpOnly signed cookie; if absent, creates a new `Actor` document (`type: "anonymous"`) and sets the cookie. Attaches `req.actorId`.
- **This is the only file that changes when real auth is added** — it will resolve `req.actorId` from a verified session/JWT instead of a cookie. Every downstream layer (services, ownership checks, vote uniqueness) is unaffected.
- **`createdByActorId` and vote `actorId` are always derived from `req.actorId` server-side.** Never accept an actor identity from the request body — this prevents spoofing.

## 7. Backend Architecture — MVC + Service Layer

```
Route → Middleware → Controller → Service → Model
```

| Layer | Responsibility | Must NOT do |
|---|---|---|
| Routes | URL → controller mapping, middleware attachment | Contain logic |
| Middleware | Cross-cutting concerns: `resolveActor`, `validateRequest`, `ownership`, `errorHandler` | Contain business rules specific to one resource |
| Controllers | Parse request, call one service method, shape HTTP response | Query the database directly, contain business rules |
| Services | All business logic: filtering rules, vote upsert logic, ownership enforcement, delete rules | Touch `req`/`res` directly |
| Models | Schema definition, data access, structural constraints (enums, required, indexes) | Contain business rules beyond structural validation |

Full folder structure for this layer is in `02_UI_IMPLEMENTATION_PLAN.md` §4 (backend section), since that document also carries the concrete file tree for both sides of the stack.

## 8. Validation Strategy

Two-layer validation, both mandatory — frontend validation is a UX convenience, backend validation is the actual enforcement boundary and must independently reject anything invalid.

| Field | Rule | Enforced at |
|---|---|---|
| `title` | Required, trimmed, 5–100 chars | Frontend (form) + backend validator + Mongoose schema |
| `description` | Required, trimmed, 10–1000 chars | Frontend (form) + backend validator + Mongoose schema |
| `category` | Required, enum `["Bug","Feature","Improvement"]` | Frontend (constrained control) + backend validator + Mongoose enum |
| `priority` | Required, enum `["Low","Medium","High"]`, no default | Frontend (constrained control) + backend validator + Mongoose enum |
| `:id` params | Must be valid MongoDB ObjectId | Backend only (`mongoose.Types.ObjectId.isValid`) — malformed → `400`, valid-but-missing → `404` |
| Duplicate votes | One vote per `(feedbackId, actorId)` | Backend: upsert logic (service) + unique index (database — authoritative layer) |

## 9. REST API Contract

Base path: `/api`

### `POST /api/feedback`
Create feedback. Body: `{ title, description, category, priority }`. `createdByActorId` set server-side from `req.actorId`.
- `201 Created` — returns full created resource including `id`, `status`, `upvoteCount: 0`, `downvoteCount: 0`, timestamps
- `400 Bad Request` — validation failure

### `GET /api/feedback`
List feedback with optional filtering and pagination.
Query params: `?category=Bug&priority=High&page=1&limit=50&sort=newest`
- Both `category` and `priority` optional and independent; when both present, combined via MongoDB `$and` (simultaneous filtering)
- `200 OK` — `{ data: [...], count, page, limit }`
- `400 Bad Request` — invalid enum value in query params

### `GET /api/feedback/:id`
Fetch a single feedback item (completeness endpoint; not required by current UI but included for resource completeness).
- `200 OK` / `404 Not Found` (missing) / `400 Bad Request` (malformed ID)

### `DELETE /api/feedback/:id`
Delete feedback. No body. Requires ownership match (`req.actorId === feedback.createdByActorId`).
- `204 No Content` — success
- `403 Forbidden` — actor does not own this item
- `404 Not Found` — valid ID, no matching document
- `400 Bad Request` — malformed ID

### `PUT /api/feedback/:id/vote`
Cast or change a vote. **Single endpoint, not separate `/upvote`/`/downvote` routes** — see rationale below.
Body: `{ "voteType": "up" | "down" }`
- `200 OK` — `{ feedbackId, upvoteCount, downvoteCount }`
- `400 Bad Request` — invalid `voteType`
- `404 Not Found` — feedback item doesn't exist

**Design rationale (do not change without re-reviewing):** `PUT` was chosen over `POST` because casting a vote is idempotent full-state-replacement semantics ("my vote on this item is now X"), scoped implicitly to `req.actorId`. A single endpoint with `voteType` in the payload was chosen over separate `/upvote`/`/downvote` endpoints because: (a) it keeps REST convention consistent with the rest of this API (no verbs in URLs, matching the `DELETE` endpoint's convention), (b) it maps to exactly one service method (no duplicated logic across two controllers), and (c) it absorbs future vote-type additions as a payload change, not a new route.

### `GET /api/health`
Health check for deployability/monitoring. Checks DB connectivity.
- `200 OK` — `{ status: "ok", db: "connected" }`
- `503 Service Unavailable` — DB unreachable

### Error Response Shape (all endpoints)

```json
{ "error": "ErrorTypeName", "message": "Human-readable description" }
```

Handled centrally by `errorHandler` middleware. Controllers/services throw typed errors (`NotFoundError`, `ForbiddenError`, `ValidationError`); this is the single place status codes are decided.

## 10. Non-Functional Requirements (Mandatory)

These are correctness/safety requirements, not optional polish — see `03_IMPLEMENTATION_ROADMAP.md` for build sequencing.

- Pagination/limit enforced on `GET /api/feedback` (default `limit=50`) — prevents unbounded response growth
- Rate limiting on `POST /api/feedback` and `PUT /api/feedback/:id/vote` (conservative default: 10 req/min per actor, tune from real traffic later)
- Response compression (gzip/brotli) via Express middleware
- Structured request logging (method, route, status, duration) and error logging with context
- Mongoose connection pool explicitly configured (`maxPoolSize`), not left at default
- CORS configured explicitly for the frontend origin only

## 11. Cross-Document References

- Frontend folder structure, component breakdown, and design system → `02_UI_IMPLEMENTATION_PLAN.md`
- Build order, phased task sequencing, and verification checklist → `03_IMPLEMENTATION_ROADMAP.md`
- Any implementation detail not covered here defers to whichever of the other two documents owns that concern; do not invent conflicting conventions.
