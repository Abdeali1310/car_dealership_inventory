import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

export async function registerUser(email: string, password: string, fullName: string): Promise<any> {
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
