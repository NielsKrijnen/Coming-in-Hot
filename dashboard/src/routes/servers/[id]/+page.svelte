<script lang="ts">
  import { Cpu, MemoryStick } from "@lucide/svelte"
  import { onMount } from "svelte"
  import * as Servers from "$lib/api/server.remote"
  // noinspection ES6UnusedImports
  import { Item, Progress } from "$lib/components/ui"

  let { params } = $props()

  const stats = $derived(await Servers.getStats(Number(params.id)))

  onMount(() => {
    const interval = setInterval(async () => {
      await Servers.getStats(Number(params.id)).refresh()
    }, 5000)

    return () => clearInterval(interval)
  })

  export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 B"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
  }
</script>

<div class="flex gap-4">
  <Item.Root variant="outline" class="w-full">
    <Item.Media variant="icon">
      <Cpu/>
    </Item.Media>
    <Item.Content>
      <Item.Title>CPU Usage</Item.Title>
      <Item.Description>
        <Progress value={stats.cpu.percent.normalized}/>
      </Item.Description>
    </Item.Content>
    <Item.Actions>
      {stats.cpu.percent.normalized.toFixed(1)} %
    </Item.Actions>
  </Item.Root>

  <Item.Root variant="outline" class="w-full">
    <Item.Media variant="icon">
      <MemoryStick/>
    </Item.Media>
    <Item.Content>
      <Item.Title>RAM Usage</Item.Title>
      <Item.Description>
        <Progress value={stats.memory.percent}/>
      </Item.Description>
    </Item.Content>
    <Item.Actions>
      {stats.memory.percent.toFixed(1)} % ({formatBytes(stats.memory.bytes)})
    </Item.Actions>
  </Item.Root>
</div>