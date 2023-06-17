<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton"
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton"
  import { TabGroup, Tab } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"

  import { goto } from "$app/navigation"

  const tiles = [
    { name: "Posts", icon: "list", path: "/" },
    { name: "Search", icon: "search", path: "/search" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ]

  let currentTileIx: number = 0
  $: goto(tiles[currentTileIx].path) // workaround for the lack of TabAnchor
</script>

<AppShell>
  <svelte:fragment slot="sidebarLeft">
    <AppRail class="hidden sm:block">
      {#each tiles as tile, i}
        <AppRailTile
          bind:group={currentTileIx}
          name={tile.name.toLowerCase()}
          title={tile.name}
          value={i}
        >
          <svelte:fragment slot="lead">
            <Symbol name={tile.icon} />
          </svelte:fragment>
          <span>{tile.name}</span>
        </AppRailTile>
      {/each}
    </AppRail>
  </svelte:fragment>

  <svelte:fragment slot="footer">
    <TabGroup
      active="variant-filled-primary"
      hover="hover:variant-soft-primary"
      rounded=""
      border=""
      justify="justify-center"
      class="bg-surface-100-800-token w-full sm:hidden"
    >
      <div class="grid grid-cols-3">
        {#each tiles as tile, i}
          <Tab
            bind:group={currentTileIx}
            name={tile.name.toLowerCase()}
            title={tile.name}
            value={i}
          >
            <svelte:fragment slot="lead">
              <Symbol name={tile.icon} />
            </svelte:fragment>
            <span>{tile.name}</span>
          </Tab>
        {/each}
      </div>
    </TabGroup>
  </svelte:fragment>

  <slot />
</AppShell>
