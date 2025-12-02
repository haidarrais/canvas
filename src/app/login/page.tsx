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
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>{mode === "login" ? "Login" : "Sign Up"}</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("login")}>Login</button>
        <button onClick={() => setMode("signup")}>Sign Up</button>
      </div>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {mode === "signup" && (
        <>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </>
      )}
      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>{mode === "login" ? "Login" : "Create Account"}</button>
      </div>
      {message && <p style={{ color: "crimson" }}>{message}</p>}
    </div>
  );
}

