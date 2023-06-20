<script lang="ts">
  import { AppShell, AppBar, ProgressRadial } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"
  import Comment from "#/components/Comment.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import { page } from "$app/stores"
  import { toastStore } from "@skeletonlabs/skeleton"
  import { client, cachedPosts } from "#/stores.js"

  import { relative, absolute } from "#/lib/time.js"
  import { onMount } from "svelte"
  import { swipe } from "svelte-gestures"
  import { goto } from "$app/navigation"
  import { markdown } from "#/lib/markdown.js"
  import type {
    CommentView,
    ListingType,
    CommentSortType,
  } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"
  import { nestComments } from "#/lib/types.js"

  $: query = $page.url.searchParams

  $: postID = parseInt($page.params.id)
  $: parentCommentID = parseInt(query.get("comment") || "") || undefined

  let listing: ListingType
  let sort: CommentSortType

  $: listing = (query.get("listing") as ListingType) || "Local"
  $: sort = (query.get("sort") as CommentSortType) || "Top"

  let post = $cachedPosts[postID]
  let comments: NestedCommentView[] | undefined

  onMount(async () => {
    if (!post) {
      try {
        const resp = await $client.getPost({ id: postID })
        $cachedPosts[postID] = resp.post_view
        post = resp.post_view
      } catch (err) {
        toastError("Cannot fetch posts:", err)
        goto("/")
      }
    }

    if (!comments) {
      try {
        const resp = await $client.getComments({
          // type_: listing,
          // sort,
          post_id: postID,
          parent_id: parentCommentID,
          max_depth: 8,
        })
        comments = nestComments(resp.comments)
      } catch (err) {
        toastError("Cannot fetch comments:", err)
      }
    }
  })

  function toastError(prefix: string, error: string | unknown) {
    console.log("Error on route /p:", error)
    toastStore.trigger({
      message: `${prefix}: ${error}`,
      background: "variant-filled-error",
    })
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
