import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { itemUpdateSchema } from "@/lib/schemas";
export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("token")?.value;
  const payload = token && verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = itemUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const p = await params;
  const id = Number(p.id);
  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing || existing.userId !== payload.sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.item.update({
    where: { id },
    data: { title: parsed.data.title ?? existing.title, description: parsed.data.description ?? existing.description },
  });
  return NextResponse.json({ item: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("token")?.value;
  const payload = token && verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const p = await params;
  const id = Number(p.id);
  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing || existing.userId !== payload.sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
