<script setup>
import { onMounted, ref } from "vue";
import { actualCurrencies, latestCurrencies } from "../../api/api.js";
import PopupComponents from "../PopupComponents.vue";

const SELECTED_CURRENCIES = import.meta.env.VITE_SELECTED_CURRENCIES.split(",");
const currenciesСoefficient = ref("");
const currencies = ref("");
const currenciesObj = ref("");
const iHave = ref(5000);
const currencieActiv = ref(import.meta.env.VITE_BASE_CURRENCY);
const currencieConvert = ref("USD");
const popupClose = ref(true);

onMounted(async () => {
  try {
    currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
    console.log(currenciesСoefficient.value);
    currenciesObj.value = await actualCurrencies();
    currencies.value = Object.entries(currenciesObj.value);
    for (let i of SELECTED_CURRENCIES) {
      let rut = 0;
      for (let j of currencies.value) {
        const selectedIndex = j[0].indexOf(i);
        if (j[0] === currencieActiv) {
          currencieActiv.value = j[0];
        }
        if (j[0] === currencieConvert) {
          currencieConvert.value = j[0];
        }
        if (selectedIndex > -1) {
          currencies.value.unshift(currencies.value.splice(rut, 1)[0]);
        }
        rut++;
      }
    }
  } catch (e) {
    console.log(e);
  }
});

const currencieActivchange = async (key) => {
  currencieActiv.value = key;
  currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
};
const currencieConvertchange = async (key) => {
  currencieConvert.value = key;
};
const currenciesReverse = async () => {
  console.log("currenciesReverse");
  const save = currencieActiv.value;
  currencieActiv.value = currencieConvert.value;
  currencieConvert.value = save;
  currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
};
const CurrencyChange = async (key) => {
  for (let i of currencies.value.slice(0, 4)) {
    if (i[0] === key) {
      currencieActiv.value = key;
    }
  }
  let rut = 4
  for (let i of currencies.value.slice(4)) {
    if (i[0] === key) {
      currencies.value.unshift(currencies.value.splice(rut, 1)[0]);
      currencieActiv.value = key;
      currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
    }
    rut++
  }
};
const choice = () => {
  console.log("choice - ", popupClose.value);
  if (popupClose.value) {
    popupClose.value = false;
  } else {
    popupClose.value = true;
  }
};
</script>

<template>
  <div class="main">
    <section class="traid-section">
      <div class="traid-section__box">
        <div class="traid-section__text">У меня есть</div>
        <ul class="traid-section__list">
          <li
            @click="currencieActivchange(key)"
            v-for="[key] in currencies.slice(0, 4)"
            :key="key"
            :class="{ focus: currencieActiv === key }"
            class="traid-section__list-item"
          >
            {{ key }}
          </li>
          <li @click="choice()" class="traid-section__list-item">Выбор...</li>
          <PopupComponents
            @change-currency="CurrencyChange"
            :currencies="currenciesObj"
            :class="{ popup__close: popupClose }"
          />
        </ul>
        <div class="traid-section__input-wrapper">
          <input
            autofocus
            class="traid-section__currency"
            v-model="iHave"
            type="number"
          />
          <p>
            1 {{ currencieActiv }} =
            {{ (1 * currenciesСoefficient[currencieConvert]).toFixed(2) }}
            {{ currencieConvert }}
          </p>
        </div>
      </div>
      <button @click="currenciesReverse()" class="traid-section__button">
        <span class="material-symbols-outlined"> swap_horiz </span>
      </button>
      <div class="traid-section__box">
        <div class="traid-section__text">Хочу получить</div>
        <ul class="traid-section__list">
          <li
            @click="currencieConvertchange(key)"
            v-for="[key] in currencies.slice(0, 4)"
            :key="key"
            :class="{ focus: currencieConvert === key }"
            class="traid-section__list-item"
          >
            {{ key }}
          </li>
          <li class="traid-section__list-item">Выбор...</li>
        </ul>
        <div class="traid-section__input-wrapper">
          <p class="traid-section__currency">
            {{ (iHave * currenciesСoefficient[currencieConvert]).toFixed(2) }}
          </p>
          <p>
            1 {{ currencieConvert }} =
            {{ (1 / currenciesСoefficient[currencieConvert]).toFixed(2) }}
            {{ currencieActiv }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="sass" scoped>
@import "../../sass/var.sass"
.traid-section
  display: flex
  justify-content: space-between
  align-items: center
  &__box
    display: flex
    flex-direction: column
    gap: 1em
  &__list
    user-select: none
    display: flex
  &__list-item
    transition: .4s
    padding: .5em 1em
    border: 1px $textColor solid
    cursor: pointer
  &__list-item:hover
    background-color: $aColorHover
  &__currency
    background: none
    border: none
    font-size: 2em

  &__currency:focus
    outline: none
    -webkit-appearance: none

.popup
  top: 30dvh
  left: 191px
  &__close
    display: none
.focus
  background-color: $aColorHover
</style>
