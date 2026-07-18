import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Attach decoded payload to req.user (typed via src/types/index.d.ts)
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
