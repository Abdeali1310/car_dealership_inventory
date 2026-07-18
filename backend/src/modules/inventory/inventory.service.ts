import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export async function purchaseVehicle(vehicleId: string, userId: string): Promise<any> {
  // Wrapped in a transaction so we never end up decrementing stock without a matching log entry, or vice versa
  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.quantity <= 0) {
      throw new ApiError(400, "Vehicle is out of stock");
    }

    // Decrement quantity by 1
    const updatedVehicle = await tx.vehicle.update({
      where: { id: vehicleId },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });

    // Create log entry
    await tx.inventoryTransaction.create({
      data: {
        vehicleId,
        userId,
        type: "PURCHASE",
        quantityChange: -1,
      },
    });

    return updatedVehicle;
  });
}

export async function restockVehicle(vehicleId: string, amount: number): Promise<any> {
  throw new Error("Not implemented");
}
