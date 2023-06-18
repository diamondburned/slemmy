<script lang="ts">
  import {
    AppShell,
    Avatar,
    AppRail,
    AppRailTile,
    AppRailAnchor,
  } from "@skeletonlabs/skeleton"
  import { TabGroup, Tab } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import { profiles, currentProfile } from "#/stores.js"

  $: instance = $profiles[$currentProfile].instance

  const tiles = [
    { name: "Posts", icon: "home", path: "/" },
    { name: "Search", icon: "explore", path: "/search" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ]

  let currentTileIx: number = 0
  $: {
    if ($page.params.id && parseInt($page.params.id) !== $currentProfile) {
      $currentProfile = parseInt($page.params.id)
    }

    const prefix = `/_/${$currentProfile}}`
    if (location.pathname.startsWith(prefix)) {
      // workaround for the lack of TabAnchor
      goto(`${prefix}${tiles[currentTileIx].path}`)
    }
  }
</script>

<AppShell slotPageContent="overflow-hidden">
  <svelte:fragment slot="sidebarLeft">
    <AppRail class="hidden sm:grid" width="w-16">
      <svelte:fragment slot="lead" />

      {#each tiles as tile, i}
        <AppRailTile
          bind:group={currentTileIx}
          name={tile.name.toLowerCase()}
          title={tile.name}
          value={i}
        >
          <Symbol name={tile.icon} size="3xl" />
        </AppRailTile>
      {/each}

      <svelte:fragment slot="trail">
        <AppRailAnchor
          target="_blank"
          href={instance.url}
          title={instance.name}
        >
          <Avatar
            src={instance.icon}
            width="w-10"
            class="m-auto"
            rounded="rounded-full"
          />
        </AppRailAnchor>
      </svelte:fragment>
    </AppRail>
  </svelte:fragment>

  <svelte:fragment slot="footer">
    <TabGroup
      active="variant-filled-primary"
      hover="hover:variant-soft-primary"
      border=""
      rounded=""
      justify="justify-between"
      spacing=""
      class="bg-surface-100-800-token w-full sm:hidden"
    >
      <div class="px-4 py-2">
        <Avatar
          src={instance.icon}
          class="inline"
          width="w-8"
          rounded="rounded-full"
        />
      </div>
      <div class="grid grid-cols-3">
        {#each tiles as tile, i}
          <Tab
            bind:group={currentTileIx}
            name={tile.name.toLowerCase()}
            title={tile.name}
            value={i}
          >
            <svelte:fragment slot="lead">
              <Symbol inline name={tile.icon} size="2xl" />
            </svelte:fragment>
          </Tab>
        {/each}
      </div>
      <div class="px-4 py-2">
        <Avatar class="inline opacity-0" width="w-8" rounded="rounded-full" />
      </div>
    </TabGroup>
  </svelte:fragment>

  <slot />
</AppShell>
