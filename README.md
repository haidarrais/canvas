# Fullstack Practice App (Canvas + Public Persistence)

## Setup
- Node 18+
- Copy `.env` (provided) and set `JWT_SECRET`
- Install deps: `npm install`
- Run initial migration: `npx prisma migrate dev --name init`
- Start dev: `npm run dev`

## Tech
- React/Next.js App Router, TypeScript
- Prisma with SQLite persistence
- Public projects (no authentication)
- SVG-based interactive workspace with mouse + keyboard support

## End-to-End Demo
- Navigate to `/projects`
- Create a project, then open it
- In `/workspace?id=...`, select a tool (Rectangle/Circle/Line)
- Click-and-drag to create shapes; hold Shift to constrain angles/square
- Select shapes and move them; see measurements update live
- Changes auto-save; browse `/projects` to resume work

## API
- `GET /api/projects` → list projects
- `POST /api/projects` → create project `{ title, data }`
- `GET /api/projects/:id` → load project
- `PUT /api/projects/:id` → save project `{ title, data }`

## Testing
- Run tests: `npm test`
- Tests: geometry computations, hashing utility

## Talking Points (Interview)
- SVG vs Canvas trade-offs for fast iteration
- Mouse + keyboard interaction model and selection/editing
- Persistence and schema design; public access implications
- Measurement computation correctness and UX clarity
- Scaling: project listing, data size, snapshot strategy

## Next Improvements
- More tests for API/services
- Logout endpoint and cookie clearing
- Pagination and optimistic UI updates
