<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import MediaCard from '$lib/components/MediaCard.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import FilterPanel from '$lib/components/FilterPanel.svelte';
    import { getTrending, getGenres, getMediaByGenre, searchMedia } from '$lib/api/tmdb';
    import { mapMediaData } from '$lib/utils/dataMapper';
    import { getOmdbDetails } from '$lib/api/omdb';

    let trending = [];
    let genres = [];
    let selectedGenre = null;
    let genreMedia = [];
    let searchResults = [];
    let isLoadingTrending = true;
    let isLoadingGenres = false;
    let isLoadingSearch = false;
    let errorTrending = null;
    let errorGenres = null;
    let errorSearch = null;
    let trendingPage = 1;
    let genrePage = 1;
    let searchPage = 1;
    let trendingTotalPages = 1;
    let genreTotalPages = 1;
    let searchTotalPages = 1;
    let searchQuery = '';
    let filters = { rating: 7.0, year: '', runtime: '' };

    async function loadTrending(page = 1) {
        isLoadingTrending = true;
        errorTrending = null;
        try {
            const data = await getTrending('all', 'week', page);
            const itemsWithOmdb = await Promise.all(
                data.results.map(async (item) => {
                    const omdbData = item.imdb_id ? await getOmdbDetails(item.imdb_id) : null;
                    return { tmdb: item, omdb: omdbData };
                })
            );
            trending = itemsWithOmdb
                .filter(({ tmdb, omdb }) => {
                    const releaseYear = (tmdb.release_date || tmdb.first_air_date || '').split('-')[0];
                    const runtime = omdb?.Runtime ? parseInt(omdb.Runtime) : tmdb.runtime || Infinity;
                    return (
                        (!filters.rating || tmdb.vote_average >= filters.rating) &&
                        (!filters.year || (releaseYear && releaseYear === filters.year.toString())) &&
                        (!filters.runtime || (runtime !== Infinity && runtime <= filters.runtime))
                    );
                })
                .slice(0, 5)
                .map(({ tmdb, omdb }) => mapMediaData(tmdb, omdb));
            trendingPage = page;
            trendingTotalPages = data.total_pages;
        } catch (err) {
            errorTrending = 'Failed to load trending content. Please check your internet connection or API keys.';
            console.error('Trending error:', err);
        } finally {
            isLoadingTrending = false;
        }
    }

    async function loadGenres() {
        try {
            const movieGenres = await getGenres('movie');
            const tvGenres = await getGenres('tv');
            genres = [...new Set([...movieGenres.genres, ...tvGenres.genres])].sort((a, b) => a.name.localeCompare(b.name));
            const actionGenre = genres.find(genre => genre.name.toLowerCase() === 'action' && genre.id === 28);
            if (actionGenre) {
                selectedGenre = actionGenre;
                loadGenreMedia(actionGenre);
            }
        } catch (err) {
            errorGenres = 'Failed to load genres.';
            console.error('Genres error:', err);
        }
    }

    async function loadGenreMedia(genre, page = 1) {
        if (!genre) return;
        isLoadingGenres = true;
        errorGenres = null;
        try {
            const data = await getMediaByGenre(genre.id, 'movie', page);
            const itemsWithOmdb = await Promise.all(
                data.results.map(async (item) => {
                    const omdbData = item.imdb_id ? await getOmdbDetails(item.imdb_id) : null;
                    return { tmdb: item, omdb: omdbData };
                })
            );
            genreMedia = itemsWithOmdb
                .filter(({ tmdb, omdb }) => {
                    const releaseYear = (tmdb.release_date || tmdb.first_air_date || '').split('-')[0];
                    const runtime = omdb?.Runtime ? parseInt(omdb.Runtime) : tmdb.runtime || Infinity;
                    return (
                        (!filters.rating || tmdb.vote_average >= filters.rating) &&
                        (!filters.year || (releaseYear && releaseYear === filters.year.toString())) &&
                        (!filters.runtime || (runtime !== Infinity && runtime <= filters.runtime))
                    );
                })
                .map(({ tmdb, omdb }) => mapMediaData(tmdb, omdb));
            genrePage = page;
            genreTotalPages = data.total_pages;
        } catch (err) {
            errorGenres = `Failed to load media for ${genre.name}.`;
            console.error('Genre media error:', err);
        } finally {
            isLoadingGenres = false;
        }
    }

    async function handleSearch(query, page = 1) {
        searchQuery = query;
        if (!query) {
            searchResults = [];
            searchTotalPages = 1;
            searchPage = 1;
            errorSearch = null;
            return;
        }
        isLoadingSearch = true;
        errorSearch = null;
        try {
            const data = await searchMedia(query, page);
            const itemsWithOmdb = await Promise.all(
                data.results.map(async (item) => {
                    const omdbData = item.imdb_id ? await getOmdbDetails(item.imdb_id) : null;
                    return { tmdb: item, omdb: omdbData };
                })
            );
            searchResults = itemsWithOmdb
                .filter(({ tmdb, omdb }) => {
                    const releaseYear = (tmdb.release_date || tmdb.first_air_date || '').split('-')[0];
                    const runtime = omdb?.Runtime ? parseInt(omdb.Runtime) : tmdb.runtime || Infinity;
                    return (
                        (!filters.rating || tmdb.vote_average >= filters.rating) &&
                        (!filters.year || (releaseYear && releaseYear === filters.year.toString())) &&
                        (!filters.runtime || (runtime !== Infinity && runtime <= filters.runtime))
                    );
                })
                .map(({ tmdb, omdb }) => mapMediaData(tmdb, omdb));
            searchPage = page;
            searchTotalPages = data.total_pages;
        } catch (err) {
            errorSearch = 'Failed to load search results. Please check your internet connection or API keys.';
            console.error('Search error:', err);
        } finally {
            isLoadingSearch = false;
        }
    }

    function handleClearSearch() {
        searchQuery = '';
        searchResults = [];
        searchTotalPages = 1;
        searchPage = 1;
        errorSearch = null;
    }

    function handleFilterChange(newFilters) {
        filters = newFilters;
        loadTrending(trendingPage);
        if (selectedGenre) loadGenreMedia(selectedGenre, genrePage);
        if (searchQuery) handleSearch(searchQuery, searchPage);
    }

    function handleGenreSelect(genre) {
        selectedGenre = genre;
        genrePage = 1;
        loadGenreMedia(genre);
    }

    onMount(() => {
        loadTrending();
        loadGenres();
    });
</script>

<div class="container py-8">
    <header class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Movie Discovery</h1>
        <div class="flex items-center gap-4">
            <button
                on:click={() => goto('/watchlist')}
                class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
                View Watchlist
            </button>
            <ThemeToggle />
            <SearchBar bind:query={searchQuery} on:search={(e) => handleSearch(e.detail.query)} />
        </div>
    </header>

    <!-- Filter Panel -->
    <div class="mb-6">
        <FilterPanel {filters} onFilterChange={handleFilterChange} />
    </div>

    <!-- Search Results Section -->
    {#if searchQuery}
        <section class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Search Results for "{searchQuery}"</h2>
                <button
                    on:click={handleClearSearch}
                    class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                    Clear Search
                </button>
            </div>
            {#if isLoadingSearch}
                <div class="flex justify-center py-6">
                    <svg class="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                </div>
            {:else if errorSearch}
                <p class="text-red-500 text-center py-6">{errorSearch}</p>
            {:else if searchResults.length === 0}
                <p class="text-gray-600 dark:text-gray-300 text-center py-6">No results found for "{searchQuery}"</p>
            {:else}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {#each searchResults as media}
                        <MediaCard {media} />
                    {/each}
                </div>
                {#if searchTotalPages > 1}
                    <div class="flex justify-center gap-4 mt-4">
                        <button
                            on:click={() => handleSearch(searchQuery, searchPage - 1)}
                            disabled={searchPage === 1}
                            class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span class="text-gray-600 dark:text-gray-300">Page {searchPage} of {searchTotalPages}</span>
                        <button
                            on:click={() => handleSearch(searchQuery, searchPage + 1)}
                            disabled={searchPage === searchTotalPages}
                            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                {/if}
            {/if}
        </section>
    {/if}

    <!-- Trending Section -->
    {#if !searchQuery}
        <section class="mb-6">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Trending</h2>
            {#if isLoadingTrending}
                <div class="flex justify-center py-6">
                    <svg class="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="var(--foreground)" stroke-width="4"/>
                        <path class="opacity-75" fill="var(--foreground)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 4 7.938l3 3-2.647z"/>
                    </svg>
                </div>
            {:else if errorTrending}
                <p class="text-red-600 text-center py-6">{errorTrending}</p>
            {:else if trending.length === 0}
                <p class="text-gray-600 dark:text-gray-300 text-center py-6">No trending content available</p>
            {:else}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {#each trending as media}
                        <MediaCard {media} />
                    {/each}
                </div>
                {#if trendingTotalPages > 1}
                    <div class="flex justify-center gap-4 mt-4">
                        <button
                            on:click={() => loadTrending(trendingPage - 1)}
                            disabled={trendingPage === 1}
                            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span class="text-gray-600 dark:text-gray-300">Page {trendingPage} of {trendingTotalPages}</span>
                        <button
                            on:click={() => loadTrending(trendingPage + 1)}
                            disabled={trendingPage === trendingTotalPages}
                            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                {/if}
            {/if}
        </section>

        <!-- Genres Section -->
        <section>
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Browse by Genre</h2>
            {#if genres.length > 0}
                <div class="flex flex-wrap gap-2 mb-6">
                    {#each genres as genre}
                        <button
                            on:click={() => handleGenreSelect(genre)}
                            class="genre-button {selectedGenre?.id === genre.id ? 'genre-button-active' : 'genre-button-inactive'}"
                        >
                            {genre.name}
                        </button>
                    {/each}
                </div>
            {:else}
                <p class="text-gray-600 dark:text-gray-300 mb-6 text-center">No genres available</p>
            {/if}

            {#if selectedGenre}
                {#if isLoadingGenres}
                    <div class="flex justify-center py-6">
                        <svg class="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="var(--foreground)" stroke-width="4"/>
                            <path class="opacity-75" fill="var(--foreground)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                    </div>
                {:else if errorGenres}
                    <p class="text-red-600 text-center py-6">{errorGenres}</p>
                {:else if genreMedia.length === 0}
                    <p class="text-gray-600 dark:text-gray-300 text-center py-6">No media available for {selectedGenre.name}</p>
                {:else}
                    <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{selectedGenre.name}</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {#each genreMedia as media}
                            <MediaCard {media} />
                        {/each}
                    </div>
                    {#if genreTotalPages > 1}
                        <div class="flex justify-center gap-4 mt-4">
                            <button
                                on:click={() => loadGenreMedia(selectedGenre, genrePage - 1)}
                                disabled={genrePage === 1}
                                class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span class="text-gray-600 dark:text-gray-300">Page {genrePage} of {genreTotalPages}</span>
                            <button
                                on:click={() => loadGenreMedia(selectedGenre, genrePage + 1)}
                                disabled={genrePage === genreTotalPages}
                                class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    {/if}
                {/if}
            {/if}
        </section>
    {/if}
</div>

<style lang="css">
    header {
        @apply flex-wrap gap-4;
    }
</style>
