/**
 * SkyFlow Weather Dashboard Core Logic
 * Powered by Open-Meteo API
 */

// ============================================================================
// WMO Weather Code Map (Converts codes to descriptions, icons, and themes)
// ============================================================================
const weatherCodeMap = {
  0: { text: "Clear Sky", icon: "sun", nightIcon: "moon", theme: "sunny" },
  1: { text: "Mainly Clear", icon: "cloud-sun", nightIcon: "cloud-moon", theme: "sunny" },
  2: { text: "Partly Cloudy", icon: "cloud-sun", nightIcon: "cloud-moon", theme: "cloudy" },
  3: { text: "Overcast", icon: "cloud", nightIcon: "cloud", theme: "cloudy" },
  45: { text: "Foggy", icon: "cloud-fog", nightIcon: "cloud-fog", theme: "cloudy" },
  48: { text: "Depositing Rime Fog", icon: "cloud-fog", nightIcon: "cloud-fog", theme: "cloudy" },
  51: { text: "Light Drizzle", icon: "cloud-drizzle", nightIcon: "cloud-drizzle", theme: "rainy" },
  53: { text: "Moderate Drizzle", icon: "cloud-drizzle", nightIcon: "cloud-drizzle", theme: "rainy" },
  55: { text: "Dense Drizzle", icon: "cloud-drizzle", nightIcon: "cloud-drizzle", theme: "rainy" },
  56: { text: "Light Freezing Drizzle", icon: "cloud-snow", nightIcon: "cloud-snow", theme: "snowy" },
  57: { text: "Dense Freezing Drizzle", icon: "cloud-snow", nightIcon: "cloud-snow", theme: "snowy" },
  61: { text: "Slight Rain", icon: "cloud-rain", nightIcon: "cloud-rain", theme: "rainy" },
  63: { text: "Moderate Rain", icon: "cloud-rain", nightIcon: "cloud-rain", theme: "rainy" },
  65: { text: "Heavy Rain", icon: "cloud-rain", nightIcon: "cloud-rain", theme: "rainy" },
  66: { text: "Light Freezing Rain", icon: "cloud-snow", nightIcon: "cloud-snow", theme: "snowy" },
  67: { text: "Heavy Freezing Rain", icon: "cloud-snow", nightIcon: "cloud-snow", theme: "snowy" },
  71: { text: "Slight Snowfall", icon: "snowflake", nightIcon: "snowflake", theme: "snowy" },
  73: { text: "Moderate Snowfall", icon: "snowflake", nightIcon: "snowflake", theme: "snowy" },
  75: { text: "Heavy Snowfall", icon: "snowflake", nightIcon: "snowflake", theme: "snowy" },
  77: { text: "Snow Grains", icon: "snowflake", nightIcon: "snowflake", theme: "snowy" },
  80: { text: "Slight Rain Showers", icon: "cloud-rain", nightIcon: "cloud-rain", theme: "rainy" },
  81: { text: "Moderate Rain Showers", icon: "cloud-rain", nightIcon: "cloud-rain", theme: "rainy" },
  82: { text: "Violent Rain Showers", icon: "cloud-rain", nightIcon: "cloud-rain", theme: "rainy" },
  85: { text: "Slight Snow Showers", icon: "cloud-snow", nightIcon: "cloud-snow", theme: "snowy" },
  86: { text: "Heavy Snow Showers", icon: "cloud-snow", nightIcon: "cloud-snow", theme: "snowy" },
  95: { text: "Thunderstorm", icon: "cloud-lightning", nightIcon: "cloud-lightning", theme: "rainy" },
  96: { text: "Thunderstorm with Hail", icon: "cloud-lightning", nightIcon: "cloud-lightning", theme: "rainy" },
  99: { text: "Heavy Thunderstorm with Hail", icon: "cloud-lightning", nightIcon: "cloud-lightning", theme: "rainy" }
};

// ============================================================================
// Application State
// ============================================================================
const state = {
  currentLocation: {
    name: "Chennai",
    lat: 13.0827,
    lon: 80.2707
  },
  isFahrenheit: false,
  favorites: [],
  chartInstance: null
};

// ============================================================================
// DOM Elements
// ============================================================================
const elements = {
  dynamicBg: document.getElementById("dynamicBg"),
  initialLoader: document.getElementById("initialLoader"),
  errorOverlay: document.getElementById("errorOverlay"),
  errorTitle: document.getElementById("errorTitle"),
  errorMessage: document.getElementById("errorMessage"),
  errorRetryBtn: document.getElementById("errorRetryBtn"),
  
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  suggestionsDropdown: document.getElementById("suggestionsDropdown"),
  geoBtn: document.getElementById("geoBtn"),
  unitToggle: document.getElementById("unitToggle"),
  
  cityName: document.getElementById("cityName"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  currentDate: document.getElementById("currentDate"),
  weatherBadge: document.getElementById("weatherBadge"),
  weatherText: document.getElementById("weatherText"),
  currentTemp: document.getElementById("currentTemp"),
  tempMax: document.getElementById("tempMax"),
  tempMin: document.getElementById("tempMin"),
  feelsLike: document.getElementById("feelsLike"),
  weatherSummaryDesc: document.getElementById("weatherSummaryDesc"),
  
  favoritesList: document.getElementById("favoritesList"),
  dailyForecastList: document.getElementById("dailyForecastList"),
  
  windSpeed: document.getElementById("windSpeed"),
  windDirectionText: document.getElementById("windDirectionText"),
  compassPointer: document.getElementById("compassPointer"),
  
  humidity: document.getElementById("humidity"),
  dewPointVal: document.getElementById("dewPointVal"),
  humidityGaugeFill: document.getElementById("humidityGaugeFill"),
  
  uvIndex: document.getElementById("uvIndex"),
  uvLevel: document.getElementById("uvLevel"),
  uvSliderIndicator: document.getElementById("uvSliderIndicator"),
  
  pressure: document.getElementById("pressure"),
  pressureText: document.getElementById("pressureText"),
  
  precipProb: document.getElementById("precipProb"),
  precipText: document.getElementById("precipText"),
  precipGaugeFill: document.getElementById("precipGaugeFill"),
  
  sunriseTime: document.getElementById("sunriseTime"),
  sunsetTime: document.getElementById("sunsetTime"),
  
  hourlyCardsContainer: document.getElementById("hourlyCardsContainer"),
  trendChart: document.getElementById("weatherTrendChart")
};

// ============================================================================
// Initialize App
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
  initUnitToggle();
  initSearch();
  initLocation();
  
  // Event listeners
  elements.favoriteBtn.addEventListener("click", toggleFavoriteCurrent);
  elements.errorRetryBtn.addEventListener("click", () => {
    elements.errorOverlay.classList.add("hidden");
    loadWeatherForLocation(state.currentLocation);
  });
  elements.geoBtn.addEventListener("click", triggerGeolocation);
});

// ============================================================================
// Unit Conversion Settings
// ============================================================================
function initUnitToggle() {
  // Check localstorage for preference
  const cachedUnit = localStorage.getItem("unit_pref");
  if (cachedUnit === "fahrenheit") {
    state.isFahrenheit = true;
    elements.unitToggle.checked = true;
  } else {
    state.isFahrenheit = false;
    elements.unitToggle.checked = false;
  }
  
  elements.unitToggle.addEventListener("change", (e) => {
    state.isFahrenheit = e.target.checked;
    localStorage.setItem("unit_pref", state.isFahrenheit ? "fahrenheit" : "celsius");
    loadWeatherForLocation(state.currentLocation, false); // Reload without toggling spinner
  });
}

// ============================================================================
// Favorites Manager (LocalStorage Linked)
// ============================================================================
function loadFavorites() {
  const stored = localStorage.getItem("favorite_cities");
  if (stored) {
    try {
      state.favorites = JSON.parse(stored);
    } catch (e) {
      state.favorites = [];
    }
  } else {
    // Default initial favorites
    state.favorites = [
      { name: "New York", lat: 40.7128, lon: -74.0060, temp: "--" },
      { name: "London", lat: 51.5074, lon: -0.1278, temp: "--" },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503, temp: "--" }
    ];
    saveFavorites();
  }
  renderFavoritesList();
}

function saveFavorites() {
  localStorage.setItem("favorite_cities", JSON.stringify(state.favorites));
}

function renderFavoritesList() {
  elements.favoritesList.innerHTML = "";
  if (state.favorites.length === 0) {
    elements.favoritesList.innerHTML = `<p class="empty-favorites">No saved locations yet. Click the star icon to bookmark.</p>`;
    return;
  }
  
  state.favorites.forEach((fav) => {
    const chip = document.createElement("div");
    chip.className = "favorite-item-chip";
    chip.innerHTML = `
      <span class="favorite-chip-name">${fav.name}</span>
      <span class="favorite-chip-temp" id="fav-temp-${fav.lat.toFixed(2)}-${fav.lon.toFixed(2)}">${fav.temp || "--"}°</span>
      <button type="button" class="favorite-chip-remove" title="Remove">
        <i data-lucide="x"></i>
      </button>
    `;
    
    // Clicking the text/temp loads the location
    chip.addEventListener("click", (e) => {
      if (e.target.closest(".favorite-chip-remove")) return; // Don't trigger if deleting
      loadWeatherForLocation({ name: fav.name, lat: fav.lat, lon: fav.lon });
    });
    
    // Delete favorite logic
    const delBtn = chip.querySelector(".favorite-chip-remove");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFavorite(fav.lat, fav.lon);
    });
    
    elements.favoritesList.appendChild(chip);
  });
  lucide.createIcons();
}

function toggleFavoriteCurrent() {
  const isMatch = state.favorites.some(
    (f) => Math.abs(f.lat - state.currentLocation.lat) < 0.05 && 
           Math.abs(f.lon - state.currentLocation.lon) < 0.05
  );
  
  if (isMatch) {
    // Remove
    state.favorites = state.favorites.filter(
      (f) => !(Math.abs(f.lat - state.currentLocation.lat) < 0.05 && 
               Math.abs(f.lon - state.currentLocation.lon) < 0.05)
    );
    elements.favoriteBtn.classList.remove("active");
  } else {
    // Add
    state.favorites.push({
      name: state.currentLocation.name,
      lat: state.currentLocation.lat,
      lon: state.currentLocation.lon,
      temp: elements.currentTemp.textContent || "--"
    });
    elements.favoriteBtn.classList.add("active");
  }
  saveFavorites();
  renderFavoritesList();
}

function removeFavorite(lat, lon) {
  state.favorites = state.favorites.filter(
    (f) => !(Math.abs(f.lat - lat) < 0.01 && Math.abs(f.lon - lon) < 0.01)
  );
  saveFavorites();
  renderFavoritesList();
  updateFavoriteStarState();
}

function updateFavoriteStarState() {
  const isMatch = state.favorites.some(
    (f) => Math.abs(f.lat - state.currentLocation.lat) < 0.05 && 
           Math.abs(f.lon - state.currentLocation.lon) < 0.05
  );
  if (isMatch) {
    elements.favoriteBtn.classList.add("active");
  } else {
    elements.favoriteBtn.classList.remove("active");
  }
}

// ============================================================================
// Geolocation Detection
// ============================================================================
function initLocation() {
  elements.initialLoader.classList.remove("hidden");
  triggerGeolocation();
}

function triggerGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        let cityName = "Your Location";
        
        // Dynamic reverse geocoding via Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            cityName = data.address.city || data.address.town || data.address.village || data.address.suburb || "Current Location";
          }
        } catch (e) {
          console.warn("Reverse geocoding failed, falling back to label 'Current Location'", e);
        }
        
        loadWeatherForLocation({ name: cityName, lat, lon });
      },
      (error) => {
        console.warn("Geolocation access denied/failed. Falling back to Chennai, India.", error);
        loadWeatherForLocation({ name: "Chennai", lat: 13.0827, lon: 80.2707 });
      }
    );
  } else {
    console.warn("Geolocation is unsupported in this browser. Falling back to Chennai, India.");
    loadWeatherForLocation({ name: "Chennai", lat: 13.0827, lon: 80.2707 });
  }
}

// ============================================================================
// Geocoding & Search Suggestions (Debounced)
// ============================================================================
function initSearch() {
  let debounceTimeout;
  
  elements.searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimeout);
    
    if (query.length < 2) {
      elements.suggestionsDropdown.classList.add("hidden");
      elements.suggestionsDropdown.innerHTML = "";
      return;
    }
    
    debounceTimeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 350);
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!elements.searchForm.contains(e.target)) {
      elements.suggestionsDropdown.classList.add("hidden");
    }
  });

  elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = elements.searchInput.value.trim();
    if (query) {
      // Force search for the first element
      fetchSuggestions(query, true);
    }
  });
}

async function fetchSuggestions(query, selectFirst = false) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
    if (!res.ok) throw new Error("Search suggestions failed");
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      if (selectFirst) {
        showError("City not found", `Could not find any location matching "${query}". Please check spelling and try again.`);
      } else {
        elements.suggestionsDropdown.innerHTML = `<div class="suggestion-item"><span class="suggestion-name">No results found</span></div>`;
        elements.suggestionsDropdown.classList.remove("hidden");
      }
      return;
    }
    
    if (selectFirst) {
      const topResult = data.results[0];
      const name = formatLocName(topResult);
      loadWeatherForLocation({ name, lat: topResult.latitude, lon: topResult.longitude });
      elements.searchInput.value = "";
      elements.suggestionsDropdown.classList.add("hidden");
    } else {
      renderSuggestions(data.results);
    }
  } catch (err) {
    console.error("Suggestions fetch error:", err);
  }
}

function formatLocName(loc) {
  let name = loc.name;
  if (loc.admin1 && loc.admin1 !== loc.name) {
    name += `, ${loc.admin1}`;
  }
  return name;
}

function renderSuggestions(results) {
  elements.suggestionsDropdown.innerHTML = "";
  
  results.forEach((item) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    
    const nameStr = formatLocName(item);
    const country = item.country_code ? item.country_code.toUpperCase() : "";
    const admin = item.admin2 || item.country || "";
    
    div.innerHTML = `
      <div class="suggestion-main">
        <span class="suggestion-name">${item.name}</span>
        <span class="suggestion-admin">${item.admin1 || ""}${admin ? ", " + admin : ""}</span>
      </div>
      ${country ? `<span class="suggestion-country">${country}</span>` : ""}
    `;
    
    div.addEventListener("click", () => {
      loadWeatherForLocation({ name: nameStr, lat: item.latitude, lon: item.longitude });
      elements.searchInput.value = "";
      elements.suggestionsDropdown.classList.add("hidden");
    });
    
    elements.suggestionsDropdown.appendChild(div);
  });
  
  elements.suggestionsDropdown.classList.remove("hidden");
}

// ============================================================================
// Weather Loader & API Coordinator
// ============================================================================
async function loadWeatherForLocation(loc, showSpinner = true) {
  state.currentLocation = loc;
  
  if (showSpinner) {
    elements.initialLoader.classList.remove("hidden");
  }
  elements.errorOverlay.classList.add("hidden");
  
  // Quick pre-validation for offline mode
  if (!navigator.onLine) {
    showError("Network Offline", "You are currently disconnected from the internet. Please reconnect and try again.");
    elements.initialLoader.classList.add("hidden");
    return;
  }

  try {
    const data = await fetchWeather(loc.lat, loc.lon);
    renderWeather(data);
    updateFavoriteStarState();
    
    // Update temperatures of saved locations matching coordinates
    updateFavoriteCachedTemp(loc.lat, loc.lon, data.current.temperature_2m);
  } catch (error) {
    console.error("Error loading weather data:", error);
    showError("Data Fetch Failure", "Unable to retrieve weather metrics for this location. Please try again later.");
  } finally {
    // Fade out main loader
    setTimeout(() => {
      elements.initialLoader.classList.add("hidden");
    }, 400);
  }
}

async function fetchWeather(lat, lon) {
  const tempUnit = state.isFahrenheit ? "fahrenheit" : "celsius";
  const windUnit = state.isFahrenheit ? "mph" : "kmh";
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo returned status: ${res.status}`);
  }
  return await res.json();
}

function updateFavoriteCachedTemp(lat, lon, temp) {
  const val = Math.round(temp);
  const formattedTemp = state.isFahrenheit ? `${val}°F` : `${val}°C`;
  
  state.favorites.forEach((fav) => {
    if (Math.abs(fav.lat - lat) < 0.05 && Math.abs(fav.lon - lon) < 0.05) {
      fav.temp = val;
    }
  });
  saveFavorites();
  
  // Dynamic update in the DOM if listed
  const targetId = `fav-temp-${lat.toFixed(2)}-${lon.toFixed(2)}`;
  const element = document.getElementById(targetId);
  if (element) {
    element.textContent = `${val}°`;
  }
}

// ============================================================================
// UI Render Engines
// ============================================================================
function renderWeather(data) {
  const cur = data.current;
  const hourly = data.hourly;
  const daily = data.daily;
  
  // WMO Code Translation
  const codeInfo = weatherCodeMap[cur.weather_code] || { text: "Cloudy", icon: "cloud", theme: "cloudy" };
  const isDay = cur.is_day === 1;
  const activeIcon = isDay ? codeInfo.icon : (codeInfo.nightIcon || codeInfo.icon);
  
  // Update Dynamic Theme background
  updateBackgroundTheme(isDay ? codeInfo.theme : "night");
  
  // Header Meta
  elements.cityName.textContent = state.currentLocation.name;
  elements.currentDate.textContent = formatCurrentDate(cur.time);
  
  // Weather Badge
  elements.weatherBadge.innerHTML = `<i data-lucide="${activeIcon}"></i> <span id="weatherText">${codeInfo.text}</span>`;
  
  // Temperature values
  const currentTempRounded = Math.round(cur.temperature_2m);
  elements.currentTemp.textContent = currentTempRounded;
  elements.tempMax.textContent = Math.round(daily.temperature_2m_max[0]);
  elements.tempMin.textContent = Math.round(daily.temperature_2m_min[0]);
  elements.feelsLike.textContent = Math.round(cur.apparent_temperature);
  
  // Summary Desc
  const cloudCoverText = cur.cloud_cover > 70 ? "dense cloud cover" : cur.cloud_cover > 30 ? "partly cloudy skies" : "clear skies";
  const rainText = cur.precipitation > 0 ? "with active precipitation" : "no rain expected";
  elements.weatherSummaryDesc.textContent = `Mainly ${cloudCoverText} ${rainText} in the region.`;

  // --- Detailed Cards Grid ---
  // Wind Speed & direction compass pointer
  elements.windSpeed.textContent = Math.round(cur.wind_speed_10m);
  const windDirText = getWindDirectionText(cur.wind_direction_10m);
  elements.windDirectionText.textContent = `${windDirText} • ${cur.wind_direction_10m}°`;
  elements.compassPointer.style.transform = `rotate(${cur.wind_direction_10m}deg)`;
  
  // Humidity & Dew Point Gauge
  elements.humidity.textContent = Math.round(cur.relative_humidity_2m);
  const dewPoint = hourly.dew_point_2m[getCurrentHourIndex(hourly.time)];
  elements.dewPointVal.textContent = Math.round(dewPoint);
  elements.humidityGaugeFill.style.width = `${cur.relative_humidity_2m}%`;
  
  // UV Index Level Check
  const uvVal = daily.uv_index_max[0];
  elements.uvIndex.textContent = uvVal.toFixed(1);
  const uvInfo = getUVLevelInfo(uvVal);
  elements.uvLevel.textContent = uvInfo.label;
  elements.uvLevel.className = `metric-label font-bold ${uvInfo.colorClass}`;
  elements.uvSliderIndicator.style.left = `${Math.min((uvVal / 11) * 100, 100)}%`;
  
  // Air Pressure Index
  const pressVal = Math.round(cur.pressure_msl);
  elements.pressure.textContent = pressVal;
  elements.pressureText.textContent = pressVal > 1022 ? "High Pressure" : pressVal < 1009 ? "Low Pressure" : "Normal Pressure";
  
  // Precipitation Probability
  const todayMaxPrecipProb = daily.precipitation_probability_max[0];
  elements.precipProb.textContent = todayMaxPrecipProb;
  elements.precipText.textContent = todayMaxPrecipProb > 50 ? "High chance of rain today" : todayMaxPrecipProb > 20 ? "Slight chance of rain" : "No rain expected today";
  elements.precipGaugeFill.style.width = `${todayMaxPrecipProb}%`;
  
  // Sunrise & Sunset Times Formatting
  elements.sunriseTime.textContent = formatIsoTimeToUserTime(daily.sunrise[0]);
  elements.sunsetTime.textContent = formatIsoTimeToUserTime(daily.sunset[0]);
  
  // --- Hourly Carousel ---
  renderHourlyCarousel(data);
  
  // --- Chart.js Trend Canvas ---
  renderHourlyTrendChart(data);

  // --- 7-Day Forecast ---
  render7DayForecast(data);
  
  // Re-instantiate icons
  lucide.createIcons();
}

function updateBackgroundTheme(themeName) {
  elements.dynamicBg.className = "dynamic-bg";
  elements.dynamicBg.classList.add(themeName);
}

// ============================================================================
// Formatting & Math Helpers
// ============================================================================
function formatCurrentDate(timeStr) {
  // Parsing ISO 8601 string
  const date = new Date(timeStr);
  const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

function formatIsoTimeToUserTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getWindDirectionText(degree) {
  const index = Math.round(((degree % 360) / 45)) % 8;
  const directions = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
  return directions[index];
}

function getUVLevelInfo(uvVal) {
  if (uvVal <= 2) return { label: "Low", colorClass: "txt-blue" };
  if (uvVal <= 5) return { label: "Moderate", colorClass: "txt-green" };
  if (uvVal <= 7) return { label: "High", colorClass: "txt-red" };
  if (uvVal <= 10) return { label: "Very High", colorClass: "txt-red" };
  return { label: "Extreme", colorClass: "txt-red" };
}

function getCurrentHourIndex(timeArray) {
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  
  let closestIndex = 0;
  let minDiff = Infinity;
  
  for (let i = 0; i < timeArray.length; i++) {
    const hourlyDate = new Date(timeArray[i]);
    const diff = Math.abs(currentHour - hourlyDate);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }
  return closestIndex;
}

// ============================================================================
// Hourly Forecast Carousel Rendering
// ============================================================================
function renderHourlyCarousel(data) {
  elements.hourlyCardsContainer.innerHTML = "";
  const hourly = data.hourly;
  const startIdx = getCurrentHourIndex(hourly.time);
  
  // Show the next 24 hours
  for (let i = 0; i < 24; i++) {
    const idx = startIdx + i;
    if (idx >= hourly.time.length) break;
    
    const time = new Date(hourly.time[idx]);
    const formattedHour = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    const temp = Math.round(hourly.temperature_2m[idx]);
    const code = hourly.weather_code[idx];
    const isDayCode = time.getHours() > 6 && time.getHours() < 19;
    
    const weatherInfo = weatherCodeMap[code] || { icon: "cloud" };
    const activeIcon = isDayCode ? weatherInfo.icon : (weatherInfo.nightIcon || weatherInfo.icon);
    
    const card = document.createElement("div");
    card.className = "hourly-card";
    card.innerHTML = `
      <span class="hourly-time">${formattedHour}</span>
      <i data-lucide="${activeIcon}"></i>
      <span class="hourly-temp">${temp}°</span>
    `;
    elements.hourlyCardsContainer.appendChild(card);
  }
}

// ============================================================================
// 7-Day Forecast Rendering
// ============================================================================
function render7DayForecast(data) {
  elements.dailyForecastList.innerHTML = "";
  const daily = data.daily;
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i] + 'T00:00:00'); // Force local midnight parsing
    const name = i === 0 ? "Today" : date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weather_code[i];
    const weatherInfo = weatherCodeMap[code] || { text: "Cloudy", icon: "cloud" };
    
    const row = document.createElement("div");
    row.className = "daily-item";
    row.innerHTML = `
      <span class="daily-name">${name}</span>
      <div class="daily-icon-wrapper">
        <i data-lucide="${weatherInfo.icon}"></i>
      </div>
      <span class="daily-desc" title="${weatherInfo.text}">${weatherInfo.text}</span>
      <div class="daily-temps">
        <span class="daily-temp-max">${maxTemp}°</span>
        <span class="daily-temp-min">${minTemp}°</span>
      </div>
    `;
    elements.dailyForecastList.appendChild(row);
  }
}

// ============================================================================
// Chart.js Temperature & Dew Point Curve Renderer
// ============================================================================
function renderHourlyTrendChart(data) {
  // Destroy existing chart to prevent canvas overlays
  if (state.chartInstance) {
    state.chartInstance.destroy();
  }
  
  const hourly = data.hourly;
  const startIdx = getCurrentHourIndex(hourly.time);
  const hoursToShow = 12; // 12 points looks much cleaner on small graphs
  
  const labels = [];
  const tempDataset = [];
  const dewDataset = [];
  
  for (let i = 0; i < hoursToShow; i++) {
    const idx = startIdx + (i * 2); // Sample every 2 hours to avoid cluttered X-axis
    if (idx >= hourly.time.length) break;
    
    const time = new Date(hourly.time[idx]);
    labels.push(time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
    tempDataset.push(Math.round(hourly.temperature_2m[idx]));
    dewDataset.push(Math.round(hourly.dew_point_2m[idx]));
  }

  const ctx = elements.trendChart.getContext("2d");
  
  // Set up gradients for neon colors
  const tempGradient = ctx.createLinearGradient(0, 0, 0, 200);
  tempGradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
  tempGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

  const dewGradient = ctx.createLinearGradient(0, 0, 0, 200);
  dewGradient.addColorStop(0, 'rgba(167, 139, 250, 0.15)');
  dewGradient.addColorStop(1, 'rgba(167, 139, 250, 0.0)');
  
  state.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature',
          data: tempDataset,
          borderColor: '#38bdf8',
          borderWidth: 2,
          pointBackgroundColor: '#38bdf8',
          pointHoverRadius: 6,
          backgroundColor: tempGradient,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Dew Point',
          data: dewDataset,
          borderColor: '#a78bfa',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: '#a78bfa',
          pointHoverRadius: 6,
          backgroundColor: dewGradient,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // We render a custom HTML legend instead
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: { family: 'Outfit', size: 12 },
          bodyFont: { family: 'Inter', size: 12 },
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label;
              const value = context.parsed.y;
              const unit = state.isFahrenheit ? '°F' : '°C';
              return ` ${label}: ${value}${unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 10 }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            borderDash: [2, 2]
          },
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 10 },
            callback: function(value) {
              return value + '°';
            }
          }
        }
      }
    }
  });
}

// ============================================================================
// Error Banner Presentation
// ============================================================================
function showError(title, message) {
  elements.errorTitle.textContent = title;
  elements.errorMessage.textContent = message;
  elements.errorOverlay.classList.remove("hidden");
  lucide.createIcons();
}
