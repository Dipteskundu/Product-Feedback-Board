# 02_UI_IMPLEMENTATION_PLAN.md — Product Feedback Board

> **Role of this document:** Concrete file/folder structure for both frontend and backend, component-level responsibilities, and the visual design system. Builds directly on the data model and API contract defined in `01_ARCHITECTURE.md` — do not introduce endpoints, fields, or state-ownership decisions here that contradict that document. Build sequencing for everything below is in `03_IMPLEMENTATION_ROADMAP.md`.

---

## 1. Frontend Structure — Feature-Sliced Layering

Layering rule (enforced strictly): **`shared → entities → features → widgets → pages → app`**. A file may only import from a layer to its left. Violating this (e.g., `entities/feedback` importing from `features/*`, or two `features/*` importing each other) is an architecture defect, not a style nit — flag and fix, don't work around it.

```
src/
├── app/
│   ├── App.jsx
│   ├── routes.jsx
│   └── providers/
│       ├── QueryProvider.jsx        # TanStack Query client setup
│       └── ActorProvider.jsx        # Resolves/exposes actorId via context (see 01_ARCHITECTURE.md §6)
│
├── pages/
│   └── feedback-board/
│       └── FeedbackBoardPage.jsx    # Thin — renders the widget, no business logic
│
├── widgets/
│   └── feedback-board/
│       ├── FeedbackBoard.jsx        # ONLY layer allowed to import from multiple features + the entity
│       ├── useDeleteConfirmation.js # Local orchestration state: which item is pending delete, modal open/closed
│       └── index.js
│
├── features/
│   ├── submit-feedback/
│   │   ├── components/FeedbackForm.jsx
│   │   ├── hooks/useCreateFeedback.js      # TanStack Query mutation → POST /api/feedback
│   │   ├── api/submitFeedbackApi.js
│   │   └── index.js
│   │
│   ├── vote-on-feedback/
│   │   ├── components/VoteButtons.jsx      # NO local state — reads/writes shared query cache only
│   │   ├── hooks/useVote.js                # Mutation → PUT /api/feedback/:id/vote, optimistic update via setQueryData
│   │   ├── api/voteApi.js
│   │   └── index.js
│   │
│   ├── delete-feedback/
│   │   ├── hooks/useDeleteFeedback.js      # Mutation → DELETE /api/feedback/:id
│   │   ├── api/deleteFeedbackApi.js
│   │   └── index.js
│   │
│   └── filter-feedback/
│       ├── components/CategoryFilter.jsx
│       ├── components/PriorityFilter.jsx
│       ├── components/FilterBar.jsx
│       ├── hooks/useFeedbackFilters.js     # Owns URL search params as source of truth for filter state
│       └── index.js
│
├── entities/
│   └── feedback/
│       ├── components/
│       │   ├── FeedbackCard.jsx     # Accepts a `renderActions` slot — NEVER imports from features/*
│       │   ├── FeedbackGrid.jsx     # Layout only — forwards renderActions per item, no enumerated callback props
│       │   ├── CategoryBadge.jsx
│       │   └── PriorityDots.jsx     # Renders ●●○ priority indicator — see design system §7
│       ├── model/
│       │   ├── feedbackApi.js       # GET /api/feedback (list) — accepts filter params as arguments
│       │   ├── useFeedbackList.js
│       │   └── types.js
│       ├── config/
│       │   └── categoryColorMap.js  # category → color token, config not hardcoded in component (OCP)
│       └── index.js
│
├── shared/
│   ├── components/
│   │   ├── Modal.jsx                # Generic overlay, focus trap, escape-to-close — no domain knowledge
│   │   ├── ConfirmDialog.jsx        # Built on Modal; generic confirm/cancel — not delete-specific
│   │   ├── Button.jsx
│   │   └── Badge.jsx
│   ├── hooks/
│   │   └── useActorId.js
│   ├── lib/
│   │   └── apiClient.js             # fetch/axios wrapper, base URL, error normalization
│   └── utils/
│       └── formatDate.js
│
└── main.jsx
```

### 1.1 Composition Pattern (Mandatory)

`FeedbackCard` and `FeedbackGrid` must never import from any `features/*` folder. Composition happens exclusively in `widgets/feedback-board/FeedbackBoard.jsx` via a render-prop/slot pattern:

```
<FeedbackGrid
  feedbackList={feedbackList}
  renderActions={(item) => (
    <>
      <VoteButtons feedbackId={item.id} upvoteCount={item.upvoteCount} downvoteCount={item.downvoteCount} />
      <DeleteTrigger onClick={() => requestDelete(item.id)} />
    </>
  )}
/>
```

This is not optional styling — it's what keeps `entities/feedback` stable while `features/*` evolve independently.

### 1.2 State Ownership Summary

| State | Owner | Mechanism |
|---|---|---|
| Feedback list, vote counts (server state) | TanStack Query | Cache keyed by `['feedback', { category, priority, page }]` |
| `actorId` (global, rarely changes) | React Context | `ActorProvider` in `app/providers/` |
| Filter selection | URL search params | `useFeedbackFilters` — never component state, must be shareable/bookmarkable |
| Delete-confirmation modal state | Local `useState` in widget | `useDeleteConfirmation` hook, scoped to the widget only |
| Form draft values | Local `useState` in `FeedbackForm` | Not lifted — no other component needs draft values before submit |

**Do not introduce Redux or Zustand.** This was an explicit, reasoned decision (see `01_ARCHITECTURE.md` §3) — client state here is small and non-interdependent; adding a global store adds complexity with no corresponding benefit.

### 1.3 Vote Count Source of Truth (Mandatory — Bug Prevention)

`VoteButtons` must have zero local state for counts. `useVote`'s optimistic update writes directly into the TanStack Query cache (`queryClient.setQueryData` on the `['feedback', ...]` key), not a separate local variable. If an implementation shows two different vote counts for the same card at any point (e.g., during an in-flight vote), this rule was violated — there must be exactly one rendered source per card.

---

## 2. Component Responsibility Reference

| Component | Type | Responsibility | Must NOT do |
|---|---|---|---|
| `FeedbackForm` | Presentational | Render controlled inputs, call `onSubmit(data)` | Perform the API call itself |
| `FeedbackCard` | Presentational | Render one item's data + an `actions` slot | Import from `features/*` |
| `FeedbackGrid` | Presentational | Layout, empty state, maps items to `FeedbackCard` | Enumerate feature-specific callback props |
| `VoteButtons` | Presentational (feature) | Render counts + up/down controls, call `onVote` | Hold its own count state |
| `FilterBar` | Presentational (feature) | Compose `CategoryFilter` + `PriorityFilter` | Touch URL params directly (delegate to hook) |
| `Modal` / `ConfirmDialog` | Shared, generic | Overlay/focus/confirm-cancel mechanics | Know what is being confirmed |
| `FeedbackBoard` (widget) | Container | Wire hooks + entity + features together | — this is the one place composition knowledge is allowed to live |

---

## 3. Design System

### 3.1 Design Thesis

The UI should read as an internal triage instrument (closer to Linear/a ticket tracker) rather than a marketing dashboard — dense, legible, confident, restrained. This governs every choice below; do not substitute generic SaaS defaults (gradient hero, rounded pastel cards, purple-everything) for these decisions.

### 3.2 Color Tokens

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FAFAFB` | Page background |
| `surface` | `#FFFFFF` | Cards, modals |
| `border` | `#E4E4E9` | Hairlines, card borders |
| `ink` | `#14141A` | Primary text |
| `ink-muted` | `#6B6B76` | Secondary text, metadata |
| `accent` | `#4F46E5` | Primary actions, focus states, links |
| `bug` | `#DC2626` | Category tag — Bug |
| `feature` | `#2563EB` | Category tag — Feature |
| `improvement` | `#059669` | Category tag — Improvement |

**Priority is NOT color-coded** (no red/amber/green traffic light). Priority renders as a filled-dot triplet — `PriorityDots.jsx` — in `ink` only: ●●● High / ●●○ Medium / ●○○ Low. This avoids competing for attention with category colors and is this design's signature differentiator from generic feedback-board templates.

### 3.3 Typography

| Role | Typeface | Used for |
|---|---|---|
| Display/headings | Space Grotesk | Page title, section headers |
| Body/UI | Inter | Form labels, descriptions, buttons |
| Data/metadata | IBM Plex Mono | Vote counts, timestamps, IDs — signals "this is data" |

Scale: `12 / 14 / 16 / 20 / 24 / 32` (rem base 16px). Use only these six sizes.

### 3.4 Spacing System

8px base unit: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`. Card padding `16`, grid gap `16`, section spacing `32`.

### 3.5 Layout

```
┌────────────────────────────────────────────────┐
│  Product Feedback          [+ New Feedback]     │  ← top bar, sticky
├────────────────────────────────────────────────┤
│  [Category ▾]  [Priority ▾]  [Sort: Newest ▾]   │  ← filter bar, sticky
├────────────────────────────────────────────────┤
│  ┌────┐┌──────────────┐  ┌────┐┌──────────────┐│
│  │ ▲  ││ Bug           │  │ ▲  ││ Feature       ││
│  │ 12 ││ Dark mode...  │  │ 4  ││ Export CSV... ││
│  │ ▼  ││ ●●○  2h ago   │  │ ▼  ││ ●●●  1d ago   ││
│  └────┘└──────────────┘  └────┘└──────────────┘│
└────────────────────────────────────────────────┘
```

**Signature element — the vote rail:** a vertical stack (chevron-up, mono count, chevron-down) on the card's left edge, not inline thumbs-up pill buttons. This is a deliberate differentiator, and `VoteButtons.jsx` should implement this layout, not a horizontal button pair.

Grid: 3 columns desktop, 2 tablet, 1 mobile.

### 3.6 Animation (Restraint — 3 moments only)

1. Initial card load: fade + 4px translate-up, ~120ms stagger per card, capped
2. Vote click: count scale-pulse, ~100ms
3. Modal open/close: 150ms scale + fade

No hover-lift-with-shadow on every card, no scroll-triggered reveals, no gradient shimmer. Respect `prefers-reduced-motion` — disable all three when set.

### 3.7 Responsive Breakpoints

| Breakpoint | Grid | Filter bar | Vote rail |
|---|---|---|---|
| Desktop `>1024px` | 3 columns | Inline | Vertical (left of card) |
| Tablet `640–1024px` | 2 columns | Inline, condensed labels | Vertical |
| Mobile `<640px` | 1 column | Collapses to a "Filters" sheet trigger | Horizontal (chevrons flank count, below card content) |

---

## 4. Backend Structure (MVC + Service Layer)

Referenced from `01_ARCHITECTURE.md` §7 — concrete file tree:

```
server/
├── src/
│   ├── models/
│   │   ├── Feedback.js
│   │   ├── Vote.js
│   │   └── Actor.js
│   │
│   ├── controllers/
│   │   ├── feedbackController.js    # createFeedback, listFeedback, getFeedback, deleteFeedback
│   │   └── voteController.js        # castVote
│   │
│   ├── routes/
│   │   ├── feedbackRoutes.js
│   │   ├── voteRoutes.js
│   │   ├── healthRoutes.js
│   │   └── index.js
│   │
│   ├── middleware/
│   │   ├── resolveActor.js          # See 01_ARCHITECTURE.md §6 — identity seam
│   │   ├── validateRequest.js
│   │   ├── ownership.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   │
│   ├── services/
│   │   ├── feedbackService.js       # create, list+filter+paginate, getById, delete-with-ownership-check
│   │   └── voteService.js           # atomic upsert + counter update (see 01_ARCHITECTURE.md §4.4)
│   │
│   ├── validators/
│   │   ├── feedbackValidators.js
│   │   └── voteValidators.js
│   │
│   ├── config/
│   │   ├── db.js                    # Mongoose connection, explicit maxPoolSize
│   │   └── env.js
│   │
│   └── app.js                       # Express setup: helmet, cors, compression, middleware chain
│
└── server.js
```

---

## 5. Cross-Document References

- Data model, indexes, API contract, validation rules → `01_ARCHITECTURE.md`
- Build order and phased sequencing for everything in this document → `03_IMPLEMENTATION_ROADMAP.md`
