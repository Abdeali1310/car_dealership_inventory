import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/lib/prisma";

describe("POST /api/auth/register", () => {
  it("should register a new user successfully and return 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "integration_test@example.com",
        password: "password123",
        fullName: "Integration Test User",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe("integration_test@example.com");
    expect(res.body.data.fullName).toBe("Integration Test User");
    expect(res.body.data.role).toBe("CUSTOMER");
    expect(res.body.data.password).toBeUndefined(); // Should not return password!

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { email: "integration_test@example.com" },
    });
    expect(dbUser).toBeDefined();
    expect(dbUser?.fullName).toBe("Integration Test User");
  });

  it("should return 400 if validation fails (invalid email)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "invalid-email",
        password: "password123",
        fullName: "Test User",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        field: "email",
        message: "Invalid email address",
      })
    );
  });

  it("should return 400 if validation fails (short password)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "short@example.com",
        password: "123",
        fullName: "Test User",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
    expect(res.body.errors).toContainEqual(
      expect.objectContaining({
        field: "password",
        message: "Password must be at least 6 characters",
      })
    );
  });

  it("should return 400 if email is already registered", async () => {
    // Register first user
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "duplicate@example.com",
        password: "password123",
        fullName: "Duplicate User",
      });

    // Try to register again
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "duplicate@example.com",
        password: "password456",
        fullName: "Another User",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Email already registered");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    // Register a user for login testing
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "login_integration@example.com",
        password: "correctPassword123",
        fullName: "Login Integration User",
      });
  });

  it("should login successfully and return 200 with token and user object", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login_integration@example.com",
        password: "correctPassword123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe("login_integration@example.com");
    expect(res.body.data.user.password).toBeUndefined(); // Should not leak password
  });

  it("should return 401 if password is wrong", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login_integration@example.com",
        password: "wrongPassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return 401 if email does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent_integration@example.com",
        password: "anyPassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
