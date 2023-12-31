<script lang="ts" context="module">
  import { UserOperation } from "lemmy-js-client"
  import { LemmyWebsocketClient } from "#/lib/lemmyws.js"
  import { LemmyClient } from "#/lib/lemmyclient.js"
  import type { LemmyConnectMethod } from "#/lib/lemmyclient.js"

  async function createProfile({
    instance,
    username,
    password,
    totp,
  }: {
    instance: string
    username?: string
    password?: string
    totp?: string
  }): Promise<Profile> {
    const instanceURL = instance.includes("://")
      ? instance
      : `https://${instance}`

    // Fast path: check for valid HTTP.
    await fetch(instanceURL, { mode: "no-cors" })

    const method = await LemmyClient.detect(instanceURL)
    const client = LemmyClient.create(instanceURL, method)

    try {
      let user: Profile["user"] | undefined
      if (username && password) {
        const resp = await client.request(UserOperation.Login, {
          username_or_email: username,
          password,
          // totp_2fa_token: totp || undefined,
        })
        if (!resp.jwt) {
          throw new Error("No account found")
        }
        user = {
          name: username,
          jwt: resp.jwt,
        }
      }

      const resp = await client.request(UserOperation.GetSite, {
        auth: user?.jwt,
      })

      return {
        instance: {
          url: instanceURL,
          name: resp.site_view.site.name,
          icon: resp.site_view.site.icon,
          method: method,
        },
        user: user
          ? {
              ...user,
              avatar: resp.my_user?.local_user_view.person.avatar,
              display_name: resp.my_user?.local_user_view.person.display_name,
            }
          : undefined,
      }
    } catch (err) {
      throw err
    } finally {
      client.close()
    }
  }
</script>

<script lang="ts">
  import { profiles, settings, currentProfile } from "#/stores.js"

  import {
    Avatar,
    ListBox,
    ListBoxItem,
    Stepper,
    Step,
    ProgressRadial,
  } from "@skeletonlabs/skeleton"
  import Symbol from "#/components/Symbol.svelte"

  import { goto } from "$app/navigation"
  import { slide, fade, fly } from "svelte/transition"
  import { onMount } from "svelte"
  import { errorToast } from "#/lib/toasty.js"
  import { thumbnailURL, urlHostname } from "#/lib/lemmyutils.js"
  import debounce from "awesome-debounce-promise"
  import type { Profile } from "#/lib/types.js"
  import type { Site } from "lemmy-js-client"

  onMount(() => currentProfile.set(-1))
  $: {
    if ($profiles[$currentProfile]) {
      goto("/")
    }
  }
  let resetting = true
  $: {
    if (resetting) {
      resetting = false
    }
  }

  // Defaults.
  let instance = "beehaw.org"
  let username = ""
  let password = ""
  let totp = ""

  let createInstanceIsValid: boolean | null = null
  let creatingProfile: Profile | null = null
  let creatingError: string | null = null
  let deleteMode = false
  let loggingIn = false

  // TypeScript is not smart enough to know that this is a function.
  // @ts-ignore
  const debouncedCreateProfile = debounce(createProfile, 250)
  $: {
    createInstanceIsValid = null
    debouncedCreateProfile({ instance })
      .then((profile: Profile) => {
        creatingProfile = profile
        createInstanceIsValid = true
      })
      .catch((err: unknown) => {
        console.info("cannot validate instance:", err)
        creatingError = `${err}`
        createInstanceIsValid = false
      })
  }

  async function applyProfile() {
    if (!creatingProfile) return
    loggingIn = true

    try {
      // Do the logging in here so we don't spam every keypress.
      if (username && password) {
        creatingProfile = await createProfile({ instance, username, password })
      }

      $profiles = [...$profiles, creatingProfile]
      $currentProfile = $profiles.length - 1
    } catch (err) {
      errorToast(`${err}`)
    } finally {
      loggingIn = false
    }
  }

  function deleteProfile(ix: number) {
    $profiles = $profiles.filter((_, i) => i != ix)
    $currentProfile = -1
  }
</script>

<svelte:head>
  <title>Profiles | Slemmy</title>
</svelte:head>

<main class="m-auto min-h-full" id="profiles">
  <h1 class="m-4 text-3xl text-center">
    <img
      src="/favicon.png"
      alt="Slemmy logo"
      class="inline align-middle w-10 mx-1"
    />
    Slemmy
  </h1>

  <section class="sm:card max-w-full sm:max-w-md w-full mb-4 p-4 sm:mx-auto">
    <Stepper
      class="flex flex-col h-full"
      regionContent="flex-1 overflow-hidden"
      buttonCompleteLabel={username ? "Login" : "Create"}
      on:complete={() => applyProfile()}
    >
      <Step
        class="h-full flex flex-col flex-1 space-y-0"
        regionContent="flex flex-col flex-1 space-y-0 overflow-x-hidden overflow-y-scroll"
        buttonNext="variant-ghost"
        buttonNextLabel="Create Profile"
      >
        <svelte:fragment slot="header">
          <h2>Choose a Profile</h2>
        </svelte:fragment>

        <svelte:fragment slot="navigation">
          <button
            class="btn btn-icon"
            class:variant-ghost={!deleteMode}
            class:variant-ghost-error={deleteMode}
            title="Delete Mode"
            on:click={() => (deleteMode = !deleteMode)}
          >
            <Symbol name="delete" />
          </button>
        </svelte:fragment>

        <ListBox
          class="profiles pt-2 pb-4 flex-1 rounded-none overflow-x-hidden overflow-y-scroll h-full"
          rounded=""
        >
          {#each $profiles as profile, i}
            <ListBoxItem
              bind:group={$currentProfile}
              name="profile"
              value={i}
              rounded="rounded-container-token"
              padding="px-2 py-2"
            >
              <div class="flex flex-row items-center space-x-2">
                <div class="relative inline-block">
                  <Avatar
                    src={thumbnailURL(profile.instance.icon || "")}
                    width="w-10"
                    rounded="rounded-full"
                    initials={profile.instance.name || profile.instance.url}
                  />
                  {#if profile.user}
                    <Avatar
                      src={thumbnailURL(profile.user.avatar || "")}
                      class="absolute -bottom-0 -right-0 z-10 outline outline-2 outline-surface-800"
                      width="w-5"
                      rounded="rounded-full"
                    />
                  {/if}
                </div>
                <div class="flex-1 leading-5">
                  <div>
                    {#if profile.instance.name}
                      <span>{profile.instance.name}</span>
                      <span class="text-xs ml-1 float-right hidden sm:inline">
                        {urlHostname(profile.instance.url)}
                      </span>
                    {:else}
                      <span>
                        {urlHostname(profile.instance.url)}
                      </span>
                    {/if}
                  </div>
                  {#if profile.user}
                    <div class="text-sm">
                      {#if profile.user.display_name}
                        <span>{profile.user.display_name}</span>
                        <span class="text-xs ml-1 float-right hidden sm:inline">
                          @{profile.user.name}
                        </span>
                      {:else}
                        <span>@{profile.user.name}</span>
                      {/if}
                    </div>
                  {/if}
                </div>
                {#if deleteMode}
                  <button
                    class="btn btn-icon btn-icon-sm variant-ringed-error hover:variant-ghost-error text-red-400"
                    title="Delete This Profile"
                    on:click={() => deleteProfile(i)}
                    transition:fly|local={{ duration: 75, x: 10 }}
                  >
                    <Symbol name="clear" />
                  </button>
                {/if}
              </div>
            </ListBoxItem>
          {:else}
            <p class="italic text-sm text-center text-surface-400 py-4">
              No profiles yet.
            </p>
          {/each}
        </ListBox>
      </Step>
      <Step
        class="h-full flex flex-col flex-1"
        regionContent="flex flex-col flex-1"
        locked={loggingIn ||
          !createInstanceIsValid ||
          (!!username && !password)}
      >
        <svelte:fragment slot="header">
          <h2>Create Profile</h2>
        </svelte:fragment>

        <form class="flex flex-col flex-1">
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
                <Symbol
                  name="close"
                  inline
                  class="text-red-500 float-right"
                  tooltip={creatingError || ""}
                />
              {/if}
              {#if createInstanceIsValid === null}
                <ProgressRadial
                  class="float-right"
                  width="w-[1.25rem]"
                  stroke={100}
                />
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
            <input
              type="text"
              class="input"
              placeholder="(optional)"
              bind:value={username}
              disabled={!createInstanceIsValid}
            />
          </label>

          {#if createInstanceIsValid && !!username}
            <div
              class="flex flex-row mb-2 gap-2"
              transition:slide|local={{ duration: 100 }}
            >
              <label class="label flex-1">
                <span>Password</span>
                <input type="password" class="input" bind:value={password} />
              </label>
              <label class="label w-20">
                <span>TOTP</span>
                <input
                  type="text"
                  class="input font-mono"
                  pattern={`[0-9]{6}`}
                  bind:value={totp}
                  disabled
                />
              </label>
            </div>
          {/if}
        </form>
      </Step>
    </Stepper>
  </section>

  <footer class="absolute w-full opacity-80 bottom-0">
    <div
      class="container my-4 flex flex-col sm:flex-row items-center justify-between"
    >
      <p class="markdown prose !m-0 !text-sm">
        Made with ❤️ and 🏳️‍⚧️ by
        <a href="https://libdb.so" target="_blank">Diamond</a>
      </p>
      <p class="markdown prose !m-0 !text-sm">
        <a class="link" href="https://libdb.so/slemmy" target="_blank">
          Source code
        </a>
        is licensed under the
        <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank">
          AGPLv3
        </a>
      </p>
    </div>
  </footer>
</main>

<style global lang="postcss">
  #profiles {
    width: 100%;

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
