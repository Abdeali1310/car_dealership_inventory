import { purchaseVehicle, restockVehicle } from "../../src/modules/inventory/inventory.service";
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

describe("inventory.service.ts - restockVehicle", () => {
  let vehicleId: string;

  beforeEach(async () => {
    // Seed a vehicle with quantity 5
    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Honda",
        model: "Civic",
        category: "SEDAN",
        price: 22000.00,
        quantity: 5,
      },
    });
    vehicleId = vehicle.id;
  });

  it("should increase quantity by the given amount", async () => {
    const result = await restockVehicle(vehicleId, 3);

    expect(result).toBeDefined();
    expect(result.quantity).toBe(8);

    // Verify in db
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    expect(dbVehicle?.quantity).toBe(8);
  });

  it("should create an InventoryTransaction row with type RESTOCK and a positive quantityChange", async () => {
    await restockVehicle(vehicleId, 3);

    const transaction = await prisma.inventoryTransaction.findFirst({
      where: { vehicleId, type: "RESTOCK" },
    });

    expect(transaction).toBeDefined();
    expect(transaction?.type).toBe("RESTOCK");
    expect(transaction?.quantityChange).toBe(3);
    expect(transaction?.userId).toBeNull(); // Restocking doesn't require customer userId link
  });

  it("should throw a 400 ApiError if amount is 0 or negative", async () => {
    await expect(
      restockVehicle(vehicleId, 0)
    ).rejects.toThrow(ApiError);

    await expect(
      restockVehicle(vehicleId, -5)
    ).rejects.toThrow(ApiError);

    try {
      await restockVehicle(vehicleId, -5);
      fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Restock amount must be a positive integer");
    }
  });

  it("should throw a 404 ApiError if the vehicle doesn't exist", async () => {
    await expect(
      restockVehicle("non-existent-id", 3)
    ).rejects.toThrow(ApiError);

    try {
      await restockVehicle("non-existent-id", 3);
      fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Vehicle not found");
    }
  });
});
