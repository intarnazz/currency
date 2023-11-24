<script setup>
import { onMounted, ref } from "vue";

const API_KEY = import.meta.env.VITE_API_KEY
const API_URL = import.meta.env.VITE_API_URL
const DATE_HISTORICAL = import.meta.env.VITE_DATE_HISTORICAL
const currenciesHistorocal = ref(import.meta.env.VITE_BASE_CURRENCY);
const currencies = ref("");
const currenciesСoefficient = ref("");
const filter = ref("");
const err = ref(false);
const errTooManyRequests = ref(false);
const baseCurrencyClose = ref(true);
const baseCurrency = ref("RUB");
const deltaHisObg = ref({});

function historicalCurrencies() {
  fetch(
    `${API_URL}historical?date=${DATE_HISTORICAL}&base_currency=${baseCurrency.value}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        errTooManyRequests.value = true;
      } else {
        currenciesHistorocal.value = json.data[DATE_HISTORICAL];
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
function actualCurrencies() {
  fetch(`${API_URL}currencies?&apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        errTooManyRequests.value = true;
      } else {
        currencies.value = json.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
function latestCurrencies() {
  fetch(
    `${API_URL}latest?base_currency=${baseCurrency.value}&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.message === "API rate limit exceeded for 'quota'") {
        errTooManyRequests.value = true;
      } else {
        currenciesСoefficient.value = json.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

onMounted(async () => {
  try {
    await historicalCurrencies();
    await actualCurrencies();
    await latestCurrencies();
  } catch (e) {
    console.log(e);
  }
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
  actualCurrencies();
  latestCurrencies();
};
</script>

<template>
  <main class="main">
    <div class="main__all-currencies all-currencies">
      <i>Список свех валют </i>
      <button
        @click="baseCurrencyEvent()"
        class="button all-currencies__button_main"
      >
        {{ baseCurrency }}
      </button>
      <span v-if="errTooManyRequests" class="fall">
        <i> Too Many Requests!</i>
      </span>

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
            <span
              v-if="deltaHisObg[key].value >= 0"
              class="material-symbols-outlined"
            >
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
