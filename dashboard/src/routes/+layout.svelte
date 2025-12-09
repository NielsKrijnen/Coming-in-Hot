<script lang="ts">
  import "../app.css"
  import { LayoutDashboard, Server } from "@lucide/svelte"
  import { page } from "$app/state"
  import { GitHub } from "$lib/components/icons"
  // noinspection ES6UnusedImports
  import { Breadcrumb, Button, Separator, Sidebar } from "$lib/components/ui"

  let { data, children } = $props()
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
      <header class="flex h-16 shrink-0 items-center gap-2 border-b pr-3">
        <div class="flex items-center gap-2 px-3">
          <Sidebar.Trigger/>
          <Separator orientation="vertical" class="mr-2 h-4"/>
          <Breadcrumb.Root>
            <Breadcrumb.List>
              {#each page.data.breadcrumbs as breadcrumb, i (breadcrumb.href)}
                {#if breadcrumb.href === page.url.pathname}
                  <Breadcrumb.Item>
                    <Breadcrumb.Page>{breadcrumb.name}</Breadcrumb.Page>
                  </Breadcrumb.Item>
                {:else}
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href={breadcrumb.href}>
                      {breadcrumb.name}
                    </Breadcrumb.Link>
                  </Breadcrumb.Item>
                  {#if i < page.data.breadcrumbs.length - 1}
                    <Breadcrumb.Separator/>
                  {/if}
                {/if}
              {/each}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
        <Button
          variant="outline"
          href="https://github.com/NielsKrijnen/Coming-in-Hot"
          target="_blank"
          class="ml-auto"
        >
          <GitHub/>
        </Button>
      </header>
      <div class="p-4 h-full overflow-y-auto">
        {@render children()}
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
</svelte:boundary>
