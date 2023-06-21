<script lang="ts">
  import { AppShell, AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"
  import Comment from "#/components/Comment.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import { page } from "$app/stores"
  import { ws, cachedPosts } from "#/stores.js"

  import { swipe } from "svelte-gestures"
  import { goto } from "$app/navigation"
  import { markdown } from "#/lib/markdown.js"
  import { errorToast } from "#/lib/toasty.js"
  import { nestComments } from "#/lib/types.js"
  import { UserOperation } from "lemmy-js-client"
  import type { PostView, ListingType, CommentSortType } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"

  $: query = $page.url.searchParams
  $: postID = parseInt($page.params.id)

  let listing: ListingType
  let sort: CommentSortType
  let post: PostView | undefined
  let comments: NestedCommentView[] | undefined

  $: listing = (query.get("listing") as ListingType) || "Local"
  $: sort = (query.get("sort") as CommentSortType) || "Top"

  $: postEvent = $ws.derive(
    UserOperation.GetPost,
    (ev) => ev.post_view.post.id == postID,
  )

  $: if ($postEvent) $cachedPosts[postID] = $postEvent.post_view
  $: if ($postEvent) post = $postEvent.post_view

  $: commentsEvent = $ws.derive(
    UserOperation.GetComments,
    (ev) => ev.comments[0]?.post.id == postID,
  )

  $: comments = $commentsEvent
    ? nestComments($commentsEvent.comments)
    : undefined

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
</script>

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
    <AppShell slotPageContent="container px-4 mx-auto">
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
        </AppBar>
      </div>

      <hgroup class="space-y-4 my-4">
        <h2 class="text-2xl font-semibold">{post.post.name}</h2>
        <p>
          <UserBadge width="w-[1.5rem]" user={post.creator} />
          <span class="mx-1 text-surface-400">to</span>
          <CommunityBadge width="w-[1.5rem]" community={post.community} />

          <span class="hidden sm:inline ml-2 text-lg leading-4">│</span>
          <br class="sm:hidden mb-3" />

          <span>
            <Symbol name="expand_less" inline margin="mr-1" size="" />
            {post.counts.upvotes - post.counts.downvotes}
          </span>
          <span class="mx-2">ꞏ</span>
          <span>
            <Symbol name="comment" inline margin="mr-1" />
            {post.counts.comments}
          </span>
          <span class="mx-2">ꞏ</span>
          <RelativeTimestamp date={post.post.published}>
            <svelte:fragment slot="icon">
              <Symbol name="schedule" inline margin="mr-1" />
            </svelte:fragment>
          </RelativeTimestamp>
        </p>
      </hgroup>

      <div class="body prose !text-white">
        {@html markdown(post?.post.body || "")}
      </div>

      <hr class="my-4" />

      {#if !comments}
        <div class="grid h-full place-items-center">
          <ProgressRadial stroke={80} width="w-12" />
        </div>
      {:else}
        <div class="comments">
          {#each comments as comment}
            <Comment {comment} />
          {/each}
        </div>
      {/if}
    </AppShell>
  {/if}
</div>
