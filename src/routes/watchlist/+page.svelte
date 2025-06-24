<script>
    import { watchlist } from '$lib/stores/watchlist';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import { exportWatchlist } from '$lib/utils/exportUtils';
    import { goto } from '$app/navigation';
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>

        <!-- Action Buttons: Export + Back -->
        <div class="flex gap-4">
            {#if $watchlist.length}
                <button
                    on:click={() => exportWatchlist($watchlist, 'csv')}
                    class="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                    Export Watchlist
                </button>
            {/if}

            <button
                on:click={() => goto('/')}
                class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
                ← Back to Home
            </button>
        </div>
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
