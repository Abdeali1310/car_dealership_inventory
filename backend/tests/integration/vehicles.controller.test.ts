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
