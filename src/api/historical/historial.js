import LibError from "@/lib/LibError.js";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const DATE_HISTORICAL = import.meta.env.VITE_DATE_HISTORICAL;
const BASE_CURRENCY = import.meta.env.VITE_BASE_CURRENCY;

export async function historial(baseCurrency = BASE_CURRENCY) {
  console.log(baseCurrency);
  return await fetch(
    `${API_URL}historical?date=${DATE_HISTORICAL}&base_currency=${baseCurrency}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        throw new LibError();
      } else {
        return json.data[DATE_HISTORICAL];
      }
    })
    .catch((e) => {
      throw e;
    });
}
