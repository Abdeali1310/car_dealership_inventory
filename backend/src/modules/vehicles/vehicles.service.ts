import { VehicleCategory } from "@prisma/client";

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
  throw new Error("Not implemented");
}
