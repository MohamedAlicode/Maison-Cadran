// Client Prisma unique pour toute l'application.
// En développement, le rechargement à chaud recréerait un client (et un pool de connexions)
// à chaque modification : on le conserve donc sur l'objet global.
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/env";

const globalPourPrisma = globalThis as unknown as { prisma?: PrismaClient };

function creerClient() {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = globalPourPrisma.prisma ?? creerClient();

if (process.env.NODE_ENV !== "production") {
  globalPourPrisma.prisma = db;
}
