<script lang="ts">
  import type { Post } from "lemmy-js-client"

  import { onMount } from "svelte"

  export let post: Post
</script>

{#if post.thumbnail_url}
  <div
    class="h-20 w-20 aspect-square sm:w-36 sm:aspect-auto relative overflow-hidden rounded"
    style="background-image: url({post.thumbnail_url})"
  >
    <img
      class="h-full w-full object-contain"
      src={post.thumbnail_url}
      alt="Post thumbnail"
    />
  </div>
{/if}

<style>
  img {
    backdrop-filter: blur(10px) brightness(0.75);
  }
</style>
