import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialWatchlist = browser ? JSON.parse(localStorage.getItem('watchlist') || '[]') : [];

function createWatchlist() {
    const { subscribe, update } = writable(initialWatchlist);

    return {
        subscribe,
        add: (item) => update(list => {
            const newList = [...list, { ...item, watched: false }];
            if (browser) localStorage.setItem('watchlist', JSON.stringify(newList));
            return newList;
        }),
        remove: (id) => update(list => {
            const newList = list.filter(item => item.id !== id);
            if (browser) localStorage.setItem('watchlist', JSON.stringify(newList));
            return newList;
        }),
        toggleWatched: (id) => update(list => {
            const newList = list.map(item => 
                item.id === id ? { ...item, watched: !item.watched } : item
            );
            if (browser) localStorage.setItem('watchlist', JSON.stringify(newList));
            return newList;
        })
    };
}

export const watchlist = createWatchlist();