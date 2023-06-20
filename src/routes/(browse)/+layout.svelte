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

  import { page } from "$app/stores"
  import { toastStore } from "@skeletonlabs/skeleton"
  import { ws, profiles, currentProfile } from "#/stores.js"

  import { fade } from "svelte/transition"
  import { goto, beforeNavigate, afterNavigate } from "$app/navigation"
  import { cubicIn, cubicOut } from "svelte/easing"

  $: instance = $profiles[$currentProfile].instance

  $: event = $ws.event
  $: $ws.ready.catch((err) => warnWS(err))
  $: {
    if ($profiles[$currentProfile] && $event.op == null && $event._error) {
      warnWS($event._error)
    }
  }

  function warnWS(err: unknown) {
    toastStore.trigger({
      message: `WS: ${err}`,
      autohide: true,
      background: "variant-filled-error",
    })
  }

  // Needed to prevent page blinking on transition.
  let navigating = false
  beforeNavigate(() => (navigating = true))
  afterNavigate(() => (navigating = false))

  const tiles = [
    { name: "Posts", icon: "home", path: "/" },
    { name: "Search", icon: "explore", path: "/search" },
    { name: "Profiles", icon: "people", path: "/profiles" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ]

  let currentTileIx: number = -1
  $: {
    const tile = tiles[currentTileIx]
    if (tile) {
      if (!$page.url.pathname.startsWith(tile.path)) {
        goto(tile.path)
      }
    } else {
      for (const tile of tiles) {
        if ($page.url.pathname.startsWith(tile.path)) {
          currentTileIx = tiles.indexOf(tile)
          break
        }
      }
    }
  }
</script>

<AppShell slotPageContent="h-full overflow-">
  <svelte:fragment slot="sidebarLeft">
    <AppRail class="hidden sm:grid" width="w-16">
      <svelte:fragment slot="lead" />

      {#each tiles as tile, i}
        <AppRailTile
          bind:group={currentTileIx}
          name={tile.name.toLowerCase()}
          title={tile.name}
          value={i}
          class=""
        >
          <Symbol name={tile.icon} size="3xl" class="leading-8 m-4" />
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
      <div class="grid grid-cols-4">
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

  {#key $page.url.pathname}
    {#if !navigating}
      <div
        class="h-full"
        in:fade={{ easing: cubicOut, duration: 150, delay: 200 }}
        out:fade={{ easing: cubicIn, duration: 150 }}
        data-url={$page.url.pathname}
      >
        <slot />
      </div>
    {/if}
  {/key}
</AppShell>
