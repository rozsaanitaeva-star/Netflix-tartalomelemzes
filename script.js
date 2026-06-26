function scrollToCharts() {
    document.getElementById('charts').scrollIntoView({ behavior: 'smooth' });
}

function parseMultiValue(value) {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(item => item);
}

function countItems(items) {
    const counts = {};
    items.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
}

function getTopN(counts, n) {
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n);
}

let allData = [];

function processData(data) {
    allData = data;
    updateOverview(data);
    renderCharts(data);
}

function updateOverview(data) {
    document.getElementById('total-titles').textContent = data.length;
    
    const movies = data.filter(item => item.type === 'Movie').length;
    const tvShows = data.filter(item => item.type === 'TV Show').length;
    
    document.getElementById('movies-count').textContent = movies;
    document.getElementById('tvshows-count').textContent = tvShows;
    
    const years = data.map(item => parseInt(item.release_year)).filter(y => !isNaN(y));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    document.getElementById('earliest-year').textContent = minYear;
    document.getElementById('latest-year').textContent = maxYear;
}

function renderCharts(data) {
    renderTypeChart(data);
    renderGenreChart(data);
    renderCountryChart(data);
    renderRatingChart(data);
    renderYearChart(data);
    renderAddedChart(data);
}

function renderTypeChart(data) {
    const types = countItems(data.map(item => item.type));
    const ctx = document.getElementById('typeChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(types),
            datasets: [{
                data: Object.values(types),
                backgroundColor: ['#e50914', '#333'],
                borderColor: '#1a1a1a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#fff' }
                }
            }
        }
    });
}

function renderGenreChart(data) {
    const genreCounts = {};
    data.forEach(item => {
        parseMultiValue(item.listed_in).forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
    });
    
    const topGenres = getTopN(genreCounts, 10);
    
    const ctx = document.getElementById('genreChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topGenres.map(g => g[0]),
            datasets: [{
                label: 'Darabszám',
                data: topGenres.map(g => g[1]),
                backgroundColor: '#e50914'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
                    y: { ticks: { color: '#fff' }, grid: { color: '#333' } }
                }
            }
        }
    });
}

function renderCountryChart(data) {
    const countryCounts = {};
    data.forEach(item => {
        parseMultiValue(item.country).forEach(country => {
            countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
    });
    
    const topCountries = getTopN(countryCounts, 10);
    
    const ctx = document.getElementById('countryChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCountries.map(c => c[0]),
            datasets: [{
                label: 'Darabszám',
                data: topCountries.map(c => c[1]),
                backgroundColor: '#e50914'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
                    y: { ticks: { color: '#fff' }, grid: { color: '#333' } }
                }
            }
        }
    });
}

function renderRatingChart(data) {
    const ratingCounts = {};
    data.forEach(item => {
        if (item.rating) {
            ratingCounts[item.rating] = (ratingCounts[item.rating] || 0) + 1;
        }
    });
    
    const topRatings = getTopN(ratingCounts, 10);
    
    const ctx = document.getElementById('ratingChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topRatings.map(r => r[0]),
            datasets: [{
                data: topRatings.map(r => r[1]),
                backgroundColor: ['#e50914', '#ff3d3d', '#666', '#888', '#999', '#aaa'],
                borderColor: '#1a1a1a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#fff' }
                }
            }
        }
    });
}

function renderYearChart(data) {
    const yearCounts = {};
    data.forEach(item => {
        const year = parseInt(item.release_year);
        if (!isNaN(year)) {
            yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
    });
    
    const sortedYears = Object.entries(yearCounts).sort((a, b) => a[0] - b[0]);
    
    const ctx = document.getElementById('yearChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears.map(y => y[0]),
            datasets: [{
                label: 'Tartalmak száma',
                data: sortedYears.map(y => y[1]),
                borderColor: '#e50914',
                backgroundColor: 'rgba(229, 9, 20, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
                    y: { ticks: { color: '#fff' }, grid: { color: '#333' } }
                }
            }
        }
    });
}

function renderAddedChart(data) {
    const addedCounts = {};
    data.forEach(item => {
        if (item.date_added) {
            const match = item.date_added.match(/\d{4}/);
            if (match) {
                const year = match[0];
                addedCounts[year] = (addedCounts[year] || 0) + 1;
            }
        }
    });
    
    const sortedYears = Object.entries(addedCounts).sort((a, b) => a[0] - b[0]);
    
    const ctx = document.getElementById('addedChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedYears.map(y => y[0]),
            datasets: [{
                label: 'Felvételi darabszám',
                data: sortedYears.map(y => y[1]),
                backgroundColor: '#e50914'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                scales: {
                    x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
                    y: { ticks: { color: '#fff' }, grid: { color: '#333' } }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    Papa.parse('netflix_titles.csv', {
        download: true,
        header: true,
        complete: function(results) {
            processData(results.data);
        },
        error: function(err) {
            console.error('CSV betöltési hiba:', err);
        }
    });
});