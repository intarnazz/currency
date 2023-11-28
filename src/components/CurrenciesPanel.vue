<script setup>
import PopupComponents from "./PopupComponents.vue";
import { actualCurrencies } from "../api/api.js";
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
const props = defineProps(["currencieActivProps"]);
const emits = defineEmits();

function baseCurrencyChange(key) {
  currencieActiv.value = key;
  popupClose.value = true;
  emits("change-currency", key);
};

const SELECTED_CURRENCIES = import.meta.env.VITE_SELECTED_CURRENCIES.split(",");
const currencies = ref("");
const currenciesObj = ref("");
const popupClose = ref(true);
const currencieActiv = ref(props.currencieActivProps);
const errTooManyRequests = ref(false);

const actualCurrenciesCol = async () => {
  const res = await actualCurrencies();
  if (!res) {
    errTooManyRequests.value = true;
    return null;
  }
  errTooManyRequests.value = false;
  return res;
};

onMounted(async () => {
  try {
    currenciesObj.value = await actualCurrenciesCol();
    currencies.value = Object.entries(currenciesObj.value);
    for (let i of SELECTED_CURRENCIES) {
      let rut = 0;
      for (let j of currencies.value) {
        const selectedIndex = j[0].indexOf(i);
        if (j[0] === currencieActiv.value) {
          currencieActiv.value = j[0];
        }
        if (selectedIndex > -1) {
          currencies.value.unshift(currencies.value.splice(rut, 1)[0]);
        }
        rut++;
      }
    }
    baseCurrencyChange(currencieActiv.value);
  } catch (e) {
    console.log(e);
  }
});

function choice() {
  console.log("choice - ", popupClose.value);
  if (popupClose.value) {
    popupClose.value = false;
  } else {
    popupClose.value = true;
  }
};

async function CurrencyChange(key) {
  for (let i of currencies.value.slice(0, 4)) {
    if (i[0] === key) {
      baseCurrencyChange(key);
    }
  }
  let rut = 4;
  for (let i of currencies.value.slice(4)) {
    if (i[0] === key) {
      currencies.value.unshift(currencies.value.splice(rut, 1)[0]);
      baseCurrencyChange(key);
    }
    rut++;
  }
};
function ActivPropsEvent() {
  CurrencyChange(props.currencieActivProps);
};

watch(() => props.currencieActivProps, ActivPropsEvent);
</script>

<template>
  <ul class="traid-section__list">
    <li
      @click="baseCurrencyChange(key)"
      v-for="[key] in currencies.slice(0, 4)"
      :key="key"
      :class="{ focus: currencieActivProps === key }"
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
  &__list
    position: relative
    user-select: none
    display: flex
  &__list-item
    transition: .4s
    padding: .5em 1em
    border: 1px $textColor solid
    cursor: pointer
  &__list-item:hover
    background-color: $aColorHover

.popup
  top: 50px
  left: 120px
  &__close
    display: none
.focus
  background-color: $aColorHover

@media screen and (max-width: 350px)
  .traid-section
    &__list-item
      padding: .3em
  .popup
    top: 5dvh
    left: 5px
</style>
