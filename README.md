# ClimaPulse | Premium Weather Dashboard

ClimaPulse is a real-time, premium weather analytics dashboard built with modern client-side technologies. It features a stunning glassmorphic UI, dynamic weather-based background gradients, interactive trend charts, and real-time location autocompletion suggestions.

---

## ✨ Key Features

1. **Real-Time Weather Queries**: Powered by the public keyless [Open-Meteo API](https://open-meteo.com/), providing detailed data metrics including temperature, high/low records, apparent temperature, humidity, air pressure, UV index, wind speed, wind direction, and sunrise/sunset times.
2. **Dynamic Aesthetic Backgrounds**: Visually responds to the weather conditions of the selected city (Sunny, Cloudy, Rainy, Snowy, Night-time) with smooth CSS gradient transitions.
3. **Advanced City Search & Autocomplete**: Integrated with the Open-Meteo Geocoding API. Employs a **350ms debounce mechanism** to optimize API traffic.
4. **Geolocation Auto-Detection**: Uses the HTML5 Geolocation API to detect coordinates on launch and reverse-geocodes it via Nominatim (OpenStreetMap) to show localized conditions.
5. **Interactive Weather Trend Graphs**: Utilizes **Chart.js** to display overlapping smooth line graphs of the 12-hour Temperature and Dew Point forecasts.
6. **Persistent Bookmarks Sidebar**: Save your favorite cities locally via `localStorage` for rapid selection.
7. **Bilingual Unit Toggle**: One-click metric/imperial unit converter (Celsius/Kilometers to Fahrenheit/Miles) synced across forecast charts and metrics.
8. **Network Offline Diagnostics**: Catches connectivity errors gracefully, rendering an offline card with retry parameters.

---

## 🛠️ Technology Stack

* **Structure**: Semantic HTML5 markup
* **Styling**: Vanilla CSS3 (Custom Variables, Flexbox, Grid, Glassmorphism, animations)
* **Logic**: Asynchronous JavaScript (ES6+, modern Fetch API, async/await, debouncing, localStorage)
* **Libraries**: [Chart.js](https://www.chartjs.org/) (Data visualization) & [Lucide Icons](https://lucide.dev/) (Vector icons)
* **Typography**: Google Fonts (Outfit & Inter)

---

## 📂 Project Structure

```text
weather-dashboard/
├── index.html        # Main dashboard structure and skeleton loaders
├── css/
│   └── style.css     # Design system, glassmorphism layers, and animations
└── js/
    └── app.js        # API fetches, state management, and UI rendering
```

---

## 🚀 How to Run Locally

Since ClimaPulse is built using client-side vanilla technologies, there are no build steps or bundlers required.

### Method 1: Local HTTP Server (Recommended)
Running through an HTTP server ensures correct Geolocation API and local storage functionalities.

1. Open a terminal/command prompt in the root of the project.
2. Spin up a lightweight server (e.g., Python):
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8000/weather-dashboard/
   ```

### Method 2: Direct File Open
You can also open the file directly in your browser:
* Double-click the `index.html` file inside the `weather-dashboard` folder.
* *Note: Browser security policies might restrict Geolocation permissions when running directly from a `file://` protocol in some browsers.*
