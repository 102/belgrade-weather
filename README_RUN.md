Run instructions for development

1. Copy example config to config.json (only if you need to provide an API key):

   Copy the example and edit values:

   ```powershell
   copy .\config.example.json .\config.json
   notepad .\config.json
   ```

2. Start the mock updater (will generate `weather.json` and `history.csv` if missing):

   ```powershell
   node mock-weather.js
   ```

3. Start a local web server and open the app in your browser:

   ```powershell
   python -m http.server 8000
   ```

Notes:
- `config.json`, `history.csv`, and `weather.json` are ignored by git. If they are not present the app will use generated defaults and continue running.
- Never commit real API keys to the repository. Use `config.example.json` as a template.
