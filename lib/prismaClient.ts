import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client";
import ws from "ws";

if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ?? (globalThis.prisma = new PrismaClient({ adapter }));

export default prisma;
