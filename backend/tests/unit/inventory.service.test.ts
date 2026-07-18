import { purchaseVehicle } from "../../src/modules/inventory/inventory.service";
import prisma from "../../src/lib/prisma";
import { ApiError } from "../../src/utils/ApiError";

describe("inventory.service.ts - purchaseVehicle", () => {
  let userId: string;
  let vehicleId: string;

  beforeEach(async () => {
    // Seed a customer user
    const user = await prisma.user.create({
      data: {
        email: `buyer_${Date.now()}_${Math.random()}@example.com`,
        password: "password123",
        fullName: "Test Buyer",
        role: "CUSTOMER",
      },
    });
    userId = user.id;

    // Seed a vehicle with quantity 5
    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "Camry",
        category: "SEDAN",
        price: 25000.00,
        quantity: 5,
      },
    });
    vehicleId = vehicle.id;
  });

  it("should decrease the vehicle's quantity by 1", async () => {
    const result = await purchaseVehicle(vehicleId, userId);

    expect(result).toBeDefined();
    expect(result.quantity).toBe(4);

    // Verify in db
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    expect(dbVehicle?.quantity).toBe(4);
  });

  it("should create an InventoryTransaction row with type PURCHASE and quantityChange -1", async () => {
    await purchaseVehicle(vehicleId, userId);

    const transaction = await prisma.inventoryTransaction.findFirst({
      where: { vehicleId },
    });

    expect(transaction).toBeDefined();
    expect(transaction?.type).toBe("PURCHASE");
    expect(transaction?.quantityChange).toBe(-1);
    expect(transaction?.userId).toBe(userId);
  });

  it("should throw a 400 ApiError if vehicle quantity is already 0", async () => {
    // Set vehicle quantity to 0
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { quantity: 0 },
    });

    await expect(
      purchaseVehicle(vehicleId, userId)
    ).rejects.toThrow(ApiError);

    try {
      await purchaseVehicle(vehicleId, userId);
      fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Vehicle is out of stock");
    }
  });

  it("should throw a 404 ApiError if the vehicle doesn't exist", async () => {
    await expect(
      purchaseVehicle("non-existent-id", userId)
    ).rejects.toThrow(ApiError);

    try {
      await purchaseVehicle("non-existent-id", userId);
      fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Vehicle not found");
    }
  });
});
