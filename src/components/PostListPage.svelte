<script lang="ts" context="module">
  import * as store from "svelte/store"
  import type { PostView } from "lemmy-js-client"
  import type { Profile } from "#/lib/types.js"

  export type PostsCache = {
    posts: store.Writable<PostView[]>
    page: store.Writable<number>
    lastScrollTop: store.Writable<number>
  }

  // communityPosts is a cache for the posts of a community.
  // An empty name means the global posts.
  const communityPosts = store.writable<Record<string, PostsCache>>({})

  // Be careful when persisting this list: we track the current profile, and if
  // it differs from the current one, then we wipe the list.
  let currentProfile: Profile | null = null
</script>

<script lang="ts">
  import { AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import { fade, fly } from "svelte/transition"
  import Symbol from "#/components/Symbol.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import PostList from "#/components/PostList.svelte"
  import RevealingShell from "#/components/RevealingShell.svelte"

  import { onMount, tick } from "svelte"
  import { errorToast } from "#/lib/toasty.js"
  import { client, profile, postsSettings } from "#/stores.js"

  let showFilters = false
  let loading = false
  let noPosts = false

  export let title = ""
  export let communityName = ""

  $: {
    if ($profile != currentProfile) {
      currentProfile = $profile
      communityPosts.set({})
    }
  }

  function getPostsCache(name: string): PostsCache {
    if (!$communityPosts[name]) {
      $communityPosts[name] = {
        posts: store.writable<PostView[]>([]),
        page: store.writable(1),
        lastScrollTop: store.writable(0),
      }
    }
    return $communityPosts[name]
  }
  $: postsCache = $communityPosts[communityName] || getPostsCache(communityName)
  $: ({ posts, page, lastScrollTop } = postsCache)

  onMount(async () => {
    await tick()

    // Try to restore the scrolling if the user has not scrolled at all.
    if (
      scrollContainer.scrollTop == 0 &&
      scrollContainer.scrollHeight >= $lastScrollTop
    ) {
      scrollContainer.scrollTo(0, $lastScrollTop)
    }
  })

  async function loadPage(p: number) {
    loading = true

    try {
      const resp = await $client!.getPosts({
        type_: $postsSettings.listing,
        sort: $postsSettings.sort,
        page: p,
        auth: $profile?.user?.jwt,
        limit: 10,
        community_name: communityName || undefined,
      })

      // Be a bit more careful: if Lemmy adds a post into the first page, our
      // second page may contain posts from the first page, so we need to filter
      // them out.
      resp.posts
        .filter((got) => !$posts.find((old) => old.post.id == got.post.id))
        .forEach((newPost) => $posts.push(newPost))

      $page = Math.max($page, p)
      posts = posts // force update
      loading = false
      noPosts = resp.posts.length == 0

      if ($posts.length > 0) {
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

  onMount(() => {
    if ($posts.length == 0) {
      loadPage(1)
    }
  })

  let scrollContainer: HTMLElement
  function checkShouldLoadMore() {
    if (loading || noPosts) {
      return
    }

    const scrollThreshold = 200 // hard-coded 200px threshold
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer

    const loadMore =
      // scrolledDown, true if we've scrolled down enough to fetch more posts.
      scrollTop + clientHeight + scrollThreshold >= scrollHeight ||
      // rare case: this function will return true if we have no posts and
      // forever load more pages, so prevent that.
      $posts.length == 0 ||
      // postsAllFit, true if we've fetched some posts but all posts fit on
      // the screen. This is a special case because we need to fetch more
      // posts even though we're not scrolled down.
      ($posts.length > 0 && clientHeight >= scrollHeight)

    if (loadMore) {
      loadPage($page + 1)
    }
  }

  function resetPosts() {
    console.debug("resetting posts")
    $posts = []
    $page = 1
    loadPage(1)
  }
</script>

<RevealingShell
  bind:scrollContainer
  lockHeaderHeight={true}
  on:scroll={() => {
    $lastScrollTop = scrollContainer.scrollTop
    checkShouldLoadMore()
  }}
>
  <div slot="pageHeader">
    <AppBar slotLead="items-baseline">
      <svelte:fragment slot="lead">
        <slot name="headerLead">
          <h1 class="text-xl font-bold line-clamp-1">
            {title}
          </h1>
        </slot>
      </svelte:fragment>

      <div slot="trail" class="space-x-1">
        <slot name="headerButtonsStart" />
        <BarButton
          icon="refresh"
          tooltip="Refresh"
          on:click={() => resetPosts()}
        />
        <BarButton
          icon="filter_alt"
          tooltip="Filter"
          bind:active={showFilters}
        />
        <slot name="headerButtonsEnd" />
      </div>
    </AppBar>

    {#if showFilters}
      <div
        class="flex flex-col sm:flex-row gap-4 px-4 pb-4 bg-surface-100-800-token"
        transition:fly|local={{ duration: 100, y: -10 }}
      >
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
          <div class="input-group-shim !pl-3 !pr-2" title="Filter">
            <Symbol name="filter_alt" tooltip="Filter" />
          </div>
          <select
            bind:value={$postsSettings.listing}
            on:change={() => resetPosts()}
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
            on:change={() => resetPosts()}
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
  </div>

  <slot name="mainHeader" />

  <div class="posts-container contents">
    <PostList class="posts-list" posts={$posts} />

    {#if loading || $posts.length == 0}
      <div
        class="grid place-items-center my-8"
        transition:fade|local={{ duration: 50 }}
      >
        {#if loading}
          <p class="inline-flex items-center gap-2">
            <ProgressRadial stroke={80} width="w-4" />
            <span>Fetching more posts...</span>
          </p>
        {:else if $posts.length == 0}
          <p
            class="text-center text-surface-400"
            transition:fade|local={{ duration: 50 }}
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
