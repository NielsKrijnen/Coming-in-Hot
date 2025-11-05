import { error, type Handle, type HandleServerError } from "@sveltejs/kit"
import { hc } from "hono/client"
import type { API } from "$api"
import { env } from "$env/dynamic/private"

export const handle: Handle = async ({ resolve, event }) => {
  if (!env.API_URL) error(500, "API_URL is not defined")

  event.locals.hc = hc<API>(env.API_URL, {
    fetch: event.fetch
  })

  return resolve(event)
}

export const handleError: HandleServerError = async context => {
  console.log(context)
}
