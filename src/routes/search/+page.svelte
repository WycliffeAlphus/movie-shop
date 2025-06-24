<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import FilterPanel from '$lib/components/FilterPanel.svelte';
    import { searchMedia } from '$lib/api/tmdb';

    let results = [];
    let isLoading = false;
    let error = null;
    let currentPage = 1;
    let totalPages = 1;
    let filters = {};

    $: query = $page.url.searchParams.get('q');

    async function loadResults(page = 1) {
        if (!query) return;
        isLoading = true;
        try {
            const data = await searchMedia(query, page);
            results = data.results.filter(item => 
                (!filters.year || item.release_date?.startsWith(filters.year)) &&
                (!filters.rating || item.vote_average >= filters.rating) &&
                (!filters.runtime || item.runtime <= filters.runtime)
            );
            currentPage = page;
            totalPages = data.total_pages;
        } catch (err) {
            error = 'Failed to load search results';
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        loadResults();
    });

    $: if (query || filters) {
        loadResults(1);
    }

    function handleFilterChange(newFilters) {
        filters = newFilters;
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Search Results for "{query || ''}"</h1>
    
    <FilterPanel {filters} onFilterChange={handleFilterChange} />

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
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {#each results as media}
                <MediaCard {media} />
            {/each}
        </div>

        {#if totalPages > 1}
            <div class="flex justify-center gap-2 mt-8">
                <button
                    on:click={() => loadResults(currentPage - 1)}
                    disabled={currentPage === 1}
                    class="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span class="py-2">Page {currentPage} of {totalPages}</span>
                <button
                    on:click={() => loadResults(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    class="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        {/if}
    {/if}
</div>