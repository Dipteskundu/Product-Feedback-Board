# 03_IMPLEMENTATION_ROADMAP.md — Product Feedback Board

> **Role of this document:** Sequences the actual build. Every task below implements a decision defined in `01_ARCHITECTURE.md` (data model, API contract, validation) or `02_UI_IMPLEMENTATION_PLAN.md` (folder structure, components, design system). Do not invent new architectural decisions while executing this roadmap — if something is ambiguous, resolve it by re-reading those two documents first; if genuinely undefined there, make the smallest reasonable assumption and note it in code comments rather than deviating silently.

---

## Phase 0 — Project Scaffolding

1. Initialize two packages: `server/` (Express) and `client/` (Vite + React). Do not use Next.js or a monorepo tool unless explicitly requested — keep this simple.
2. `server/`: install `express`, `mongoose`, `cors`, `helmet`, `compression`, `cookie-parser`, `zod`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`.
3. `client/`: install `react-router-dom`, `@tanstack/react-query`, and set up Vite.
4. Create `.env` files for both (Mongo URI, port, cookie secret, JWT secret) — never hardcode secrets. `server/src/config/env.js` validates required vars at startup and fails fast if missing.
5. Set up `server/src/config/db.js` with an explicit `maxPoolSize` (do not leave at Mongoose default — see `01_ARCHITECTURE.md` §10).

## Phase 1 — Backend: Models

Reference: `01_ARCHITECTURE.md` §4.

1. `models/Actor.js` — per §4.3 schema, extended with auth fields:
   - `type`: enum `['anonymous', 'registered']`, default `'anonymous'`
   - `name`: String, trim, minlength 2, maxlength 50 (required for registered)
   - `email`: String, unique, lowercase, trim (required for registered)
   - `password`: String, select: false (hashed with bcrypt, pre-save hook)
   - `role`: enum `['user', 'manager', 'admin']`, default `'user'`
   - Instance method: `comparePassword(candidatePassword)` for login verification
   - Pre-save hook: hash password with bcrypt (10 rounds) only when modified
2. `models/Feedback.js` — per §4.1 schema exactly, including:
   - `status`: enum `['Open', 'Under Review', 'Planned', 'In Progress', 'Completed', 'Rejected']`, default `'Open'`
   - `commentCount`: Number, default 0 (denormalized, incremented/decremented by commentService)
   - Compound index: `{ category: 1, priority: 1, createdAt: -1 }`
   - Status index: `{ status: 1 }`
   - Text index: `{ title: 'text', description: 'text' }` for full-text search
3. `models/Vote.js` — per §4.2 schema exactly, including the **unique** compound index `{ feedbackId: 1, actorId: 1 }` — this is a correctness requirement, not an optimization.
4. `models/Comment.js` — threaded comment support:
   - `feedbackId`: ObjectId ref Feedback, required
   - `actorId`: ObjectId ref Actor, required
   - `body`: String, required, trim, minlength 1, maxlength 2000
   - `parentId`: ObjectId ref Comment, default null (for nested replies)
   - Indexes: `{ feedbackId: 1, createdAt: -1 }`, `{ parentId: 1 }`
5. `models/Activity.js` — immutable audit trail:
   - `feedbackId`, `actorId`, `action` (enum of 9 values: created, status_changed, priority_changed, comment_added, vote_cast, deleted, delete_requested, delete_approved, delete_rejected)
   - `details`: Mixed (arbitrary metadata like from/to values)
   - `createdAt` only (no updatedAt — immutable record)
   - Index: `{ feedbackId: 1, createdAt: -1 }`
6. `models/DeleteRequest.js` — user-initiated deletion workflow:
   - `feedbackId`, `requestedByActorId`, `status` (pending/approved/rejected)
   - `reviewedByActorId`, `reviewNote`
   - Indexes: `{ feedbackId: 1, status: 1 }`, `{ requestedByActorId: 1, status: 1 }`
7. `models/ManagerRequest.js` — role escalation workflow:
   - `requestedByActorId`, `status` (pending/approved/rejected)
   - `reviewedByActorId`, `reviewNote`
   - Index: `{ requestedByActorId: 1, status: 1 }`

**Verification before moving to Phase 2:** confirm indexes exist via `db.collection.getIndexes()` in MongoDB shell or Compass.

## Phase 2 — Backend: Middleware

Reference: `01_ARCHITECTURE.md` §6, §10.

1. `middleware/resolveActor.js` — global middleware, runs before all routes:
   - First checks for JWT token (in signed cookies or Authorization header)
   - If valid JWT found, sets `req.actorId` from token payload
   - If no JWT, falls back to anonymous actor cookie pattern
   - If no cookie, creates new anonymous Actor and sets httpOnly signed cookie
2. `middleware/requireAuth.js` — authentication gate for protected routes:
   - Reads JWT from signed cookies or Bearer header
   - Verifies token, loads Actor, attaches `req.actorId` and `req.user`
   - Throws `UnauthorizedError` (401) if token missing or invalid
3. `middleware/requireRole.js` — role-based authorization gate:
   - Accepts variadic roles (e.g., `requireRole('admin', 'manager')`)
   - Throws `ForbiddenError` (403) if user's role not in allowed list
4. `middleware/validateRequest.js` — generic Zod schema validation:
   - Takes a schema and source (`body`/`params`/`query`)
   - Validates, replaces `req[source]` with parsed data
   - Throws `ValidationError` (400) on failure
5. `middleware/ownership.js` — resource ownership verification:
   - Takes a fetchResource function, loads resource by `req.params.id`
   - Verifies `resource.createdByActorId === req.actorId`
   - Throws `ForbiddenError` (403) on mismatch
   - Applied to `DELETE /api/feedback/:id` for regular users
6. `middleware/rateLimiter.js` — rate limiting (10 req/min per actor/IP):
   - `feedbackLimiter` for `POST /api/feedback`
   - `voteLimiter` for `PUT /api/feedback/:id/vote`
7. `middleware/errorHandler.js` — mount last, maps typed errors to `{ error, message }` JSON
8. `middleware/errors.js` — four error classes:
   - `NotFoundError` (404), `ForbiddenError` (403), `ValidationError` (400), `UnauthorizedError` (401)
9. `middleware/logger.js` — request logging: `[METHOD URL STATUS DURATIONms]`

**Verification:** hit any endpoint without credentials — confirm a new anonymous actor is created and cookie is set. Hit a protected endpoint without JWT — confirm 401 response.

## Phase 3 — Backend: Services

Reference: `01_ARCHITECTURE.md` §4.4, §7, §9.

1. `services/authService.js`:
   - `register({ name, email, password })` — check duplicate email, create Actor (type: 'registered'), generate JWT, return { user, token }
   - `login({ email, password })` — find by email, compare password, generate JWT, return { user, token }
   - `getMe(actorId)` — find Actor by ID, return sanitized user (no password)
   - Helper: `generateToken(actorId)` — signs JWT with 7-day expiry
2. `services/feedbackService.js`:
   - `createFeedback(...)` — creates feedback + logs 'created' activity
   - `listFeedback(...)` — dynamic query builder with category/priority/status filters (AND logic), text search, date range, 6 sort options, pagination (default limit=50), user vote enrichment
   - `getFeedbackById(id)` — single feedback + current user's vote
   - `deleteFeedback(id, actorId)` — role-gated: manager/admin can delete directly; regular users must use delete request flow
   - `updateStatus(id, status, actorId)` — role-gated (manager/admin only), logs activity with from/to
   - `updatePriority(id, priority, actorId)` — role-gated (manager/admin only), logs activity with from/to
   - `getStats()` — aggregate queries for dashboard: total/open/completed/highPriority/thisWeek counts, category/priority breakdowns, recent trend (30 days), most voted
   - `getRelatedFeedback(id)` — same category, top 5 by votes
3. `services/voteService.js`:
   - `castVote({ feedbackId, actorId, voteType })` — **atomic operation using MongoDB transaction**: upsert vote + update feedback upvoteCount/downvoteCount in single transaction. Handles first vote, vote change (up->down), and same-vote no-op.
4. `services/commentService.js`:
   - `createComment(...)` — creates comment + increments feedback.commentCount + logs 'comment_added' activity
   - `listComments(feedbackId)` — returns nested tree (top-level + replies)
   - `deleteComment(id, actorId)` — decrements commentCount, ownership check
5. `services/activityService.js`:
   - `logActivity({ feedbackId, actorId, action, details })` — creates Activity document
   - `listActivities(feedbackId)` — returns activities sorted newest first
6. `services/deleteRequestService.js`:
   - `createDeleteRequest(...)` — validates ownership, prevents duplicate pending requests
   - `listDeleteRequests(status)` — for admin/manager review
   - `approveDeleteRequest(id, reviewerId)` — deletes feedback, logs activity
   - `rejectDeleteRequest(id, reviewerId, note)` — updates status, logs activity
   - `getUserNotifications(actorId)` — recent approvals (last 1 hour)
7. `services/managerRequestService.js`:
   - `createManagerRequest(actorId)` — prevents already-manager/admin, prevents duplicates
   - `listManagerRequests(status)` — for admin review
   - `approveManagerRequest(id, reviewerId)` — auto-upgrades user role to 'manager'
   - `rejectManagerRequest(id, reviewerId, note)` — updates status
8. `services/userService.js`:
   - `listUsers(page, limit)` — paginated registered users
   - `updateUserRole(userId, role, requesterId)` — prevents self-role-change
   - `getUserById(id)` — single user lookup

**Verification:** write a quick script to fire 10 concurrent identical votes from the same actor at one item — confirm exactly one `votes` row exists and counters reflect exactly one vote.

## Phase 4 — Backend: Controllers + Routes

Reference: `01_ARCHITECTURE.md` §9 for endpoint list, request/response shapes, and status codes.

1. `authController.js` + `authRoutes.js`:
   - `POST /api/auth/register` — validate body → create account → set JWT cookie → 201
   - `POST /api/auth/login` — validate body → verify credentials → set JWT cookie → 200
   - `POST /api/auth/logout` — clear JWT cookie → 204
   - `GET /api/auth/me` — requireAuth → return current user → 200
2. `feedbackController.js` + `feedbackRoutes.js`:
   - `POST /api/feedback` — feedbackLimiter → validate → create → 201
   - `GET /api/feedback` — list with filters, pagination, sort → 200
   - `GET /api/feedback/related/:id` — related items → 200
   - `GET /api/feedback/:id` — single item → 200 / 404
   - `DELETE /api/feedback/:id` — ownership middleware → delete → 204
   - `PUT /api/feedback/:id/status` — requireRole(manager, admin) → update → 200
   - `PUT /api/feedback/:id/priority` — requireRole(manager, admin) → update → 200
3. `voteController.js` + `voteRoutes.js`:
   - `PUT /api/feedback/:id/vote` — voteLimiter → validate → cast vote → 200
4. `commentController.js` + `commentRoutes.js` (nested under feedback):
   - `POST /api/feedback/:feedbackId/comments` — validate → create → 201
   - `GET /api/feedback/:feedbackId/comments` — list (threaded) → 200
   - `DELETE /api/feedback/:feedbackId/comments/:id` — ownership → delete → 204
5. `activityRoutes.js` (nested under feedback):
   - `GET /api/feedback/:feedbackId/activities` — list → 200
6. `userController.js` + `userRoutes.js` (admin only):
   - `GET /api/users` — requireRole('admin') → list → 200
   - `PUT /api/users/:id/role` — requireRole('admin') → update → 200
   - `GET /api/users/:id` — requireRole('admin') → get → 200
7. `deleteRequestController.js` + `deleteRequestRoutes.js`:
   - `POST /api/delete-requests` — requireAuth → create → 201
   - `GET /api/delete-requests` — requireRole('manager', 'admin') → list → 200
   - `PUT /api/delete-requests/:id/approve` — requireRole → approve → 200
   - `PUT /api/delete-requests/:id/reject` — requireRole → reject → 200
8. `managerRequestController.js` + `managerRequestRoutes.js`:
   - `POST /api/manager-requests` — requireAuth → create → 201
   - `GET /api/manager-requests` — requireRole('admin') → list → 200
   - `PUT /api/manager-requests/:id/approve` — requireRole('admin') → approve → 200
   - `PUT /api/manager-requests/:id/reject` — requireRole('admin') → reject → 200
9. `notificationController.js` + `notificationRoutes.js`:
   - `GET /api/notifications` — requireAuth → get recent notifications → 200
10. `statsRoutes.js`:
    - `GET /api/stats` — dashboard statistics → 200
11. `healthRoutes.js`:
    - `GET /health` — DB connectivity check → 200 / 503
12. Route aggregator `routes/index.js` — mounts all sub-routers under `/api`

Wire `:id` validation (`mongoose.Types.ObjectId.isValid`) before any service call — malformed → 400, valid-but-not-found → 404.

**Verification against `01_ARCHITECTURE.md` §9, endpoint by endpoint:**
- [ ] `POST /api/feedback` — valid body → 201 with full resource; missing title → 400
- [ ] `GET /api/feedback?category=Bug&priority=High` — returns only matching items (AND)
- [ ] `GET /api/feedback` (no filters) — returns paginated full list
- [ ] `DELETE /api/feedback/:id` by non-owner, non-admin → 403
- [ ] `DELETE /api/feedback/:id` with malformed ID → 400; valid but missing → 404
- [ ] `PUT /api/feedback/:id/vote` with `voteType: "up"` twice → counter increments once
- [ ] `PUT /api/feedback/:id/vote` switching up→down → counts update correctly
- [ ] `POST /api/auth/register` with existing email → 400 with descriptive message
- [ ] `POST /api/auth/login` with wrong password → 401
- [ ] `GET /api/auth/me` without token → 401
- [ ] `PUT /api/feedback/:id/status` by regular user → 403

## Phase 5 — Frontend: Shared Primitives & Auth

Reference: `02_UI_IMPLEMENTATION_PLAN.md` §1, §3.

1. Set up `app/providers/QueryProvider.jsx` (staleTime 30s, retry 1 queries, retry 0 mutations) and `app/providers/ActorProvider.jsx` (reads user from auth context).
2. Build auth feature (`features/auth/`):
   - `api/authApi.js` — register, login, logout, getMe API calls
   - `hooks/useAuth.jsx` — AuthProvider context + useAuth hook (user, isAuthenticated, isAdmin, isManager, login, register, logout)
   - `components/LoginForm.jsx` — email/password form with show/hide toggle, error display
   - `components/RegisterForm.jsx` — name/email/password form with validation
   - `components/AuthLayout.jsx` — centered card layout for auth pages
3. Build auth pages:
   - `pages/welcome/WelcomePage.jsx` — landing page with Sign In / Create Account buttons
   - `pages/login/LoginPage.jsx` — login form + redirect if authenticated
   - `pages/register/RegisterPage.jsx` — register form + redirect if authenticated
4. Build route guards:
   - `shared/components/ProtectedRoute.jsx` — redirects to /welcome if not authenticated
   - `shared/components/GuestRoute.jsx` — redirects to / if authenticated
   - `shared/components/RequireRole.jsx` — redirects to / if role doesn't match
5. Build shared components (`shared/components/`):
   - `Modal.jsx` — accessible modal: focus trap, Escape-to-close, overlay click, aria-modal, body scroll lock
   - `ConfirmDialog.jsx` — confirmation modal built on Modal
   - `Button.jsx` — 4 variants (primary/secondary/danger/ghost), 3 sizes (sm/md/lg)
   - `Badge.jsx` — 10 color themes, optional dot indicator
   - `Toast.jsx` — ToastProvider + useToast hook, 3 types (success/error/info), auto-dismiss
   - `Skeleton.jsx` — CardSkeleton, ListSkeleton, StatSkeleton
   - `EmptyState.jsx` — icon, title, description, optional action button
   - `ErrorBoundary.jsx` — React class error boundary with retry button
   - `AppLayout.jsx` — responsive sidebar layout with Outlet for nested routes
6. Set up `shared/lib/apiClient.js` — fetch wrapper with credentials, JSON headers, error normalization.
7. Set up `shared/hooks/` — `useActorId.js`, `useRole.js`, `useNotifications.js`.
8. Set up `shared/constants/` — design tokens, enums (categories, priorities, statuses, sort options).

**Verification:** navigate to `/welcome` without login — confirm redirect works. Register a new account — confirm redirect to `/`. Try accessing `/` without login — confirm redirect to `/welcome`.

## Phase 6 — Frontend: Entity Layer

Reference: `02_UI_IMPLEMENTATION_PLAN.md` §1, §3.5–3.7.

1. Feedback entity (`entities/feedback/`):
   - `model/feedbackApi.js` — `fetchFeedback()` calls GET /feedback with query params
   - `model/useFeedbackList.js` — TanStack Query hook
   - `config/categoryColorMap.js` — Bug/Feature/Improvement → color tokens
   - `config/statusColorMap.js` — 6 statuses → color tokens
   - `components/CategoryBadge.jsx`, `StatusBadge.jsx`, `PriorityDots.jsx`
   - `components/FeedbackCard.jsx` — card with slot prop for actions (must not import from features/)
   - `components/FeedbackGrid.jsx` — responsive grid layout + empty state
2. Comment entity (`entities/comment/`):
   - `model/commentApi.js` — fetchComments, createComment, deleteComment
   - `model/useComments.js` — TanStack Query hook
   - `components/CommentItem.jsx` — individual comment with avatar, date, Reply button, nested replies
   - `components/CommentList.jsx` — list of CommentItems
3. Activity entity (`entities/activity/`):
   - `model/activityApi.js` — fetchActivities
   - `model/useActivities.js` — TanStack Query hook
   - `components/ActivityTimeline.jsx` — vertical timeline with action-specific icons/colors

**Verification:** render `FeedbackGrid` with mock data and no features wired — should render correctly with empty action slots.

## Phase 7 — Frontend: Features

Reference: `02_UI_IMPLEMENTATION_PLAN.md` §1, §1.3.

1. `features/submit-feedback/` — FeedbackForm + useCreateFeedback (mutation, invalidates `['feedback']` on success). Form has client-side validation matching backend rules.
2. `features/vote-on-feedback/` — VoteButtons + useVote (mutation with **optimistic update via setQueryData**, rollback on error). Zero local count state.
3. `features/delete-feedback/` — useDeleteFeedback (mutation, invalidates `['feedback']` on success).
4. `features/filter-feedback/` — CategoryFilter, PriorityFilter, StatusFilter, SortSelect, FilterBar, SearchBar (300ms debounce). `useFeedbackFilters` owns URL search params via React Router.
5. `features/search-feedback/` — SearchBar with debounced input (300ms), clear button.
6. `features/add-comment/` — CommentInput (textarea with Reply/Comment button, supports parentId for threading) + useAddComment (mutation, invalidates comments + feedback queries).
7. `features/change-status/` — StatusSelect (dropdown for 6 statuses, auto-submits on change) + useChangeStatus (mutation).
8. `features/delete-request/` — DeleteRequestButton (shown to owners), DeleteRequestList (admin/manager view with approve/reject), useCreateDeleteRequest, useDeleteRequests, useApproveDeleteRequest, useRejectDeleteRequest.
9. `features/manager-request/` — RequestManagerButton (for regular users), ManagerRequestList (admin view), useCreateManagerRequest, useManagerRequests, useApproveManagerRequest, useRejectManagerRequest.
10. `features/manage-users/` — UserList (table with name, email, role dropdown, joined date), RoleSelect (inline role dropdown), useUsers, useUpdateUserRole.

**Verification:** confirm no file under `features/*` imports from another `features/*` folder.

## Phase 8 — Frontend: Widgets + Pages

Reference: `02_UI_IMPLEMENTATION_PLAN.md` §1.1, §1.2.

1. Feedback Board widget (`widgets/feedback-board/`):
   - `useDeleteConfirmation.js` — local orchestration state for delete flow
   - `FeedbackBoard.jsx` — composition of FilterBar + FeedbackGrid + VoteButtons + DeleteRequestButton + FeedbackForm (modal) + ConfirmDialog + EmptyState + Skeleton loading. Role-based delete (direct for manager/admin, request for owners). Toast notifications for delete requests.
2. Feedback Detail widget (`widgets/feedback-detail/`):
   - `FeedbackDetail.jsx` — full detail view: title, description, CategoryBadge, PriorityDots, StatusBadge, VoteButtons, StatusSelect (manager/admin), Delete/DeleteRequestButton, CommentList with CommentInput (threaded replies), ActivityTimeline, ConfirmDialog.
3. Dashboard widget (`widgets/dashboard/`):
   - `DashboardWidget.jsx` — 5 stat cards, Most Voted highlight, 2 BarCharts (by category, by priority), TrendChart (30-day activity). Skeleton loading state.
   - `components/StatCard.jsx`, `BarChart.jsx`, `TrendChart.jsx`
4. Pages (all wrap widgets in ErrorBoundary):
   - `pages/feedback-board/FeedbackBoardPage.jsx`
   - `pages/feedback-detail/FeedbackDetailPage.jsx`
   - `pages/dashboard/DashboardPage.jsx`
   - `pages/admin/AdminPage.jsx` — 3 tabs: Users, Manager Requests, Delete Requests

**Verification — full requirement checklist:**
- [ ] Submit → item appears in grid without manual refresh
- [ ] Filter by category, priority, status — confirm AND logic
- [ ] Filters persist through page refresh (URL params working)
- [ ] Search with debounce works correctly
- [ ] Upvote/downvote updates count with no flicker
- [ ] Delete opens confirmation modal; owner sees "Request Delete", admin/manager sees "Delete"
- [ ] Comment creation and threaded replies work
- [ ] Activity timeline shows all actions
- [ ] Dashboard shows correct stats and charts
- [ ] Admin panel shows users, manager requests, delete requests
- [ ] Role-based access: regular users can't change status/priority, managers can, admins can
- [ ] Responsive behavior at all breakpoints

## Phase 9 — Frontend: Routing & Navigation

Reference: `02_UI_IMPLEMENTATION_PLAN.md` §1.1.

1. `app/routes.jsx` — React Router with `createBrowserRouter`:
   - **Guest routes** (GuestRoute wrapper): `/welcome`, `/login`, `/register`
   - **Protected routes** (ProtectedRoute → AppLayout):
     - `/` — FeedbackBoardPage
     - `/feedback/:id` — FeedbackDetailPage
     - `/dashboard` — DashboardPage
   - **Admin routes** (ProtectedRoute → RequireRole('admin') → AppLayout):
     - `/admin` — AdminPage
2. `AppLayout.jsx` — responsive sidebar with:
   - Logo + nav links (Feedback Board, Dashboard, Admin for admins)
   - RequestManagerButton (for regular users only)
   - User info + role badge + Sign Out button
   - Mobile hamburger menu
   - Uses `<Outlet />` for nested route content

**Verification:** navigate between all routes, confirm guards work. Admin link only visible to admin users. Manager request button only visible to regular users.

## Phase 10 — Production-Readiness Pass

Reference: `01_ARCHITECTURE.md` §10. These are correctness/safety items, not optional polish.

1. Confirm pagination is enforced server-side (`limit` default 50 applied even if client omits it).
2. Confirm rate limiting is active on write endpoints (test by exceeding threshold → 429).
3. Response compression via `compression()` middleware — already in `app.js`.
4. Structured request/error logging via `logger.js` — already in `app.js`.
5. React error boundaries around every page widget — already in all `*Page.jsx` files.
6. Confirm `GET /health` reflects real DB connectivity (kill DB connection → 503).
7. TanStack Query retry defaults: retry 1 for queries, retry 0 for mutations — confirm vote mutation doesn't blindly retry.
8. CORS configured for frontend origin only with credentials — already in `app.js`.
9. Mongoose connection pool explicitly configured (`maxPoolSize: 10`) — already in `db.js`.
10. Seed admin user via `scripts/seedAdmin.js` for initial admin access.

## Explicitly Out of Scope for This Roadmap

Per prior design review, these are deferred with a defined trigger for revisiting — do not build them speculatively:

| Item | Trigger to revisit |
|---|---|
| Email/webhook notifications | Only if explicit contact field added at submission |
| Redis/CDN response caching | Only if a distinct, explicitly-stale-tolerant read view is added |
| Virtualized list rendering | Evidence users routinely paginate through hundreds of items |
| Cursor-based pagination | Evidence of skipped/duplicated items during concurrent add/delete |
| Code splitting beyond Vite defaults | Bundle analyzer shows a chunk over ~150-200KB gzipped |
| `vote_cast` activity logging | Only if users request vote history visibility |
| Priority change UI component | Only if priority changes become a frequent admin action |

## Cross-Document References

- What to build → `01_ARCHITECTURE.md` (data model, API contract, validation)
- How to structure it → `02_UI_IMPLEMENTATION_PLAN.md` (folder trees, components, design system)
- This document only sequences and verifies — it does not define new contracts. If a step here seems to require a decision not covered by the other two documents, stop and resolve against them first.
