# How to Run ESP32-Flasher-React

Based on the package.json file, here are the instructions for running this Electron application:

## Prerequisites
1. Make sure you have Node.js and npm installed
2. Clone or download the repository to your local machine

## Initial Setup
Navigate to the project directory and install dependencies:
```bash
cd /path/to/esp32-flasher-react
npm install
```

## Development Mode
To run the application in development mode with hot reloading:
```bash
npm run dev
```

If you want continuous watching for file changes:
```bash
npm run watch
```

## Preview Mode
To preview the built application without rebuilding:
```bash
npm run start
```

## Building for Production

### Build for all platforms
```bash
npm run build
```

### Build for specific platforms
For Windows:
```bash
npm run build:win
```

For macOS:
```bash
npm run build:mac
```

For 64-bit Windows specifically:
```bash
npm run build:win64
```

For Linux:
```bash
npm run build:linux
```

After building, you'll find the executable in the `dist` directory that will be created by the build process.

## Note
When running the application, make sure you have the necessary permissions to access serial ports, as this application needs to communicate with ESP32 devices connected via USB.