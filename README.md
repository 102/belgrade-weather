Here’s the `README.md` file in markdown format:
# Weather Data Logger

## Description
**Weather Data Logger** is a Deno-based application that captures and logs weather data from a JSON file into a CSV format. This allows users to maintain a historical record of weather conditions, making it easy to analyze trends over time. 

This project is designed as a lightweight solution for personal or small-scale weather tracking and is not intended for serious research purposes.

## Features
- **Data Logging**: Reads weather data from a JSON file and appends it to a CSV file.
- **Input Validation**: Ensures that the JSON input has the expected structure and that the temperature is within a realistic range.
- **Duplicate Detection**: Prevents duplicate entries in the historical data based on date and temperature.
- **Error Handling**: Provides clear error messages for issues encountered during file operations.
- **Help Command**: Offers a built-in help command to guide users on how to use the application.

## Installation

### Prerequisites
- Ensure you have [Deno](https://deno.land/manual/getting_started/installation) installed on your system.

### Clone the Repository
```
git clone <https://github.com/102/belgrade-weather.git>
```

### Expected JSON Input Format
The JSON file should follow this structure:
```json
{
  "main": {
    "temp": 25.3
  },
  "weather": [
    {
      "main": "Clear"
    }
  ]
}
```

### Help Command
You can access usage instructions directly from the command line by using the `--help` flag:
```
deno run --allow-read --allow-write script.ts --help
```

## Contributing
Contributions are welcome! If you'd like to improve this project, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and test them thoroughly.
4. Submit a pull request explaining your changes.



## Acknowledgments
- Thanks to the [Deno](https://deno.land/) team for creating a secure runtime for JavaScript and TypeScript.
- Special thanks to all contributors and open-source libraries that have made this project possible.

