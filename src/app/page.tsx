import Link from "next/link";

export default function Home() {
  return (
    <div className="stack" style={{ marginTop: 32 }}>
      <h1 className="h1">Fullstack Practice App</h1>
      <p className="muted">Interactive canvas with public persistence, built on Next.js and Prisma.</p>
      <div className="row">
        <Link className="btn btn-primary" href="/projects" prefetch={false}>Open Projects</Link>
        <Link className="btn" href="/docs" prefetch={false}>Documentation</Link>
      </div>
    </div>
  );
}
