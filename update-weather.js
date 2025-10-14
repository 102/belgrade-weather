import { readFileSync, writeFileSync, existsSync } from 'fs';
import { csvParse, csvFormat } from 'd3-dsv';
import fetch from 'node-fetch';

let config = { updateInterval: 3600000 };
if (existsSync('config.json')) {
    try { config = JSON.parse(readFileSync('config.json', 'utf-8')); } catch { console.warn('Invalid config.json — using defaults'); }
}

let history = [];

async function fetchWeatherData() {
    // Attempt to use WeatherAPI keyless endpoint removed — fallback to generated data here
    try {
        // If developer wants to restore a real API, they can modify this section
        throw new Error('External API disabled in this script');
    } catch (error) {
        console.warn('Using generated fallback data for now:', error.message);
        // generate similar to mock-weather
        const now = new Date();
        const hour = now.getHours();
        const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 5;
        return {
            main: { temp: baseTemp + (Math.random() - 0.5) * 2, humidity: 60 + (Math.random() - 0.5) * 20, pressure: 1013 + (Math.random() - 0.5) * 10 },
            wind: { speed: 2 + Math.random() * 3 }
        };
    }
}

async function updateWeatherData() {
    try {
        if (existsSync('history.csv')) {
            try { history = csvParse(readFileSync('history.csv', 'utf-8')); } catch { history = []; }
        } else { history = []; }

        const weatherData = await fetchWeatherData();
        try { writeFileSync('weather.json', JSON.stringify(weatherData, null, 2)); } catch (e) { console.warn('Failed to write weather.json', e.message || e); }

        const currentData = {
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
            temperature: (weatherData.main && weatherData.main.temp != null) ? Number(weatherData.main.temp).toFixed(1) : '',
            humidity: (weatherData.main && weatherData.main.humidity != null) ? String(Math.round(weatherData.main.humidity)) : '',
            wind_speed: (weatherData.wind && weatherData.wind.speed != null) ? Number(weatherData.wind.speed).toFixed(1) : '',
            pressure: (weatherData.main && weatherData.main.pressure != null) ? weatherData.main.pressure : ''
        };

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        history = (history || []).filter(entry => {
            const entryDate = new Date(entry.date);
            return !isNaN(entryDate) && entryDate > twentyFourHoursAgo;
        });

        const updatedData = [...history, currentData];
        try { writeFileSync('history.csv', csvFormat(updatedData)); } catch (e) { console.warn('Failed to write history.csv', e.message || e); }
        console.log('Weather data updated successfully at', new Date().toLocaleString());
    } catch (error) { console.error('Error updating weather data:', error); }
}

updateWeatherData();
if (config.updateInterval && Number.isFinite(config.updateInterval)) setInterval(updateWeatherData, config.updateInterval);