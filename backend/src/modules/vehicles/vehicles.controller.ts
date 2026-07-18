import { Request, Response, NextFunction } from "express";
import { createVehicle } from "./vehicles.service";

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const vehicle = await createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
}
