import { registerUser } from "../../src/modules/auth/auth.service";
import prisma from "../../src/lib/prisma";

describe("auth.service.ts - registerUser", () => {
  it("should create a user with role CUSTOMER", async () => {
    const user = await registerUser("test@example.com", "password123", "Test User");
    expect(user).toBeDefined();
    expect(user.role).toBe("CUSTOMER");

    // Double check database record
    const dbUser = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });
    expect(dbUser).toBeDefined();
    expect(dbUser?.role).toBe("CUSTOMER");
  });

  it("should hash the password", async () => {
    const user = await registerUser("hash@example.com", "securePassword", "Hash User");
    expect(user.password).not.toBe("securePassword");

    const dbUser = await prisma.user.findUnique({
      where: { email: "hash@example.com" },
    });
    expect(dbUser?.password).not.toBe("securePassword");
  });

  it("should throw an error if the email is already registered", async () => {
    await registerUser("dup@example.com", "pass1", "Dup User");

    await expect(
      registerUser("dup@example.com", "pass2", "Another User")
    ).rejects.toThrow("Email already registered");
  });
});
