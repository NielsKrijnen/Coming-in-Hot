import type { hc } from "hono/client"
import type { API } from "$api"

declare global {
  namespace App {
    interface Locals {
      hc: ReturnType<typeof hc<API>>
    }
  }
}
