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

// ---------Running promises in parallel-------------

const getJSON = function (url) {
  return fetch(url).then((response) => {
    console.log(response);
    if (!response.ok) {
      console.log(response);
      throw new Error(`${response.message} ${response.status}`);
    }
    return response.json();
  });
};

const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);
    // console.log(data1.capital, data2.capital, data3.capital);
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);
    console.log(data.map((d) => d[0].capital));
  } catch (err) {
    console.error(`${err}`);
  }
};

get3Countries("portugal", "germany", "us");

// Promise race
(async function () {
  const data = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/Germany`),
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/Greece`),
  ]);
  console.log(data);
})();

// Reject the Promise after certain amount of time

const timeout = function (sec) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("It took too long"));
    }, sec * 1000);
  });
};
Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/Germany`),
  timeout(5),
]).then((res) => console.log(res));

// Promise.any

Promise.allSettled([
  Promise.reject("reject"),
  Promise.resolve("success is here"),
  Promise.resolve("another success"),
]).then((res) => console.log(res));
