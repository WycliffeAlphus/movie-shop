import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialTheme = browser ? localStorage.getItem('theme') || 'light' : 'light';

export const theme = writable(initialTheme);

theme.subscribe(value => {
    if (browser) {
        localStorage.setItem('theme', value);
        document.documentElement.classList.toggle('dark', value === 'dark');
    }
});