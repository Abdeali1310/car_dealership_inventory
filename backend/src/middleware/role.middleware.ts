import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRole: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    throw new Error("Not implemented");
  };
}
