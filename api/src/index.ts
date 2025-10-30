import { Hono } from "hono";
import server from "./routes/server"
import docker from "$lib/services/docker";

const containerId = (await Bun.file("/etc/hostname").text()).trim()

const container = docker.getContainer(containerId)
const info = await container.inspect()

const networks = Object.keys(info.NetworkSettings.Networks)
export const network = networks.find(n => n.includes('coming-in-hot')) ?? networks[0]!

const app = new Hono()
  .route("/server", server)

Bun.serve({
  port: 3000,
  fetch: app.fetch
})