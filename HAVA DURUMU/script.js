const url = 'https://api.openweathermap.org/data/2.5/';
const key = '70a79cc0272d98bf7df5d1109191d57b';

const setQuery = (e) => {
  if (e.keyCode === 13) {
    getResult(searchBar.value);
  }
};

const getResult = (cityName) => {
  let query = `${url}weather?q=${cityName}&appid=${key}&units=metric&lang=tr`;
  fetch(query)
    .then((weather) => {
      if (!weather.ok) {
        throw new Error(`Şehir bulunamadı!`);
      }
      return weather.json();
    })
    .then(displayResult)
    .catch((error) => {
      displayError(error.message);
    });
};

const displayResult = (result) => {
  let city = document.querySelector('.city');
  city.innerText = `${result.name}, ${result.sys.country}`;

  let temp = document.querySelector('.temp');
  temp.innerText = `${Math.round(result.main.temp)}°C`;

  let desc = document.querySelector('.desc');
  let test = result.weather[0].description.toUpperCase();
  desc.innerText = test;

  let minmax = document.querySelector('.minmax');
  minmax.innerText = `${Math.round(result.main.temp_min)}°C / ${Math.round(
    result.main.temp_max
  )}°C`;
};

const displayError = (message) => {
  let error = document.querySelector('.error');
  error.innerText = message;
};

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keypress', setQuery);
