<script lang="ts">
  import { profiles, settings, currentProfile } from "#/stores.js"

  import {
    Avatar,
    ListBox,
    ListBoxItem,
    Stepper,
    Step,
  } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"

  import { goto } from "$app/navigation"
  import { slide } from "svelte/transition"
  import { onMount } from "svelte"
  import { LemmyHTTP } from "#/lib/types.js"
  import { UserOperation } from "lemmy-js-client"
  import { LemmyWebsocketClient } from "#/lib/lemmyws.js"
  import type { Profile } from "#/lib/types.js"
  import type { Site } from "lemmy-js-client"

  let resetting = true
  onMount(() =>
    currentProfile.subscribe(() => {
      if (resetting) {
        resetting = false
        return -1
      }
      goto("/")
    }),
  )

  // Defaults.
  let instance = "beehaw.org"
  let username = ""
  let password = ""

  let createInstanceIsValid: boolean | null = null
  let instanceInfo: Site | null = null
  $: (async () => {
    const lastInstance = instance
    createInstanceIsValid = null
    instanceInfo = null

    const instanceURL = instance.includes("://")
      ? instance
      : `https://${instance}`

    let ws: LemmyWebsocketClient | null = null
    try {
      await fetch(instanceURL, { mode: "no-cors" })

      ws = new LemmyWebsocketClient(instanceURL)

      const resp = await ws.sendForReply(UserOperation.GetSite, {})
      if (lastInstance == instance) {
        createInstanceIsValid = true
        instanceInfo = resp.site_view.site
      }
    } catch (err) {
      console.debug(lastInstance, "failed:", err)
      if (lastInstance == instance) {
        createInstanceIsValid = false
      }
    } finally {
      if (ws) ws.close()
    }
  })()

  async function createProfile() {
    const instanceURL = instance.includes("://")
      ? instance
      : `https://${instance}`

    const profile: Profile = {
      instance: {
        url: instanceURL,
        name: instanceInfo?.name,
        icon: instanceInfo?.icon,
      },
    }

    $profiles = [...$profiles, profile]
    $currentProfile = $profiles.length - 1
  }
</script>

<svelte:head>
  <title>Profiles | Slemmy</title>
</svelte:head>

<main class="m-auto" id="profiles">
  <h1 class="mx-4 text-3xl text-center">
    <img
      src="/favicon.png"
      alt="Slemmy logo"
      class="inline align-middle w-10 mx-1"
    />
    Slemmy
  </h1>

  <section class="card p-4 m-2 sm:m-4">
    <Stepper
      class="flex flex-col"
      regionContent="flex-1"
      on:complete={() => createProfile()}
    >
      <Step
        class="h-full flex flex-col flex-1 space-y-0"
        regionContent="flex flex-col flex-1 space-y-0"
        buttonNext="variant-ghost"
        buttonNextLabel="Create Profile"
      >
        <svelte:fragment slot="header">
          <h2>Choose a Profile</h2>
        </svelte:fragment>

        <ListBox class="profiles py-1 flex-1">
          {#each $profiles as profile, i}
            <ListBoxItem
              bind:group={$currentProfile}
              name="profile"
              value={i}
              rounded="rounded-container-token"
              padding="px-2 py-2"
            >
              <div class="flex flex-row items-center space-x-2">
                {#if profile.instance.icon}
                  <Avatar
                    src={profile.instance.icon}
                    class="inline"
                    width="w-8"
                    rounded="rounded-full"
                  />
                {/if}
                <div class="flex-1">
                  {#if profile.instance.name}
                    <span>{profile.instance.name}</span>
                    <span class="text-xs font-mono ml-1 hidden sm:inline">
                      {profile.instance.url}
                    </span>
                  {:else}
                    <span>{profile.instance.url}</span>
                  {/if}
                </div>
              </div>
            </ListBoxItem>
          {:else}
            <p class="italic text-sm text-center text-surface-400 py-4">
              No profiles yet.
            </p>
          {/each}
        </ListBox>

        {#if $profiles.length != 0}
          <label class="label pb-2">
            <input
              type="checkbox"
              class="checkbox mr-2"
              bind:checked={$settings.autoLogin}
            />
            <span>Automatically log in to this profile</span>
          </label>
        {/if}
      </Step>
      <Step
        class="h-full flex flex-col flex-1"
        regionContent="flex flex-col flex-1"
        locked={!createInstanceIsValid}
      >
        <svelte:fragment slot="header">
          <h2>Create Profile</h2>
        </svelte:fragment>

        <form
          class="flex flex-col flex-1"
          on:submit|preventDefault={createProfile}
        >
          <label class="label mb-2">
            <span>
              Instance
              {#if createInstanceIsValid === true}
                <Symbol
                  name="check"
                  inline
                  class="text-green-500 float-right"
                />
              {/if}
              {#if createInstanceIsValid === false}
                <Symbol name="close" inline class="text-red-500 float-right" />
              {/if}
            </span>
            <input
              type="text"
              class="input"
              class:input-error={createInstanceIsValid === false}
              class:input-success={createInstanceIsValid === true}
              bind:value={instance}
            />
          </label>

          <label class="label mb-2">
            <span>Username/Email</span>
            <!-- TODO: login support -->
            <input
              type="text"
              class="input"
              placeholder="(optional)"
              bind:value={username}
              disabled
            />
          </label>

          {#if username}
            <label class="label mb-2" transition:slide={{ duration: 100 }}>
              <span>Password</span>
              <input type="password" class="input" bind:value={password} />
            </label>
          {/if}
        </form>
      </Step>
    </Stepper>
  </section>
</main>

<style global lang="postcss">
  #profiles {
    @apply h-full;

    width: 100vw;
    max-width: 400px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    .card {
      min-height: 300px;

      display: flex;
      flex-direction: column;

      & > * {
        flex: 1;
      }
    }
  }
</style>
