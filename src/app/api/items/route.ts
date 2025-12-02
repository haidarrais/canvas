import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { itemCreateSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token && verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.item.findMany({
    where: { userId: payload.sub },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token && verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = itemCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const item = await prisma.item.create({ data: { title: parsed.data.title, description: parsed.data.description ?? null, userId: payload.sub } });
  return NextResponse.json({ item }, { status: 201 });
}
