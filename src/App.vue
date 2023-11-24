<script setup>
import { onMounted, ref } from "vue";

const API_KEY = "fca_live_INn8oonmjCvqkWaIfZgUSc7dBEfazBHAxrz8EKUC";
const API_URL = "https://api.freecurrencyapi.com/v1/";
const DATE__HISTORICAL = "2022-01-01";
const currenciesHistorocal = ref("");
const userStatus = ref("");
const currencies = ref("");
const currenciesСoefficient = ref("");
const filter = ref("");
const err = ref(false);
const baseCurrencyClose = ref(false);
const baseCurrency = ref("RUB");
const deltaHisObg = ref({});
let exchangeСlculationResult = 0;
let delHis = 0;

function historicalCurrencies() {
  fetch(
    `${API_URL}historical?date=${DATE__HISTORICAL}&base_currency=${baseCurrency.value}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      currenciesHistorocal.value = json.data[DATE__HISTORICAL];
    })
    .catch((e) => {
      err.value = true;
    });
}

onMounted(async () => {
  await fetch(`${API_URL}status?apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      userStatus.value = json.quotas.month;
    })
    .catch((e) => {
      err.value = true;
    });
  historicalCurrencies();
  await fetch(`${API_URL}currencies?&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      currencies.value = json.data;
    })
    .catch((e) => {
      err.value = true;
    });
  await fetch(
    `${API_URL}latest?base_currency=${baseCurrency.value}&apikey=${API_KEY}`
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
  deltaHisObg.value[key].price = (i / coefficient).toFixed(2);
  return i;
};
const deltaCurrencies = (actual, historocal, key) => {
  deltaHisObg.value[key] = {
    value: (actual - historocal).toFixed(4),
    price: null,
  };
  return deltaHisObg.value[key].value;
};
const baseCurrencyEvent = () => {
  if (baseCurrencyClose.value) {
    baseCurrencyClose.value = false;
  } else {
    baseCurrencyClose.value = true;
  }
};
const baseCurrencyChange = (key) => {
  baseCurrency.value = key;
  historicalCurrencies();
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
    <div class="main__all-currencies all-currencies">
      <i>Список свех валют </i>
      <button
        @click="baseCurrencyEvent()"
        class="button all-currencies__button_main"
      >
        {{ baseCurrency }}
      </button>

      <div
        :class="{ popup__close: baseCurrencyClose }"
        class="all-currencies__popup popup"
      >
        <div
          v-for="[key] in Object.entries(currencies)"
          :key="key"
          class="all-currencies-item"
        >
          <button
            @click="baseCurrencyChange(key)"
            class="all-currencies__button button"
          >
            {{ key }}
          </button>
        </div>
      </div>
    </div>
    <form action="">
      <input v-model="filter" type="text" />
    </form>
    <section class="main__currencies currencies">
      <template v-for="[key, value] in Object.entries(currencies)" :key="key">
        <div
          v-if="value.name.toLowerCase().includes(filter.toLowerCase())"
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
                  currenciesHistorocal[key],
                  key
                ) < 0,
            }"
          >
            {{ exchangeСlculation(key) }} - {{ key }} ({{
              deltaHisObg[key].value
            }})
            <span v-if="delHis >= 0" class="material-symbols-outlined">
              arrow_upward
            </span>
            <span v-else class="material-symbols-outlined">
              arrow_downward
            </span>
          </div>
          <div class="currencies__currencies-сoefficient">
            {{ deltaHisObg[key].price }} - {{ baseCurrency }}
          </div>
        </div>
      </template>
    </section>
  </main>
</template>
