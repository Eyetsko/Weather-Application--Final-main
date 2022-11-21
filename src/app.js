function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return ` ${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        </br>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coords) {
  let apiKey = "e947cb2640f1db92e6a19005bc43b435";
  let lon = coords.lon;
  let lat = coords.lat;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}
function displayTemperature(response) {
  let farenheit = response.data.main.temp;
  let temp = document.querySelector("#temp");
  temp.innerHTML = Math.round(farenheit);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = Math.round(response.data.main.humidity);
  let description = document.querySelector("#description");
  let date = document.querySelector("#date-time");
  date.innerHTML = formatDate(response.data.dt * 1000);
  description.innerHTML = response.data.weather[0].description;

  let icon = document.querySelector("#icon");
  let iconLink = response.data.weather[0].icon;
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconLink}@2x.png`
  );
  getForecast(response.data.coord);
}

function searchLocation(position) {
  let apiKey = "210f0105830dab42da6932b5c4b52fc7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function displayCurrentWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", displayCurrentWeather);

function search(city) {
  let apiKey = "210f0105830dab42da6932b5c4b52fc7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}
function submit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

let form = document.querySelector("#search");
form.addEventListener("submit", submit);

search("New York");
