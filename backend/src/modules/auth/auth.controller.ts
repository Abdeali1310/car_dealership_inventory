import { Request, Response, NextFunction } from "express";
import { registerUser } from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, fullName } = req.body;
    
    const user = await registerUser(email, password, fullName);
    
    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    if (error.message === "Email already registered") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}
