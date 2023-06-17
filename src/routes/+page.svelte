<script lang="ts">
  import * as svelte from "svelte"
  import { goto } from "$app/navigation"
  import { modalStore } from "@skeletonlabs/skeleton"
  import {
    profiles,
    currentProfile,
    currentProfileIx,
    settings,
  } from "#/stores.js"

  import { LemmyHTTP } from "#/lib/types.js"

  import {
    AppShell,
    Avatar,
    ListBox,
    ListBoxItem,
    Stepper,
    Step,
  } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"

  svelte.onMount(() => {
    if ($settings.autoLogin && $currentProfile) {
      goto(`/p/${$currentProfile.index}`)
    }
  })

  let createParams = {
    instance: "",
    username: "",
    password: "",
  }

  let createInstanceIsValid: boolean = false
  $: {
    const lastInstance = createParams.instance
    createInstanceIsValid = false
    isValidInstance(lastInstance).then((valid) => {
      if (lastInstance !== createParams.instance) return
      createInstanceIsValid = valid
    })
  }

  async function isValidInstance(instance: string): Promise<boolean> {
    if (!instance.includes("://")) {
      instance = `https://${instance}`
    }

    const client = new LemmyHTTP(instance)
    try {
      await client.getSite({})
      return true
    } catch (err) {
      return false
    }
  }

  async function createProfile() {}
</script>

<svelte:head>
  <title>Profiles | Slemmy</title>
</svelte:head>

<main class="m-auto">
  <h1 class="mx-4 text-3xl text-center">Slemmy</h1>

  <section class="card p-4 m-2 sm:m-4">
    <Stepper
      class="flex flex-col"
      regionContent="flex-1"
      on:complete={() => createProfile()}
    >
      <Step
        class="h-full flex flex-col flex-1"
        regionContent="flex flex-col flex-1"
        buttonNext="variant-ghost"
        buttonNextLabel="Create Profile"
      >
        <svelte:fragment slot="header">Choose a Profile</svelte:fragment>

        <ListBox class="profiles py-2 flex-1">
          {#each $profiles as profile, i}
            <ListBoxItem
              bind:group={$currentProfileIx}
              name="profile"
              value={i}
            >
              <div class="flex flex-row">
                <div class="flex-1">
                  {profile.instance}
                </div>
              </div>
            </ListBoxItem>
          {:else}
            <p class="italic text-sm text-center text-gray-400 py-4">
              No profiles yet.
            </p>
          {/each}
        </ListBox>
      </Step>
      <Step
        class="h-full flex flex-col flex-1"
        regionContent="flex flex-col flex-1"
        locked={createInstanceIsValid}
      >
        <svelte:fragment slot="header">Create Profile</svelte:fragment>

        <form
          class="flex flex-col flex-1"
          on:submit|preventDefault={createProfile}
        >
          <label class="label mb-2">
            <span>Instance</span>
            <input
              type="text"
              class="input"
              class:input-success={createInstanceIsValid}
              placeholder="beehaw.org"
              bind:value={createParams.instance}
            />
          </label>

          <label class="label mb-2">
            <span>Username or Email (optional)</span>
            <input
              type="text"
              class="input"
              bind:value={createParams.username}
            />
          </label>

          <label class="label mb-2">
            <span>Password (optional)</span>
            <input
              type="password"
              class="input"
              bind:value={createParams.password}
            />
          </label>
        </form>
      </Step>
    </Stepper>
  </section>
</main>

<style global lang="postcss">
  main {
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
