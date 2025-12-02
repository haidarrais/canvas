import { describe, it, expect } from "vitest";
import { rectArea, rectPerimeter, circleArea, circleCircumference, lineLength } from "./geometry";

describe("geometry", () => {
  it("rectangle area and perimeter", () => {
    const r = { id: "r", type: "rect" as const, x: 0, y: 0, w: 100, h: 50 };
    expect(rectArea(r)).toBe(5000);
    expect(rectPerimeter(r)).toBe(300);
  });
  it("circle area and circumference", () => {
    const c = { id: "c", type: "circle" as const, cx: 0, cy: 0, r: 10 };
    expect(Math.round(circleArea(c))).toBe(Math.round(Math.PI * 100));
    expect(Math.round(circleCircumference(c))).toBe(Math.round(2 * Math.PI * 10));
  });
  it("line length", () => {
    const l = { id: "l", type: "line" as const, x1: 0, y1: 0, x2: 3, y2: 4 };
    expect(lineLength(l)).toBe(5);
  });
});

