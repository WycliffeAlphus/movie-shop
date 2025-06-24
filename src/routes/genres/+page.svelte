<script>
    import { onMount } from 'svelte';
    import { getGenres } from '$lib/api/tmdb';
    import MediaCard from '$lib/components/MediaCard.svelte';

    let genres = [];
    let selectedGenre = null;
    let media = [];
    let isLoading = true;
    let error = null;

    async function loadGenres() {
        try {
            const movieGenres = await getGenres('movie');
            const tvGenres = await getGenres('tv');
            genres = [...new Set([...movieGenres.genres, ...tvGenres.genres])];
        } catch (err) {
            error = 'Failed to load genres';
        } finally {
            isLoading = false;
        }
    }

    async function loadMediaByGenre(genreId) {
        isLoading = true;
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreId}`);
            const data = await response.json();
            media = data.results;
        } catch (err) {
            error = 'Failed to load media';
        } finally {
            isLoading = false;
        }
    }

    onMount(loadGenres);

    function handleGenreSelect(genre) {
        selectedGenre = genre;
        loadMediaByGenre(genre.id);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Browse by Genre</h1>

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
        <div class="flex flex-wrap gap-2 mb-6">
            {#each genres as genre}
                <button
                    on:click={() => handleGenreSelect(genre)}
                    class="px-4 py-2 rounded {selectedGenre?.id === genre.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}"
                >
                    {genre.name}
                </button>
            {/each}
        </div>

        {#if selectedGenre}
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{selectedGenre.name}</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {#each media as item}
                    <MediaCard media={item} />
                {/each}
            </div>
        {/if}
    {/if}
</div>