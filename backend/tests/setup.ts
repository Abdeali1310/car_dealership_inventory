// Set environment variables for tests before importing Prisma
process.env.DATABASE_URL = "postgresql://postgres:abdeali@localhost:5432/car_dealership_test";
process.env.JWT_SECRET = "test_jwt_secret";

import prisma from "../src/lib/prisma";

beforeEach(async () => {
  // Clean up all tables to ensure test isolation
  await prisma.inventoryTransaction.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Disconnect prisma client when all tests are done
  await prisma.$disconnect();
});
