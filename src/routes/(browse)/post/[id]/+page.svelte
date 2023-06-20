<script lang="ts">
  import { page } from "$app/stores"

  import { goto } from "$app/navigation"

  goto(`/p/${$page.params.id}`)
</script>
