const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const DATE_HISTORICAL = import.meta.env.VITE_DATE_HISTORICAL;
const BASE_CURRENCY = import.meta.env.VITE_BASE_CURRENCY;

export async function historicalCurrencies(baseCurrency = BASE_CURRENCY) {
  console.log(baseCurrency);
  return await fetch(
    `${API_URL}historical?date=${DATE_HISTORICAL}&base_currency=${baseCurrency}&apikey=${API_KEY}`
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
export async function actualCurrencies() {
  return await fetch(`${API_URL}currencies?&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        return false;
      } else {
        return json.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
export async function latestCurrencies(baseCurrency = BASE_CURRENCY) {
  return await fetch(
    `${API_URL}latest?base_currency=${baseCurrency}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        return false;
      } else {
        return json.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

export async function status() {
  return await fetch(`${API_URL}status?apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        return false;
      } else {
        return json.quotas.month;
      }
    })
    .catch((e) => {
      err.value = true;
    });
}
