<script lang="ts">
  import { thumbnailURL } from "#/lib/lemmyutils.js"
  import { slide } from "svelte/transition"

  import { Avatar } from "@skeletonlabs/skeleton"
  import Markdown from "#/components/Markdown.svelte"

  import type { CommunityView } from "lemmy-js-client"
  import Symbol from "./Symbol.svelte"
  import BarButton from "./BarButton.svelte"
  import Badge from "./Badge.svelte"

  export let communityView: CommunityView
  export let communityName = communityView.community.name
  $: ({ community, counts } = communityView)

  let expanded = false
</script>

<div>
  {#if community.banner}
    <img
      src={thumbnailURL(community.banner)}
      alt=""
      class="mt-6 w-full h-32 md:h-52 lg:h-64 object-cover rounded-md background-surface-600"
    />
  {/if}

  <div class="my-6 flex">
    <div class="flex-1 flex flex-col sm:flex-row sm:content-start">
      <Avatar
        src={thumbnailURL(community.icon)}
        width="w-24"
        class="sm:mr-4"
        initials={community.title}
        background=""
      />
      <hgroup class="mt-4 sm:mt-0 sm:self-center">
        <h1 class="text-2xl">
          {community.title}
          {#if community.nsfw}
            <Badge class="!ml-1 !align-middle !text-red-400">NSFW</Badge>
          {/if}
        </h1>
        <a
          href={community.actor_id}
          class="text-surface-400 no-underline hover:underline"
          target="_blank"
        >
          !{communityName}
        </a>
      </hgroup>
    </div>

    <div class="self-center">
      <BarButton
        tooltip="Show more"
        icon={expanded ? "expand_less" : "expand_more"}
        on:click={() => (expanded = !expanded)}
      />
    </div>
  </div>

  {#if expanded}
    <div class="extras mb-6" transition:slide={{ duration: 150 }}>
      {#if community.description}
        <h2 class="text-xl mb-2">Description</h2>
        <blockquote class="mb-4 border-l-4 px-2 border-surface-400">
          <Markdown markdown={community.description} />
        </blockquote>
      {/if}

      <div class="flex flex-wrap gap-2">
        {#if counts.hot_rank}
          <Badge class="!text-red-400">#{counts.hot_rank}</Badge>
        {/if}
        <Badge>{counts.subscribers} subscribers</Badge>
        <Badge>{counts.posts} posts</Badge>
        <Badge>{counts.comments} comments</Badge>
        <Badge>{counts.users_active_day} active users today</Badge>
        <Badge>{counts.users_active_week} active users this week</Badge>
        <Badge>{counts.users_active_month} active users this month</Badge>
      </div>
    </div>
  {/if}
</div>
