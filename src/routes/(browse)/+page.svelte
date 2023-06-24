<script lang="ts" context="module">
  import { posts } from "#/stores.js"
  import * as store from "svelte/store"

  const lastScrollTop = store.writable<number>(0)
  const page = store.writable<number>(1)
</script>

<script lang="ts">
  import { AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import { slide, fade } from "svelte/transition"
  import Symbol from "#/components/Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import PostThumbnail from "#/components/PostThumbnail.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RevealingShell from "#/components/RevealingShell.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import { onMount, tick } from "svelte"
  import { errorToast } from "#/lib/toasty.js"
  import { urlHostname } from "#/lib/lemmyutils.js"
  import { ws, profile, postsSettings } from "#/stores.js"
  import { UserOperation } from "lemmy-js-client"

  let showFilters = false
  let loading = false

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

  onMount(() =>
    $ws.derive(UserOperation.GetPosts).subscribe(async (ev) => {
      if (!ev) {
        return
      }

      // Be a bit more careful: if Lemmy adds a post into the first page, our
      // second page may contain posts from the first page, so we need to filter
      // them out.
      ev.posts
        .filter((got) => !$posts.find((old) => old.post.id == got.post.id))
        .forEach((newPost) => $posts.push(newPost))

      $posts = $posts // force update
      loading = false

      checkShouldLoadMore()
    }),
  )

  // Load page on first mount.
  onMount(() => page.subscribe((page) => emitLoadPage(page)))

  function emitLoadPage(page: number) {
    // In case this is the first load that immediately redirects to the
    // profiles page, exit the function.
    if ($ws.closed) {
      return
    }

    console.log("emitLoadPage")
    if (!loading) {
      console.log("emitLoadPage loading")
      loading = true
      $ws
        .send(UserOperation.GetPosts, {
          type_: $postsSettings.listing,
          sort: $postsSettings.sort,
          page,
          auth: $profile?.user?.jwt,
          limit: 10,
        })
        .catch((err) => {
          errorToast(`Cannot request posts: ${err}`)
        })
    }
  }

  let scrollContainer: HTMLElement
  function checkShouldLoadMore() {
    if (loading) {
      return
    }

    const scrollThreshold = 200 // hard-coded 200px threshold
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer

    const loadMore =
      // scrolledDown, true if we've scrolled down enough to fetch more posts.
      scrollTop + clientHeight + scrollThreshold >= scrollHeight ||
      // postsAllFit, true if we've fetched some posts but all posts fit on
      // the screen. This is a special case because we need to fetch more
      // posts even though we're not scrolled down.
      ($posts.length > 0 && clientHeight >= scrollHeight)

    if (loadMore) {
      $page++
    }
  }

  function resetPosts() {
    console.debug("resetting posts")
    $posts = []
    $page = 1
  }
</script>

<svelte:head>
  <title>Posts | Slemmy</title>
</svelte:head>

<RevealingShell
  bind:scrollContainer
  on:scroll={() => {
    $lastScrollTop = scrollContainer.scrollTop
    checkShouldLoadMore()
  }}
>
  <div slot="pageHeader">
    <AppBar slotLead="items-baseline">
      <h1 slot="lead" class="text-2xl font-bold">Posts</h1>
      <div slot="trail" class="space-x-1">
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
      </div>
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
          <div class="input-group-shim" title="Sort">
            <Symbol name="sort" tooltip="Sort" />
          </div>
          <select
            bind:value={$postsSettings.sort}
            on:change={() => resetPosts()}
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
    <ol id="post-list" class="list flex flex-col gap-4 py-4">
      {#each $posts as post}
        <li
          class="flex flex-row gap-0 items-center"
          transition:fade|local={{ duration: 75 }}
        >
          <div class="flex-1 flex flex-col gap-1 w-full">
            <p class="text-sm text-surface-400">
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
                  class="align-bottom text-surface-400"
                />
                {#if urlHostname(post.post.url)}
                  <span class="text-surface-400 text-xs">
                    ({urlHostname(post.post.url)})
                  </span>
                {/if}
              {/if}
            </h3>

            <Markdown
              class="summary !text-sm line-clamp-2 overflow-hidden border-l-4 px-2 border-surface-400"
              markdown={post.post.body || ""}
            />

            <p class="flex flex-wrap gap-2 mt-1">
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
              {#if post.post.nsfw}
                <span class="badge variant-soft !text-red-400 gap-1 px-3">
                  NSFW
                </span>
              {/if}
            </p>
          </div>

          <PostThumbnail post={post.post} />
        </li>
      {/each}
    </ol>

    {#if loading}
      <div
        class="grid h-full place-items-center"
        transition:fade|local={{ duration: 50 }}
      >
        <p class="inline-flex items-center gap-2 mt-8 mb-16">
          <ProgressRadial stroke={80} width="w-4" />
          <span>Fetching more posts...</span>
        </p>
      </div>
    {/if}
  {/await}
</RevealingShell>

<style global lang="postcss">
  #post-list .markdown.summary {
    --block-margin: 0.25rem;
    max-height: 6rem;
  }

  #post-list .markdown.summary img {
    display: none;
  }
</style>
