<script lang="ts">
  import type { PostView } from "lemmy-js-client"
  import { UserOperation } from "lemmy-js-client"
  import { client, profile } from "#/stores.js"
  import { errorToast } from "#/lib/toasty.js"

  import Symbol from "#/components/Symbol.svelte"

  export let post: PostView
  export let canDownvote: boolean = false

  let className = "btn btn-sm"
  export { className as class }

  $: loggedIn = !!$profile?.user
  $: upvoted = post.my_vote == +1
  $: downvoted = post.my_vote == -1
  let voting = false

  async function toggleVoteDelta(delta: number, state: boolean) {
    if (!loggedIn || voting) {
      return
    }

    voting = true

    const score = state ? 0 : delta
    state = !state

    try {
      await $client.request(UserOperation.CreatePostLike, {
        post_id: post.post.id,
        score,
        auth: $profile?.user?.jwt!,
      })

      if (delta == +1) {
        post.counts.upvotes += state ? +1 : -1
      }
      if (delta == -1) {
        post.counts.downvotes += state ? +1 : -1
      }

      post.counts.score = post.counts.upvotes - post.counts.downvotes
      post.my_vote = score
    } catch (err) {
      errorToast(`${err}`)
    } finally {
      voting = false
    }
  }
</script>

<div class="inline-flex">
  <button
    class="{className} inline-flex gap-1 px-3 !border-surface-400"
    class:variant-soft={!upvoted}
    class:variant-filled-success={upvoted}
    class:rounded-r-none={canDownvote}
    class:border-r-1={canDownvote}
    disabled={voting}
    on:click={() => toggleVoteDelta(+1, upvoted)}
  >
    <Symbol name="expand_less" />
    {post.counts.score}
  </button>
  {#if canDownvote}
    <button
      class="badge inline-flex gap-1 pl-2 pr-3 rounded-l-none"
      class:variant-soft={!downvoted}
      class:variant-filled-error={downvoted}
      disabled={voting}
      on:click={() => toggleVoteDelta(-1, downvoted)}
    >
      <Symbol name="expand_more" />
    </button>
  {/if}
</div>
