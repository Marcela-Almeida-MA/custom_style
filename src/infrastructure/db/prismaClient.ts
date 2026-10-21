import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Em desenvolvimento, o Next.js recarrega módulos a cada mudança (HMR), o
 * que criaria uma nova instância do PrismaClient a cada reload. Guardamos a
 * instância em `global` para reaproveitar a mesma conexão.
 */
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
