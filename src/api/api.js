const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const DATE_HISTORICAL = import.meta.env.VITE_DATE_HISTORICAL;
const BASE_CURRENCY = import.meta.env.VITE_BASE_CURRENCY;

export function historicalCurrencies() {
  fetch(
    `${API_URL}historical?date=${DATE_HISTORICAL}&base_currency=${BASE_CURRENCY}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        return false;
      } else {
        return json.data[DATE_HISTORICAL];
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
export function actualCurrencies() {
  fetch(`${API_URL}currencies?&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        return false;
      } else {
        return (currencies.value = json.data);
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
export function latestCurrencies() {
  fetch(
    `${API_URL}latest?base_currency=${BASE_CURRENCY}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        return false;
      } else {
        return (currenciesСoefficient.value = json.data);
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
