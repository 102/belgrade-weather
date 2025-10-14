import { readFileSync, writeFileSync, existsSync } from 'fs';
import { csvParse, csvFormat } from 'd3-dsv';
import fetch from 'node-fetch';

// Read config safely; don't crash if it's missing
let config = { city: 'Belgrade', countryCode: 'RS', apiKey: '', updateInterval: 3600000 };
if (existsSync('config.json')) {
    try {
        config = JSON.parse(readFileSync('config.json', 'utf-8'));
    } catch (e) {
        console.warn('config.json present but invalid JSON — using defaults');
    }
}

let history = [];

function generateMockData() {
    const now = new Date();
    const hour = now.getHours();
    const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 5;
    return {
        main: {
            temp: baseTemp + (Math.random() - 0.5) * 2,
            humidity: 60 + (Math.random() - 0.5) * 20,
            pressure: 1013 + (Math.random() - 0.5) * 10
        },
        wind: {
            speed: 2 + Math.random() * 3
        }
    };
}

async function fetchWeatherData() {
    // If an API key is provided try fetching from OpenWeatherMap, otherwise use generated data
    if (!config.apiKey) {
        return generateMockData();
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${config.city},${config.countryCode}&appid=${config.apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.main) return data;
        console.warn('Unexpected API response, falling back to mock data');
    } catch (e) {
        console.warn('Error fetching from weather API, falling back to mock data:', e.message || e);
    }

    // Fallback to stored weather.json if present
    if (existsSync('weather.json')) {
        try {
            return JSON.parse(readFileSync('weather.json', 'utf-8'));
        } catch (e) {
            console.warn('Could not parse existing weather.json — using generated data');
        }
    }

    return generateMockData();
}

async function updateOnce() {
    try {
        // Load history if present; otherwise start empty
        if (existsSync('history.csv')) {
            try {
                history = csvParse(readFileSync('history.csv', 'utf-8'));
            } catch (e) {
                console.warn('history.csv present but could not be parsed — starting fresh');
                history = [];
            }
        } else {
            history = [];
        }

        const weatherData = await fetchWeatherData();
        // Save latest in a safe way
        try {
            writeFileSync('weather.json', JSON.stringify(weatherData, null, 2));
        } catch (e) {
            console.warn('Unable to write weather.json:', e.message || e);
        }

        const currentData = {
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
            temperature: (weatherData.main && weatherData.main.temp != null) ? Number(weatherData.main.temp).toFixed(1) : '',
            humidity: (weatherData.main && weatherData.main.humidity != null) ? String(Math.round(weatherData.main.humidity)) : '',
            wind_speed: (weatherData.wind && weatherData.wind.speed != null) ? Number(weatherData.wind.speed).toFixed(1) : '',
            pressure: (weatherData.main && weatherData.main.pressure != null) ? weatherData.main.pressure : ''
        };

        // Trim to last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        history = (history || []).filter(entry => {
            const entryDate = new Date(entry.date);
            return !isNaN(entryDate) && entryDate > twentyFourHoursAgo;
        });

        const updatedData = [...history, currentData];

        try {
            writeFileSync('history.csv', csvFormat(updatedData));
        } catch (e) {
            console.warn('Unable to write history.csv:', e.message || e);
        }

        console.log('Weather data updated successfully at', new Date().toLocaleString());
    } catch (e) {
        console.error('Unexpected error in updateOnce:', e);
    }
}

// Run once immediately and then on interval if provided
updateOnce();
if (config.updateInterval && Number.isFinite(config.updateInterval)) {
    setInterval(updateOnce, config.updateInterval);
}