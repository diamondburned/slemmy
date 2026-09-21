<script lang="ts">
  import { AppBar, ProgressRadial, TabGroup, Tab } from "@skeletonlabs/skeleton"
  import { fade, fly } from "svelte/transition"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import { client, profile } from "#/stores.js"
  import { errorToast } from "#/lib/toasty.js"
  import * as humanize from "#/lib/humanize.js"

  import RevealingShell from "#/components/RevealingShell.svelte"
  import BackButton from "#/components/BackButton.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import Symbol from "#/components/Symbol.svelte"
  import Loading from "#/components/Loading.svelte"
  import PostList from "#/components/PostList.svelte"
  import UserSummary from "#/components/UserSummary.svelte"
  import UserCommentList from "#/components/UserCommentList.svelte"
  import UserModeratesList from "#/components/UserModeratesList.svelte"

  import type {
    PersonView,
    PostView,
    CommentView,
    CommunityModeratorView,
    SortType,
  } from "lemmy-js-client"

  let uid = $derived($page.params.uid ?? "")

  let personView = $state<PersonView | null>(null)
  let person = $derived(personView?.person)
  let userTitle = $derived(person?.display_name || person?.name || uid)

  let posts = $state<PostView[]>([])
  let comments = $state<CommentView[]>([])
  let moderates = $state<CommunityModeratorView[]>([])

  let activeTab = $state<"posts" | "comments" | "moderates">("posts")
  let showFilters = $state(false)
  let sort = $state<SortType>("New")

  let loading = $state(false)
  let currentPage = $state(1)
  let noMorePosts = $state(false)
  let noMoreComments = $state(false)
  let scrollContainer = $state<HTMLElement>()

  async function loadInitial() {
    if (!$client || !uid) return

    loading = true
    personView = null
    posts = []
    comments = []
    moderates = []
    currentPage = 1
    noMorePosts = false
    noMoreComments = false

    try {
      const isNumeric = /^\d+$/.test(uid)
      const params: any = {
        sort,
        page: 1,
        limit: 10,
      }
      if (isNumeric) {
        params.person_id = parseInt(uid, 10)
      } else {
        params.username = uid
      }

      const resp = await $client.getPersonDetails(params)
      personView = resp.person_view
      posts = resp.posts || []
      comments = resp.comments || []
      moderates = resp.moderates || []

      noMorePosts = (resp.posts?.length ?? 0) < 10
      noMoreComments = (resp.comments?.length ?? 0) < 10

      // If posts fit on screen, check if we can fetch more
      checkShouldLoadMore()
    } catch (err) {
      console.error("Error fetching user profile", err)
      errorToast(`Error fetching user profile: ${err}`)
    } finally {
      loading = false
    }
  }

  async function loadNextPage() {
    if (!$client || !uid || loading) return
    if (activeTab === "posts" && noMorePosts) return
    if (activeTab === "comments" && noMoreComments) return
    if (activeTab === "moderates") return

    loading = true
    const nextPage = currentPage + 1

    try {
      const isNumeric = /^\d+$/.test(uid)
      const params: any = {
        sort,
        page: nextPage,
        limit: 10,
      }
      if (isNumeric) {
        params.person_id = parseInt(uid, 10)
      } else {
        params.username = uid
      }

      const resp = await $client.getPersonDetails(params)

      const newPosts = (resp.posts || []).filter(
        (got) => !posts.find((old) => old.post.id === got.post.id),
      )
      const newComments = (resp.comments || []).filter(
        (got) => !comments.find((old) => old.comment.id === got.comment.id),
      )

      if ((resp.posts?.length ?? 0) === 0) noMorePosts = true
      if ((resp.comments?.length ?? 0) === 0) noMoreComments = true

      posts.push(...newPosts)
      comments.push(...newComments)
      currentPage = nextPage
    } catch (err) {
      errorToast(`Error fetching more items: ${err}`)
    } finally {
      loading = false
    }
  }

  function checkShouldLoadMore() {
    if (!scrollContainer || loading) return
    if (activeTab === "posts" && noMorePosts) return
    if (activeTab === "comments" && noMoreComments) return
    if (activeTab === "moderates") return

    const scrollThreshold = 200
    const { scrollTop, clientHeight, scrollHeight } = scrollContainer

    const currentCount = activeTab === "posts" ? posts.length : comments.length
    const loadMore =
      scrollTop + clientHeight + scrollThreshold >= scrollHeight ||
      (currentCount > 0 && clientHeight >= scrollHeight)

    if (loadMore) {
      loadNextPage()
    }
  }

  $effect(() => {
    if (uid.startsWith("@")) {
      const pathname = $page.url.pathname.replace(/^\/u\/@/, "/u/")
      goto(pathname)
    } else if (uid && $client) {
      // Re-load when uid or active client changes
      $profile // track profile changes
      loadInitial()
    }
  })
</script>

<svelte:head>
  <title>{userTitle} | Slemmy</title>
</svelte:head>

<RevealingShell
  bind:scrollContainer
  lockHeaderHeight={true}
  onscroll={() => checkShouldLoadMore()}
>
  {#snippet pageHeader()}
    <AppBar slotLead="items-baseline">
      <svelte:fragment slot="lead">
        <BackButton />
      </svelte:fragment>

      <div slot="trail" class="space-x-1">
        <BarButton
          icon="refresh"
          tooltip="Refresh"
          onclick={() => loadInitial()}
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
        transition:fly={{ duration: 100, y: -10 }}
      >
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
          <div class="input-group-shim !pl-3 !pr-2" title="Sort">
            <Symbol name="sort" tooltip="Sort" />
          </div>
          <select bind:value={sort} onchange={() => loadInitial()}>
            <option value="New">New</option>
            <option value="Active">Active</option>
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

  <div class="border-b border-surface-600 md:mb-2">
    {#if !personView}
      <Loading />
    {:else}
      <UserSummary {personView} userName={uid} />
    {/if}
  </div>

  {#if personView}
    <div class="border-b border-surface-600 mb-2">
      <TabGroup
        justify="justify-start"
        active="border-b-2 border-primary-500 font-bold"
        hover="hover:border-b-2 hover:border-surface-400"
      >
        <Tab bind:group={activeTab} name="posts" value="posts">
          <span>Posts</span>
          {#if personView.counts.post_count}
            <span class="badge variant-soft-surface ml-1">
              {humanize.numeral(personView.counts.post_count)}
            </span>
          {/if}
        </Tab>
        <Tab bind:group={activeTab} name="comments" value="comments">
          <span>Comments</span>
          {#if personView.counts.comment_count}
            <span class="badge variant-soft-surface ml-1">
              {humanize.numeral(personView.counts.comment_count)}
            </span>
          {/if}
        </Tab>
        {#if moderates.length > 0}
          <Tab bind:group={activeTab} name="moderates" value="moderates">
            <span>Moderates</span>
            <span class="badge variant-soft-surface ml-1">
              {moderates.length}
            </span>
          </Tab>
        {/if}
      </TabGroup>
    </div>

    {#if activeTab === "posts"}
      <div class="posts-container contents">
        <PostList class="posts-list" {posts} />

        {#if loading || posts.length === 0}
          <div
            class="grid place-items-center my-8"
            transition:fade={{ duration: 50 }}
          >
            {#if loading}
              <p class="inline-flex items-center gap-2">
                <ProgressRadial stroke={80} width="w-4" />
                <span>Fetching more posts...</span>
              </p>
            {:else if posts.length === 0}
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
    {:else if activeTab === "comments"}
      <div class="comments-container contents">
        <UserCommentList {comments} />

        {#if loading || comments.length === 0}
          <div
            class="grid place-items-center my-8"
            transition:fade={{ duration: 50 }}
          >
            {#if loading}
              <p class="inline-flex items-center gap-2">
                <ProgressRadial stroke={80} width="w-4" />
                <span>Fetching more comments...</span>
              </p>
            {:else if comments.length === 0}
              <p
                class="text-center text-surface-400"
                transition:fade={{ duration: 50 }}
              >
                No comments found.
              </p>
            {/if}
          </div>
        {/if}
      </div>
    {:else if activeTab === "moderates"}
      <div class="moderates-container contents">
        <UserModeratesList {moderates} />

        {#if moderates.length === 0}
          <p
            class="text-center text-surface-400 my-8"
            transition:fade={{ duration: 50 }}
          >
            No communities moderated.
          </p>
        {/if}
      </div>
    {/if}
  {/if}
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
