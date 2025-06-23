<script>
    import { onMount } from 'svelte';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { getTrending } from '$lib/api/tmdb';

    let trending = [];
    let isLoading = true;
    let error = null;

    onMount(async () => {
        try {
            const data = await getTrending();
            trending = data.results;
        } catch (err) {
            error = 'Failed to load trending content';
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="container mx-auto px-4 py-8">
    <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Movie Discovery</h1>
        <ThemeToggle />
    </header>

    <SearchBar />

    {#if isLoading}
        <div class="text-center py-12">
            <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
        </div>
    {:else if error}
        <p class="text-red-500 text-center py-12">{error}</p>
    {:else}
        <h2 class="text-2xl font-semibold my-6 text-gray-900 dark:text-white">Trending Now</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {#each trending as media}
                <MediaCard {media} />
            {/each}
        </div>
    {/if}
</div>