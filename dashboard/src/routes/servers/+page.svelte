<script lang="ts">
  import { Plus, Server, Trash2 } from "@lucide/svelte"
  import * as Servers from "$lib/api/server.remote"
  // noinspection ES6UnusedImports
  import { Button, Card, Empty, Spinner } from "$lib/components/ui"

  let loadingCreate = $state(false)
  let loadingDelete = $state(false)
</script>

<div>
  {#each await Servers.list() as server}
    <Card.Root>
      <Card.Header>
        <Card.Title>{server.name}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Server ID: {server.id}</p>
        <p>Port: {server.port}</p>
        <Button variant="destructive" onclick={async () => {
          loadingDelete = true
          await Servers.remove(server.id)
          await Servers.list().refresh()
          loadingDelete = false
        }}>
          {#if loadingDelete}
            <Spinner/>
            Deleting...
          {:else}
            <Trash2/>
            Delete
          {/if}
        </Button>
      </Card.Content>
    </Card.Root>
  {:else}
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <Server/>
        </Empty.Media>
        <Empty.Title>No Servers Yet</Empty.Title>
        <Empty.Description>You haven't created any servers yet. Get started by creating your first server.</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button onclick={async () => {
          loadingCreate = true
          await Servers.create()
          loadingCreate = false
        }}>
          {#if loadingCreate}
            <Spinner/>
            Creating...
          {:else}
            <Plus/>
            Create Server
          {/if}
        </Button>
      </Empty.Content>
    </Empty.Root>
  {/each}
</div>
