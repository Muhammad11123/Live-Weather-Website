/*
Database Design (Simulated with localStorage)

NOTE: This file handles all the JavaScript functionality for the weather app.
It fetches data from the Visual Crossing API and dynamically updates the UI.
*/

const apiKey = "EGX3AFJETNHLRPD76SHJ8L5BJ"; // My Visual Crossing API key
const baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"; // Base URL to fetch forecast data

// Function to add a new city card (either from user input or default)
async function addCity(cityName = null) {
  const input = document.getElementById("cityInput");
  const city = cityName || input.value.trim(); // Use input or default

  // Validation to check if user entered a valid city
  if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
    alert("Please enter a valid city name (letters and spaces only).");
    return;
  }

  const cardId = city.toLowerCase();

  // Avoid duplicates on the page
  if (document.getElementById(cardId)) {
    if (!cityName) alert("That city is already on the list!");
    return;
  }

  try {
    // Fetch weather data from the API
    const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`;
    const response = await fetch(url);
    const data = await response.json();

    // Get the resolved city name from the response
    const resolved = data?.resolvedAddress || "";
    const resolvedParts = resolved.split(",").map(part => part.trim());
    const resolvedCity = resolvedParts[0];

    // Basic validity check on the response
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

    const today = data.days[0]; // Today’s weather details

    // Get appropriate icon URL (checks if day or night)
    const icon = getIconUrl(
      today.icon,
      today.sunrise,
      today.sunset,
      data.currentConditions.datetime
    );

    // Create the weather card HTML
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

    // Append the card to the main container
    document.getElementById("weatherCards").appendChild(card);

    // Clear the input after adding a city
    if (!cityName) input.value = "";
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Something went wrong. Please try again later.");
  }
}

// Function to get the correct weather icon based on time of day
function getIconUrl(iconName, sunrise, sunset, currentTimeStr) {
  const now = new Date();
  const [hours, minutes] = currentTimeStr.split(":").map(Number);
  now.setHours(hours, minutes); // Set current time

  const sunriseTime = new Date();
  const [sunriseH, sunriseM] = sunrise.split(":").map(Number);
  sunriseTime.setHours(sunriseH, sunriseM);

  const sunsetTime = new Date();
  const [sunsetH, sunsetM] = sunset.split(":").map(Number);
  sunsetTime.setHours(sunsetH, sunsetM);

  const isNight = now < sunriseTime || now > sunsetTime;

  // Return night version of icon if it's nighttime
  if (isNight) {
    if (iconName === "clear-day") return "/static/images/weather-icons/clear-night.png";
    if (iconName === "partly-cloudy-day") return "/static/images/weather-icons/partly-cloudy-night.png";
  }

  // Return regular icon path
  return `/static/images/weather-icons/${iconName}.png`;
}

// Function to update the Guildford forecast banner at the top
async function updateGuildfordForecast() {
  const banner = document.getElementById("guildfordForecast");
  const city = "Guildford";

  try {
    const url = `${baseUrl}/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`;
    const response = await fetch(url);
    const data = await response.json();

    const today = data.days[0];
    const tomorrow = data.days[1];

    // Format the banner text
    const todayText = `${today.temp.toFixed(1)}°C – ${today.conditions}`;
    const tomorrowText = `${tomorrow.temp.toFixed(1)}°C – ${tomorrow.conditions}`;

    banner.textContent = `Guildford Now: ${todayText} | Tomorrow: ${tomorrowText}`;
  } catch (err) {
    console.error("Failed to load Guildford forecast:", err);
    banner.textContent = "Unable to load Guildford forecast.";
  }
}

// Function to remove a weather card from the page
function removeCity(id) {
  const card = document.getElementById(id);
  if (card) card.remove();
}

// Load default cities on initial page load (resets every time)
function loadInitialCities() {
  ["New York", "London", "Tokyo"].forEach(city => addCity(city));
}

// Everything runs after the page finishes loading
window.onload = () => {
  loadInitialCities(); // Show default cities
  updateGuildfordForecast(); // Show Guildford banner

  const input = document.getElementById("cityInput");
  input.focus();

  // Add city when pressing Enter key
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addCity();
    }
  });
};
