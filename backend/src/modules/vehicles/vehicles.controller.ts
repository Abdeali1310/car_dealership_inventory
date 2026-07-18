import { Request, Response, NextFunction } from "express";
import { createVehicle, getAllVehicles } from "./vehicles.service";

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

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const vehicles = await getAllVehicles();

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
}
