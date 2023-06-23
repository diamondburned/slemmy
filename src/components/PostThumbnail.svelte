<script lang="ts">
  import type { Post } from "lemmy-js-client"
  import { modalStore } from "@skeletonlabs/skeleton"
  import PostThumbnailLarge from "#/components/PostThumbnailLarge.svelte"

  export let post: Post

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
    class="h-20 w-20 aspect-square sm:w-36 sm:aspect-auto relative overflow-hidden rounded"
    class:nsfw={post.nsfw}
    class:hidden={!post.thumbnail_url}
    style="background-image: url({post.thumbnail_url})"
    on:click={() => openModal()}
  >
    {#if post.nsfw}
      <div
        class="nsfw-overlay absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center text-white text-xl font-bold bg-black bg-opacity-50"
      >
        NSFW
      </div>
    {/if}
    <img
      loading="lazy"
      class="h-full w-full object-contain"
      class:hidden={post.nsfw}
      src={post.thumbnail_url}
      alt="Post thumbnail"
    />
  </button>
{/if}

<style>
  img,
  div.nsfw-overlay {
    backdrop-filter: blur(10px) brightness(0.75);
  }
</style>
