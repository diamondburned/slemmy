<script lang="ts">
  import PostListPage from "#/components/PostListPage.svelte"
  import CommunitySummary from "#/components/CommunitySummary.svelte"
  import type { CommunityView } from "lemmy-js-client"

  import { page } from "$app/stores"
  import { client } from "#/stores.js"
  import { errorToast } from "#/lib/toasty.js"
  import Loading from "#/components/Loading.svelte"
  import { goto } from "$app/navigation"
  import BackButton from "#/components/BackButton.svelte"

  let communityName = $derived($page.params.cname ?? "")

  let communityView = $state<CommunityView | null>(null)
  let community = $derived(communityView?.community)
  let communityTitle = $derived(community?.title || communityName)

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

  $effect(() => {
    if (communityName.startsWith("!")) {
      const pathname = $page.url.pathname.replace(/^\/c\/!/, "/c/")
      goto(pathname)
    } else if (communityName) {
      load()
    }
  })
</script>

<svelte:head>
  <title>{communityTitle} | Slemmy</title>
</svelte:head>

<PostListPage {communityName}>
  {#snippet headerLead()}
    <BackButton />
  {/snippet}

  {#snippet mainHeader()}
    <div class="border-b border-surface-600 md:mb-2">
      {#if !communityView}
        <Loading />
      {:else}
        <CommunitySummary bind:communityView {communityName} />
      {/if}
    </div>
  {/snippet}
</PostListPage>
