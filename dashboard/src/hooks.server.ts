import type { Handle } from "@sveltejs/kit"
import { hc } from "hono/client"
import type { API } from "$api"
import { env } from "$env/dynamic/private"

export const handle: Handle = async ({ resolve, event }) => {
  if (!env.API_URL)
    return new Response("API_URL is not defined", { status: 500 })

  event.locals.hc = hc<API>(env.API_URL, {
    fetch: event.fetch
  })

  return resolve(event)
}
