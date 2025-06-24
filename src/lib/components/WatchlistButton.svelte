<script>
    import { watchlist } from '$lib/stores/watchlist';

    export let media;
    let isInWatchlist = false;
    let isWatched = false;

    watchlist.subscribe(list => {
        const item = list.find(i => i.id === media.id);
        isInWatchlist = !!item;
        isWatched = item?.watched || false;
    });

    function toggleWatchlist() {
        if (isInWatchlist) {
            watchlist.remove(media.id);
        } else {
            watchlist.add(media);
        }
    }

    function toggleWatched(e) {
        e.stopPropagation();
        watchlist.toggleWatched(media.id);
    }
</script>

<div class="flex items-center gap-2">
    <button
        on:click={toggleWatchlist}
        class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
    >
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
    {#if isInWatchlist}
        <input
            type="checkbox"
            checked={isWatched}
            on:change={toggleWatched}
            class="h-4 w-4"
            title="Mark as watched"
        />
    {/if}
</div>