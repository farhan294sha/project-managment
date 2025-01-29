import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

async function checkDatabaseConnection() {
    try {
      await db.$queryRaw`SELECT 1`;
      console.log("Database connection established successfully.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1); 
    }
  }
  
  checkDatabaseConnection().catch((error) => {
    console.error("Error during database health check:", error);
    process.exit(1);
  });