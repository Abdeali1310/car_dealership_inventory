import { z } from "zod";
import { VehicleCategory } from "@prisma/client";

export const CreateVehicleDto = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  category: z.nativeEnum(VehicleCategory),
  price: z.number().positive("Price must be a positive number"),
  quantity: z.number().int().nonnegative("Quantity must be a non-negative integer"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type CreateVehicleInput = z.infer<typeof CreateVehicleDto>;

// For updates, all fields are optional but must pass original validation if provided.
export const UpdateVehicleDto = CreateVehicleDto.partial();
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDto>;
