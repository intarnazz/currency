const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const BASE_CURRENCY = import.meta.env.VITE_BASE_CURRENCY;

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
