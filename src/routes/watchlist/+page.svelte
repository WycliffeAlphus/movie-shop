<script>
    import { watchlist } from '$lib/stores/watchlist';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import { exportWatchlist } from '$lib/utils/exportUtils';
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
        {#if $watchlist.length}
            <button
                on:click={() => exportWatchlist($watchlist, 'csv')}
                class="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
                Export Watchlist
            </button>
        {/if}
    </div>

    {#if $watchlist.length === 0}
        <p class="text-center text-gray-600 dark:text-gray-300 py-12">Your watchlist is empty</p>
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {#each $watchlist as media}
                <MediaCard {media} />
            {/each}
        </div>
    {/if}
</div>