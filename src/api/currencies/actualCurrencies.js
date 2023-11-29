const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

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
