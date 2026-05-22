# SyncSpace

AI-powered project management platform — production-ready full-stack SaaS scaffold.

**Stack:** React + TypeScript + Vite (frontend) · Node.js + Express + MongoDB (backend) · JWT auth · Tailwind · Zustand · axios

---

## Project structure

```
syncspace/
├── frontend/                 # React SPA (Vite)
│   ├── public/
│   └── src/
│       ├── components/       # ui/, layout/, auth/
│       ├── hooks/
│       ├── pages/            # Landing, auth, dashboard
│       ├── providers/
│       ├── routes/           # Router + ProtectedRoute
│       ├── services/         # apiClient, authService
│       ├── stores/           # authStore, themeStore
│       ├── types/
│       └── utils/
├── backend/                  # Express API
│   └── src/
│       ├── config/           # env, database
│       ├── controllers/
│       ├── middleware/       # auth, validate, errors
│       ├── models/           # User (Mongoose)
│       ├── routes/
│       ├── services/
│       └── utils/
├── CONTRIBUTING.md
├── package.json              # npm workspaces (monorepo)
└── README.md
```

---

## Prerequisites

- **Node.js** 20+
- **MongoDB** 6+ (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** 10+

---

## Installation

```bash
cd C:\Users\swapn\Projects\syncspace

# Install all workspace dependencies
npm install

# Environment files
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Edit `backend/.env`:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — long random secret (required in production)
- `CORS_ORIGIN` — `http://localhost:5173` for local dev

Edit `frontend/.env` if the API is not on the default URL.

---

## Development

Run both apps (recommended):

```bash
npm run dev
```

Or separately:

```bash
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

### API endpoints (v1)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v1/health` | No |
| POST | `/api/v1/auth/register` | No |
| POST | `/api/v1/auth/login` | No |
| GET | `/api/v1/auth/me` | Bearer JWT |

---

## Production build

```bash
npm run build
cd backend && npm start
cd frontend && npm run preview
```

Serve the frontend `dist/` behind your CDN or static host; point `VITE_API_BASE_URL` at your deployed API.

---

## Architecture highlights

| Layer | Responsibility |
|-------|----------------|
| **Frontend services** | HTTP via axios (`apiClient` + interceptors) |
| **Zustand stores** | Auth session, theme (light/dark/system) |
| **Protected routes** | `ProtectedRoute` / `PublicRoute` wrappers |
| **Backend services** | Business logic (e.g. `authService`) |
| **Controllers** | HTTP request/response only |
| **Middleware** | JWT `authenticate`, validation, global errors |
| **Design tokens** | CSS variables in `index.css` + Tailwind theme |

---

## Best practices

See [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards, env safety, and how to extend modules (projects, tasks, AI).

---

## License

Private — all rights reserved unless you add a license file.
