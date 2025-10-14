# belgrade-weather

Belgrade Weather — small demo project that stores and visualizes recent weather
observations for Belgrade. The project contains a tiny Node.js updater that
generates or fetches current weather data and saves a rolling 24-hour history
(`history.csv`) which is rendered by a simple Chart.js frontend.

This README contains step-by-step instructions for running the project locally.

Quick start (run locally)
1. Clone the repository and open the project folder.

2. Install Node.js dependencies (required for the updater scripts):

```powershell
npm install
```

3. If you want to use a real weather API key, copy `config.example.json` to
	`config.json` and fill your API key. If you don't provide a key the updater
	will use generated mock data so the app still works.

```powershell
copy .\config.example.json .\config.json
notepad .\config.json
```

4. Start the mock updater which will create `weather.json` and `history.csv` if
	missing (or fetch real data when configured). Leave this running to keep
	history updated every hour:

```powershell
node mock-weather.js
```

5. Serve the frontend (static files) and open the UI in your browser:

```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

6. The chart page (`index.html`) reads `history.csv`. If the file is missing
	the frontend will show a friendly message. The backend scripts will not
	crash when files are absent — they use safe defaults or generated data.

Files and purpose
- `index.html` — frontend page that displays the Chart.js visualization
- `style.css` — simple styling for the page
- `graph.js` — frontend logic that reads `history.csv` and draws the chart
- `history.csv` — rolling CSV history (generated at runtime)
- `weather.json` — last downloaded/generated weather snapshot (ignored by git)
- `mock-weather.js` — mock updater that generates weather data and maintains `history.csv`
- `update-weather.js` / `process.js` — other updater variants (they are defensive and will not crash if files/config are missing)
- `config.example.json` — example configuration (copy to `config.json` to set API key)
- `.gitignore` — ignores generated and secret files (e.g. `config.json`, `history.csv`)

Security notes
- Do not commit `config.json` with real API keys. Use `config.example.json` as
  template and keep secrets out of version control.

Support / Troubleshooting
- If the chart doesn't show data, make sure the updater is running or that
  `history.csv` exists in the project root. The frontend will display a
  message when no historical data is available.

License & disclaimer
This repository is a small demo and not intended for production use. Data is
synthetic unless you configure a real API key. Use at your own risk.
