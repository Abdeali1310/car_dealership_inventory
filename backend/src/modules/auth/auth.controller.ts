import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getUserById } from "./auth.service";

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

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    
    const result = await loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Support both sub and id
    const userId = req.user.sub || req.user.id;
    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
}
