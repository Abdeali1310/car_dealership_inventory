import { PrismaClient } from "@prisma/client";

// Export a single shared instance of PrismaClient
const prisma = new PrismaClient();

export default prisma;
