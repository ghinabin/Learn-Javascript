import { PrismaClient } from "@prisma/client";

// Lazy singleton — client is only created on first access, not at import time.
// This prevents build-time crashes when DATABASE_URL isn't set yet.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getDb() as never)[prop];
  },
});
