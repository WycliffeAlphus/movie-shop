# 🎬 Movie Shop

A modern, responsive entertainment discovery platform built with SvelteKit that allows users to search, discover, and manage their favorite movies and TV shows.

## ✨ Features

- **🔍 Smart Search**: Search across movies and TV shows with real-time results
- **📈 Trending Content**: Discover what's trending this week
- **🎭 Genre Browsing**: Explore content by genre with dynamic filtering
- **⭐ Advanced Filtering**: Filter by rating, year, and runtime
- **📝 Personal Watchlist**: Save movies and shows to watch later
- **🌙 Dark/Light Theme**: Toggle between dark and light modes
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile
- **🎥 Trailer Integration**: Watch trailers directly in the app
- **📊 Multiple Rating Sources**: View ratings from TMDB, IMDB, and Rotten Tomatoes
- **🔗 Social Sharing**: Share your favorite content with others

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 2.x with Svelte 5
- **Styling**: TailwindCSS with custom components
- **APIs**:
  - The Movie Database (TMDB) API
  - Open Movie Database (OMDB) API
  - YouTube Data API v3
- **State Management**: Svelte stores with localStorage persistence
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- API keys for TMDB, OMDB, and YouTube (see [API Setup](#-api-setup))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Setup

### TMDB API
1. Visit [The Movie Database](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Add your API key to `.env` as `VITE_TMDB_API_KEY`

### OMDB API
1. Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Add your API key to `.env` as `VITE_OMDB_API_KEY`

### YouTube Data API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Add your API key to `.env` as `VITE_YOUTUBE_API_KEY`

## 📁 Project Structure

```
movie-shop/
├── src/
│   ├── lib/
│   │   ├── api/           # API integration modules
│   │   ├── components/    # Reusable Svelte components
│   │   ├── stores/        # Svelte stores for state management
│   │   └── utils/         # Utility functions
│   ├── routes/            # SvelteKit routes (pages)
│   ├── app.html          # HTML template
│   └── app.css           # Global styles
├── static/               # Static assets
├── package.json
└── README.md
```

## 🔌 API Documentation

### TMDB API Integration (`src/lib/api/tmdb.js`)

The TMDB API provides comprehensive movie and TV show data.

#### Available Functions

##### `searchMedia(query, page = 1)`
Search for movies and TV shows across TMDB database.

**Parameters:**
- `query` (string): Search term
- `page` (number, optional): Page number for pagination (default: 1)

**Returns:** Promise resolving to search results with pagination info

**Example:**
```javascript
import { searchMedia } from '$lib/api/tmdb';

const results = await searchMedia('avengers', 1);
console.log(results.results); // Array of media items
console.log(results.total_pages); // Total pages available
```

##### `getTrending(type = 'all', timeWindow = 'week', page = 1)`
Get trending content from TMDB.

**Parameters:**
- `type` (string): Media type - 'all', 'movie', or 'tv' (default: 'all')
- `timeWindow` (string): Time window - 'day' or 'week' (default: 'week')
- `page` (number): Page number (default: 1)

**Returns:** Promise resolving to trending content

**Example:**
```javascript
import { getTrending } from '$lib/api/tmdb';

const trending = await getTrending('movie', 'week', 1);
```

##### `getMediaDetails(id, type)`
Get detailed information about a specific movie or TV show.

**Parameters:**
- `id` (number): TMDB media ID
- `type` (string): Media type - 'movie' or 'tv'

**Returns:** Promise resolving to detailed media information including credits, watch providers, videos, and external IDs

**Example:**
```javascript
import { getMediaDetails } from '$lib/api/tmdb';

const details = await getMediaDetails(550, 'movie'); // Fight Club
console.log(details.credits.cast); // Cast information
console.log(details['watch/providers']); // Streaming availability
```

##### `getGenres(type)`
Get list of available genres for movies or TV shows.

**Parameters:**
- `type` (string): Media type - 'movie' or 'tv'

**Returns:** Promise resolving to array of genre objects

**Example:**
```javascript
import { getGenres } from '$lib/api/tmdb';

const movieGenres = await getGenres('movie');
const tvGenres = await getGenres('tv');
```

##### `getMediaByGenre(genreId, mediaType = 'movie', page = 1)`
Discover movies or TV shows by genre.

**Parameters:**
- `genreId` (number): Genre ID from getGenres()
- `mediaType` (string): 'movie' or 'tv' (default: 'movie')
- `page` (number): Page number (default: 1)

**Returns:** Promise resolving to media items in the specified genre

**Example:**
```javascript
import { getMediaByGenre } from '$lib/api/tmdb';

const actionMovies = await getMediaByGenre(28, 'movie', 1); // Action genre ID is 28
```

#### Features
- **Caching**: Automatic response caching to reduce API calls
- **Rate Limiting**: Handles 429 responses with automatic retry
- **Error Handling**: Comprehensive error handling with logging

### OMDB API Integration (`src/lib/api/omdb.js`)

The OMDB API provides additional movie data including IMDB ratings and Rotten Tomatoes scores.

#### Available Functions

##### `getOmdbDetails(imdbId)`
Get detailed movie information from OMDB using IMDB ID.

**Parameters:**
- `imdbId` (string): IMDB ID (e.g., 'tt0137523')

**Returns:** Promise resolving to OMDB data or null if not found

**Example:**
```javascript
import { getOmdbDetails } from '$lib/api/omdb';

const omdbData = await getOmdbDetails('tt0137523'); // Fight Club
console.log(omdbData.imdbRating); // IMDB rating
console.log(omdbData.Ratings); // Array of ratings from different sources
```

**Response includes:**
- IMDB rating
- Rotten Tomatoes score
- Metacritic score
- Runtime
- Plot summary
- Awards
- Box office information

### YouTube API Integration (`src/lib/api/youtube.js`)

The YouTube API is used to find and embed movie trailers.

#### Available Functions

##### `getTrailer(query)`
Search for movie/TV show trailers on YouTube.

**Parameters:**
- `query` (string): Search query (typically movie/show title)

**Returns:** Promise resolving to YouTube video ID or null if not found

**Example:**
```javascript
import { getTrailer } from '$lib/api/youtube';

const videoId = await getTrailer('Avengers Endgame');
if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
}
```

## 🗃️ Data Models

### Media Object Structure

The application uses a unified media object structure created by the `mapMediaData` utility:

```javascript
{
    id: number,              // TMDB ID
    title: string,           // Movie title or TV show name
    type: string,            // 'movie' or 'tv'
    poster: string | null,   // Full poster image URL
    overview: string,        // Plot summary
    releaseDate: string,     // Release date (YYYY-MM-DD)
    rating: {
        tmdb: number,        // TMDB rating (0-10)
        imdb: string,        // IMDB rating (e.g., "8.8")
        rottenTomatoes: string // RT score (e.g., "91%")
    },
    genres: string[],        // Array of genre names
    cast: string[],          // Array of main cast names (top 5)
    providers: string[],     // Streaming service names (US only)
    runtime: string,         // Runtime (e.g., "142 min")
    year: string            // Release year
}
```

## 🧩 Components

### Core Components

#### `MediaCard.svelte`
Displays movie/TV show information in a card format.

**Props:**
- `media` (object): Media object with title, poster, rating, etc.

**Features:**
- Responsive design
- Hover effects
- Rating display
- Click navigation to details

#### `SearchBar.svelte`
Search input component with debounced search functionality.

**Props:**
- `query` (string): Current search query (bindable)

**Events:**
- `search`: Fired when search is performed with `{detail: {query}}`

#### `FilterPanel.svelte`
Advanced filtering controls for content discovery.

**Props:**
- `filters` (object): Current filter values
- `onFilterChange` (function): Callback when filters change

**Filter Options:**
- Minimum rating (0-10)
- Release year
- Maximum runtime

#### `WatchlistButton.svelte`
Add/remove items from personal watchlist.

**Props:**
- `media` (object): Media item to add/remove

**Features:**
- Visual feedback for watchlist status
- Automatic localStorage persistence

#### `ThemeToggle.svelte`
Toggle between light and dark themes.

**Features:**
- Persistent theme preference
- Smooth transitions
- System theme detection

#### `TrailerModal.svelte`
Modal component for displaying YouTube trailers.

**Props:**
- `isOpen` (boolean): Modal visibility
- `videoId` (string): YouTube video ID
- `title` (string): Movie/show title

#### `ShareButton.svelte`
Social sharing functionality for media items.

**Props:**
- `media` (object): Media item to share

**Features:**
- Native Web Share API support
- Fallback for unsupported browsers

## 🏪 State Management

### Stores

#### `watchlist.js`
Manages user's personal watchlist with localStorage persistence.

**Methods:**
- `add(item)`: Add item to watchlist
- `remove(id)`: Remove item by ID
- `toggleWatched(id)`: Mark item as watched/unwatched

**Data Structure:**
```javascript
[
    {
        ...mediaObject,
        watched: boolean
    }
]
```

#### `theme.js`
Manages application theme (light/dark mode).

**Features:**
- Automatic system theme detection
- Persistent user preference
- CSS custom property updates

## 🛣️ Routing

### Pages

#### `/` - Home Page
- Trending content display
- Genre browsing
- Search functionality
- Advanced filtering

#### `/search` - Search Results
- Dedicated search results page
- Pagination support
- Filter integration

#### `/media/[id]` - Media Details
- Detailed movie/TV show information
- Cast and crew details
- Trailer integration
- Watchlist management
- Social sharing

#### `/watchlist` - Personal Watchlist
- User's saved movies and shows
- Mark as watched functionality
- Export capabilities

#### `/genres` - Genre Browser
- Browse all available genres
- Genre-specific content discovery

## 🎨 Styling

The application uses TailwindCSS for styling with custom components and utilities.

### Theme Support
- CSS custom properties for theme variables
- Dark/light mode toggle
- Responsive design patterns

### Custom Styles
- Genre button variants
- Loading animations
- Card hover effects
- Modal transitions

## 🔧 Utilities

### `dataMapper.js`
Transforms and combines data from multiple APIs into unified media objects.

### `debounce.js`
Provides debouncing functionality for search inputs and API calls.

### `exportUtils.js`
Handles data export functionality for watchlists and search results.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Optimized card layouts
- Collapsible navigation
- Swipe gestures

## 🚀 Performance

### Optimization Features
- API response caching
- Image lazy loading
- Debounced search inputs
- Pagination for large datasets
- Efficient state management

### Bundle Optimization
- Tree-shaking with Vite
- Code splitting by routes
- Optimized asset loading

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Sync SvelteKit
npm run prepare
```

### Code Quality
- ESLint configuration for Svelte
- Prettier for code formatting
- TypeScript support via JSDoc

## 🔒 Environment Variables

Required environment variables:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_OMDB_API_KEY=your_omdb_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for comprehensive movie data
- [OMDb API](http://www.omdbapi.com/) for additional movie information
- [YouTube Data API](https://developers.google.com/youtube/v3) for trailer integration
- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [TailwindCSS](https://tailwindcss.com/) for utility-first styling
