import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/hash";
import { signJwt } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signJwt({ sub: user.id, email: user.email });
  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
