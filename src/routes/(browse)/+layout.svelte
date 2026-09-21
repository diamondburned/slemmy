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
  import { profile } from "#/stores.js"

  import type { Snippet } from "svelte"
  import { tick } from "svelte"
  import { fade } from "svelte/transition"
  import { goto, beforeNavigate, afterNavigate } from "$app/navigation"
  import { cubicIn, cubicOut } from "svelte/easing"
  import { thumbnailURL } from "#/lib/lemmyutils.js"

  let { children }: { children?: Snippet } = $props()

  let instance = $derived($profile?.instance)
  let user = $derived($profile?.user)

  $effect(() => {
    if (!$profile?.instance) {
      goto("/profiles")
    }
  })

  // Needed to prevent page blinking on transition.
  let navigating = $state(false)
  beforeNavigate(() => {
    navigating = true
  })
  afterNavigate(async () => {
    await tick()
    navigating = false
  })

  const tiles = [
    { name: "Frontpage", icon: "home", path: "/" },
    { name: "Search", icon: "explore", path: "/search", disabled: true },
    { name: "Settings", icon: "settings", path: "/settings", disabled: true },
    { name: "Switch Profile", icon: "switch_account", path: "/profiles" },
  ]

  let currentTileIx = $derived(
    tiles.findIndex((tile) =>
      tile.path === "/"
        ? $page.url.pathname === "/"
        : $page.url.pathname.startsWith(tile.path),
    ),
  )

  const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none"
</script>

{#if instance}
  <AppShell slotPageContent="h-full overflow-">
    <svelte:fragment slot="sidebarLeft">
      <AppRail class="hidden sm:grid" width="w-16">
        <svelte:fragment slot="lead" />

        {#each tiles as tile, i}
          <AppRailTile
            name={tile.name.toLowerCase()}
            title={tile.name}
            value={i}
            class={tile.disabled ? disabledClass : ""}
            onclick={() => goto(tile.path)}
            group={currentTileIx}
          >
            <Symbol name={tile.icon} size="3xl" class="leading-8 m-4" />
          </AppRailTile>
        {/each}

        <svelte:fragment slot="trail">
          {#if user}
            <AppRailAnchor
              href="/u/{user.name}"
              title={user.display_name || user.name}
            >
              <Avatar
                src={thumbnailURL(user.avatar)}
                width="w-10"
                class="m-auto"
                rounded="rounded-full"
                initials={user.display_name || user.name}
              />
            </AppRailAnchor>
          {/if}
          <AppRailAnchor
            target="_blank"
            href={instance.url}
            title={instance.name}
          >
            <Avatar
              src={thumbnailURL(instance.icon)}
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
            src={thumbnailURL(instance.icon)}
            class="inline"
            width="w-8"
            rounded="rounded-full"
          />
        </div>
        <div class="grid grid-cols-4">
          {#each tiles as tile, i}
            <Tab
              name={tile.name.toLowerCase()}
              title={tile.name}
              value={i}
              class={tile.disabled ? disabledClass : ""}
              onclick={() => goto(tile.path)}
              group={currentTileIx}
            >
              <svelte:fragment slot="lead">
                <Symbol inline name={tile.icon} size="2xl" />
              </svelte:fragment>
            </Tab>
          {/each}
        </div>
        <div class="px-4 py-2">
          <Avatar
            src={thumbnailURL(user?.avatar)}
            class="inline {!user && 'opacity-0'}"
            width="w-8"
            rounded="rounded-full"
            initials={user?.display_name || user?.name || ""}
          />
        </div>
      </TabGroup>
    </svelte:fragment>

    {#key $page.url.href}
      {#if !navigating}
        <div
          class="h-full"
          in:fade={{ easing: cubicOut, duration: 150, delay: 150 }}
          out:fade={{ easing: cubicIn, duration: 150 }}
          data-url={$page.url.pathname}
        >
          {@render children?.()}
        </div>
      {/if}
    {/key}
  </AppShell>
{/if}
