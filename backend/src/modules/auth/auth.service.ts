import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

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
  throw new Error("Not implemented");
}
