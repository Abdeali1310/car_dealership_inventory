import { createVehicle, getAllVehicles } from "../../src/modules/vehicles/vehicles.service";
import prisma from "../../src/lib/prisma";

describe("vehicles.service.ts - createVehicle", () => {
  it("should create a vehicle and return it with all the fields", async () => {
    const vehicleData = {
      make: "Toyota",
      model: "Camry",
      category: "SEDAN" as const,
      price: 25000.00,
      quantity: 5,
      description: "A reliable sedan",
      imageUrl: "http://example.com/camry.jpg",
    };

    const vehicle = await createVehicle(vehicleData);

    expect(vehicle).toBeDefined();
    expect(vehicle.id).toBeDefined();
    expect(vehicle.make).toBe("Toyota");
    expect(vehicle.model).toBe("Camry");
    expect(vehicle.category).toBe("SEDAN");
    expect(Number(vehicle.price)).toBe(25000.00);
    expect(vehicle.quantity).toBe(5);
    expect(vehicle.description).toBe("A reliable sedan");
    expect(vehicle.imageUrl).toBe("http://example.com/camry.jpg");

    // Double check database record
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
    });
    expect(dbVehicle).toBeDefined();
    expect(dbVehicle?.make).toBe("Toyota");
  });
});

describe("vehicles.service.ts - getAllVehicles", () => {
  it("should return an array of all vehicles in the database", async () => {
    // Seed some vehicles
    await createVehicle({
      make: "Honda",
      model: "Civic",
      category: "SEDAN" as const,
      price: 22000.00,
      quantity: 10,
    });

    await createVehicle({
      make: "Ford",
      model: "F-150",
      category: "TRUCK" as const,
      price: 35000.00,
      quantity: 2,
    });

    const vehicles = await getAllVehicles();

    expect(vehicles).toBeDefined();
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBe(2);

    const makes = vehicles.map(v => v.make);
    expect(makes).toContain("Honda");
    expect(makes).toContain("Ford");
  });
});
