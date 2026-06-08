# Weather | Premium Weather Dashboard

Weather is a real-time, premium weather analytics Progressive Web App (PWA) built with modern client-side technologies. It features a stunning glassmorphic UI, dynamic weather-based background gradients with GPU-accelerated particle animations (rain, snow, stars, moving clouds, and sun rays), interactive trend charts, location autocompletion, and multi-city side-by-side comparison tables.

🔗 **Live Website Link**: [https://praveen542spk-ship-it.github.io/weather-dashboard/weather-dashboard/](https://praveen542spk-ship-it.github.io/weather-dashboard/weather-dashboard/)

---

## ✨ Key Features

### 1. Dedicated Geolocation & Autocomplete
* **Use Current Location**: Detects coordinates using the browser's Geolocation API with a fallback to Chennai, India.
* **Precise Geocoding fallback**: Uses Nominatim reverse-geocoding to resolve precise town, village, and settlement names (hamlets, farms, local districts) alongside parent cities.
* **Autocomplete Suggestions**: Features a debounced search input (350ms) to request matches from the Geocoding API.

### 2. Multi-Page Single Page Application (SPA)
Features a tabbed routing system that handles instant view swapping:
* **Today's Dashboard**: Display of key weather metrics (apparent temperature, UV index, wind speed with a rotating compass, pressure, humidity with a custom gauge, and sunrise/sunset times), 24h hourly forecast carousel, and temperature trends chart.
* **7-Day Detailed Forecast**: Sidebar containing 7 daily forecast cards. Selecting a day updates the panel on the right with daily stats, a scrollable hourly carousel for that specific day, and a dedicated 24-hour daily trend line.
* **Compare Cities**: Select two or more bookmarked cities from your list. Clicking "Run Comparison" fires concurrent requests (`Promise.all()`) to generate side-by-side comparison tables and comparative bar charts.

### 3. GPU-Accelerated Background Animations
Background styles and animations dynamically sync to the searched location's current weather and time-of-day:
* **Sunny (Clear Day)**: A brilliant white-hot sun disc in the top left with glowing shadows, rotating sharp white rays, and fluffy white clouds swaying gently at the bottom of the viewport.
* **Rainy**: Spawn 95 raindrop particles falling vertically with randomized speeds, heights, and delays, with dark storm clouds drifting behind the rain.
* **Snowy**: Spawn 75 snowflake particles drifting and swaying horizontally, with white-grey snow clouds drifting.
* **Cloudy / Foggy**: Spawn 5 large mist-blobs for overcast lighting and 8 detailed grey-blue clouds drifting across the viewport.
* **Night (Clear Night)**: Populate 75 twinkling stars at randomized coordinates with varying twinkle durations.

### 4. Progressive Web App (PWA) & Offline Capabilities
* **Offline Fallback**: Stores successful fetches in `localStorage` (`offline_weather_data`). If you are offline, it automatically falls back to rendering cached weather statistics.
* **Connection Monitoring**: Restoring connectivity triggers an automatic refresh to download live statistics.
* **Network-First Caching**: Intercepts requests using Service Worker (`sw.js` with `weather-cache-v9`), returning cached assets instantly if offline, and updating the cache if online.
* **Installable**: Full standalone app viewport support with custom branding icons for mobile home screens.

### 5. Mobile Layout Grid Optimization
* Utilizes **CSS Grid** and `display: contents` to re-arrange the header on mobile viewports:
  * **Row 1**: Brand logo + title, geolocation action button (scaled to compact icon button), and temperature unit toggle fit next to each other.
  * **Row 2**: Search bar wraps to its own row, spanning the full width of the mobile viewport, preventing cut-offs and horizontal overflow.

---

## 🛠️ Technology Stack

* **Structure**: Semantic HTML5 markup
* **Styling**: Vanilla CSS3 (Custom Variables, Flexbox, CSS Grid, Glassmorphism, animations)
* **Logic**: Asynchronous JavaScript (ES6+, Fetch API, async/await, debouncing, localStorage, navigator.onLine)
* **Libraries**: [Chart.js](https://www.chartjs.org/) (Data visualization) & [Lucide Icons](https://lucide.dev/) (Vector icons)
* **Typography**: Google Fonts (Outfit & Inter)

---

## 📂 Project Structure

```text
weather-dashboard/
├── index.html        # Main dashboard structure and skeleton loaders
├── manifest.json     # PWA manifest configurations
├── sw.js             # Service Worker cache coordinator (Network-First)
├── logo.png          # App custom home screen icon
├── css/
│   └── style.css     # CSS variable tokens, glassmorphism layout, and animations
└── js/
    └── app.js        # SPA Router, API koordinators, state managers, and charts
```

---

## 🚀 How to Run Locally

Since the app is built using client-side vanilla technologies, there are no build steps or bundlers required.

### Method 1: Local HTTP Server (Recommended)
Running through an HTTP server ensures correct Geolocation API and service worker registration functionalities.

1. Open a terminal in the root of the project.
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
* *Note: Browser security policies might restrict Geolocation permissions and Service Worker registration when running directly from a `file://` protocol in some browsers.*
