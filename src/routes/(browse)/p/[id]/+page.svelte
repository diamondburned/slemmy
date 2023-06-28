<script lang="ts">
  import {
    AppShell,
    AppBar,
    Avatar,
    ProgressRadial,
  } from "@skeletonlabs/skeleton"
  import Post from "#/components/Post.svelte"
  import Symbol from "#/components/Symbol.svelte"
  import Comment from "#/components/Comment.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import CommentComposer from "#/components/CommentComposer.svelte"

  import { page } from "$app/stores"
  import {
    client,
    posts,
    commentsSettings,
    profile as profile_,
  } from "#/stores.js"

  import { swipe } from "svelte-gestures"
  import { goto } from "$app/navigation"
  import { errorToast, infoToast } from "#/lib/toasty.js"
  import { thumbnailURL } from "#/lib/lemmyutils.js"
  import { nestComments } from "#/lib/types.js"
  import { modalStore } from "@skeletonlabs/skeleton"
  import { UserOperation } from "lemmy-js-client"
  import type { PostView } from "lemmy-js-client"
  import type { NestedCommentView } from "#/lib/types.js"

  const postID = parseInt($page.params.id)

  let post: PostView
  let comments: NestedCommentView[] | undefined

  $: profile = $profile_! // deal with Svelte being bad

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
      type_: "All",
      sort: $commentsSettings.sort,
      // TODO: automatic pagination on scroll
      limit: 50,
      max_depth: 8,
      auth: profile.user?.jwt,
    })
    comments = nestComments(resp.comments)
  }

  async function resetComments() {
    comments = undefined
    await initComments()
  }

  $: (async () => {
    try {
      await initPost()
    } catch (err) {
      handleError(err, true)
    }
    try {
      await resetComments()
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

  function makeComment() {
    modalStore.trigger({
      type: "component",
      component: {
        ref: CommentComposer,
        props: {
          post,
          refresh: () => resetComments(),
        },
      },
    })
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
            <BarButton
              icon="add_comment"
              tooltip="Write a comment"
              on:click={() => makeComment()}
            />
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
                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/Fediverse_logo_proposal.svg"
                    width="w-4"
                    class="m-auto absolute -bottom-0 -right-0 align-text-bottom"
                    rounded="rounded-full"
                    background=""
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
                  background=""
                />
              </svelte:fragment>
            </BarButton>
            <BarButton
              icon="link"
              tooltip="Copy original post link"
              on:click={() => copyLink()}
            />
          </div>
        </AppBar>
      </div>

      <Post {post} />

      {#if post && post.counts.comments > 0}
        <div class="funny-width">
          <hr class="my-4" />
        </div>

        <div class="container flex flex-row justify-between align-center">
          <h4 class="text-bold text-lg">Comments</h4>
          <div
            class="float-right w-32 input-group input-group-divider grid-cols-[auto_1fr_auto]"
          >
            <div class="input-group-shim !pl-3 !pr-2" title="Sort">
              <Symbol name="sort" tooltip="Sort" />
            </div>
            <select
              class="px-2 py-1"
              bind:value={$commentsSettings.sort}
              on:change={() => resetComments()}
            >
              <option value="Hot">Hot</option>
              <option value="New">New</option>
              <option value="Top">Top</option>
              <option value="Old">Old</option>
            </select>
          </div>
        </div>

        {#if !comments}
          <div class="grid my-8 place-items-center container">
            <ProgressRadial stroke={80} width="w-12" />
          </div>
        {:else}
          <div class="comments funny-width mb-4">
            {#each comments as comment}
              <Comment {post} {comment} refresh={() => resetComments()} />
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
