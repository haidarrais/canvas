export type Point = { x: number; y: number };
export type Rect = { id: string; type: "rect"; x: number; y: number; w: number; h: number };
export type Circle = { id: string; type: "circle"; cx: number; cy: number; r: number };
export type Line = { id: string; type: "line"; x1: number; y1: number; x2: number; y2: number };
export type Shape = Rect | Circle | Line;

export function rectArea(r: Rect): number {
  return Math.abs(r.w * r.h);
}

export function rectPerimeter(r: Rect): number {
  return Math.abs(2 * (r.w + r.h));
}

export function circleArea(c: Circle): number {
  return Math.PI * c.r * c.r;
}

export function circleCircumference(c: Circle): number {
  return 2 * Math.PI * c.r;
}

export function lineLength(l: Line): number {
  const dx = l.x2 - l.x1;
  const dy = l.y2 - l.y1;
  return Math.hypot(dx, dy);
}

export function snapAngle45(dx: number, dy: number): { dx: number; dy: number } {
  const angle = Math.atan2(dy, dx);
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  const len = Math.hypot(dx, dy);
  return { dx: Math.cos(snapped) * len, dy: Math.sin(snapped) * len };
}

export function uid(): string {
  return Math.random().toString(36).slice(2);
}

