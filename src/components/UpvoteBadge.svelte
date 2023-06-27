<script lang="ts" context="module">
  import type {
    PostView,
    CommentView,
    PostAggregates,
    CommentAggregates,
  } from "lemmy-js-client"

  export interface PostOrComment {
    counts: PostAggregates | CommentAggregates
    my_vote?: number
  }
</script>

<script lang="ts">
  import { UserOperation } from "lemmy-js-client"
  import { client, profile } from "#/stores.js"
  import { errorToast, infoToast } from "#/lib/toasty.js"

  import Symbol from "#/components/Symbol.svelte"

  export let post: PostView | undefined = undefined
  export let comment: CommentView | undefined = undefined
  export let canDownvote: boolean = false

  export let style: "button" | "none" = "button"
  export let classes: {
    div?: string
    upvoted?: string
    downvoted?: string
  } = {}

  let klass = ""
  export { klass as class }

  $: item = post || (comment as PostOrComment)
  $: button = style == "button"

  $: loggedIn = !!$profile?.user
  $: upvoted = item.my_vote == +1
  $: downvoted = item.my_vote == -1
  let voting = false

  $: upvotedClasses = upvoted ? classes.upvoted || "" : ""
  $: downvotedClasses = downvoted ? classes.downvoted || "" : ""

  async function toggleVoteDelta(delta: number, state: boolean) {
    if (!loggedIn || voting) {
      infoToast("You must be logged in to vote.")
      return
    }

    voting = true

    const score = state ? 0 : delta
    state = !state

    try {
      if (post) {
        await $client.request(UserOperation.CreatePostLike, {
          post_id: post.post.id,
          score,
          auth: $profile?.user?.jwt!,
        })
      }

      if (comment) {
        await $client.request(UserOperation.CreateCommentLike, {
          comment_id: comment.comment.id,
          score,
          auth: $profile?.user?.jwt!,
        })
      }

      item.counts.score += state ? delta : -delta
      item.my_vote = score
    } catch (err) {
      errorToast(`${err}`)
    } finally {
      voting = false
    }
  }
</script>

<div class="{classes.div || ''} inline-flex">
  <button
    class="{klass} {upvotedClasses} inline-flex gap-1 px-3 !border-surface-400"
    class:btn={button}
    class:btn-sm={button}
    class:variant-soft={button && !upvoted}
    class:variant-filled-success={button && upvoted}
    class:hover:text-white={!button}
    class:hover:font-bold={!button}
    class:rounded-r-none={canDownvote}
    class:border-r-1={canDownvote}
    class:upvoted={classes.upvoted || ""}
    disabled={voting}
    on:click|preventDefault|stopPropagation={() => toggleVoteDelta(+1, upvoted)}
  >
    <Symbol name="expand_less" />
    {item.counts.score}
  </button>
  {#if canDownvote}
    <button
      class="{klass} {downvotedClasses} inline-flex gap-1 pl-2 pr-3 rounded-l-none"
      class:btn={button}
      class:btn-sm={button}
      class:variant-soft={button && !downvoted}
      class:variant-filled-error={button && downvoted}
      class:hover:text-white={!button}
      class:hover:font-bold={!button}
      class:downvoted={classes.downvoted || ""}
      disabled={voting}
      on:click={() => toggleVoteDelta(-1, downvoted)}
    >
      <Symbol name="expand_more" />
    </button>
  {/if}
</div>
