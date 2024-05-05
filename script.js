"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const currency = Object.values(data.currencies)[0].name;
  const languages = Object.values(data.languages);
  console.log(currency, languages);
  // Now add cards
  const html = `<article class="country" ${className}>
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${Object.values(
          data.languages
        ).join(", ")}</p>
        <p class="country__row"><span>💰</span>${currency}</p>

      </div>
      </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};
const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

function geoPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

const whereAMI = async function () {
  // geocation
  const pos = await geoPosition();
  const { latitude: lat, longitude: lng } = pos.coords;
  //   reverse geooding
  const geoApi = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  const dataGeo = await geoApi.json();
  console.log(dataGeo);
  // Country data
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${dataGeo.country}`
  );
  const data = await res.json();
  console.log(data);
  renderCountry(data[0]);
};
whereAMI();
console.log("First");
