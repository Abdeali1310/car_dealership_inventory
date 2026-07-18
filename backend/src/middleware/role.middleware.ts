import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRole: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      if (req.user.role !== allowedRole) {
        res.status(403).json({
          success: false,
          message: "Forbidden: Access denied",
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
