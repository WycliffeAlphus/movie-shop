export function mapMediaData(tmdbData, omdbData) {
    return {
        id: tmdbData.id,
        title: tmdbData.title || tmdbData.name,
        type: tmdbData.media_type || (tmdbData.title ? 'movie' : 'tv'),
        poster: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null,
        overview: tmdbData.overview || omdbData?.Plot,
        releaseDate: tmdbData.release_date || tmdbData.first_air_date,
        rating: {
            tmdb: tmdbData.vote_average,
            imdb: omdbData?.imdbRating,
            rottenTomatoes: omdbData?.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value
        },
        genres: tmdbData.genres?.map(g => g.name) || omdbData?.Genre?.split(', '),
        cast: tmdbData.credits?.cast?.slice(0, 5).map(c => c.name) || omdbData?.Actors?.split(', '),
        providers: tmdbData['watch/providers']?.results?.US?.flatrate?.map(p => p.provider_name),
        runtime: omdbData?.Runtime,
        year: omdbData?.Year
    };
}