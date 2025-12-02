"use client";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessage(null);
  }, [mode]);

  async function submit() {
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Request failed");
    } else {
      setMessage(mode === "login" ? "Logged in" : "Signed up");
      window.location.href = "/items";
    }
  }

  return (
    <div className="stack" style={{ marginTop: 32, maxWidth: 520 }}>
      <h1 className="h1">{mode === "login" ? "Login" : "Sign Up"}</h1>
      <div className="row">
        <button className="btn" onClick={() => setMode("login")}>Login</button>
        <button className="btn" onClick={() => setMode("signup")}>Sign Up</button>
      </div>
      <span className="label">Email</span>
      <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      <span className="label">Password</span>
      <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {mode === "signup" && (
        <>
          <span className="label">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </>
      )}
      <div>
        <button className="btn btn-primary" onClick={submit}>{mode === "login" ? "Login" : "Create Account"}</button>
      </div>
      {message && <p style={{ color: "var(--danger)" }}>{message}</p>}
    </div>
  );
}
