<script lang="ts">
  import { AppBar, ProgressRadial, toastStore } from "@skeletonlabs/skeleton"
  import { slide } from "svelte/transition"
  import Symbol from "#/components/Symbol.svelte"
  import PostThumbnail from "#/components/PostThumbnail.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RevealingShell from "#/components/RevealingShell.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import { onMount } from "svelte"
  import { ws, cachedPosts } from "#/stores.js"
  import { UserOperation } from "lemmy-js-client"
  import type { ListingType, SortType, PostView } from "lemmy-js-client"

  let showFilters = false
  let listing: ListingType = "Local"
  let sort: SortType = "Active"

  let loading = true
  let posts: PostView[] = []

  $: getPostsEvent = $ws.derive(UserOperation.GetPosts)
  $: {
    if ($getPostsEvent) {
      posts = [...posts, ...$getPostsEvent.posts]
      loading = false
    } else {
      posts = []
    }
  }

  let currentPage: number

  async function loadNext() {
    currentPage++
    loading = true
    $ws.send(UserOperation.GetPosts, {
      type_: listing,
      sort,
      page: currentPage,
    })
  }

  $: {
    listing
    sort
    currentPage = 0
    loadNext()
  }
</script>

<svelte:head>
  <title>Posts | Slemmy</title>
</svelte:head>

<RevealingShell>
  <div slot="pageHeader">
    <AppBar slotLead="items-baseline">
      <h1 slot="lead" class="text-2xl font-bold">Posts</h1>
      <button
        slot="trail"
        type="button"
        class="btn-icon btn-icon-sm"
        class:variant-filled={showFilters}
        class:variant-outlined={!showFilters}
        on:click={() => (showFilters = !showFilters)}
      >
        <Symbol name="filter_alt" tooltip="Filter" />
      </button>
    </AppBar>

    {#if showFilters}
      <div
        class="flex flex-col sm:flex-row gap-4 px-4 pb-4 bg-surface-100-800-token"
        transition:slide|local={{ duration: 100 }}
      >
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
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
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
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

  {#await $ws.ready}
    <div class="grid h-full place-items-center">
      <ProgressRadial stroke={80} width="w-12" />
    </div>
  {:then}
    <ol class="list flex flex-col gap-4 py-4">
      {#each posts as post}
        <li class="flex flex-row gap-0 px-4 items-center">
          <div class="flex-1 flex flex-col gap-1">
            <p class="text-sm text-surface-400 truncate">
              <UserBadge user={post.creator} />
              <span>to</span>
              <CommunityBadge community={post.community} />

              <span class="float-right">
                {#if post.post.featured_community || post.post.featured_local}
                  <span class="badge-icon variant-ghost" title="Featured">
                    <Symbol name="push_pin" />
                  </span>
                {/if}
              </span>
            </p>

            <h3>
              <a
                href={post.post.url || `/p/${post.post.id}`}
                class="hover:underline"
                target={post.post.url ? "_blank" : ""}
              >
                {post.post.name}
              </a>
              {#if post.post.url}
                <Symbol
                  name="open_in_new"
                  size="sm"
                  class="align-text-bottom text-surface-400"
                />
              {/if}
            </h3>

            <p class="flex gap-2 mt-1">
              <span class="badge variant-soft inline-flex gap-1 px-3">
                <Symbol name="expand_less" />
                {post.counts.upvotes - post.counts.downvotes}
              </span>

              <a
                href="/p/{post.post.id}"
                class="badge variant-soft hover:variant-filled transition inline-flex gap-1 px-3"
              >
                <Symbol name="comment" />
                {post.counts.comments}
              </a>

              <RelativeTimestamp
                date={post.post.published + "Z"}
                class="badge variant-soft inline-flex gap-1 px-3"
              />
            </p>
          </div>

          <PostThumbnail post={post.post} />
        </li>
      {/each}
    </ol>

    {#if loading}
      <div class="grid h-full place-items-center">
        <p class="inline-flex items-center gap-2">
          <ProgressRadial stroke={80} width="w-4" />
          <span>Fetching more posts...</span>
        </p>
      </div>
    {/if}
  {/await}
</RevealingShell>
