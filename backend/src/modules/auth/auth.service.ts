import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";
import { signToken } from "../../lib/jwt";

export async function registerUser(email: string, password: string, fullName: string): Promise<any> {
  // Check if email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash the password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user in the database
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      role: "CUSTOMER",
    },
  });

  return user;
}

export async function loginUser(email: string, password: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token using the helper function, providing both sub and id
  const token = signToken({
    sub: user.id,
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Exclude password from the returned user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
}

export async function getUserById(id: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}
