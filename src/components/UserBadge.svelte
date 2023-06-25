<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton"

  import { thumbnailURL } from "#/lib/lemmyutils.js"
  import type { Person } from "lemmy-js-client"

  export let user: Person
  export let width = "w-4"
</script>

<a
  href="/u/{user.id}"
  class="inline-flex items-baseline hover:underline hover:text-white truncate"
>
  <Avatar
    src={thumbnailURL(user.avatar)}
    {width}
    initials=""
    class="mr-1 self-center"
    rounded="rounded-full"
  />
  {user.display_name || user.name}
</a>
