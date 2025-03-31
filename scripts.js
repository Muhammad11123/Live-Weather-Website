/*
Database Design (Simulated with localStorage)

-- Table: cities
CREATE TABLE cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT,
  lat REAL,
  lon REAL,
  date_added DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: weather_forecast
CREATE TABLE weather_forecast (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city_id INTEGER,
  forecast_date DATE,
  temperature REAL,
  conditions TEXT,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);
*/

const apiKey = "EGX3AFJETNHLRPD76SHJ8L5BJ"; // Visual Crossing API key
const baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

// Add a city card (input or default)
async function addCity(cityName = null) {
    const input = document.getElementById("cityInput");
    const city = cityName || input.value.trim();
  
    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
      alert("Please enter a valid city name (letters and spaces only).");
      return;
    }
  
    const cardId = city.toLowerCase();
    if (document.getElementById(cardId)) {
      if (!cityName) alert("That city is already on the list!");
      return;
    }
  
    try {
      const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`;
      const response = await fetch(url);
      const data = await response.json();
  
      const resolved = data?.resolvedAddress || "";
      const resolvedParts = resolved.split(",").map(part => part.trim());
      const resolvedCity = resolvedParts[0];
  
      const isValidCity =
        resolvedParts.length >= 2 &&
        resolvedCity.length > 1 &&
        data.latitude !== 0 &&
        data.longitude !== 0 &&
        data.days?.length > 0;
  
      if (!isValidCity) {
        alert("City not found. Please enter a real city.");
        return;
      }
  
      const today = data.days[0];
      const icon = getIconUrl(today.icon);
  
      const card = document.createElement("div");
      card.className = "weather-card";
      card.id = cardId;
  
      card.innerHTML = `
        <div class="left">
          <img src="${icon}" alt="Weather icon" />
          <div>
            <h2>${resolvedCity}</h2>
            <p>${today.temp.toFixed(1)}°C</p>
            <p>${today.conditions}</p>
          </div>
        </div>
        <button onclick="removeCity('${cardId}')">✖</button>
      `;
  
      document.getElementById("weatherCards").appendChild(card);
      if (!cityName) input.value = "";
  
      saveCity(resolvedCity);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Something went wrong. Please try again later.");
    }
  }  

// Use local weather icons (stored in images/weather-icons/)
function getIconUrl(iconName) {
  return `images/weather-icons/${iconName}.png`;
}

// Update Guildford weather banner
async function updateGuildfordForecast() {
  const banner = document.getElementById("guildfordForecast");
  const city = "Guildford";

  try {
    const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`;
    const response = await fetch(url);
    const data = await response.json();

    const today = data.days[0];
    const tomorrow = data.days[1];

    const todayText = `${today.temp.toFixed(1)}°C – ${today.conditions}`;
    const tomorrowText = `${tomorrow.temp.toFixed(1)}°C – ${tomorrow.conditions}`;

    banner.textContent = `Guildford Now: ${todayText} | Tomorrow: ${tomorrowText}`;
  } catch (err) {
    console.error("Failed to load Guildford forecast:", err);
    banner.textContent = "Unable to load Guildford forecast.";
  }
}

// Remove a city card and from local storage
function removeCity(id) {
  const card = document.getElementById(id);
  if (card) card.remove();

  const saved = getSavedCities();
  const updated = saved.filter(city => city.toLowerCase() !== id);
  localStorage.setItem("cities", JSON.stringify(updated));
}

// Save a city to local storage
function saveCity(city) {
  const saved = getSavedCities();
  if (!saved.includes(city)) {
    saved.push(city);
    localStorage.setItem("cities", JSON.stringify(saved));
  }
}

// Get saved cities
function getSavedCities() {
  const cities = localStorage.getItem("cities");
  return cities ? JSON.parse(cities) : [];
}

// Load initial cities (defaults if none saved)
function loadInitialCities() {
  const saved = getSavedCities();
  if (saved.length > 0) {
    saved.forEach(city => addCity(city));
  } else {
    ["Tokyo", "New York", "London"].forEach(city => addCity(city));
  }
}

// Page onload
window.onload = () => {
  loadInitialCities();
  updateGuildfordForecast();

  const input = document.getElementById("cityInput");
  input.focus();

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addCity();
    }
  });
};
