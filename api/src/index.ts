import { Hono } from "hono"
import { logger } from "hono/logger"
import docker from "$lib/services/docker"
import server from "./routes/server"

const containerId = (await Bun.file("/etc/hostname").text()).trim()

const container = docker.getContainer(containerId)
const info = await container.inspect()

const networks = Object.keys(info.NetworkSettings.Networks)

const preferred = networks.find(n => n.includes("coming-in-hot")) ?? networks[0]
if (!preferred) throw new Error("Could not find any preferred network")

export const network = preferred

const app = new Hono().use(logger()).route("/server", server)

export type API = typeof app

Bun.serve({
  port: 3000,
  fetch: app.fetch
})

console.log("Server running on port 3000")
