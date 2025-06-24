const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function getTrailer(query) {
    try {
        const response = await fetch(`${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query + ' trailer')}&key=${API_KEY}&type=video&maxResults=1`);
        if (!response.ok) throw new Error('YouTube API request failed');
        const data = await response.json();
        return data.items[0]?.id.videoId || null;
    } catch (error) {
        console.error('YouTube API error:', error);
        return null;
    }
}