<script lang="ts">
  import {onMount} from 'svelte'
  import TailwindCss from './TailwindCSS.svelte'
  import Board from './lib/Board.svelte'
  import CategorySelect from './lib/CategorySelect.svelte'
  import getRandomStreamUrl from './lib/functions/getRandomStreamUrl'
  import getBearerOAuthToken from './lib/functions/getBearerOAuthToken'
  import type {ApiCategoryItem} from './lib/functions/getApiCategories'
  import getApiTags from './lib/functions/getApiTags'

  let randomStreamUrl: string = ''
  let bearerToken: string = ''
  let chosenCategories: ApiCategoryItem[] = []
  let viewersMin: number
  let viewersMax: number

  let errorMessage: string = ''

  onMount(() => {
    const setBearerToken = async (): Promise<void> => {
      bearerToken = await getBearerOAuthToken()
      // temp, around 60 requests
      // await getApiTags(bearerToken)
    }
    setBearerToken()
  })

  const setRandomStreamUrl = async (): Promise<void> => {
    if (chosenCategories.length <= 0) {
      errorMessage = 'Select at least one category'
      randomStreamUrl = ''
      return
    }

    errorMessage = ''
    try {
      randomStreamUrl = await getRandomStreamUrl({
        bearerToken,
        viewersMin,
        viewersMax,
        categories: chosenCategories
          .filter(category => category.id)
          .map(category => category.id!),
        // categories: ['670867987'],
        languages: ['en']
      })
      // getApiCategoriesByName(bearerToken, 'pokemon')
      // getApiCategories(bearerToken)
    } catch (error) {
      console.error(error)
      errorMessage =
        error instanceof Error ? error.message : 'Error from server'
      randomStreamUrl = ''
    }
  }
</script>

<TailwindCss />
<h1
  class="absolute top-20 w-full p-4 text-center text-4xl font-bold text-violet-600 md:top-24 md:text-5xl lg:top-32 xl:top-52"
>
  Twitch Streamer Discoverer
</h1>
<main
  class="flex min-h-screen flex-col items-center justify-center bg-neutral-800"
>
  <div class="mt-5 w-full max-w-4xl px-8">
    <div class="mx-auto flex w-full max-w-md items-center justify-center">
      <input
        type="number"
        min="0"
        placeholder="Min viewers"
        bind:value={viewersMin}
        class="mr-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-gray-500 transition duration-300 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <input
        type="number"
        min="0"
        placeholder="Max viewers"
        bind:value={viewersMax}
        class="ml-1 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-gray-500 transition duration-300 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
    <CategorySelect {bearerToken} bind:chosenCategories />

    <div class="mt-4 flex flex-col items-center justify-center py-2 lg:mt-6">
      <button
        class="rounded bg-violet-600 py-2 px-4 font-bold text-white transition-all duration-100 hover:bg-violet-700"
        on:click={setRandomStreamUrl}>Get Random Stream</button
      >
      <div class="my-3 h-6">
        {#if errorMessage}
          <div class="text-2xl font-bold text-red-500">{errorMessage}</div>
        {/if}
        <h1 class="text-2xl font-bold text-gray-300">
          <a class="text-blue-500 hover:text-blue-700" href={randomStreamUrl}
            >{randomStreamUrl}</a
          >
        </h1>
      </div>
    </div>
  </div>
</main>
<footer
  class="absolute bottom-0 w-full bg-violet-800 py-3 px-4 text-center font-semibold text-gray-50 transition-colors duration-500"
>
  <a
    class="text-gray-50 transition-colors duration-100 hover:text-blue-200"
    href="https://eb1811.github.io"
    >Made by <span class="underline">Emmanuil B.</span></a
  >
</footer>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
