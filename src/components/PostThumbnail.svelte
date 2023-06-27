<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { modalStore } from "@skeletonlabs/skeleton"
  import { postThumbnailURL } from "#/lib/lemmyutils.js"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"

  export let post: Post
  $: thumbnailURL = postThumbnailURL(post)

  function openModal() {
    modalStore.trigger({
      type: "component",
      component: {
        ref: PostThumbnailLarge,
        props: {
          post,
          class: "pointer-events-none",
        },
      },
    })
  }
</script>

{#if post.thumbnail_url}
  <button
    class="h-20 w-20 aspect-square sm:w-36 sm:aspect-auto overflow-hidden rounded"
    class:nsfw={post.nsfw}
    class:hidden={!thumbnailURL}
    style="background-image: url({thumbnailURL})"
    on:click={() => openModal()}
  >
    {#if post.nsfw}
      <div class="nsfw-overlay z-10 h-full w-full" />
    {:else}
      <img
        loading="lazy"
        class="h-full w-full object-contain"
        class:hidden={post.nsfw}
        src={thumbnailURL}
        alt="Post thumbnail"
      />
    {/if}
  </button>
{/if}

<style>
  img,
  div.nsfw-overlay {
    height: calc(100% + 1px);
    border-radius: 0;
    backdrop-filter: blur(15px) brightness(0.5) contrast(0.65);
  }

  button {
    background-size: cover;
  }
</style>
