const API = "dde0aa7d090f85292a5688478abdcba1";

const iconImg = document.getElementById("weather-icon");
const loc = document.querySelector("#location");
const tempC = document.querySelector(".c");
const tempF = document.querySelector(".f");
const desc = document.querySelector(".desc");
const sunriseDOM = document.querySelector(".sunrise");
const sunsetDOM = document.querySelector(".sunset");

function navigationSuccess(position) {
  getWeather(position.coords.latitude, position.coords.longitude);
}

function onWindowLoaded() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(navigationSuccess, () => {
      // определение geo по ip
      fetch("http://ip-api.com/json")
        .then((Response) => {
          return Response.json();
        })
        .then((data) => {
          getWeather(data.lat, data.long);
        })
        .catch((e) => showError('Отказано в доступе к местоположению.'));
    });
  } else {
    showError('Отказано в доступе к местоположению.');
  }
}

window.addEventListener("load", onWindowLoaded);

async function getWeather(lat, long) {
  const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API}&units=metric`;
  console.log(base);

  try {
    const Response = await fetch(base);
    const data = await Response.json();
    const { temp } = data.main;
    const place = data.name;
    const { description, icon } = data.weather[0];
    const { sunrise, sunset } = data.sys;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    const fahrenheit = (temp * 9) / 5 + 32;
    const sunriseGMT = new Date(sunrise * 1000);
    const sunsetGMT = new Date(sunset * 1000);
    iconImg.src = iconUrl;
    loc.textContent = `${place}`;
    desc.textContent = `${description}`;
    tempC.textContent = `${temp.toFixed(2)} °C`;
    tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
    sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
    sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;

    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';
    const weatherWidget = document.querySelector('#weatherWidget');
    weatherWidget.style.display = 'block'

  } catch (e) {
    showError('Отказано в доступе к местоположению.');;
  }
}
 

function showError(message){
  const errorElement = document.createElement('div')
  // const errorElement = document.createElement('div');
  errorElement.innerText = message;
  errorElement.style.position = 'fixed';
  errorElement.style.top = '50%';
  errorElement.style.left = '50%';
  errorElement.style.transform = 'translate(-50%, -50%)';
  errorElement.style.backgroundColor = 'white';
  errorElement.style.color = 'red';
  errorElement.style.padding = '20px';
  errorElement.style.border = '2px solid red';
  errorElement.style.zIndex = '9999';
  // mesege = 'Отказано в доступе к местоположению.';
  document.body.innerHTML = "";
  document.body.append(errorElement)
}

