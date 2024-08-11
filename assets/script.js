let cities = [];

function searchCity() {
  let cityName = $("#cityName");
  if (cityName.val() != "") {
    getNewWeather(cityName.val().trim().toLowerCase());
    generateButton(cityName.val().trim().toUpperCase());
    cities.push(cityName.val().trim().toUpperCase());
    localStorage.setItem("weatherCities", JSON.stringify(cities));
    cityName.val("");
    $("#searchModalClose").click();
  } else {
    console.log("Please provide city name!");
  }
}

function getNewWeather(t) {
  $("#searchModalClose").click();
  $.ajax({ url: `https://api.openweathermap.org/data/2.5/weather?appid=aed52c01e7f5375831def9553ce0837d&q=${t}`, method: "GET" }).then((t) => {
    dataSetup(t);
  });
  $.ajax({ url: `https://api.openweathermap.org/data/2.5/forecast?appid=aed52c01e7f5375831def9553ce0837d&q=${t}`, method: "GET" }).then((t) => {
    newForcast(t);
  });
}

function generateButton(city) {
  console.log(city);
  let a = $("<button>");
  a.text(city).addClass("m-2").attr("onclick", `getNewWeather("${city}")`);
  $("#previousSearch").append(a);
}

function dataSetup(t) {
  console.log(t);
  $("#cityW").text(t.name);
  $("#iconW").attr("src", `http://openweathermap.org/img/wn/${t.weather[0].icon}@2x.png`);
  $("#tempW").text(Math.round(1.8 * (t.main.temp - 273.15) + 32));
  $("#forcastW").text(t.weather[0].description);
  $("#humidW").text(t.main.humidity);
  $("#windW").text(t.wind.speed);
  $("#cityWeatherInfo").show();
}

function newForcast(t) {
  console.log(t);
  $("#forcastInfo").empty();
  for (let e = 9; e < 32; e += 8) {
    let a = t.list[e],
      s = 1e3 * a.dt,
      n = new Date(s);
    console.log(n);
    let i = `<div class="jumbotron jumbotron-fluid bg-white py-2 border border-dark">
                <div class="container">
                    <h2 class="display-4"><img src="http://openweathermap.org/img/wn/${a.weather[0].icon}@2x.png" alt="Weather Icon" width="100" /> ${n.toDateString().substring(0, 3)} <b>${n.toDateString().substring(8, 10)}</b></h2>
                    
                    <p class="lead"><span>${Math.round(1.8 * (a.main.temp - 273.15) + 32)}</span> °F — <span>${a.weather[0].description}</span></p>
                  <hr>
                  <p class="lead">Humidity: <span>${a.main.humidity}</span>% &#160;&#160;&#160;&#160;&#160;&#160;Wind: <span>${a.wind.speed}</span>MPH</p>
                </div>
              </div>`;
    $("#forcastInfo").append(i);
  }
}

$(document).ready(() => {
  $("#searchModal").click();
  $("#cityWeatherInfo").hide();
  localStorage.getItem("weatherCities") != null ? (cities = localStorage.getItem("weatherCities")) : (cities = []);
  cities = JSON.parse(cities);
  console.log(cities);
  console.log(cities.length);
  if (cities.length != 0) {
    for (city of cities) {
      generateButton(city);
    }
  }
});
