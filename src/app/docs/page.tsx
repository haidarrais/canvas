import Link from "next/link";

export default function DocsPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Application Documentation</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>This page documents the architecture, features, APIs, and setup of the app.</p>

      <section style={{ marginBottom: 24 }}>
        <h2>Overview</h2>
        <ul>
          <li>Fullstack Next.js app with public persistence and an interactive 2D SVG workspace.</li>
          <li>Users browse projects and resume work in a workspace that supports rectangle, circle, and line tools.</li>
          <li>Measurements for shapes are computed live and persisted to the database.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Tech Stack</h2>
        <ul>
          <li>Framework: Next.js App Router 15.</li>
          <li>UI: React 19 RC with Client/Server component split.</li>
          <li>ORM/DB: Prisma with PostgreSQL (Supabase).</li>
          <li>Validation: Zod.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Data Models</h2>
        <ul>
          <li>Project: <code>id</code>, <code>title</code>, <code>data</code> (JSON <code>{"{shapes: Shape[]}"}</code>), timestamps.</li>
          <li>User and Item exist for demo auth and CRUD flows.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Key Routes</h2>
        <ul>
          <li><Link prefetch={false} href="/projects">/projects</Link> — list and create projects.</li>
          <li><Link prefetch={false} href="/workspace?id=1">/workspace?id=&lt;id&gt;</Link> — SVG workspace for a project.</li>
          <li><Link prefetch={false} href="/api/projects">/api/projects</Link> — list and create (GET/POST).</li>
          <li>/api/projects/[id] — read/update a project (GET/PUT).</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Workspace Features</h2>
        <ul>
          <li>Tools: Select, Rectangle, Circle, Line.</li>
          <li>Drag to create; hold Shift for square and 45° snap for lines.</li>
          <li>Measurements: rectangle area/perimeter, circle area/circumference, line length.</li>
          <li>Auto-save: debounced PUT to `/api/projects/:id`.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Environment</h2>
        <ul>
          <li>`DATABASE_URL`: Supabase Postgres pooled connection (PgBouncer, `6543`).</li>
          <li>`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client use if needed.</li>
          <li>Server-only keys (e.g., service role) must be kept out of `NEXT_PUBLIC_*`.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Local Development</h2>
        <ul>
          <li>Install deps: `npm install`.</li>
          <li>Generate client: `npx prisma generate`.</li>
          <li>Migrate: `npx prisma migrate dev` (use non-pooled `5432` once if needed).</li>
          <li>Run dev: `npm run dev` and open `http://localhost:3000`.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Deployment</h2>
        <ul>
          <li>Set `DATABASE_URL` in Vercel env to the Supabase pooled connection.</li>
          <li>Run Prisma migrations in production with `prisma migrate deploy`.</li>
          <li>App routes enforce Node runtime for Prisma APIs.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Troubleshooting</h2>
        <ul>
          <li>Hydration warnings: avoid client-only APIs in Server Pages; use Suspense and client components.</li>
          <li>DB errors: verify `DATABASE_URL` and that migrations are applied to Supabase.</li>
          <li>Port conflicts: dev falls back if `3000` is busy; free it or use the alternate port.</li>
        </ul>
      </section>

      <section>
        <h2>Quick Links</h2>
        <ul>
          <li><Link prefetch={false} href="/">Home</Link></li>
          <li><Link prefetch={false} href="/projects">Projects</Link></li>
          <li><Link prefetch={false} href="/workspace?id=1">Workspace</Link></li>
          <li><Link prefetch={false} href="/api/projects">API: Projects</Link></li>
        </ul>
      </section>
    </main>
  );
}
