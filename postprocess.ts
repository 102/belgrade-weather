import {
  readCSV,
  readJSON,
  writeCSV,
} from "https://deno.land/x/flat@0.0.15/mod.ts";

// Check if a filename argument is provided
if (Deno.args.length < 1) {
  console.error("Error: Please provide a filename as an argument.");
  Deno.exit(1);
}

const filename = Deno.args[0];

// Read JSON and handle potential errors
let json;
try {
  json = await readJSON(filename);
} catch (error) {
  console.error(`Error reading JSON file: ${error.message}`);
  Deno.exit(1);
}

// Validate JSON structure
if (!json.main || !json.main.temp || !json.weather || !json.weather[0] || !json.weather[0].main) {
  console.error("Error: JSON does not contain the expected structure.");
  Deno.exit(1);
}

const newFilename = "history.csv";
let history = [];

// Read historical data and handle potential errors
try {
  history = await readCSV(newFilename);
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.warn("Warning: history.csv not found. Creating a new file.");
  } else {
    console.error(`Error reading history.csv: ${error.message}`);
    Deno.exit(1);
  }
}

// Prepare new entry
const newEntry = {
  "temperature in °C": json.main.temp,
  description: json.weather[0].main,
  date: new Date().toISOString(),
};

// Write updated data to CSV and handle potential errors
try {
  await writeCSV(newFilename, [newEntry, ...history]);
  console.log("Data successfully written to history.csv");
} catch (error) {
  console.error(`Error writing to history.csv: ${error.message}`);
  Deno.exit(1);
}
3