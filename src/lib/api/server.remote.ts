import { error } from "@sveltejs/kit"
import { z } from "zod"
import { command, getRequestEvent, query } from "$app/server"
import { createServer, deleteServer, getServer, getServerStats } from "$lib/server/docker";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  return locals.prisma.server.findMany()
})

export const get = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const server = await locals.prisma.server.findUnique({
    where: { id }
  })

  if (!server) error(404, "Server Not Found")

  return {
    ...server,
    container: await getServer(server.containerId)
  }
})

export const getStats = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const server = await locals.prisma.server.findUnique({
    where: { id }
  })

  if (!server) error(404, "Server Not Found")

  return await getServerStats(server.containerId)
})

export const create = command(async () => {
  const { locals } = getRequestEvent()

  const date = Date.now()

  const container = await createServer({
    name: date.toString(),
    port: 25565
  })

  const server = await locals.prisma.server.create({
    data: {
      containerId: container.id,
      name: date.toString(),
      port: 25565,
      rconPort: 25575,
      rconPassword: "password"
    }
  })

  await list().refresh()

  return server
})

export const remove = command(z.number(), async serverId => {
  const { locals } = getRequestEvent()

  const server = await locals.prisma.server.findUnique({
    where: { id: serverId }
  })

  if (!server) error(404, "Server Not Found")

  await deleteServer(server.containerId)

  await locals.prisma.server.delete({
    where: { id: server.id }
  })

  return { success: true }
})
