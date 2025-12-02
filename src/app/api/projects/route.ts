import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    await prisma.$connect();
    const projects = await prisma.project.findMany({ select: { id: true, title: true, updatedAt: true }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json({ projects });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Database error", detail }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await prisma.$connect();
    const body = await req.json().catch(() => null);
    const title = body?.title && typeof body.title === "string" ? body.title : "Untitled";
    const data = body?.data && typeof body.data === "object" ? body.data : { shapes: [] };
    const project = await prisma.project.create({ data: { title, data } });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Database error", detail }, { status: 500 });
  }
}
