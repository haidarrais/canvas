import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const payload = verifyJwt(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, name: true } });
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}

