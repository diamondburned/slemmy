<script lang="ts">
  import PostListPage from "#/components/PostListPage.svelte"
  import { profile } from "#/stores"
</script>

<svelte:head>
  <title>Frontpage | Slemmy</title>
</svelte:head>

{#if $profile}
  <PostListPage title="Frontpage" />
{/if}
