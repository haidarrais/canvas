"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shape, uid, lineLength, rectArea, rectPerimeter, circleArea, circleCircumference, snapAngle45 } from "@/lib/geometry";

type Tool = "select" | "rect" | "circle" | "line";

export default function WorkspaceClient({ initialId }: { initialId: string | null }) {
  const [id] = useState<string | null>(initialId);
  const [title, setTitle] = useState("Untitled");
  const [tool, setTool] = useState<Tool>("rect");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; kind: "move" | "resize" } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`).then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        setTitle(data.project.title);
        setShapes(Array.isArray(data.project.data?.shapes) ? data.project.data.shapes : []);
      }
    });
  }, [id]);

  useEffect(() => {
    const h = setTimeout(() => {
      if (!id) return;
      fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, data: { shapes } }),
      });
    }, 500);
    return () => clearTimeout(h);
  }, [id, title, shapes]);

  const selected = useMemo(() => shapes.find((s) => s.id === selectedId) || null, [shapes, selectedId]);

  function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startRef.current = { x, y };
    if (tool === "rect") {
      const id0 = uid();
      setShapes((prev) => [...prev, { id: id0, type: "rect", x, y, w: 0, h: 0 }]);
      setSelectedId(id0);
      setDragging({ id: id0, kind: "resize" });
    } else if (tool === "circle") {
      const id0 = uid();
      setShapes((prev) => [...prev, { id: id0, type: "circle", cx: x, cy: y, r: 0 }]);
      setSelectedId(id0);
      setDragging({ id: id0, kind: "resize" });
    } else if (tool === "line") {
      const id0 = uid();
      setShapes((prev) => [...prev, { id: id0, type: "line", x1: x, y1: y, x2: x, y2: y }]);
      setSelectedId(id0);
      setDragging({ id: id0, kind: "resize" });
    }
  }

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragging || !startRef.current) return;
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const shift = e.shiftKey;
    setShapes((prev) => prev.map((s) => {
      if (s.id !== dragging.id) return s;
      if (s.type === "rect") {
        let w = x - s.x;
        let h = y - s.y;
        if (shift) {
          const m = Math.max(Math.abs(w), Math.abs(h));
          w = Math.sign(w) * m;
          h = Math.sign(h) * m;
        }
        return { ...s, w, h };
      } else if (s.type === "circle") {
        const dx = x - s.cx;
        const dy = y - s.cy;
        const r = Math.hypot(dx, dy);
        return { ...s, r };
      } else {
        let dx = x - s.x1;
        let dy = y - s.y1;
        if (shift) {
          const snapped = snapAngle45(dx, dy);
          dx = snapped.dx;
          dy = snapped.dy;
        }
        return { ...s, x2: s.x1 + dx, y2: s.y1 + dy };
      }
    }));
  }

  function onMouseUp() {
    setDragging(null);
    startRef.current = null;
  }

  function onSelect(id0: string) {
    setSelectedId(id0);
  }

  function onMoveSelected(dx: number, dy: number) {
    if (!selected) return;
    setShapes((prev) => prev.map((s) => {
      if (s.id !== selected.id) return s;
      if (s.type === "rect") return { ...s, x: s.x + dx, y: s.y + dy };
      if (s.type === "circle") return { ...s, cx: s.cx + dx, cy: s.cy + dy };
      return { ...s, x1: s.x1 + dx, y1: s.y1 + dy, x2: s.x2 + dx, y2: s.y2 + dy };
    }));
  }

  function measurementText(s: Shape): string {
    if (s.type === "rect") return `w=${Math.abs(s.w).toFixed(0)} h=${Math.abs(s.h).toFixed(0)} area=${rectArea(s).toFixed(0)} perim=${rectPerimeter(s).toFixed(0)}`;
    if (s.type === "circle") return `r=${s.r.toFixed(0)} area=${circleArea(s).toFixed(0)} circ=${circleCircumference(s).toFixed(0)}`;
    return `len=${lineLength(s).toFixed(0)}`;
  }

  return (
    <div className="workspace">
      <div className="workspace-sidebar stack">
        <h3 className="h2">Tools</h3>
        <div className="stack">
          <button className="btn" onClick={() => setTool("select")} disabled={tool === "select"}>Select</button>
          <button className="btn" onClick={() => setTool("rect")} disabled={tool === "rect"}>Rectangle</button>
          <button className="btn" onClick={() => setTool("circle")} disabled={tool === "circle"}>Circle</button>
          <button className="btn" onClick={() => setTool("line")} disabled={tool === "line"}>Line</button>
        </div>
        <h3 className="h2">Project</h3>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <p className="muted">ID: {id}</p>
        <a className="nav-link" href="/projects" suppressHydrationWarning>Back to Projects</a>
      </div>
      <svg className="workspace-canvas" onMouseDown={tool === "select" ? undefined : onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        {shapes.map((s) => {
          if (s.type === "rect") {
            const x = Math.min(s.x, s.x + s.w);
            const y = Math.min(s.y, s.y + s.h);
            const w = Math.abs(s.w);
            const h = Math.abs(s.h);
            return (
              <g key={s.id} onMouseDown={(e) => { if (tool === "select") { e.stopPropagation(); onSelect(s.id); setDragging({ id: s.id, kind: "move" }); startRef.current = { x: (e.nativeEvent as MouseEvent).clientX, y: (e.nativeEvent as MouseEvent).clientY }; } }}>
                <rect x={x} y={y} width={w} height={h} fill="#4f46e5" opacity={0.2} stroke="#4f46e5" />
                {selectedId === s.id && (
                  <g>
                    <circle cx={x + w} cy={y + h} r={5} fill="#4f46e5" />
                  </g>
                )}
              </g>
            );
          } else if (s.type === "circle") {
            return (
              <g key={s.id} onMouseDown={(e) => { if (tool === "select") { e.stopPropagation(); onSelect(s.id); setDragging({ id: s.id, kind: "move" }); startRef.current = { x: (e.nativeEvent as MouseEvent).clientX, y: (e.nativeEvent as MouseEvent).clientY }; } }}>
                <circle cx={s.cx} cy={s.cy} r={s.r} fill="#16a34a" opacity={0.2} stroke="#16a34a" />
              </g>
            );
          } else {
            return (
              <g key={s.id} onMouseDown={(e) => { if (tool === "select") { e.stopPropagation(); onSelect(s.id); setDragging({ id: s.id, kind: "move" }); startRef.current = { x: (e.nativeEvent as MouseEvent).clientX, y: (e.nativeEvent as MouseEvent).clientY }; } }}>
                <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#dc2626" strokeWidth={2} />
              </g>
            );
          }
        })}
      </svg>
      <div className="workspace-right">
        <h3 className="h2">Selection</h3>
        {selected ? (
          <div className="stack">
            <div>Type: {selected.type}</div>
            <div className="muted">{measurementText(selected)}</div>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => onMoveSelected(1, 0)}>→</button>
              <button className="btn" onClick={() => onMoveSelected(-1, 0)}>←</button>
              <button className="btn" onClick={() => onMoveSelected(0, -1)}>↑</button>
              <button className="btn" onClick={() => onMoveSelected(0, 1)}>↓</button>
            </div>
          </div>
        ) : (
          <p className="muted">No selection</p>
        )}
      </div>
    </div>
  );
}
