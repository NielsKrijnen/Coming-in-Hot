<script lang="ts">
  import * as servers from "$lib/api/server.remote"

  let command = $state("")
  let result = $state("")
</script>

{#each await servers.list() as server}
  {server.name}

  <input type="text" bind:value={command} placeholder="Enter command">
  <button onclick={async () => {
    result = await servers.sendCommand({
      serverId: server.id,
      command: command
    })
  }}>Execute</button>
  {result}
  <button onclick={async () => {
    await servers.remove(server.id)
    await servers.list().refresh()
  }}>Delete</button>
{:else}
  <button onclick={async () => {
    await servers.create()
    await servers.list().refresh()
  }}>Create server</button>
{/each}