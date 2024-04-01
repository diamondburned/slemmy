<script lang="ts">
  import { thumbnailURL, urlHostname } from "#/lib/lemmyutils.js"
  import { slide } from "svelte/transition"
  import * as humanize from "#/lib/humanize.js"

  import { Avatar } from "@skeletonlabs/skeleton"
  import Markdown from "#/components/Markdown.svelte"

  import type { CommunityView } from "lemmy-js-client"
  import BarButton from "./BarButton.svelte"
  import Badge from "./Badge.svelte"
  import Symbol from "./Symbol.svelte"

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
      class="mt-4 md:mt-6 w-full max-h-32 md:max-h-52 lg:max-h-64 object-cover rounded-md background-surface-600"
    />
  {/if}

  <div class="my-4 md:my-6 flex">
    <div class="flex-1 flex flex-col sm:flex-row sm:content-start">
      <Avatar
        src={thumbnailURL(community.icon)}
        width="w-24"
        class="sm:mr-4"
        initials={community.title}
        background=""
      />
      <hgroup class="mt-2 md:mt-4 sm:mt-0 sm:self-center">
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
          {communityName}
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
        <a href={community.actor_id} target="_blank">
          <Badge class="!cursor-pointer">
            <div class="inline-block relative pr-1">
              <Symbol name="open_in_new" class="!align-middle" />
              <Avatar
                src="/fediverse.svg"
                width="w-4"
                class="m-auto absolute -bottom-1 -right-0"
                background=""
              />
            </div>
            {urlHostname(community.actor_id)}
          </Badge>
        </a>

        {#if counts.hot_rank}
          <Badge class="!text-red-400">#{counts.hot_rank}</Badge>
        {/if}
        <Badge>
          {humanize.numeral(counts.subscribers)} subscribers
        </Badge>
        <Badge>
          {humanize.numeral(counts.posts)} posts
        </Badge>
        <Badge>
          {humanize.numeral(counts.comments)} comments
        </Badge>
        <Badge>
          {humanize.numeral(counts.users_active_day)} users today
        </Badge>
        <Badge>
          {humanize.numeral(counts.users_active_week)} users this week
        </Badge>
        <Badge>
          {humanize.numeral(counts.users_active_month)} users this month
        </Badge>
      </div>
    </div>
  {/if}
</div>
