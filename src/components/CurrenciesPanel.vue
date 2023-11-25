<script setup>
import PopupComponents from "./PopupComponents.vue";
import { actualCurrencies } from "../api/api.js";
import { defineProps, defineEmits, ref, onMounted } from "vue";
const props = defineProps(["currencieActiv"]);
const emits = defineEmits();


const baseCurrencyChange = (key) => {
  currencieActiv.value = key
  emits("change-currency", key);
};

const SELECTED_CURRENCIES = import.meta.env.VITE_SELECTED_CURRENCIES.split(",");
const currencies = ref("");
const currenciesObj = ref("");
const popupClose = ref(true);
const currencieActiv = ref(props.currencieActiv);

onMounted(async () => {
  try {
    currenciesObj.value = await actualCurrencies();
    currencies.value = Object.entries(currenciesObj.value);
    for (let i of SELECTED_CURRENCIES) {
      let rut = 0;
      for (let j of currencies.value) {
        const selectedIndex = j[0].indexOf(i);
        if (j[0] === currencieActiv) {
          currencieActiv.value = j[0];
        }
        if (selectedIndex > -1) {
          currencies.value.unshift(currencies.value.splice(rut, 1)[0]);
        }
        rut++;
      }
    }
    baseCurrencyChange(currencieActiv.value)
  } catch (e) {
    console.log(e);
  }
});

const choice = () => {
  console.log("choice - ", popupClose.value);
  if (popupClose.value) {
    popupClose.value = false;
  } else {
    popupClose.value = true;
  }
};

const CurrencyChange = async (key) => {
  for (let i of currencies.value.slice(0, 4)) {
    if (i[0] === key) {
      baseCurrencyChange(key)
    }
  }
  let rut = 4;
  for (let i of currencies.value.slice(4)) {
    if (i[0] === key) {
      currencies.value.unshift(currencies.value.splice(rut, 1)[0]);
      baseCurrencyChange(key)
    }
    rut++;
  }
};
</script>

<template>
  <ul class="traid-section__list">
    <li
      @click="baseCurrencyChange(key)"
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
</template>

<style lang="sass" scoped>
@import "../sass/var.sass"
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
