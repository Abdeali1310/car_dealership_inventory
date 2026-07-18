import { VehicleCategory } from "@prisma/client";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

interface CreateVehicleInput {
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

export interface SearchFilters {
  make?: string;
  model?: string;
  category?: VehicleCategory;
  minPrice?: number;
  maxPrice?: number;
}

export async function createVehicle(data: CreateVehicleInput): Promise<any> {
  const vehicle = await prisma.vehicle.create({
    data: {
      make: data.make,
      model: data.model,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  });
  return vehicle;
}

export async function getAllVehicles(): Promise<any[]> {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return vehicles;
}

export async function searchVehicles(filters: SearchFilters): Promise<any[]> {
  const where: any = {};

  if (filters.make) {
    where.make = {
      contains: filters.make,
      mode: "insensitive",
    };
  }

  if (filters.model) {
    where.model = {
      contains: filters.model,
      mode: "insensitive",
    };
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  return vehicles;
}

export async function updateVehicle(id: string, data: Partial<CreateVehicleInput>): Promise<any> {
  // Check first with findUnique to explicitly throw a clear 404 ApiError if the record doesn't exist.
  // This is clearer and safer than handling Prisma's generic error codes directly.
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!existingVehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  const updatedVehicle = await prisma.vehicle.update({
    where: { id },
    data,
  });

  return updatedVehicle;
}
