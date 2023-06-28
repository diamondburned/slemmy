<script lang="ts">
  import "easymde/dist/easymde.min.css"

  import { errorToast } from "#/lib/toasty.js"
  import { client, profile } from "#/stores.js"
  import { createEventDispatcher, onMount } from "svelte"
  import {
    UserOperation,
    type PostView,
    type CommentView,
  } from "lemmy-js-client"
  import markdownEditor from "easymde"
  import type { Modal } from "@skeletonlabs/skeleton"

  import Comment from "#/components/Comment.svelte"
  import Post from "#/components/Post.svelte"
  import type { NestedCommentView } from "#/lib/types.js"

  export let post: PostView
  export let replyingTo: CommentView | undefined = undefined

  // refresh is called when a comment is created to refresh the comments list.
  export let refresh: (_: void) => void | undefined = undefined

  export let parent: Modal // used only by Skeleton

  let loading = false
  let content = ""
  let textarea: HTMLTextAreaElement

  let editor: markdownEditor | undefined
  onMount(() => {
    editor = new markdownEditor({
      element: textarea,
      forceSync: true,
      autofocus: true,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: "commentComposer",
      },
      hideIcons: ["side-by-side", "horizontal-rule", "clean-block"],
      minHeight: "none",
      previewClass: ["editor-preview", "markdown", "prose"],
      renderingConfig: {
        singleLineBreaks: false,
      },
      styleSelectedText: false,
      status: ["lines", "words"],
    })

    const update = () => {
      content = editor!.value()
    }

    editor.codemirror.on("change", update)
    return () => editor!.codemirror.off("change", update)
  })

  const dispatch = createEventDispatcher<{ create: CommentView }>()
  $: canSend = !loading && !!content && !!$profile?.user

  async function sendComment() {
    if (!canSend) {
      return
    }

    loading = true
    try {
      const resp = await $client.request(UserOperation.CreateComment, {
        post_id: post.post.id,
        content: editor!.value(),
        parent_id: replyingTo?.comment.id,
        auth: $profile!.user!.jwt,
      })

      dispatch("create", resp.comment_view)

      if (refresh) {
        window.location.hash = `comment-${resp.comment_view.comment.id}`
        refresh()
      }

      editor!.value("")
      parent.onClose()
    } catch (err) {
      console.error(err)
      errorToast(`${err}`)
    } finally {
      loading = false
    }
  }
</script>

<div class="card w-full h-full max-w-[750px] max-h-[800px] flex flex-col">
  <header class="card-header">
    <h2 class="text-lg">
      {replyingTo ? "Reply" : "Comment"}
    </h2>
  </header>
  <section class="h-full overflow-hidden flex flex-col">
    <div class="flex-0 max-h-[24rem] overflow-y-auto">
      {#if replyingTo}
        <Comment
          {post}
          {refresh}
          comment={replyingTo}
          controls={false}
          headerClass="px-4"
          contentClass="mx-4 !text-sm"
        />
      {:else}
        <Post
          {post}
          size="small"
          class="my-2 mx-4"
          authorPosition="top"
          showCounters={false}
          showThumbnail={false}
          showExternalLink={false}
          contentClass="my-1 !text-sm"
        />
      {/if}
    </div>
    <hr class="mx-4" />
    <div class="flex-1 h-3/5 min-h-[18rem] px-4">
      <textarea class="hidden" bind:this={textarea} bind:value={content} />
    </div>
  </section>
  <footer class="card-footer">
    <button
      class="btn btn-sm variant-filled float-left"
      on:click={() => parent.onClose()}
    >
      Cancel
    </button>
    <button
      class="btn btn-sm variant-filled-primary float-right"
      on:click={sendComment}
      disabled={!canSend}
    >
      {replyingTo ? "Reply" : "Comment"}
    </button>
  </footer>
</div>
