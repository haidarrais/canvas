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
    <div className="stack" style={{ marginTop: 32 }}>
      <h1 className="h1">Projects</h1>
      <div className="row">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn btn-primary" onClick={create}>New Project</button>
      </div>
      <div className="grid grid-2">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <div className="stack">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div className="muted" style={{ fontSize: 12 }}>{new Date(p.updatedAt).toLocaleString()}</div>
              </div>
              <div className="row">
                <a className="btn btn-primary" href={`/workspace?id=${p.id}`} suppressHydrationWarning>Open</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
