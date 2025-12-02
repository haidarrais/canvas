"use client";
import { useEffect, useState } from "react";

type Item = { id: number; title: string; description?: string | null };

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/items");
    const data = await res.json();
    if (!res.ok) setError(data.error || "Failed to load items");
    else setItems(data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function addItem() {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add item");
    }
  }

  async function deleteItem(id: number) {
    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to delete item");
    }
  }

  return (
    <div className="stack" style={{ marginTop: 32 }}>
      <h1 className="h1">Items</h1>
      <div className="stack">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn btn-primary" onClick={addItem}>Add Item</button>
      </div>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <div className="grid grid-2">
        {items.map((i) => (
          <div key={i.id} className="card row" style={{ justifyContent: "space-between" }}>
            <span>{i.title}</span>
            <button className="btn btn-danger" onClick={() => deleteItem(i.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
