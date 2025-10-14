declare const Chart: any;
declare const d3: any;

async function plotWeather() {
    const response = await fetch('./history.csv');
    const csvData = await response.text();
    const data = d3.csvParse(csvData);

    // The CSV is newest-first, so we should reverse it for a chronological chart.
    const reversedData = data.reverse();

    const dates = reversedData.map((row: any) => new Date(row.date));
    const temperatures = reversedData.map((row: any) => parseFloat(row['temperature in °C']));

    const ctx = (document.getElementById('weatherChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) {
        return;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature in °C',
                data: temperatures,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

plotWeather();
