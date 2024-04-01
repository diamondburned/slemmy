<script lang="ts">
  import PostListPage from "#/components/PostListPage.svelte"
  import CommunitySummary from "#/components/CommunitySummary.svelte"
  import type { CommunityView } from "lemmy-js-client"

  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import { client } from "#/stores.js"
  import { errorToast } from "#/lib/toasty.js"
  import Loading from "#/components/Loading.svelte"
  import { goto } from "$app/navigation"
  import BackButton from "#/components/BackButton.svelte"

  const communityName = $page.params.cname

  let communityView: CommunityView | null = null
  $: communityTitle = community?.title || communityName
  $: community = communityView?.community

  async function load() {
    communityView = null
    try {
      const resp = await $client!.getCommunity({ name: communityName })
      communityView = resp.community_view
    } catch (err) {
      console.error("Error fetching community", err)
      errorToast(`Error fetching community: ${err}`)
    }
  }

  // Remove the ! from the community name via a redirection.
  // Only load the page if not.
  if (communityName.startsWith("!")) {
    const pathname = $page.url.pathname.replace(/^\/c\/!/, "/c/")
    goto(pathname)
  } else {
    onMount(load)
  }
</script>

<svelte:head>
  <title>{communityTitle} | Slemmy</title>
</svelte:head>

<PostListPage {communityName}>
  <svelte:fragment slot="headerLead">
    <BackButton />
  </svelte:fragment>

  <div slot="mainHeader" class="border-b border-surface-600 md:mb-2">
    {#if !communityView}
      <Loading />
    {:else}
      <CommunitySummary {communityView} {communityName} />
    {/if}
  </div>
</PostListPage>
