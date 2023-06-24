<script lang="ts">
  import { AppShell, AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"
  import Comment from "#/components/Comment.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import { page } from "$app/stores"
  import { ws, posts } from "#/stores.js"

  import { swipe } from "svelte-gestures"
  import { goto } from "$app/navigation"
  import { errorToast, infoToast } from "#/lib/toasty.js"
  import { nestComments } from "#/lib/types.js"
  import { UserOperation } from "lemmy-js-client"
  import type {
    PostView,
    ListingType,
    CommentSortType,
    GetPostResponse,
  } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"

  const query = $page.url.searchParams
  const postID = parseInt($page.params.id)

  let listing: ListingType
  let post: PostView
  let sort: CommentSortType
  let comments: NestedCommentView[] | undefined

  $: listing = (query.get("listing") as ListingType) || "All"
  $: sort = (query.get("sort") as CommentSortType) || "Top"

  $: postEvent = $ws.derive(UserOperation.GetPost, {
    filter: (ev) => ev.post_view.post.id == postID,
    initial: $posts.find((p) => p.post.id == postID)
      ? ({
          post_view: $posts.find((p) => p.post.id == postID),
        } as GetPostResponse)
      : null,
  })

  $: if ($postEvent) post = $postEvent.post_view
  $: commentsEvent = $ws.derive(UserOperation.GetComments, {
    filter: (ev) => ev.comments[0]?.post.id == postID,
  })

  $: console.log("commentsEvent", $commentsEvent)
  $: if ($commentsEvent) comments = nestComments($commentsEvent.comments)

  $: $ws
    .send(UserOperation.GetPost, {
      id: postID,
    })
    .catch((err) => handleError(err))

  // It's kind of impossible to guard a possible race condition where a previous
  // user change may arrive after the latest one.
  $: $ws
    .send(UserOperation.GetComments, {
      post_id: postID,
      sort,
      type_: listing,
      // TODO: automatic pagination on scroll
      limit: 50,
      max_depth: 8,
    })
    .catch((err) => handleError(err))

  function handleError(err: unknown) {
    console.log("Fetch error on route /p:", err)
    errorToast(`Fetch error: ${err}`)
    goto("/")
  }

  function goBack() {
    history.back()
  }

  function copyLink() {
    navigator.clipboard.writeText(post.post.ap_id)
    infoToast("Copied post link to clipboard!")
  }
</script>

<svelte:head>
  <title>{post?.post.name || `Post ${postID}`} | Slemmy</title>
</svelte:head>

<div
  class="contents"
  use:swipe={{ touchAction: "pan-x" }}
  on:swipe={(e) => e.detail.direction == "right" && goBack()}
>
  {#if !post}
    <div class="grid h-full place-items-center">
      <ProgressRadial stroke={80} width="w-12" />
    </div>
  {:else}
    <AppShell slotPageContent="container mx-auto">
      <div slot="pageHeader">
        <AppBar>
          <button
            slot="lead"
            class="text-surface-400 hover:text-current"
            on:click={() => goBack()}
          >
            <Symbol inline name="arrow_back_ios" class="w-5" />
            Back
          </button>

          <div slot="trail" class="space-x-1">
            <BarButton
              icon="link"
              tooltip="Copy Post Link"
              on:click={() => copyLink()}
            />
            <BarButton
              icon="open_in_new"
              href={post.post.ap_id}
              tooltip="Open Post"
            />
          </div>
        </AppBar>
      </div>

      <hgroup class="space-y-4 my-4">
        <h2 class="text-2xl font-semibold">
          <a
            href={post.post.url}
            class={post.post.url ? "hover:underline" : ""}
            target="_blank"
          >
            {post.post.name}
          </a>
          {#if post.post.url}
            <Symbol
              name="open_in_new"
              size="lg"
              class="align-middle text-surface-400"
            />
          {/if}
        </h2>
        <p>
          <UserBadge width="w-[1.5rem]" user={post.creator} />
          <span class="mx-1 text-surface-400">to</span>
          <CommunityBadge width="w-[1.5rem]" community={post.community} />

          <span
            class="sm:border-r-2 border-current text-2xl mx-2 align-middle leading-0"
          />
          <br class="sm:hidden mb-3" />

          <span>
            <Symbol
              name="expand_less"
              inline
              margin="mr-1"
              size=""
              class="!align-middle"
            />
            {post.counts.upvotes - post.counts.downvotes}
          </span>
          <span class="mx-2">ꞏ</span>
          <span>
            <Symbol name="comment" inline margin="mr-1" class="!align-middle" />
            {post.counts.comments}
          </span>
          <span class="mx-2">ꞏ</span>
          <RelativeTimestamp date={post.post.published}>
            <svelte:fragment slot="icon">
              <Symbol
                name="schedule"
                inline
                margin="mr-1"
                class="!align-middle"
              />
            </svelte:fragment>
          </RelativeTimestamp>
          {#if post.post.nsfw}
            <span class="mx-2">ꞏ</span>
            <span class="text-red-400">NSFW</span>
          {/if}
        </p>
        <PostThumbnailLarge post={post.post} />
      </hgroup>

      <Markdown markdown={post?.post.body || ""} />

      {#if post && post.counts.comments > 0}
        <hr class="my-4" />

        {#if !comments}
          <div class="grid my-8 place-items-center">
            <ProgressRadial stroke={80} width="w-12" />
          </div>
        {:else}
          <div class="comments">
            {#each comments as comment}
              <Comment {comment} />
            {/each}
          </div>
        {/if}
      {/if}
    </AppShell>
  {/if}
</div>
