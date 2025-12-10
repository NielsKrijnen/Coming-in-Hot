import { PrismaLibSql } from "@prisma/adapter-libsql"
import type { Handle } from "@sveltejs/kit"
import { env as ENV } from "$env/dynamic/private"
import { PrismaClient } from "../generated/prisma/client"

export const handle: Handle = async ({ resolve, event }) => {
  const adapter = new PrismaLibSql({
    url: ENV.DATABASE_URL
  })

  event.locals.prisma = new PrismaClient({ adapter })

  return resolve(event)
}
