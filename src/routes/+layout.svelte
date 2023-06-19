<script lang="ts">
  import "#/styles/theme.scss"
  import "@skeletonlabs/skeleton/styles/skeleton.css"
  import "#/styles/base.scss"

  import { Modal, Toast } from "@skeletonlabs/skeleton"

  import { profiles, currentProfile } from "#/stores.js"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"

  function navIfNotIn(base: string) {
    if (!location.pathname.startsWith(base)) {
      goto(base)
    }
  }

  $: {
    if ($page.params._id && parseInt($page.params._id) !== $currentProfile) {
      $currentProfile = parseInt($page.params._id)
    }

    if ($profiles[$currentProfile]) {
      navIfNotIn(`/_/${$currentProfile}`)
    } else if (location.pathname != "/") {
      goto("/")
    }
  }
</script>

<Modal />
<Toast />

<slot />
