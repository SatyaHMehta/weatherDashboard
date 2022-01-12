const apiUrl = "e4fbd094ad1ca0b388921e84630b68c4";

function getCityVal() {
  const city = document.getElementById("search-city").value;
  setRecentSearch(city);
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiUrl}`)
    .then((resp) => resp.json())
    .then((weatherData) => {
      const coordinates = { lat: weatherData.city.coord.lat, lon: weatherData.city.coord.lon }
      populateCurrentDay(weatherData.list[0], coordinates);
      populate5Day(weatherData.list);
    });
}

function setRecentSearch(city) {
  const previousSearches = JSON.parse(localStorage.getItem("searches")) ?? [];
  localStorage.setItem("searches", JSON.stringify([city, ...previousSearches]));

  const list = document.getElementById("history");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  var entry = document.createElement("li");
  entry.appendChild(document.createTextNode(city));
  list.appendChild(entry);

  previousSearches.slice(0, 6).forEach((search) => {
    var entry = document.createElement("li");
    entry.appendChild(document.createTextNode(search));
    list.appendChild(entry);
  });
}

function populateCurrentDay(currentDayWeather, coordinates) {
  const temp = getTemp(currentDayWeather.main.temp);
  const humidity = currentDayWeather.main.humidity;
  const windSpeed = currentDayWeather.wind.speed;

  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,daily,alerts&appid=${apiUrl}`
  )
    .then((resp) => resp.json())
    .then((weatherData) => {
      document.getElementById("temperature").innerHTML = temp.toFixed(2);
      document.getElementById("humidity").innerHTML = humidity;
      document.getElementById("wind-speed").innerHTML = windSpeed;
      document.getElementById("uv-index").innerHTML = weatherData.current.uvi;
    });
}

function populate5Day(listOfWeather) {
  const days = listOfWeather.filter((day, i) => i % 8 == 0).slice(0, 5);
  days.forEach((day, i) => {
    document.getElementById(`fTemp${i}`).innerHTML = getTemp(day.main.temp).toFixed(2);
    document.getElementById(`fHumidity${i}`).innerHTML = day.main.humidity;
  });
}

const getTemp = (temp) => ((temp - 273.15) * 9) / 5 + 32;
