<script>
    import { onMount } from 'svelte';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { getTrending, getGenres, getMediaByGenre } from '$lib/api/tmdb';
    import { mapMediaData } from '$lib/utils/dataMapper';
    import { getOmdbDetails } from '$lib/api/omdb';

    let trending = [];
    let genres = [];
    let selectedGenre = null;
    let genreMedia = [];
    let isLoadingTrending = true;
    let isLoadingGenres = false;
    let errorTrending = null;
    let errorGenres = null;

    // Fetch trending media
    onMount(async () => {
        try {
            const data = await getTrending('all', 'week');
            trending = await Promise.all(
                data.results.map(async (item) => {
                    const omdbData = item.imdb_id ? await getOmdbDetails(item.imdb_id) : null;
                    return mapMediaData(item, omdbData);
                })
            );
        } catch (err) {
            errorTrending = 'Failed to load trending content. Please check your internet connection or API keys.';
            console.error('Trending error:', err);
        } finally {
            isLoadingTrending = false;
        }

        // Fetch genres
        try {
            const movieGenres = await getGenres('movie');
            const tvGenres = await getGenres('tv');
            genres = [...new Set([...movieGenres.genres, ...tvGenres.genres])].sort((a, b) => a.name.localeCompare(b.name));
        } catch (err) {
            errorGenres = 'Failed to load genres.';
            console.error('Genres error:', err);
        }
    });

    // Fetch media for selected genre
    async function handleGenreSelect(genre) {
        selectedGenre = genre;
        isLoadingGenres = true;
        errorGenres = null;
        try {
            const data = await getMediaByGenre(genre.id, 'movie'); // Default to movies
            genreMedia = await Promise.all(
                data.results.map(async (item) => {
                    const omdbData = item.imdb_id ? await getOmdbDetails(item.imdb_id) : null;
                    return mapMediaData(item, omdbData);
                })
            );
        } catch (err) {
            errorGenres = `Failed to load media for ${genre.name}.`;
            console.error('Genre media error:', err);
        } finally {
            isLoadingGenres = false;
        }
    }
</script>

<div class="container py-8">
    <header class="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Movie Discovery</h1>
        <div class="flex items-center gap-4">
            <ThemeToggle />
            <SearchBar />
        </div>
    </header>

    <!-- Trending Section -->
    {#if isLoadingTrending}
        <div class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
        </div>
    {:else if errorTrending}
        <p class="text-red-500 text-center py-12">{errorTrending}</p>
    {:else if trending.length === 0}
        <p class="text-gray-600 dark:text-gray-300 text-center py-12">No trending content available</p>
    {:else}
        <h2 class="text-2xl font-semibold my-6 text-gray-900 dark:text-white">Trending Now</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {#each trending as media}
                <MediaCard {media} />
            {/each}
        </div>
    {/if}

    <!-- Genres Section -->
    <h2 class="text-2xl font-semibold my-6 text-gray-900 dark:text-white">Browse by Genre</h2>
    {#if genres.length > 0}
        <div class="flex flex-wrap gap-2 mb-6">
            {#each genres as genre}
                <button
                    on:click={() => handleGenreSelect(genre)}
                    class="px-4 py-2 rounded {selectedGenre?.id === genre.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} hover:bg-blue-400 hover:text-white transition-colors"
                >
                    {genre.name}
                </button>
            {/each}
        </div>
    {:else}
        <p class="text-gray-600 dark:text-gray-300 mb-6">No genres available</p>
    {/if}

    {#if selectedGenre}
        {#if isLoadingGenres}
            <div class="flex justify-center py-12">
                <svg class="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
            </div>
        {:else if errorGenres}
            <p class="text-red-500 text-center py-12">{errorGenres}</p>
        {:else if genreMedia.length === 0}
            <p class="text-gray-600 dark:text-gray-300 text-center py-12">No media available for {selectedGenre.name}</p>
        {:else}
            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{selectedGenre.name}</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {#each genreMedia as media}
                    <MediaCard {media} />
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    /* Local styles for responsiveness */
    header {
        @apply flex-wrap gap-4;
    }
</style>