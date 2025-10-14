Contributing to belgrade-weather

Thank you for your interest in contributing! This project is small and intended
as a demo — contributions that improve documentation, data handling, or the
visualization are welcome.

Getting started

1. Fork the repo and clone it locally.
2. Install dependencies:

```powershell
npm install
```

3. Run the mock updater (it generates `history.csv` and `weather.json` if they are missing):

```powershell
node mock-weather.js
```

4. Open the frontend in your browser:

```powershell
python -m http.server 8000
# open http://localhost:8000
```

What to edit

- Frontend changes: edit `index.html`, `style.css`, and `graph.js`.
- Updater scripts: `mock-weather.js`, `update-weather.js`, `process.js`.
- Add new features as small pull requests with a clear description.

API keys & secrets

- `config.json` is ignored by git. Always add API keys to your local `config.json` only.
- Use `config.example.json` as a template and never commit real keys.

Testing your change

- Manual testing is enough for this small project: run the updater, open the
  page and verify the chart updates and no errors appear in the browser
  console.

Submitting a PR

- Create a branch with a descriptive name.
- Keep changes small and focused.
- Add a short description of the change and how to test it.

Questions

Open an issue if you're unsure where to start or run into problems.
