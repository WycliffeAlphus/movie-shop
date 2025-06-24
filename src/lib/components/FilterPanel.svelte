<script>
    export let filters;
    export let onFilterChange;

    let year = filters.year || '';
    let rating = filters.rating || '';
    let runtime = filters.runtime || '';
</script>

<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300">Year</label>
            <input
                type="number"
                bind:value={year}
                on:input={() => onFilterChange({ ...filters, year })}
                placeholder="e.g. 2023"
                class="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
        </div>
        <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300">Min Rating</label>
            <input
                type="number"
                bind:value={rating}
                on:input={() => onFilterChange({ ...filters, rating })}
                placeholder="e.g. 7.0"
                step="0.1"
                min="0"
                max="10"
                class="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
        </div>
        <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300">Max Runtime (min)</label>
            <input
                type="number"
                bind:value={runtime}
                on:input={() => onFilterChange({ ...filters, runtime })}
                placeholder="e.g. 180"
                class="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
        </div>
    </div>
</div>