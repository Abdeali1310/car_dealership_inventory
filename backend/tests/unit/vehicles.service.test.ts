import { createVehicle, getAllVehicles, searchVehicles } from "../../src/modules/vehicles/vehicles.service";
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

describe("vehicles.service.ts - searchVehicles", () => {
  beforeEach(async () => {
    // Seed test vehicles
    await createVehicle({
      make: "Tesla",
      model: "Model 3",
      category: "SEDAN" as const,
      price: 45000.00,
      quantity: 3,
    });

    await createVehicle({
      make: "Toyota",
      model: "RAV4",
      category: "SUV" as const,
      price: 32000.00,
      quantity: 4,
    });

    await createVehicle({
      make: "Ford",
      model: "F-150 Raptor",
      category: "TRUCK" as const,
      price: 75000.00,
      quantity: 1,
    });
  });

  it("should filter by make (case-insensitive partial match)", async () => {
    const results = await searchVehicles({ make: "tes" });
    expect(results.length).toBe(1);
    expect(results[0].make).toBe("Tesla");
  });

  it("should filter by model (case-insensitive partial match)", async () => {
    const results = await searchVehicles({ model: "rav" });
    expect(results.length).toBe(1);
    expect(results[0].model).toBe("RAV4");
  });

  it("should filter by category (exact enum match)", async () => {
    const results = await searchVehicles({ category: "SUV" });
    expect(results.length).toBe(1);
    expect(results[0].category).toBe("SUV");
  });

  it("should filter by price range (minPrice/maxPrice)", async () => {
    const results = await searchVehicles({ minPrice: 30000, maxPrice: 50000 });
    expect(results.length).toBe(2);
    const makes = results.map(r => r.make);
    expect(makes).toContain("Tesla");
    expect(makes).toContain("Toyota");
  });

  it("should combine multiple filters", async () => {
    const results = await searchVehicles({ make: "Ford", category: "TRUCK" });
    expect(results.length).toBe(1);
    expect(results[0].model).toBe("F-150 Raptor");
  });

  it("should return all vehicles if no filters are provided", async () => {
    const results = await searchVehicles({});
    expect(results.length).toBe(3);
  });
});
