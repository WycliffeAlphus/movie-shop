<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import WatchlistButton from '$lib/components/WatchlistButton.svelte';
    import ShareButton from '$lib/components/ShareButton.svelte';
    import TrailerModal from '$lib/components/TrailerModal.svelte';
    import { getMediaDetails } from '$lib/api/tmdb';
    import { getOmdbDetails } from '$lib/api/omdb';
    import { getTrailer } from '$lib/api/youtube';
    import { mapMediaData } from '$lib/utils/dataMapper';

    let media = null;
    let isLoading = true;
    let error = null;
    let trailerId = null;
    let showTrailer = false;

    async function loadMedia() {
        try {
            const tmdbData = await getMediaDetails($page.params.id, 'movie'); // Try movie first
            let finalData = tmdbData;
            if (tmdbData.status_code === 34) { // If movie not found, try TV
                finalData = await getMediaDetails($page.params.id, 'tv');
            }
            
            const omdbData = await getOmdbDetails(finalData.imdb_id);
            media = mapMediaData(finalData, omdbData);
            
            trailerId = await getTrailer(media.title);
        } catch (err) {
            error = 'Failed to load media details';
        } finally {
            isLoading = false;
        }
    }

    onMount(loadMedia);
</script>

<div class="container mx-auto px-4 py-8">
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
        <div class="flex flex-col md:flex-row gap-8">
            {#if media.poster}
                <img src={media.poster} alt={media.title} class="w-full md:w-1/3 rounded-lg shadow-md"/>
            {/if}
            <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{media.title}</h1>
                <div class="flex gap-4 mb-4">
                    <WatchlistButton {media} />
                    <ShareButton {media} />
                    {#if trailerId}
                        <button
                            on:click={() => showTrailer = true}
                            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Watch Trailer
                        </button>
                    {/if}
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{media.overview}</p>
                {#if media.genres}
                    <p class="mb-2"><strong>Genres:</strong> {media.genres.join(', ')}</p>
                {/if}
                {#if media.cast}
                    <p class="mb-2"><strong>Cast:</strong> {media.cast.join(', ')}</p>
                {/if}
                {#if media.releaseDate}
                    <p class="mb-2"><strong>Release Date:</strong> {media.releaseDate}</p>
                {/if}
                {#if media.runtime}
                    <p class="mb-2"><strong>Runtime:</strong> {media.runtime}</p>
                {/if}
                {#if media.providers}
                    <p class="mb-2"><strong>Available on:</strong> {media.providers.join(', ')}</p>
                {/if}
                {#if media.rating}
                    <div class="mb-4">
                        <p><strong>Ratings:</strong></p>
                        {#if media.rating.tmdb}
                            <span>TMDB: {media.rating.tmdb}/10</span>
                        {/if}
                        {#if media.rating.imdb}
                            <span class="ml-4">IMDb: {media.rating.imdb}/10</span>
                        {/if}
                        {#if media.rating.rottenTomatoes}
                            <span class="ml-4">Rotten Tomatoes: {media.rating.rottenTomatoes}</span>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        {#if showTrailer && trailerId}
            <TrailerModal videoId={trailerId} onClose={() => showTrailer = false} />
        {/if}
    {/if}
</div>