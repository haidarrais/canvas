import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await prisma.$connect();
    const p = await params;
    const id = Number(p.id);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Database error", detail }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    await prisma.$connect();
    const p = await params;
    const id = Number(p.id);
    const json = await req.json().catch(() => null);
    if (!json || typeof json !== "object" || typeof json.title !== "string" || typeof json.data !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const updated = await prisma.project.update({ where: { id }, data: { title: json.title, data: json.data } });
    return NextResponse.json({ project: updated });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Database error", detail }, { status: 500 });
  }
}
