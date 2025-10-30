import { Hono } from "hono"
import { Rcon } from "rcon-client"
import { createServer, deleteServer, getServer } from "$lib/server"
import prisma from "$lib/services/db"

const router = new Hono()
  .get("/", async c => {
    const result = await prisma.server.findMany()

    return c.json(result, 200)
  })

  .get("/:id", async c => {
    const { id } = c.req.param()

    const server = await prisma.server.findUnique({
      where: { id: Number(id) }
    })

    if (!server) return c.notFound()

    return c.json({
      ...server,
      container: await getServer(server.containerId)
    })
  })

  .post("/", async c => {
    const date = Date.now()

    const container = await createServer({
      name: date.toString(),
      port: 25565
    })

    const server = await prisma.server.create({
      data: {
        containerId: container.id,
        name: date.toString(),
        port: 25565,
        rconPort: 25575,
        rconPassword: "password"
      }
    })

    return c.json(server)
  })

  .delete("/:id", async c => {
    const { id } = c.req.param()

    const server = await prisma.server.findUnique({
      where: { id: Number(id) }
    })

    if (!server) return c.notFound()

    await deleteServer(server.containerId)

    await prisma.server.delete({
      where: { id: server.id }
    })

    return c.json({ success: true })
  })

  .post("/:id/rcon", async c => {
    const { id } = c.req.param()
    const { command } = await c.req.json()

    const server = await prisma.server.findUnique({
      where: { id: Number(id) }
    })

    if (!server) return c.notFound()

    const container = await getServer(server.containerId)
    if (!container) return c.notFound()

    const rcon = await Rcon.connect({
      host: container.Name.slice(1),
      port: server.rconPort,
      password: server.rconPassword
    })

    const result = await rcon.send(command)

    await rcon.end()

    return c.json({ result })
  })

export default router
