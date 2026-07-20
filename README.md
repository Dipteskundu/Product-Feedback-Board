# Product Feedback Board — Client

React single-page application for the Product Feedback Board. Built with Vite, Tailwind CSS v4, and Feature-Sliced Design architecture.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| TanStack Query v5 | Server state management (caching, refetch, mutations) |
| React Router DOM v7 | Client-side routing |
| React Aria Components | Accessible UI primitives (dialogs, modals) |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend server running on `http://localhost:5000` (see `../server/README.md`)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The app runs on `http://localhost:5173`. API requests to `/api` are proxied to `http://localhost:5000`.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server.

### Preview production build

```bash
npm run preview
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |

---

## Architecture

This project follows **Feature-Sliced Design** — a scalable frontend architecture pattern. Layers are organized by concern and have strict import rules.

### Layer hierarchy (left to right = dependency direction)

```
shared → entities → features → widgets → pages → app
```

A layer may only import from layers to its left. Never import from a layer to the right.

### Directory structure

```
src/
├── app/                        # App layer — providers, routing, global config
│   ├── routes.jsx              # Route definitions (createBrowserRouter)
│   └── providers/
│       ├── QueryProvider.jsx    # TanStack Query context
│       ├── AuthProvider.jsx     # Authentication context
│       ├── ActorProvider.jsx    # Anonymous actor identity context
│       └── ThemeProvider.jsx    # Dark/light theme context
│
├── shared/                     # Shared layer — reusable, app-agnostic
│   ├── components/
│   │   ├── AppLayout.jsx       # Main layout with sidebar
│   │   ├── Button.jsx          # Reusable button (primary/secondary/danger/ghost)
│   │   ├── Modal.jsx           # Portal-based modal
│   │   ├── ConfirmDialog.jsx   # Confirmation dialog
│   │   ├── Toast.jsx           # Toast notification system
│   │   ├── Skeleton.jsx        # Loading skeletons
│   │   ├── EmptyState.jsx      # Empty state component
│   │   ├── Badge.jsx           # Badge component
│   │   ├── ErrorBoundary.jsx   # React error boundary
│   │   ├── ProtectedRoute.jsx  # Auth guard (redirects to /welcome)
│   │   ├── GuestRoute.jsx      # Guest guard (redirects to /)
│   │   └── RequireRole.jsx     # Role-based guard (admin/manager)
│   ├── hooks/
│   │   ├── useActorId.js       # Actor identity hook
│   │   ├── useNotifications.js # Notification polling hook
│   │   └── useRole.js          # Role checking hook
│   ├── lib/
│   │   └── apiClient.js        # Fetch wrapper with credentials
│   ├── utils/
│   │   └── formatDate.js       # Date formatting utility
│   └── constants/
│       ├── api.js              # API base URL
│       ├── enums.js            # Shared enums
│       └── tokens.js           # Design tokens
│
├── entities/                   # Entity layer — data models and their representation
│   ├── feedback/
│   │   ├── components/
│   │   │   ├── FeedbackCard.jsx    # Feedback card for grid
│   │   │   ├── FeedbackGrid.jsx    # Responsive grid layout
│   │   │   ├── CategoryBadge.jsx   # Category badge (Bug/Feature/Improvement)
│   │   │   ├── PriorityDots.jsx    # Priority indicator dots
│   │   │   └── StatusBadge.jsx     # Status badge
│   │   └── model/
│   │       ├── feedbackApi.js      # Feedback API calls
│   │       └── useFeedbackList.js  # Feedback list query hook
│   ├── comment/
│   │   ├── components/
│   │   │   ├── CommentList.jsx     # Comment list
│   │   │   └── CommentItem.jsx     # Individual comment
│   │   └── model/
│   │       ├── commentApi.js       # Comment API calls
│   │       └── useComments.js      # Comments query hook
│   └── activity/
│       ├── components/
│       │   └── ActivityTimeline.jsx # Activity timeline
│       └── model/
│           ├── activityApi.js       # Activity API calls
│           └── useActivities.js     # Activities query hook
│
├── features/                   # Feature layer — one feature per user action
│   ├── auth/                   # Login, register, logout
│   │   ├── api/authApi.js
│   │   ├── components/ (LoginForm, RegisterForm, AuthLayout)
│   │   └── hooks/useAuth.jsx
│   ├── submit-feedback/        # Create feedback form
│   │   ├── api/submitFeedbackApi.js
│   │   ├── components/ (CreateFeedbackDialog, FeedbackForm)
│   │   └── hooks/useCreateFeedback.js
│   ├── vote-on-feedback/       # Upvote/downvote
│   │   ├── api/voteApi.js
│   │   ├── components/VoteButtons.jsx
│   │   └── hooks/useVote.js
│   ├── filter-feedback/        # Category, priority, status filters
│   │   ├── components/ (FilterBar, CategoryFilter, PriorityFilter, StatusFilter, SortSelect)
│   │   └── hooks/useFeedbackFilters.js
│   ├── search-feedback/        # Text search
│   │   └── components/SearchBar.jsx
│   ├── delete-feedback/        # Direct delete (manager/admin)
│   │   ├── api/deleteFeedbackApi.js
│   │   └── hooks/useDeleteFeedback.js
│   ├── delete-request/         # Delete request flow (user)
│   │   ├── api/deleteRequestApi.js
│   │   ├── components/ (DeleteRequestButton, DeleteRequestList)
│   │   └── hooks/
│   ├── add-comment/            # Add/delete comments
│   │   ├── components/CommentInput.jsx
│   │   └── hooks/ (useAddComment, useDeleteComment)
│   ├── change-status/          # Change feedback status (manager/admin)
│   │   ├── api/statusApi.js
│   │   ├── components/StatusSelect.jsx
│   │   └── hooks/useChangeStatus.js
│   ├── manage-users/           # User management (admin)
│   │   ├── api/userApi.js
│   │   ├── components/ (UserList, RoleSelect)
│   │   └── hooks/ (useUsers, useUpdateUserRole)
│   └── manager-request/        # Manager role request flow
│       ├── api/managerRequestApi.js
│       ├── components/ (RequestManagerButton, ManagerRequestList)
│       └── hooks/
│
├── widgets/                    # Widget layer — composed UI from entities + features
│   ├── feedback-board/
│   │   ├── FeedbackBoard.jsx       # Main board (grid + filters + actions)
│   │   └── useDeleteConfirmation.js
│   ├── feedback-detail/
│   │   └── FeedbackDetail.jsx      # Detail view (comments, activity, actions)
│   └── dashboard/
│       ├── DashboardWidget.jsx     # Dashboard with stats and charts
│       ├── components/ (StatCard, BarChart, TrendChart)
│       └── model/statsApi.js
│
└── pages/                      # Page layer — route targets
    ├── welcome/WelcomePage.jsx
    ├── login/LoginPage.jsx
    ├── register/RegisterPage.jsx
    ├── feedback-board/FeedbackBoardPage.jsx
    ├── feedback-detail/FeedbackDetailPage.jsx
    ├── dashboard/DashboardPage.jsx
    └── admin/AdminPage.jsx
```

---

## Providers

The app wraps all routes in these providers (outermost to innermost):

1. **QueryProvider** — TanStack Query client
2. **ThemeProvider** — Dark/light mode (persists to localStorage)
3. **AuthProvider** — Authentication state and user role
4. **ActorProvider** — Anonymous actor identity (cookie-based)
5. **ToastProvider** — Toast notification context

---

## Routing

| Path | Component | Access |
|---|---|---|
| `/welcome` | WelcomePage | Guest only |
| `/login` | LoginPage | Guest only |
| `/register` | RegisterPage | Guest only |
| `/` | FeedbackBoardPage | Authenticated |
| `/feedback/:id` | FeedbackDetailPage | Authenticated |
| `/dashboard` | DashboardPage | Authenticated |
| `/admin` | AdminPage | Admin only |

---

## Design System

### Fonts

- **Heading** — Space Grotesk (500, 700)
- **Body** — Inter (400, 500, 600, 700)
- **Mono** — IBM Plex Mono (500, 600)

### Color tokens (defined in `index.css`)

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#FAFAFB` | `#0B0D14` |
| `--color-surface` | `#FFFFFF` | `#13151F` |
| `--color-border` | `#E4E4E9` | `#1E2030` |
| `--color-ink` | `#14141A` | `#E8E9ED` |
| `--color-accent` | `#4F46E5` | `#6366F1` |
| `--color-bug` | `#DC2626` | `#F87171` |
| `--color-feature` | `#2563EB` | `#60A5FA` |
| `--color-improvement` | `#059669` | `#34D399` |

### Animations

- `fade-in` — Fade in (0.3s)
- `scale-in` — Scale up from 95% (0.2s)
- `card-in` — Slide up + fade in (0.4s)
- `slide-up` — Slide up from below (0.3s)
- `slide-in-right` — Slide in from right (0.35s)

---

## Environment

The Vite dev server proxies `/api` requests to `http://localhost:5000`. No `.env` file is needed for the client — the proxy is configured in `vite.config.js`.

For production, the client builds to `dist/` and expects the API to be served at the same origin or configured via the proxy.
