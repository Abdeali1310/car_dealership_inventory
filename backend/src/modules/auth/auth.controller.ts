import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getUserById } from "./auth.service";
import { ApiError } from "../../utils/ApiError";

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
  } catch (error) {
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
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    // Support both sub and id
    const userId = req.user.sub || req.user.id;
    const user = await getUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
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
