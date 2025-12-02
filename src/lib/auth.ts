import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

export type JwtPayload = {
  sub: number;
  email: string;
};

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

