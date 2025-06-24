const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

export async function getOmdbDetails(imdbId) {
    try {
        const response = await fetch(`${BASE_URL}?i=${imdbId}&apikey=${API_KEY}`);
        if (!response.ok) throw new Error('OMDB API request failed');
        return await response.json();
    } catch (error) {
        console.error('OMDB API error:', error);
        return null;
    }
}