<script lang="ts">
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"

  $effect(() => {
    goto(`/p/${$page.params.id}`)
  })
</script>
