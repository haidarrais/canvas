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
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Items</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={addItem}>Add Item</button>
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul>
        {items.map((i) => (
          <li key={i.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>{i.title}</span>
            <button onClick={() => deleteItem(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

