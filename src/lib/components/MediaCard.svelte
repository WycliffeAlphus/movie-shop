<script>
    import WatchlistButton from './WatchlistButton.svelte';
    import ShareButton from './ShareButton.svelte';

    export let media;
</script>

<a href="/media/{media.id}" class="card transition-transform hover:scale-105">
    {#if media.poster}
        <img src={media.poster} alt={media.title} class="w-full h-64 object-cover"/>
    {:else}
        <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400">No Poster</span>
        </div>
    {/if}
    <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">{media.title}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{media.year || media.releaseDate?.split('-')[0] || 'N/A'}</p>
        <div class="mt-2 flex justify-between items-center">
            <WatchlistButton {media} />
            <ShareButton {media} />
        </div>
    </div>
</a>