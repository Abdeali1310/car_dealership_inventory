import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export function signToken(payload: { id: string; sub: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
