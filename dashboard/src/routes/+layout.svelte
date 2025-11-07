<script lang="ts">
  import "../app.css"
  import { LayoutDashboard, Server } from "@lucide/svelte"
  // noinspection ES6UnusedImports
  import { Sidebar } from "$lib/components/ui"

  let { children } = $props()
</script>

<svelte:boundary>
  <Sidebar.Provider class="h-full">
    <Sidebar.Root>
      <Sidebar.Header>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton class="font-medium">Coming in Hot</Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href="/" {...props}>
                      <LayoutDashboard/>
                      <span>Dashboard</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href="/servers" {...props}>
                      <Server/>
                      <span>Servers</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar.Root>
    <Sidebar.Inset>
      <div class="p-4 h-full overflow-y-auto">
        {@render children()}
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
</svelte:boundary>
