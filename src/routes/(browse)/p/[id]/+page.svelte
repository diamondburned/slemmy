<script lang="ts">
  import {
    AppShell,
    AppBar,
    Avatar,
    ProgressRadial,
  } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"
  import Comment from "#/components/Comment.svelte"
  import Markdown from "#/components/Markdown.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"
  import UserBadge from "#/components/UserBadge.svelte"
  import UpvoteBadge from "#/components/UpvoteBadge.svelte"
  import CommunityBadge from "#/components/CommunityBadge.svelte"
  import RelativeTimestamp from "#/components/RelativeTimestamp.svelte"

  import { page } from "$app/stores"
  import { client, posts, profile as profile_ } from "#/stores.js"

  import { swipe } from "svelte-gestures"
  import { goto } from "$app/navigation"
  import { errorToast, infoToast } from "#/lib/toasty.js"
  import { thumbnailURL } from "#/lib/lemmyutils.js"
  import { nestComments } from "#/lib/types.js"
  import { UserOperation } from "lemmy-js-client"
  import type { PostView, ListingType, CommentSortType } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"

  const query = $page.url.searchParams
  const postID = parseInt($page.params.id)

  let listing: ListingType
  let post: PostView
  let sort: CommentSortType
  let comments: NestedCommentView[] | undefined

  $: profile = $profile_! // deal with Svelte being bad
  $: listing = (query.get("listing") as ListingType) || "All"
  $: sort = (query.get("sort") as CommentSortType) || "Top"

  async function initPost() {
    const cached = $posts.find((p) => p.post.id == postID)
    if (cached) {
      post = cached
      return
    }

    const resp = await $client.request(UserOperation.GetPost, {
      id: postID,
    })
    post = resp.post_view
  }

  async function initComments() {
    const resp = await $client.request(UserOperation.GetComments, {
      post_id: postID,
      sort,
      type_: listing,
      // TODO: automatic pagination on scroll
      limit: 50,
      max_depth: 8,
      auth: profile.user?.jwt,
    })
    comments = nestComments(resp.comments)
  }

  $: (async () => {
    try {
      await initPost()
    } catch (err) {
      handleError(err, true)
    }
    try {
      await initComments()
    } catch (err) {
      handleError(err)
    }
  })()

  // It's kind of impossible to guard a possible race condition where a previous
  // user change may arrive after the latest one.

  function handleError(err: unknown, fatal = false) {
    console.log("Fetch error on route /p:", err)
    errorToast(`${err}`)
    if (fatal) goto("/")
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
    <AppShell slotPageContent="mx-auto w-full">
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
            {#if !post.post.ap_id.startsWith(profile.instance.url)}
              <BarButton
                icon=""
                href={post.post.ap_id}
                class="relative"
                tooltip="Open original post"
              >
                <svelte:fragment slot="icon">
                  <Symbol name="open_in_new" />
                  <Avatar
                    src={thumbnailURL(post.community.icon)}
                    width="w-4"
                    class="m-auto absolute -bottom-0 -right-0 align-text-bottom"
                    rounded="rounded-full"
                    initials={post.community.name || ""}
                  />
                </svelte:fragment>
              </BarButton>
            {/if}
            <BarButton
              icon=""
              href="{profile.instance.url}/post/{post.post.id}"
              class="relative"
              tooltip="Open in {profile.instance.name || 'current instance'}"
            >
              <svelte:fragment slot="icon">
                <Symbol name="open_in_new" />
                <Avatar
                  src={thumbnailURL(profile.instance.icon)}
                  width="w-4"
                  class="m-auto absolute -bottom-0 -right-0 align-text-bottom"
                  rounded="rounded-full"
                  initials={profile.instance.name || ""}
                />
              </svelte:fragment>
            </BarButton>
            <BarButton
              icon="share"
              tooltip="Copy post link"
              on:click={() => copyLink()}
            />
          </div>
        </AppBar>
      </div>

      <hgroup class="space-y-4 my-4 container">
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
        </p>
        <div class="flex flex-row flex-wrap gap-2">
          <UpvoteBadge bind:post class="btn" />
          <span class="btn variant-soft pointer-events-none">
            <Symbol name="comment" inline margin="mr-1" class="!align-middle" />
            {post.counts.comments}
          </span>
          <RelativeTimestamp
            date={post.post.published}
            style="long"
            class="btn variant-soft pointer-events-none"
          >
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
            <span class="btn variant-soft pointer-events-none !text-red-400">
              NSFW
            </span>
          {/if}
        </div>
        <PostThumbnailLarge post={post.post} />
      </hgroup>

      <div class="container">
        <Markdown markdown={post?.post.body || ""} />
      </div>

      {#if post && post.counts.comments > 0}
        <div class="funny-width">
          <hr class="my-4" />
        </div>

        {#if !comments}
          <div class="grid my-8 place-items-center container">
            <ProgressRadial stroke={80} width="w-12" />
          </div>
        {:else}
          <div class="comments funny-width mb-4">
            {#each comments as comment}
              <Comment {comment} />
            {/each}
          </div>
        {/if}
      {/if}
    </AppShell>
  {/if}
</div>

<style lang="scss">
  .funny-width {
    max-width: var(--max-page-width);
    padding: 0 calc(var(--max-page-padding) - 0.75rem);
    margin-left: auto;
    margin-right: auto;
  }
</style>
