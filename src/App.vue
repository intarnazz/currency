<script setup>
import { onMounted, ref } from "vue";

const API_KEY = "fca_live_INn8oonmjCvqkWaIfZgUSc7dBEfazBHAxrz8EKUC";
const API_URL = "https://api.freecurrencyapi.com/v1/";
const BASE_CURRENCY = "RUB";
const DATE__HISTORICAL = "2022-01-01";
const currenciesHistorocal = ref("");
const userStatus = ref("");
const currencies = ref("");
const currenciesСoefficient = ref("");
const err = ref(false);
let exchangeСlculationResult = 0;
let delHis = 0;

onMounted(async () => {
  await fetch(`${API_URL}status?apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      userStatus.value = json.quotas.month;
    })
    .catch((e) => {
      err.value = true;
    });
  await fetch(
    `${API_URL}historical?date=${DATE__HISTORICAL}&base_currency=${BASE_CURRENCY}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      currenciesHistorocal.value = json.data[DATE__HISTORICAL];
    })
    .catch((e) => {
      err.value = true;
    });
  await fetch(`${API_URL}currencies?&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      currencies.value = json.data;
    })
    .catch((e) => {
      err.value = true;
    });
  await fetch(
    `${API_URL}latest?base_currency=${BASE_CURRENCY}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      currenciesСoefficient.value = json.data;
    })
    .catch((e) => {
      err.value = true;
    });
});

const exchangeСlculation = (key) => {
  const coefficient = currenciesСoefficient.value[key];
  let i = 1;

  while (i / coefficient < 10) {
    i *= 10;
  }
  exchangeСlculationResult = (i / coefficient).toFixed(2);
  return i;
};
const deltaCurrencies = (actual, historocal) => {
  console.log(actual, " - ", historocal);
  delHis = (actual - historocal).toFixed(4);
  return delHis;
};
</script>

<template>
  <header class="header">
    <div class="header__logo">
      <RouterLink :to="{ name: 'Home' }">
        <img src="" alt="Logo" />
      </RouterLink>
    </div>
    <nav class="header__nav">
      <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
    </nav>
    <ul v-if="!err" class="header__user-status user-status">
      <li
        v-for="[key, value] in Object.entries(userStatus)"
        :key="key"
        class="user-status__row"
      >
        <div class="user-status__key">{{ key }}:</div>
        <div class="user-status__value">
          {{ value }}
        </div>
      </li>
    </ul>
    <div v-else class="err">not found</div>
  </header>
  <hr />
  <main class="main">
    <form action="">
      <input type="text" />
    </form>
    <section class="main__currencies currencies">
      <div
        v-for="[key, value] in Object.entries(currencies)"
        :key="key"
        class="currencies__item"
      >
        <div class="currencies__name">
          {{ value.name }}
        </div>
        <div
          class="currencies__currencies-сoefficient rise"
          :class="{
            fall:
              deltaCurrencies(
                currenciesСoefficient[key],
                currenciesHistorocal[key]
              ) < 0,
          }"
        >
          {{ exchangeСlculation(key) }} - {{ key }} ({{ delHis }})
        </div>
        <div class="currencies__currencies-сoefficient">
          {{ exchangeСlculationResult }} - RUB
        </div>
      </div>
    </section>
  </main>
</template>
