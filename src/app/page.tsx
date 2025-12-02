import Link from "next/link";

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Fullstack Practice App</h1>
      {/* <p suppressHydrationWarning>
        <Link href="/login" prefetch={false}>Login / Sign Up</Link>
      </p> */}
      <p suppressHydrationWarning>
        <Link href="/projects" prefetch={false}>Projects</Link>
      </p>
    </div>
  );
}
