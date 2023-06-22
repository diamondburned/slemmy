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
    class:hidden={!post.thumbnail_url}
    style="background-image: url({post.thumbnail_url})"
    on:click={() => openModal()}
  >
    <img
      loading="lazy"
      class="h-full w-full object-contain"
      src={post.thumbnail_url}
      alt="Post thumbnail"
    />
  </button>
{/if}

<style>
  img {
    backdrop-filter: blur(10px) brightness(0.75);
  }
</style>
