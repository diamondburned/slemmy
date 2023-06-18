<script lang="ts">
  import {
    AppShell,
    AppBar,
    Avatar,
    ProgressRadial,
    ListBox,
    ListBoxItem,
    toastStore,
  } from "@skeletonlabs/skeleton"
  import { slide } from "svelte/transition"
  import Symbol from "#/components/Symbol.svelte"
  import PostThumbnail from "#/components/PostThumbnail.svelte"

  import { onMount } from "svelte"
  import { relative } from "#/lib/time.js"
  import { scrollDelta } from "#/lib/events.js"
  import { profiles, currentProfile, client, cachedPosts } from "#/stores.js"
  import type { ScrollDeltaEvent } from "#/lib/events.js"
  import type { ListingType, SortType, PostView } from "lemmy-js-client"

  $: instance = $profiles[$currentProfile].instance

  let listing: ListingType = "Local"
  let sort: SortType = "Active"

  let headerSize = { w: 0, h: 0 }
  let headerPadding: HTMLElement
  $: headerPadding && (headerPadding.style.height = `${headerSize.h}px`)

  let showFilters = false
  let hideBar = false
  function handlePostsScroll(event: ScrollDeltaEvent) {
    if (event.detail.y < 0) {
      hideBar = false
    } else if (event.detail.y > 0) {
      hideBar = true
    }
  }

  let loading = false // true
  let posts: PostView[] = []

  async function refresh() {
    loading = true

    try {
      const resp = await $client.getPosts({ type_: listing, sort })
      posts = resp.posts

      $cachedPosts = {}
      posts.forEach((post) => ($cachedPosts[post.post.id] = post))
    } catch (err) {
      console.error(`Error getting posts:`, err)
      toastStore.trigger({
        message: `${err}`,
        autohide: false,
        background: "variant-filled-error",
      })
    }

    loading = false
  }

  onMount(() => refresh())
  $: {
    listing
    sort
    refresh()
  }
</script>

<svelte:head>
  <title>Posts | Slemmy</title>
</svelte:head>

<AppShell slotPageContent="overflow-hidden" slotPageHeader="relative">
  <svelte:fragment slot="pageHeader">
    <div
      bind:clientHeight={headerSize.h}
      style="z-index: 1; {hideBar ? `top: -${headerSize.h}px` : 'top: 0'}"
      class="absolute w-full transition-all duration-100 ease-in-out"
    >
      <div>
        <AppBar slotLead="items-baseline">
          <svelte:fragment slot="lead">
            <h1 class="text-2xl font-bold">Posts</h1>
          </svelte:fragment>
          <svelte:fragment slot="trail">
            <button
              type="button"
              class="btn-icon btn-icon-sm"
              class:variant-filled={showFilters}
              class:variant-outlined={!showFilters}
              on:click={() => (showFilters = !showFilters)}
            >
              <Symbol name="filter_alt" tooltip="Filter" />
            </button>
          </svelte:fragment>
        </AppBar>

        {#if showFilters}
          <div
            class="flex flex-col sm:flex-row gap-4 px-4 pb-4 bg-surface-100-800-token"
            transition:slide|local={{ duration: 100 }}
          >
            <div
              class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
            >
              <div class="input-group-shim" title="Filter">
                <Symbol name="filter_alt" tooltip="Filter" />
              </div>
              <select bind:value={listing}>
                <option value="All">All</option>
                <option value="Local">Local</option>
                <option value="Subscribed">Subscribed</option>
                <option value="Community">Community</option>
              </select>
            </div>
            <div
              class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
            >
              <div class="input-group-shim" title="Sort">
                <Symbol name="sort" tooltip="Sort" />
              </div>
              <select bind:value={sort}>
                <option value="Active">Active</option>
                <option value="New">New</option>
                <option value="Hot">Hot</option>
                <option value="TopDay">Top Day</option>
                <option value="TopWeek">Top Week</option>
                <option value="TopMonth">Top Month</option>
                <option value="TopYear">Top Year</option>
                <option value="TopAll">Top All Time</option>
              </select>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </svelte:fragment>

  {#if loading}
    <div class="grid h-full place-items-center">
      <ProgressRadial stroke={80} width="w-12" />
    </div>
  {:else}
    <div
      class="overflow-y-scroll h-full"
      use:scrollDelta
      on:scrolldelta={handlePostsScroll}
    >
      <div bind:this={headerPadding} />
      <div class="container m-auto">
        <ol class="list flex flex-col gap-4 py-4">
          {#each posts as post}
            <li class="flex flex-row gap-0 px-4 items-center">
              <div class="flex-1 flex flex-col gap-1">
                <p class="text-sm text-gray-400">
                  <span class="inline-flex items-baseline">
                    <Avatar
                      src={post.creator.avatar}
                      width="w-4"
                      class="mr-1 self-center"
                      rounded="rounded-full"
                    />
                    {post.creator.display_name || post.creator.name}
                  </span>
                  <span class="mx-1">·</span>
                  <span class="inline-flex items-baseline">
                    <Avatar
                      src={post.community.icon}
                      width="w-4"
                      class="mr-1 self-center"
                      rounded="rounded-full"
                    />
                    {post.community.title}
                  </span>
                  <span class="float-right">
                    {#if post.post.featured_community || post.post.featured_local}
                      <span class="badge-icon variant-ghost" title="Featured">
                        <Symbol name="push_pin" />
                      </span>
                    {/if}
                  </span>
                </p>
                <h3>
                  <a href={post.post.url} target="_blank">{post.post.name}</a>
                  {#if post.post.url}
                    <Symbol
                      inline
                      name="open_in_new"
                      size="sm"
                      class="align-text-bottom text-gray-400"
                    />
                  {/if}
                </h3>
                <p class="flex gap-2 mt-1">
                  <span class="badge variant-soft inline-flex gap-1 px-3">
                    <Symbol name="north" />
                    {post.counts.upvotes - post.counts.downvotes}
                  </span>
                  <span class="badge variant-soft inline-flex gap-1 px-3">
                    <Symbol name="comment" />
                    {post.counts.comments}
                  </span>
                  <span class="badge variant-soft inline-flex gap-1 px-3">
                    <Symbol name="schedule" />
                    <time datetime={post.post.published} class="contents">
                      {relative(new Date(post.post.published), "short")}
                    </time>
                  </span>
                </p>
                <!--
                {#if post.post.body}
                  <p class="text-sm text-gray-400">
                    {post.post.body.slice(0, 128)}
                  </p>
                {/if}
				-->
              </div>
              <PostThumbnail post={post.post} />
            </li>
          {/each}
        </ol>
      </div>
    </div>
  {/if}
</AppShell>
