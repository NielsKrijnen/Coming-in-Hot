<script lang="ts">
  import "../app.css"
  // noinspection ES6UnusedImports
  import { Sidebar } from "$lib/components/ui"

  let { children } = $props()
</script>

<svelte:boundary>
  <Sidebar.Provider class="h-full">
    <Sidebar.Root>
      <Sidebar.Content>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              {#snippet child({ props })}
                <a href="/" {...props}>
                  <span>Dashboard</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar.Root>
    <Sidebar.Inset>
      <div class="p-4 overflow-y-auto">
        {@render children()}
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
</svelte:boundary>
