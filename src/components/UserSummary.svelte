<script lang="ts">
  import {
    thumbnailURL,
    urlHostname,
    parseUserActorID,
  } from "#/lib/lemmyutils.js"
  import { slide } from "svelte/transition"
  import * as humanize from "#/lib/humanize.js"

  import { Avatar } from "@skeletonlabs/skeleton"
  import Markdown from "#/components/Markdown.svelte"

  import type { PersonView } from "lemmy-js-client"
  import BarButton from "./BarButton.svelte"
  import Badge from "./Badge.svelte"
  import Symbol from "./Symbol.svelte"
  import { infoToast } from "#/lib/toasty.js"

  let {
    personView,
    userName = "",
  }: {
    personView: PersonView
    userName?: string
  } = $props()

  let person = $derived(personView.person)
  let counts = $derived(personView.counts)
  let isAdmin = $derived(personView.is_admin)

  let handle = $derived(
    parseUserActorID(person.actor_id) || userName || person.name,
  )
  let expanded = $state(false)

  function copyUserLink() {
    navigator.clipboard.writeText(person.actor_id)
    infoToast("Copied user link to clipboard!")
  }
</script>

<div>
  {#if person.banner}
    <img
      src={thumbnailURL(person.banner)}
      alt=""
      class="mt-4 md:mt-6 w-full max-h-32 md:max-h-52 lg:max-h-64 object-cover rounded-md background-surface-600"
    />
  {/if}

  <div class="my-4 md:my-6 flex">
    <div class="flex-1 flex flex-col sm:flex-row sm:content-start">
      <Avatar
        src={thumbnailURL(person.avatar)}
        width="w-24"
        class="sm:mr-4 shrink-0"
        initials={person.display_name || person.name}
        background=""
      />
      <hgroup class="mt-2 md:mt-4 sm:mt-0 sm:self-center">
        <h1 class="text-2xl flex items-center flex-wrap gap-1">
          {person.display_name || person.name}
          {#if isAdmin}
            <Badge class="!ml-1 !align-middle !text-red-400">Admin</Badge>
          {/if}
          {#if person.bot_account}
            <Badge class="!ml-1 !align-middle !text-yellow-400">Bot</Badge>
          {/if}
          {#if person.banned}
            <Badge class="!ml-1 !align-middle !text-error-500">Banned</Badge>
          {/if}
        </h1>
        <span class="text-surface-400">{handle}</span>
      </hgroup>
    </div>

    <div class="self-center flex items-center gap-1">
      <BarButton tooltip="Copy user link" icon="share" onclick={copyUserLink} />
      <BarButton
        href={person.actor_id}
        icon="open_in_new"
        tooltip="Open on web"
      />
      <BarButton
        tooltip="Show more"
        icon={expanded ? "expand_less" : "expand_more"}
        bind:active={expanded}
      />
    </div>
  </div>

  {#if expanded}
    <div class="extras mb-6" transition:slide={{ duration: 150 }}>
      {#if person.bio}
        <h2 class="text-xl mb-2">Bio</h2>
        <blockquote class="mb-4 border-l-4 px-2 border-surface-400">
          <Markdown markdown={person.bio} />
        </blockquote>
      {/if}

      <div class="flex flex-wrap gap-2">
        <a href={person.actor_id} target="_blank">
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
            {urlHostname(person.actor_id)}
          </Badge>
        </a>

        <Badge>
          {humanize.numeral(counts.post_count)} posts
        </Badge>
        <Badge>
          {humanize.numeral(counts.comment_count)} comments
        </Badge>
        <Badge>
          <Symbol name="cake" class="mr-1 !align-middle" />
          Joined {new Date(person.published).toLocaleDateString()}
        </Badge>
        {#if person.matrix_user_id}
          <a href="https://matrix.to/#/{person.matrix_user_id}" target="_blank">
            <Badge class="!cursor-pointer">
              <Symbol name="chat" class="mr-1 !align-middle" />
              {person.matrix_user_id}
            </Badge>
          </a>
        {/if}
      </div>
    </div>
  {/if}
</div>
