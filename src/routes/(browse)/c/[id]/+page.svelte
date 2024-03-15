<script lang="ts">
  import { page } from "$app/stores"
  import { profile, client } from "#/stores.js"
  import { thumbnailURL } from "#/lib/lemmyutils.js"
  import { UserOperation } from "lemmy-js-client"
  import type { CommunityView } from "lemmy-js-client"

  import {
    Avatar,
    AppShell,
    AppBar,
    Accordion,
    AccordionItem,
    ProgressRadial,
  } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"
  import Markdown from "#/components/Markdown.svelte"

  const communityID = $page.params.id
  let resp = $client.request(UserOperation.GetCommunity, {
    name: communityID,
  })
</script>

{#await resp}
  <div class="grid h-full place-items-center">
    <ProgressRadial stroke={80} width="w-12" />
  </div>
{:then resp}
  <AppShell slotPageContent="mx-auto my-4 w-full container">
    <div slot="pageHeader">
      <AppBar>
        <button
          slot="lead"
          class="text-surface-400 hover:text-current"
          on:click={() => history.back()}
        >
          <Symbol inline name="arrow_back_ios" class="w-5" />
          Back
        </button>
      </AppBar>
    </div>

    <div class="header relative">
      <img
        class="w-full object-cover bg-surface-600 rounded absolute top-0"
        alt=" "
        src={thumbnailURL(resp.community_view.community.banner, {
          size: 1920,
          format: "jpg",
        })}
      />

      <div class="avatar pt-2">
        <Avatar
          alt=" "
          src={thumbnailURL(resp.community_view.community.icon)}
          width="w-24"
          class="mx-4"
          rounded="rounded-full"
          initials={resp.community_view.community.name}
          background=""
        />
      </div>
    </div>

    <hgroup>
      <h2 class="text-xl">
        {resp.community_view.community.title}
      </h2>
      <h3 class="text-lg text-surface-300">
        {communityID}
      </h3>
    </hgroup>

    {#if resp.community_view.community.description}
      <AccordionItem class="my-2">
        <h3 slot="lead" class="text-sm text-surface-300">
          Community Description
        </h3>
        <svelte:fragment slot="summary">
          <p class="hidden" />
        </svelte:fragment>
        <svelte:fragment slot="content">
          <blockquote class="border-l-4 px-2 border-surface-400">
            <Markdown
              class="my-2 !text-sm"
              markdown={resp.community_view.community.description}
            />
          </blockquote>
        </svelte:fragment>
      </AccordionItem>
    {/if}
  </AppShell>
{/await}
