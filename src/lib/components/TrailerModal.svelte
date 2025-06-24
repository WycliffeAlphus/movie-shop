<script>
    export let videoId;
    export let onClose;

    function handleKeydown(event) {
        if (event.key === 'Escape') onClose();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-3xl">
        <button
            on:click={onClose}
            class="absolute top-4 right-4 text-gray-600 dark:text-gray-300"
            aria-label="Close modal"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
        <iframe
            class="w-full h-64 sm:h-96"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Trailer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
    </div>
</div>