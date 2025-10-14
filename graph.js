async function loadData() {
    try {
        const response = await fetch('history.csv');
        if (!response.ok) throw new Error('history.csv not found');
        const csvText = await response.text();
        const parsed = d3.csvParse(csvText);
        return parsed;
    } catch (e) {
        console.warn('Could not load history.csv:', e.message || e);
        return [];
    }
}

async function createChart() {
    const data = await loadData();
    if (!data || data.length === 0) {
        const container = document.querySelector('.chart-container');
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#666;">No historical data available yet. Run the updater or refresh later.</div>';
        return;
    }
    const dates = data.map(d => d.date);
    const temperatures = data.map(d => parseFloat(d.temperature));
    const humidity = data.map(d => parseFloat(d.humidity));
    const windSpeed = data.map(d => parseFloat(d.wind_speed));

    // Sort data by date
    const sortedIndices = dates.map((_, i) => i).sort((a, b) => new Date(dates[a]) - new Date(dates[b]));
    const sortedDates = sortedIndices.map(i => dates[i]);
    const sortedTemperatures = sortedIndices.map(i => temperatures[i]);
    const sortedHumidity = sortedIndices.map(i => humidity[i]);
    const sortedWindSpeed = sortedIndices.map(i => windSpeed[i]);

    new Chart('weatherChart', {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: sortedTemperatures,
                    borderColor: 'rgb(255, 99, 132)',
                    yAxisID: 'y-temperature',
                },
                {
                    label: 'Humidity (%)',
                    data: sortedHumidity,
                    borderColor: 'rgb(54, 162, 235)',
                    yAxisID: 'y-humidity',
                },
                {
                    label: 'Wind Speed (m/s)',
                    data: sortedWindSpeed,
                    borderColor: 'rgb(75, 192, 192)',
                    yAxisID: 'y-wind',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Belgrade Weather History'
                }
            },
            scales: {
                'y-temperature': {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                'y-humidity': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                'y-wind': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

createChart();