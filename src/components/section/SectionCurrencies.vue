<script setup>
import { onMounted, ref } from "vue";
import { historial, actualCurrencies, latestCurrencies } from "@/api/api.js";
import PopupComponents from "../PopupComponents.vue";
import LibError from "@/lib/LibError.js";

const currenciesHistorocal = ref("");
const currencies = ref("");
const currenciesСoefficient = ref("");
const filter = ref("");
const errTooManyRequests = ref(false);
const baseCurrencyClose = ref(true);
const baseCurrency = ref(import.meta.env.VITE_BASE_CURRENCY);
const deltaHisObg = ref({});
const loading = ref(true);

async function apiCol(baseCurrency) {
  try {
    currenciesHistorocal.value = await historial(baseCurrency);
    currencies.value = await actualCurrencies();
    currenciesСoefficient.value = await latestCurrencies(baseCurrency);

    errTooManyRequests.value = false;
  } catch (e) {
    if (e instanceof LibError) {
      console.log("LibError в apiCol:", e.message);
      errTooManyRequests.value = true;
    } else {
      console.log(e);
    }
  }
}

onMounted(async () => {
  await apiCol();
  loading.value = false;
});

function exchangeСlculation(key) {
  const coefficient = currenciesСoefficient.value[key];
  let i = 1;

  while (i / coefficient < 10) {
    i *= 10;
  }
  deltaHisObg.value[key].price = (i / coefficient).toFixed(2);
  return i;
}
function deltaCurrencies(actual, historocal, key) {
  deltaHisObg.value[key] = {
    value: (actual - historocal).toFixed(3),
    price: null,
  };
  return deltaHisObg.value[key].value;
}
function baseCurrencyEvent() {
  if (baseCurrencyClose.value) {
    baseCurrencyClose.value = false;
  } else {
    baseCurrencyClose.value = true;
  }
}
async function baseCurrencyChange(key) {
  baseCurrency.value = key;
  baseCurrencyClose.value = true;
  await apiCol(baseCurrency.value);
}
</script>

<template>
  <n-space v-if="loading">
    <n-spin size="large" />
  </n-space>
  <main v-else class="main">
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
      <PopupComponents
        @change-currency="baseCurrencyChange"
        :currencies="currencies"
        :class="{ popup__close: baseCurrencyClose }"
      />
    </div>
    <form class="filter" action="">
      <span class="material-symbols-outlined"> search </span>
      <input class="filter__input" v-model="filter" type="text" />
    </form>

    <section class="main__currencies currencies">
      <template v-for="[key, value] in Object.entries(currencies)" :key="key">
        <div
          v-if="
            value.name.toLowerCase().includes(filter.toLowerCase()) &&
            key !== baseCurrency
          "
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

<style lang="sass" scoped>

.currencies
    display: flex
    flex-wrap: wrap
    gap: 1em
    &__item
      cursor: pointer
      display: flex
      flex-direction: column
      align-items: center
      border: 1px $textColor solid
      border-radius: 10px
      width: 210px
      transition: .1s
    &__item:hover
      transform: scale(1.1)
    &__currencies-сoefficient
      display: flex
      align-items: center

.all-currencies
  position: relative
  align-items: center
  display: flex
  gap: 1em
  &__popup
    width: 225px
    height: 400px
    display: flex
    flex-wrap: wrap
    flex-direction: column
    gap: 1em
    padding: 1em
  &__button
    padding: 0
    background: none
  &__button_main
    color: $textColor
    background: linear-gradient(to right, red, green)
    font-weight: 700
    font-size: 21px
    padding: .2em .7em
  &__button:hover
    color: $aColorHover
.main
  &__header-wrapper
    display: flex
    flex-direction: column
.filter:focus,
.filter:hover
  outline: none
  border: 1px $textColor solid

.filter
  border: 1px $textColor solid
  border-radius: 10px
  width: 200px
  padding: 1px 0px 0px 5px
  display: flex
  &__input
    padding: 0
    width: 82%
    border: none
    background-color: $main
  &__input:focus
    outline: none
    border: none
  &__input:hover
    outline: none
    border: none


.popup
  top: 5.5dvh
  &__close
    display: none

@media screen and (max-width: 483px)
  .main
    width: 230px
    margin: auto
</style>
