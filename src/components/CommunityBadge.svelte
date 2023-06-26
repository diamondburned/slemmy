<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton"

  import { thumbnailURL } from "#/lib/lemmyutils.js"
  import type { Community } from "lemmy-js-client"

  export let community: Community
  export let width = "w-4"
</script>

<a
  href="/c/{community.name}"
  class="inline-flex items-baseline hover:underline hover:text-white truncate"
>
  <Avatar
    src={thumbnailURL(community.icon)}
    {width}
    class="mr-1 self-center"
    rounded="rounded-full"
    initials={community.name}
    background=""
  />
  {community.title}
</a>
