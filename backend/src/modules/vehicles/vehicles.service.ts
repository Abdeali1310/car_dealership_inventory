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
