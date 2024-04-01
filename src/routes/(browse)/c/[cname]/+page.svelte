<script lang="ts">
  import PostListPage from "#/components/PostListPage.svelte"
  import CommunitySummary from "#/components/CommunitySummary.svelte"
  import type { CommunityView } from "lemmy-js-client"

  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import { client } from "#/stores.js"
  import { errorToast } from "#/lib/toasty.js"
  import Loading from "#/components/Loading.svelte"
  import BarButton from "#/components/BarButton.svelte"
  import Symbol from "#/components/Symbol.svelte"
  import { Avatar } from "@skeletonlabs/skeleton"

  const communityName = $page.params.cname

  let communityView: CommunityView | null = null
  $: communityTitle = community?.title || communityName
  $: community = communityView?.community

  onMount(async () => {
    communityView = null
    try {
      const resp = await $client!.getCommunity({ name: communityName })
      communityView = resp.community_view
    } catch (err) {
      console.error("Error fetching community", err)
      errorToast("Error fetching this community")
    }
  })
</script>

<svelte:head>
  <title>{communityTitle} | Slemmy</title>
</svelte:head>

<PostListPage title={communityTitle} {communityName}>
  <div slot="headerButtonsStart" class="contents">
    <BarButton
      icon=""
      href={community?.actor_id}
      class="relative"
      tooltip="Open original post"
    >
      <svelte:fragment slot="icon">
        <Symbol name="open_in_new" />
        <Avatar
          src="/fediverse.svg"
          width="w-4"
          class="m-auto absolute -bottom-0 -right-0 align-text-bottom"
          background=""
        />
      </svelte:fragment>
    </BarButton>
  </div>

  <div slot="mainHeader" class="border-b border-surface-600 mb-2">
    {#if !communityView}
      <Loading />
    {:else}
      <CommunitySummary {communityView} {communityName} />
    {/if}
  </div>
</PostListPage>
