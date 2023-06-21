<script lang="ts">
  import { AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import { slide } from "svelte/transition"
  import Symbol from "#/components/Symbol.svelte"
  import PostThumbnail from "#/components/PostThumbnail.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RevealingShell from "#/components/RevealingShell.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import * as store from "svelte/store"
  import { onMount, onDestroy } from "svelte"
  import { errorToast } from "#/lib/toasty.js"
  import { ws, currentPosts } from "#/stores.js"
  import { UserOperation } from "lemmy-js-client"

  let scrollContainer: HTMLElement

  let showFilters = false
  let currentPage = $currentPosts.page
  $: loading = $currentPosts.page != currentPage

  // Intentionally declare as variables without reactivity.
  let listing = $currentPosts.listing
  let sort = $currentPosts.sort

  // You may notice uses of .update in this file. This is to prevent Svelte from
  // re-rendering the entire page when an irrelevant value changes.

  // I don't think doing const here is a concern. $ws will only be changing in a
  // different page, so this value would've been destroyed.
  const getPostsEvent = $ws.derive(UserOperation.GetPosts)
  $: currentPosts.update((currentPosts) => {
    if ($getPostsEvent) {
      const posts = currentPosts.posts

      // Be a bit more careful: if Lemmy adds a post into the first page, our
      // second page may contain posts from the first page, so we need to filter
      // them out.
      $getPostsEvent.posts
        .filter((got) => !posts.find((old) => old.post.id == got.post.id))
        .forEach((newPost) => posts.push(newPost))

      currentPosts.posts = posts
    } else {
      currentPosts.posts = []
      currentPosts.page = 0
    }

    // Only update the currentPage after the DOM has been updated.
    // This prevents pages from being increased because the posts fit on the
    // screen even though they're not even rendered yet.
    // The timeout setting things asynchronously shouldn't be an issue, since we
    // don't try to fetch until currentPage is updated.
    setTimeout(() => (currentPage = currentPosts.page), 100)

    // Save the last scrollTop value for the async callback.
    const lastScrollTop = currentPosts.scrollTop
    if (lastScrollTop) {
      // Try to restore the scrolling if the user has not scrolled at all.
      setTimeout(() => {
        if (
          scrollContainer &&
          scrollContainer.scrollTop == 0 &&
          scrollContainer.scrollHeight >= lastScrollTop
        ) {
          scrollContainer.scrollTo(0, lastScrollTop)
        }
      }, 100)
    }

    return currentPosts
  })

  // I can't get $currentPosts to reliably update when its value changes, so
  // subscribe with onMount is used.
  onMount(() =>
    currentPosts.subscribe((currentPosts) => {
      if (currentPosts.page == 0) {
        // Page 0 means we've never loaded posts before.
        // Mark to 1 so we fetch some.
        currentPosts.page = 1
      }

      if (currentPage != currentPosts.page) {
        $ws
          .send(UserOperation.GetPosts, {
            type_: $currentPosts.listing,
            sort: $currentPosts.sort,
            page: $currentPosts.page,
            limit: 10,
          })
          .catch((err) => {
            errorToast(`Cannot request posts: ${err}`)
          })
      }

      return currentPosts
    }),
  )

  // call checkShouldLoadMore when either loading or scrollContainer changes.
  // $: ((..._) => checkShouldLoadMore())(loading, scrollContainer)

  onMount(() => checkShouldLoadMore())

  function checkShouldLoadMore() {
    // Exit if we're already loading or the page is still loading.
    // Svelte will re-run this function when this changes.
    if (loading || !scrollContainer) return

    const scrollThreshold = 200 // hard-coded 200px threshold
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer

    const loadMore =
      // scrolledDown, true if we've scrolled down enough to fetch more posts.
      scrollTop + clientHeight + scrollThreshold >= scrollHeight ||
      // postsAllFit, true if we've fetched some posts but all posts fit on the
      // screen. This is a special case because we need to fetch more posts even
      // though we're not scrolled down.
      (currentPage > 0 && clientHeight >= scrollHeight)

    currentPosts.update((currentPosts) => {
      currentPosts.scrollTop = scrollTop
      if (loadMore) currentPosts.page++
      return currentPosts
    })
  }
</script>

<svelte:head>
  <title>Posts | Slemmy</title>
</svelte:head>

<RevealingShell on:scroll={() => checkShouldLoadMore()} bind:scrollContainer>
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
          <select
            bind:value={listing}
            on:change={() =>
              currentPosts.update((currentPosts) => {
                currentPosts.page = 1
                currentPosts.listing = listing
                return currentPosts
              })}
          >
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
          <select
            bind:value={sort}
            on:change={() =>
              currentPosts.update((currentPosts) => {
                currentPosts.page = 0
                currentPosts.sort = sort
                return currentPosts
              })}
          >
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
      {#each $currentPosts.posts as post}
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
        <p class="inline-flex items-center gap-2 mt-8 mb-16">
          <ProgressRadial stroke={80} width="w-4" />
          <span>Fetching more posts...</span>
        </p>
      </div>
    {/if}
  {/await}
</RevealingShell>
