import { getRequestEvent, query } from "$app/server"

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const response = await locals.hc.server.$get()
  return await response.json()
})
