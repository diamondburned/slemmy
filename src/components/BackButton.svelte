<script lang="ts">
  import Symbol from "./Symbol.svelte"

  $: canGoBack = history.length > 1

  function goBack() {
    history.back()
  }
</script>

<button
  class="text-surface-400"
  class:hover:text-current={canGoBack}
  on:click={() => goBack()}
  disabled={!canGoBack}
>
  <Symbol inline name="arrow_back_ios" class="w-5" />
  Back
</button>
