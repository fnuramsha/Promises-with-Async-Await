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
  try {
    // geocation
    const pos = await geoPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    //   reverse geooding
    const geoApi = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!geoApi.ok) {
      throw new Error("Problem getting location data");
    }
    const dataGeo = await geoApi.json();

    // Country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );

    if (!res.ok) {
      throw new Error("Problem getting country data");
    }
    const data = await res.json();
    renderCountry(data[0]);
    return `You're in ${dataGeo.city} and ${dataGeo.country}`;
  } catch (err) {
    console.error(`${err}`);
    renderError(`${err.message}`);
    // Reject the prmise returned from async function
    throw err;
  }
};
console.log("1. You'll get the location");
// const city = whereAMI();
// console.log(city);
// whereAMI()
//   .then((city) => console.log(`2: ${city}`))
//   .catch((err) => console.error(`2: ${err.message}`))
//   .finally(() => console.log("3.Checking the last log"));
// console.log(whereAMI());

// Conversion of .then to await promises

(async function () {
  try {
    const city = await whereAMI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}`);
  }
  console.log("3. You got the location");
})();
