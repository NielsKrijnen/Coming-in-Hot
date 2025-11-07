import { error } from "@sveltejs/kit"
import { z } from "zod"
import { command, getRequestEvent, query } from "$app/server"

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const response = await locals.hc.server.$get()
  if (response.ok) {
    return await response.json()
  } else {
    error(response.status, response.statusText)
  }
})

export const get = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const response = await locals.hc.server[":id"].$get({
    param: { id: id.toString() }
  })

  if (response.ok) {
    return await response.json()
  } else {
    error(response.status, response.statusText)
  }
})

export const sendCommand = command(
  z.object({
    serverId: z.number(),
    command: z.string()
  }),
  async data => {
    const { locals } = getRequestEvent()

    const response = await locals.hc.server[":id"].rcon.$post({
      param: { id: data.serverId.toString() },
      form: { command: data.command }
    })

    if (response.ok) {
      const json = await response.json()
      return json.result
    } else {
      error(response.status, response.statusText)
    }
  }
)

export const create = command(async () => {
  const { locals } = getRequestEvent()

  const response = await locals.hc.server.$post()

  if (response.ok) {
    await list().refresh()
    return await response.json()
  } else {
    error(response.status, response.statusText)
  }
})

export const remove = command(z.number(), async serverId => {
  const { locals } = getRequestEvent()

  const response = await locals.hc.server[":id"].$delete({
    param: { id: serverId.toString() }
  })

  if (!response.ok) {
    error(response.status, response.statusText)
  }
})
