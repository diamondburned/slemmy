<script lang="ts">
  import type { Post } from "lemmy-js-client"

  export let post: Post
</script>

<img
  class="rounded m-auto w-full max-w-md max-h-md"
  class:hidden={!post.thumbnail_url}
  loading="lazy"
  src={post.thumbnail_url}
  alt="Post thumbnail"
/>
