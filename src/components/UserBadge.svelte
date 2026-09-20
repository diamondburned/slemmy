<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"

  import { thumbnailURL, parseUserActorID } from "#/lib/lemmyutils.js"
  import type { Person } from "lemmy-js-client"

  let {
    user,
    width = "w-4",
    isAdmin = false,
    class: className = "",
  }: {
    user: Person
    width?: string
    isAdmin?: boolean
    class?: string
  } = $props()

  let id = $derived(parseUserActorID(user.actor_id))
  let showAdmin = $derived(isAdmin || (user as any).admin)
</script>

<a
  href={id ? `/u/${id}` : undefined}
  class="{className} inline-flex items-baseline hover:text-white truncate"
>
  <Avatar
    src={thumbnailURL(user.avatar)}
    {width}
    initials=""
    class="mr-1 self-center"
    rounded="rounded-full"
  />
  <span class="name">{user.display_name || user.name}</span>
  {#if showAdmin}
    <Symbol
      tooltip="Admin"
      name="verified_user"
      class="text-red-400 opacity-80 self-center no-underline"
      style="font-size: 1.15em; width: 0.9em;"
    />
  {/if}
</a>

<style>
  a:hover .name {
    text-decoration: underline;
  }
</style>
