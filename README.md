# Weather | Premium Weather Dashboard

Weather is a real-time, progress-enhanced weather analytics dashboard built with modern glassmorphic design and client-side technologies. It features dynamic day/night backgrounds, visual particle animations (rain, snow, stars, drifting clouds, and sun rays), interactive forecasts, and multi-city analytics.

🔗 **Live Website**: [https://praveen542spk-ship-it.github.io/weather-dashboard/weather-dashboard/](https://praveen542spk-ship-it.github.io/weather-dashboard/weather-dashboard/)

---

## ✨ Key Features

* **Time- & Weather-Aware Backgrounds**: Displays light sky-blue gradients during day cloudy hours and deep dark indigo-black backgrounds during nights, with synced GPU-accelerated weather particles.
* **Interactive SPA Navigation**: Click navigation tabs to instantly switch between **Today's Dashboard**, **7-Day Forecast**, and **Compare Cities** without page reloads.
* **Autocomplete & Geolocation**: Instantly look up city coordinates using debounced autocomplete suggestions or the browser's Geolocation API.
* **Multi-City Analytics**: Compare current temperatures, wind speeds, and humidity levels for saved cities side-by-side using Chart.js bar graphs.
* **PWA & Offline-First**: Installable on mobile home screens, fully functional offline using a Service Worker and `localStorage` caching strategies.

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, CSS Grid, Flexbox), Vanilla ES6+ Javascript
* **Data Visuals**: [Chart.js](https://www.chartjs.org/) & [Lucide Icons](https://lucide.dev/)

---

## 📂 Project Structure

```text
weather-dashboard/
├── index.html        # Main SPA skeleton
├── manifest.json     # PWA configurations
├── sw.js             # Service Worker Cache (Network-First)
├── logo.png          # App icon
├── css/style.css     # Design tokens and glassmorphism styling
└── js/app.js         # API controller, routing logic, and charts
```

---

## 🚀 How to Run Locally

Run a lightweight local HTTP server in the root of the project to enable full Geolocation and Service Worker features:

```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000/weather-dashboard/` in your browser.
