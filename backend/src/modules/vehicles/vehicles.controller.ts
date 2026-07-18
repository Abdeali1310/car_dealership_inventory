import { Request, Response, NextFunction } from "express";
import { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle } from "./vehicles.service";
import { VehicleCategory } from "@prisma/client";

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

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const filters: any = {};

    if (typeof make === "string" && make) {
      filters.make = make;
    }
    if (typeof model === "string" && model) {
      filters.model = model;
    }
    if (typeof category === "string" && category) {
      filters.category = category as VehicleCategory;
    }
    if (typeof minPrice === "string" && minPrice) {
      filters.minPrice = Number(minPrice);
    }
    if (typeof maxPrice === "string" && maxPrice) {
      filters.maxPrice = Number(maxPrice);
    }

    const vehicles = await searchVehicles(filters);

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const vehicle = await updateVehicle(id as string, req.body);

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await deleteVehicle(id as string);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
