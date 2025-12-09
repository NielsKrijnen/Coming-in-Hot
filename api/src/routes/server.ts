import { zValidator } from "@hono/zod-validator"
import type { ContainerInspectInfo } from "dockerode"
import { Hono } from "hono"
import { Rcon } from "rcon-client"
import { z } from "zod"
import {
  createServer,
  deleteServer,
  getServer,
  getServerStats,
  type ServerStats
} from "$lib/server"
import prisma from "$lib/services/db"
import type { Server } from "../../generated/prisma/client"

const router = new Hono()
  .get("/", async c => {
    const result: Server[] = await prisma.server.findMany()

    return c.json(result, 200)
  })

  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number()
      })
    ),
    async c => {
      const { id } = c.req.valid("param")

      const server = await prisma.server.findUnique({
        where: { id }
      })

      if (!server) return c.text("Not Found", 404)

      const data: Server & { container: ContainerInspectInfo } = {
        ...server,
        container: await getServer(server.containerId)
      }

      return c.json(data, 200)
    }
  )

  .get(
    "/:id/stats",
    zValidator("param", z.object({ id: z.coerce.number() })),
    async c => {
      const { id } = c.req.valid("param")

      const server = await prisma.server.findUnique({
        where: { id }
      })

      if (!server) return c.text("Not Found", 404)

      const stats: ServerStats = await getServerStats(server.containerId)

      return c.json<ServerStats>(stats, 200)
    }
  )

  .post("/", async c => {
    const date = Date.now()

    const container = await createServer({
      name: date.toString(),
      port: 25565
    })

    const server: Server = await prisma.server.create({
      data: {
        containerId: container.id,
        name: date.toString(),
        port: 25565,
        rconPort: 25575,
        rconPassword: "password"
      }
    })

    return c.json(server, 200)
  })

  .delete("/:id", async c => {
    const { id } = c.req.param()

    const server = await prisma.server.findUnique({
      where: { id: Number(id) }
    })

    if (!server) return c.text("Not Found", 404)

    await deleteServer(server.containerId)

    await prisma.server.delete({
      where: { id: server.id }
    })

    return c.json({ success: true }, 200)
  })

  .post(
    "/:id/rcon",
    zValidator(
      "form",
      z.object({
        command: z.string()
      })
    ),
    async c => {
      const { id } = c.req.param()
      const { command } = c.req.valid("form")

      const server = await prisma.server.findUnique({
        where: { id: Number(id) }
      })

      if (!server) return c.text("Not Found", 404)

      const container = await getServer(server.containerId)
      if (!container) return c.text("Not Found", 404)

      const rcon = await Rcon.connect({
        host: container.Name.slice(1),
        port: server.rconPort,
        password: server.rconPassword
      })

      const result = await rcon.send(command)

      await rcon.end()

      return c.json({ result }, 200)
    }
  )

export default router
