const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const cache = new Map();

async function fetchWithCache(url, options = {}) {
    const cacheKey = url;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const response = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });

        if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return fetchWithCache(url, options);
        }

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('TMDB API error:', error);
        throw error;
    }
}

export async function searchMedia(query, page = 1) {
    if (!query) return { results: [], total_pages: 1 };
    return fetchWithCache(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
}

export async function getTrending(type = 'all', timeWindow = 'week') {
    return fetchWithCache(`${BASE_URL}/trending/${type}/${timeWindow}?api_key=${API_KEY}`);
}

export async function getMediaDetails(id, type) {
    return fetchWithCache(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits,watch/providers,videos,external_ids`);
}

export async function getGenres(type) {
    return fetchWithCache(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
}