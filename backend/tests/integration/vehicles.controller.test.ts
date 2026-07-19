import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/lib/prisma";
import { signToken } from "../../src/lib/jwt";

describe("POST /api/vehicles", () => {
  let adminToken: string;
  let customerToken: string;

  beforeEach(() => {
    adminToken = signToken({
      id: "admin-id-123",
      sub: "admin-id-123",
      email: "admin_test@example.com",
      role: "ADMIN",
    });

    customerToken = signToken({
      id: "customer-id-123",
      sub: "customer-id-123",
      email: "customer_test@example.com",
      role: "CUSTOMER",
    });
  });

  it("should allow an ADMIN to create a vehicle successfully and return 201", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Tesla",
        model: "Model S",
        category: "SEDAN",
        price: 89990.00,
        quantity: 3,
        description: "Electric luxury sedan",
        imageUrl: "http://example.com/tesla.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.make).toBe("Tesla");
    expect(res.body.data.model).toBe("Model S");
    expect(res.body.data.category).toBe("SEDAN");
    expect(Number(res.body.data.price)).toBe(89990.00);
    expect(res.body.data.quantity).toBe(3);

    // Verify it exists in database
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: res.body.data.id },
    });
    expect(dbVehicle).toBeDefined();
    expect(dbVehicle?.make).toBe("Tesla");
  });

  it("should deny access with 403 Forbidden when user is a CUSTOMER", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        make: "Tesla",
        model: "Model S",
        category: "SEDAN",
        price: 89990.00,
        quantity: 3,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden: Access denied");
  });

  it("should deny access with 401 Unauthorized when no token is provided", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({
        make: "Tesla",
        model: "Model S",
        category: "SEDAN",
        price: 89990.00,
        quantity: 3,
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No token provided");
  });

  it("should return 400 Bad Request if validation fails (negative price)", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        make: "Tesla",
        model: "Model S",
        category: "SEDAN",
        price: -100.00,
        quantity: 3,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        field: "price",
      })
    );
  });
});

describe("GET /api/vehicles", () => {
  it("should return 200 OK and a list of all vehicles", async () => {
    // Seed a vehicle
    await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "Corolla",
        category: "SEDAN",
        price: 20000.00,
        quantity: 5,
      },
    });

    const res = await request(app).get("/api/vehicles");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].make).toBe("Toyota");
  });
});

describe("GET /api/vehicles/search", () => {
  let customerToken: string;

  beforeEach(async () => {
    customerToken = signToken({
      id: "customer-id-123",
      sub: "customer-id-123",
      email: "customer_test@example.com",
      role: "CUSTOMER",
    });

    // Seed some vehicles
    await prisma.vehicle.create({
      data: {
        make: "Honda",
        model: "Civic",
        category: "SEDAN",
        price: 22000.00,
        quantity: 10,
      },
    });

    await prisma.vehicle.create({
      data: {
        make: "Ford",
        model: "F-150",
        category: "TRUCK",
        price: 45000.00,
        quantity: 2,
      },
    });
  });

  it("should allow an authenticated CUSTOMER to search vehicles and return filtered results", async () => {
    const res = await request(app)
      .get("/api/vehicles/search")
      .set("Authorization", `Bearer ${customerToken}`)
      .query({ make: "honda" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].make).toBe("Honda");
  });

  it("should allow searching by price range minPrice/maxPrice", async () => {
    const res = await request(app)
      .get("/api/vehicles/search")
      .set("Authorization", `Bearer ${customerToken}`)
      .query({ minPrice: 30000, maxPrice: 50000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].make).toBe("Ford");
  });

  it("should allow searching by model and category", async () => {
    const res = await request(app)
      .get("/api/vehicles/search")
      .set("Authorization", `Bearer ${customerToken}`)
      .query({ model: "Civic", category: "SEDAN" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].make).toBe("Honda");
  });

  it("should deny access with 401 Unauthorized when no token is provided", async () => {
    const res = await request(app)
      .get("/api/vehicles/search")
      .query({ make: "honda" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No token provided");
  });
});

describe("PUT /api/vehicles/:id", () => {
  let adminToken: string;
  let customerToken: string;
  let vehicleId: string;

  beforeEach(async () => {
    adminToken = signToken({
      id: "admin-id-123",
      sub: "admin-id-123",
      email: "admin_test@example.com",
      role: "ADMIN",
    });

    customerToken = signToken({
      id: "customer-id-123",
      sub: "customer-id-123",
      email: "customer_test@example.com",
      role: "CUSTOMER",
    });

    // Seed a vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Subaru",
        model: "Outback",
        category: "SUV",
        price: 33000.00,
        quantity: 4,
      },
    });
    vehicleId = vehicle.id;
  });

  it("should allow an ADMIN to update a vehicle successfully and return 200", async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 35000.00,
        quantity: 5,
        description: "Updated Outback description",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(Number(res.body.data.price)).toBe(35000.00);
    expect(res.body.data.quantity).toBe(5);
    expect(res.body.data.description).toBe("Updated Outback description");
    expect(res.body.data.make).toBe("Subaru"); // Unchanged field
  });

  it("should deny access with 403 Forbidden when user is a CUSTOMER", async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        price: 35000.00,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden: Access denied");
  });

  it("should deny access with 401 Unauthorized when no token is provided", async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .send({
        price: 35000.00,
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No token provided");
  });

  it("should return 404 Not Found if the vehicle does not exist", async () => {
    const res = await request(app)
      .put("/api/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: 35000.00,
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Vehicle not found");
  });

  it("should return 400 Bad Request if validation fails (negative price)", async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: -50.00,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
  });
});

describe("DELETE /api/vehicles/:id", () => {
  let adminToken: string;
  let customerToken: string;
  let vehicleId: string;

  beforeEach(async () => {
    adminToken = signToken({
      id: "admin-id-123",
      sub: "admin-id-123",
      email: "admin_test@example.com",
      role: "ADMIN",
    });

    customerToken = signToken({
      id: "customer-id-123",
      sub: "customer-id-123",
      email: "customer_test@example.com",
      role: "CUSTOMER",
    });

    // Seed a vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Ford",
        model: "Mustang",
        category: "COUPE",
        price: 55000.00,
        quantity: 2,
      },
    });
    vehicleId = vehicle.id;
  });

  it("should allow an ADMIN to delete a vehicle successfully and return 200", async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Vehicle deleted successfully");

    // Verify it is gone from the database
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    expect(dbVehicle).toBeNull();
  });

  it("should deny access with 403 Forbidden when user is a CUSTOMER", async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden: Access denied");
  });

  it("should deny access with 401 Unauthorized when no token is provided", async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No token provided");
  });

  it("should return 404 Not Found if the vehicle to delete does not exist", async () => {
    const res = await request(app)
      .delete("/api/vehicles/non-existent-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Vehicle not found");
  });
});

describe("POST /api/vehicles/:id/purchase", () => {
  let customerToken: string;
  let customerId: string;
  let vehicleId: string;

  beforeEach(async () => {
    customerId = "customer-user-id-456";
    customerToken = signToken({
      id: customerId,
      sub: customerId,
      email: "buyer_integration@example.com",
      role: "CUSTOMER",
    });

    // Seed a customer user in db so referential integrity checks pass
    await prisma.user.create({
      data: {
        id: customerId,
        email: "buyer_integration@example.com",
        password: "password123",
        fullName: "Buyer Integration",
        role: "CUSTOMER",
      },
    });

    // Seed a vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Mazda",
        model: "CX-5",
        category: "SUV",
        price: 28000.00,
        quantity: 3,
      },
    });
    vehicleId = vehicle.id;
  });

  it("should allow any logged-in user to purchase a vehicle and return 200 with updated stock", async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Vehicle purchased successfully");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.quantity).toBe(2);

    // Verify in db
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    expect(dbVehicle?.quantity).toBe(2);
  });

  it("should return 400 Bad Request when vehicle is out of stock", async () => {
    // Set stock to 0
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { quantity: 0 },
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Vehicle is out of stock");
  });

  it("should return 401 Unauthorized when no token is provided", async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No token provided");
  });

  it("should return 404 Not Found if vehicle does not exist", async () => {
    const res = await request(app)
      .post("/api/vehicles/non-existent-id/purchase")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Vehicle not found");
  });
});

describe("POST /api/vehicles/:id/restock", () => {
  let adminToken: string;
  let customerToken: string;
  let vehicleId: string;

  beforeEach(async () => {
    adminToken = signToken({
      id: "admin-id-123",
      sub: "admin-id-123",
      email: "admin_test@example.com",
      role: "ADMIN",
    });

    customerToken = signToken({
      id: "customer-id-123",
      sub: "customer-id-123",
      email: "customer_test@example.com",
      role: "CUSTOMER",
    });

    // Seed a vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: "Toyota",
        model: "Highlander",
        category: "SUV",
        price: 40000.00,
        quantity: 5,
      },
    });
    vehicleId = vehicle.id;
  });

  it("should allow an ADMIN to restock a vehicle and return 200 with updated stock", async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Vehicle restocked successfully");
    expect(res.body.data.quantity).toBe(10);

    // Verify in db
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    expect(dbVehicle?.quantity).toBe(10);
  });

  it("should deny access with 403 Forbidden when user is a CUSTOMER", async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Forbidden: Access denied");
  });

  it("should deny access with 401 Unauthorized when no token is provided", async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .send({ amount: 5 });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No token provided");
  });

  it("should return 400 Bad Request when restock amount is 0, negative, or invalid", async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: -3 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
  });

  it("should return 404 Not Found if vehicle does not exist", async () => {
    const res = await request(app)
      .post("/api/vehicles/non-existent-id/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Vehicle not found");
  });
});

describe("POST /api/vehicles/upload", () => {
  let adminToken: string;
  let customerToken: string;

  beforeEach(() => {
    adminToken = signToken({
      id: "admin-id-123",
      sub: "admin-id-123",
      email: "admin_test@example.com",
      role: "ADMIN",
    });

    customerToken = signToken({
      id: "customer-id-123",
      sub: "customer-id-123",
      email: "customer_test@example.com",
      role: "CUSTOMER",
    });
  });

  it("should allow an ADMIN to upload an image successfully and return 200", async () => {
    const res = await request(app)
      .post("/api/vehicles/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("file", Buffer.from("dummy image content"), "test-car.png");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.url).toMatch(/^\/uploads\/\d+-\d+\.png$/);
  });

  it("should deny upload with 403 Forbidden when user is a CUSTOMER", async () => {
    const res = await request(app)
      .post("/api/vehicles/upload")
      .set("Authorization", `Bearer ${customerToken}`)
      .attach("file", Buffer.from("dummy image content"), "test-car.png");

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if no file is uploaded", async () => {
    const res = await request(app)
      .post("/api/vehicles/upload")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No file uploaded");
  });
});
