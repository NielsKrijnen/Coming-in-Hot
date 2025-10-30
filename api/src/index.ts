import { Hono } from "hono";
import server from "./routes/server"

const app = new Hono()
  .route("/server", server)

Bun.serve({
  port: 3000,
  fetch: app.fetch
})