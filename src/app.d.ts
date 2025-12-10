import type { PrismaClient } from "../generated/prisma/client"

declare global {
  namespace App {
    interface Locals {
      prisma: PrismaClient
    }
  }
}
