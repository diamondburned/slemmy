<script lang="ts" module>
  import type { PostView } from "lemmy-js-client"
  import type { Profile } from "#/lib/types.js"

  export type PostsCache = {
    posts: PostView[]
    page: number
    lastScrollTop: number
  }

  // In-memory cache for posts of a community. An empty name means global frontpage.
  const communityPosts = new Map<string, PostsCache>()
  let currentProfile: Profile | null = null
</script>

<script lang="ts">
  import type { Snippet } from "svelte"
  import { AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import { fade, fly } from "svelte/transition"
  import Symbol from "#/components/Symbol.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import PostList from "#/components/PostList.svelte"
  import RevealingShell from "#/components/RevealingShell.svelte"

  import { onMount, tick } from "svelte"
  import { errorToast } from "#/lib/toasty.js"
  import { client, profile, postsSettings } from "#/stores.js"

  let {
    title = "",
    communityName = "",
    headerLead,
    headerButtonsStart,
    headerButtonsEnd,
    mainHeader,
  }: {
    title?: string
    communityName?: string
    headerLead?: Snippet
    headerButtonsStart?: Snippet
    headerButtonsEnd?: Snippet
    mainHeader?: Snippet
  } = $props()

  let showFilters = $state(false)
  let loading = $state(false)
  let noPosts = $state(false)
  let scrollContainer = $state<HTMLElement>()

  let posts = $state<PostView[]>([])
  let page = $state(1)
  let lastScrollTop = $state(0)

  // Clear cache if profile changes
  $effect(() => {
    if ($profile != currentProfile) {
      currentProfile = $profile
      communityPosts.clear()
    }
  })

  // Synchronize cache when communityName changes or on load
  $effect(() => {
    const cName = communityName
    const cached = communityPosts.get(cName)
    if (cached) {
      posts = cached.posts
      page = cached.page
      lastScrollTop = cached.lastScrollTop
    } else {
      posts = []
      page = 1
      lastScrollTop = 0
      loadPage(1)
    }
  })

  // Save changes to cache
  $effect(() => {
    communityPosts.set(communityName, {
      posts,
      page,
      lastScrollTop,
    })
  })

  onMount(async () => {
    await tick()

    // Try to restore the scrolling if the user has not scrolled at all.
    if (
      scrollContainer &&
      scrollContainer.scrollTop == 0 &&
      scrollContainer.scrollHeight >= lastScrollTop
    ) {
      scrollContainer.scrollTo(0, lastScrollTop)
    }
  })

  async function loadPage(p: number) {
    loading = true

    try {
      const resp = await $client!.getPosts({
        type_: $postsSettings.listing,
        sort: $postsSettings.sort,
        page: p,
        limit: 10,
        community_name: communityName || undefined,
      })

      // Be a bit more careful: if Lemmy adds a post into the first page, our
      // second page may contain posts from the first page, so we need to filter
      // them out.
      const newPosts = resp.posts.filter(
        (got) => !posts.find((old) => old.post.id == got.post.id),
      )
      posts.push(...newPosts)

      page = Math.max(page, p)
      loading = false
      noPosts = resp.posts.length == 0

      if (posts.length > 0) {
        // We can definitely fetch more posts if we're not already exhausted.
        checkShouldLoadMore()
      }
    } catch (err) {
      errorToast(`Cannot request posts: ${err}`)
      return
    } finally {
      loading = false
    }
  }

  function checkShouldLoadMore() {
    if (!scrollContainer || loading || noPosts) {
      return
    }

    const scrollThreshold = 200 // hard-coded 200px threshold
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer

    const loadMore =
      // scrolledDown, true if we've scrolled down enough to fetch more posts.
      scrollTop + clientHeight + scrollThreshold >= scrollHeight ||
      // rare case: this function will return true if we have no posts and
      // forever load more pages, so prevent that.
      posts.length == 0 ||
      // postsAllFit, true if we've fetched some posts but all posts fit on
      // the screen. This is a special case because we need to fetch more
      // posts even though we're not scrolled down.
      (posts.length > 0 && clientHeight >= scrollHeight)

    if (loadMore) {
      loadPage(page + 1)
    }
  }

  function resetPosts() {
    console.debug("resetting posts")
    posts = []
    page = 1
    loadPage(1)
  }
</script>

<RevealingShell
  bind:scrollContainer
  lockHeaderHeight={true}
  onscroll={() => {
    if (scrollContainer) {
      lastScrollTop = scrollContainer.scrollTop
    }
    checkShouldLoadMore()
  }}
>
  {#snippet pageHeader()}
    <AppBar slotLead="items-baseline">
      <svelte:fragment slot="lead">
        {#if headerLead}
          {@render headerLead()}
        {:else}
          <h1 class="text-xl font-bold line-clamp-1">
            {title}
          </h1>
        {/if}
      </svelte:fragment>

      <div slot="trail" class="space-x-1">
        {@render headerButtonsStart?.()}
        <BarButton
          icon="refresh"
          tooltip="Refresh"
          onclick={() => resetPosts()}
        />
        <BarButton
          icon="filter_alt"
          tooltip="Filter"
          bind:active={showFilters}
        />
        {@render headerButtonsEnd?.()}
      </div>
    </AppBar>

    {#if showFilters}
      <div
        class="flex flex-col sm:flex-row gap-4 px-4 pb-4 bg-surface-100-800-token"
        transition:fly={{ duration: 100, y: -10 }}
      >
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
          <div class="input-group-shim !pl-3 !pr-2" title="Filter">
            <Symbol name="filter_alt" tooltip="Filter" />
          </div>
          <select
            bind:value={$postsSettings.listing}
            onchange={() => resetPosts()}
          >
            <option value="All">All</option>
            <option value="Local">Local</option>
            <option value="Subscribed">Subscribed</option>
            <option value="Community">Community</option>
          </select>
        </div>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
          <div class="input-group-shim !pl-3 !pr-2" title="Sort">
            <Symbol name="sort" tooltip="Sort" />
          </div>
          <select
            bind:value={$postsSettings.sort}
            onchange={() => resetPosts()}
          >
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="Hot">Hot</option>
            <option value="TopHour">Top Hour</option>
            <option value="TopSixHour">Top 6 Hours</option>
            <option value="TopTwelveHour">Top 12 Hours</option>
            <option value="TopDay">Top Day</option>
            <option value="TopWeek">Top Week</option>
            <option value="TopMonth">Top Month</option>
            <option value="TopThreeMonths">Top 3 Months</option>
            <option value="TopSixMonths">Top 6 Months</option>
            <option value="TopNineMonths">Top 9 Months</option>
            <option value="TopYear">Top Year</option>
            <option value="TopAll">Top All Time</option>
            <option value="MostComments">Most Comments</option>
            <option value="NewComments">New Comments</option>
          </select>
        </div>
      </div>
    {/if}
  {/snippet}

  {@render mainHeader?.()}

  <div class="posts-container contents">
    <PostList class="posts-list" {posts} />

    {#if loading || posts.length == 0}
      <div
        class="grid place-items-center my-8"
        transition:fade={{ duration: 50 }}
      >
        {#if loading}
          <p class="inline-flex items-center gap-2">
            <ProgressRadial stroke={80} width="w-4" />
            <span>Fetching more posts...</span>
          </p>
        {:else if posts.length == 0}
          <p
            class="text-center text-surface-400"
            transition:fade={{ duration: 50 }}
          >
            No posts found.
          </p>
        {/if}
      </div>
    {/if}
  </div>
</RevealingShell>

<style lang="postcss">
  .posts-container :global(.posts-list):empty {
    display: none;
  }

  .posts-container :global(.markdown.summary) {
    --block-margin: 0.25rem;
    max-height: 6rem;
  }

  .posts-container :global(.markdown.summary img) {
    display: none;
  }
</style>
