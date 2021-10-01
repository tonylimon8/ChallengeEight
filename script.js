function onLoad() {
const entCity = document.getElementById("enter-city");
const currentPic = document.getElementById("current-pic");
const nameEl = document.getElementById("city-name");
const clearHistory = document.getElementById("clear-history");
const searchButton = document.getElementById("search-button");
const history = document.getElementById("history");
const currentHumidity = document.getElementById("humidity");
const currentWind = document.getElementById("wind-speed");
const currentTemp = document.getElementById("temperature");
const currentUV = document.getElementById("UV-index");
var todaysWeather = document.getElementById("today-weather");
var fivedayHeader = document.getElementById("fiveday-header");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// API Key for Open Weather 

const APIKey = "b8ef96bda18c1fc111d9d8a01ea1ff9d";

    function getWeather(cityName) {
     
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

                todaysWeather.classList.remove("d-none");

                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";

                let weatherPic = response.data.weather[0].icon;
                currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPic.setAttribute("alt", response.data.weather[0].description);
                currentTemp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(UVQueryURL)

                    .then(function (response) {

                        let UVIndex = document.createElement("span");
                        
                        if (response.data[0].value < 4 ) {
                            UVIndex.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        console.log(response.data[0].value)
                        UVIndex.innerHTML = response.data[0].value;
                        currentUV.innerHTML = "UV Index: ";
                        currentUV.append(UVIndex);
                    });
                
           
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayHeader.classList.remove("d-none");
                        
     
                        const forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;

                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();

                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");

                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");

                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;

                            forecastEls[i].append(forecastDateEl);

                   
                            const forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");

                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);

                            forecastEls[i].append(forecastWeatherEl);
                            const forecastTempEl = document.createElement("p");

                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";

                            forecastEls[i].append(forecastTempEl);
                            const forecastHumidityEl = document.createElement("p");

                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }

   
    searchButton.addEventListener("click", function () {
        const searchTerm = entCity.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })


    clearHistory.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];

        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        history.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {

            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");

            historyItem.setAttribute("readonly", true);

            historyItem.setAttribute("class", "form-control d-block bg-white");

            historyItem.setAttribute("value", searchHistory[i]);

            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            history.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

onLoad();