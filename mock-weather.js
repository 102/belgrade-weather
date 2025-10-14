import { readFileSync, writeFileSync, existsSync } from 'fs';
import { csvParse, csvFormat } from 'd3-dsv';

let history = [];

function generateWeatherData() {
    const now = new Date();
    const hour = now.getHours();
    const baseTemp = 15 + Math.sin((hour - 6) * Math.PI / 12) * 5;
    return {
        main: {
            temp: baseTemp + (Math.random() - 0.5) * 2,
            humidity: 60 + (Math.random() - 0.5) * 20,
            pressure: 1013 + (Math.random() - 0.5) * 10
        },
        wind: { speed: 2 + Math.random() * 3 }
    };
}

async function updateWeatherData() {
    try {
        if (existsSync('history.csv')) {
            try { history = csvParse(readFileSync('history.csv', 'utf-8')); } catch { history = []; }
        } else { history = []; }

        const weatherData = generateWeatherData();
        try { writeFileSync('weather.json', JSON.stringify(weatherData, null, 2)); } catch (e) { console.warn('Unable to write weather.json', e.message || e); }

        const currentData = {
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
            temperature: weatherData.main.temp != null ? weatherData.main.temp.toFixed(1) : '',
            humidity: weatherData.main.humidity != null ? Math.round(weatherData.main.humidity).toFixed(0) : '',
            wind_speed: weatherData.wind.speed != null ? weatherData.wind.speed.toFixed(1) : '',
            pressure: weatherData.main.pressure != null ? weatherData.main.pressure.toFixed(0) : ''
        };

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        history = (history || []).filter(entry => {
            const entryDate = new Date(entry.date);
            return !isNaN(entryDate) && entryDate > twentyFourHoursAgo;
        });

        const updatedData = [...history, currentData];
        try { writeFileSync('history.csv', csvFormat(updatedData)); } catch (e) { console.warn('Unable to write history.csv', e.message || e); }

        console.log('Weather data updated successfully at', new Date().toLocaleString());
    } catch (error) { console.error('Error updating weather data:', error); }
}

updateWeatherData();
setInterval(updateWeatherData, 3600000);