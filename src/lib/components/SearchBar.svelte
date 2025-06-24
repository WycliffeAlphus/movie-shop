<script>
    import { debounce } from '$lib/utils/debounce';
    import { goto } from '$app/navigation';

    let query = '';
    let isSearching = false;

    const handleSearch = debounce(async (value) => {
        if (value.length >= 2) {
            isSearching = true;
            await goto(`/search?q=${encodeURIComponent(value)}`);
            isSearching = false;
        }
    }, 300);
</script>

<div class="relative w-full max-w-2xl mx-auto">
    <input
        type="text"
        bind:value={query}
        on:input={() => handleSearch(query)}
        placeholder="Search movies and TV shows..."
        class="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {#if isSearching}
        <span class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg class="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
        </span>
    {/if}
</div>