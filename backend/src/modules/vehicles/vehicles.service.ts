import { VehicleCategory } from "@prisma/client";
import prisma from "../../lib/prisma";

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
  throw new Error("Not implemented");
}
