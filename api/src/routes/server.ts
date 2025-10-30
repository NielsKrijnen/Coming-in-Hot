import { Hono } from "hono";
import prisma from "$lib/services/db";
import { createServer, deleteServer, getServer } from "$lib/server";

const router = new Hono()

router.get("/", async c => {
  const result = await prisma.server.findMany()

  return c.json(result)
})

router.get("/:id", async c => {
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

router.post("/", async c => {
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

router.delete("/:id", async c => {
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

export default router