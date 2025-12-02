"use client";
import { useEffect, useState } from "react";

type Project = { id: number; title: string; updatedAt: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");

  async function load() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (res.ok) setProjects(data.projects);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "Untitled", data: { shapes: [] } }),
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = `/workspace?id=${data.project.id}`;
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>Projects</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={create}>New Project</button>
      </div>
      <ul>
        {projects.map((p) => (
          <li key={p.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>{p.title}</span>
            <a href={`/workspace?id=${p.id}`} suppressHydrationWarning>Open</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
