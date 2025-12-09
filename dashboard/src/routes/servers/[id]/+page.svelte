<script lang="ts">
  import * as Servers from "$lib/api/server.remote"

  let { params } = $props()

  const server = await Servers.get(Number(params.id))
  const env = Object.fromEntries(
    server.container.Config.Env.map(e => e.split("=", 2))
  )
</script>

{server.name}

Type: {env.TYPE}
Version: {env.VERSION}

{JSON.stringify(await Servers.getStats(Number(params.id)))}