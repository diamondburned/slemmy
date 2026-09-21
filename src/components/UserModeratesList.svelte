<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton"
  import { thumbnailURL, parseCommunityActorID } from "#/lib/lemmyutils.js"
  import type { CommunityModeratorView } from "lemmy-js-client"
  import { fade } from "svelte/transition"

  let {
    moderates,
    class: className = "",
  }: {
    moderates: CommunityModeratorView[]
    class?: string
  } = $props()
</script>

<div
  class="{className} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-4"
>
  {#each moderates as mod (mod.community.id)}
    {@const handle =
      parseCommunityActorID(mod.community.actor_id) || mod.community.name}
    <a
      href="/c/{handle}"
      class="card card-hover p-4 flex items-start gap-3 bg-surface-800/60 hover:bg-surface-700/60 transition"
      transition:fade={{ duration: 75 }}
    >
      <Avatar
        src={thumbnailURL(mod.community.icon)}
        width="w-12"
        rounded="rounded-full"
        initials={mod.community.name}
        class="shrink-0 mt-0.5"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1">
          <h4 class="font-bold truncate text-base text-surface-100">
            {mod.community.title}
          </h4>
          {#if mod.community.nsfw}
            <span class="badge variant-filled-error text-xs">NSFW</span>
          {/if}
        </div>
        <span class="text-xs text-surface-400 truncate block">
          {handle}
        </span>
        {#if mod.community.description}
          <p class="text-xs text-surface-300 line-clamp-2 mt-1">
            {mod.community.description}
          </p>
        {/if}
      </div>
    </a>
  {/each}
</div>
