# Contributing to SyncSpace

## Code organization

### Frontend

- **Pages** — route-level views only; keep them thin.
- **Components** — reusable UI in `components/ui/`; layout shells in `components/layout/`.
- **Services** — all API calls go through `services/` using `apiClient`; never call axios directly from pages.
- **Stores** — global client state (auth, theme); prefer hooks (`useAuth`, `useTheme`) in components.
- **Types** — shared API shapes in `types/`.
- **Utils** — pure helpers (validation, `cn`, storage).

### Backend

- **Routes** — wire HTTP paths only.
- **Controllers** — parse request, call service, send JSON response.
- **Services** — business rules and database orchestration.
- **Models** — Mongoose schemas and instance methods.
- **Middleware** — cross-cutting concerns (auth, validation, errors).
- **Utils** — shared helpers (`asyncHandler`, `ApiError`, JWT helpers).

## Adding a new feature module

Example: **Projects**

1. `backend/src/models/Project.ts`
2. `backend/src/services/projectService.ts`
3. `backend/src/controllers/projectController.ts`
4. `backend/src/routes/projectRoutes.ts` — mount in `routes/index.ts`
5. `frontend/src/types/project.ts`
6. `frontend/src/services/projectService.ts`
7. `frontend/src/pages/dashboard/...` + sidebar nav entry

## Environment & secrets

- Never commit `.env` files.
- Use strong `JWT_SECRET` in production (32+ random bytes).
- Rotate secrets if leaked; invalidate sessions if needed.
- Keep `CORS_ORIGIN` explicit — no `*` with credentials.

## Error handling

- Backend: throw `ApiError` for expected failures; unknown errors hit `errorHandler`.
- Frontend: rely on axios interceptor; surface messages in UI state.

## Auth

- Access token in `localStorage` (`syncspace_token`) — consider httpOnly cookies for hardened production.
- Protected API routes use `authenticate` middleware.
- Frontend `ProtectedRoute` redirects unauthenticated users to `/login`.

## Styling

- Use design tokens (`bg-surface`, `text-content`, `border-border`, `brand`).
- Support dark mode via `dark` class on `<html>` (theme store).
- Prefer Tailwind utilities; extract components when repeated 3+ times.

## Git workflow

- Small, focused commits with clear messages.
- Run `npm run build` before opening a PR.
- Do not commit `node_modules`, `dist`, or secrets.

## Testing (recommended next steps)

- Backend: Jest + supertest for auth routes.
- Frontend: Vitest + React Testing Library for forms and protected routes.
- E2E: Playwright for login → dashboard flow.
