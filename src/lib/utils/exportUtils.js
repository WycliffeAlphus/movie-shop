export function exportWatchlist(watchlist, format = 'csv') {
    if (format === 'csv') {
        const headers = ['Title', 'Type', 'Year', 'Watched'];
        const csv = [
            headers.join(','),
            ...watchlist.map(item => 
                `"${item.title.replace(/"/g, '""')}","${item.type}","${item.year || ''}","${item.watched}"`
            )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'watchlist.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}