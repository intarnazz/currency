<script setup>
import { onMounted, ref } from "vue";
import { latestCurrencies } from "../../api/api.js";
import CurrenciesPanel from "../CurrenciesPanel.vue";

const currenciesСoefficient = ref("");
const iHave = ref(5000);
const currencieActiv = ref(import.meta.env.VITE_BASE_CURRENCY);
const currencieConvert = ref("USD");

onMounted(async () => {
  try {
    currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
    console.log(currenciesСoefficient.value);
  } catch (e) {
    console.log(e);
  }
});

const currenciesReverse = async () => {
  console.log("currenciesReverse");
  const save = currencieActiv.value;
  currencieActiv.value = currencieConvert.value;
  currencieConvert.value = save;
  currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
};

const currencieConvertchange = async (key) => {
  currencieConvert.value = key;
};

const currencieActivchange = async (key) => {
  currencieActiv.value = key;
  currenciesСoefficient.value = await latestCurrencies(currencieActiv.value);
};
</script>

<template>
  <div class="main">
    <section class="traid-section">
      <div class="traid-section__box">
        <div class="traid-section__text">У меня есть</div>
        <CurrenciesPanel
          @change-currency="currencieActivchange"
          :currencieActivProps="currencieActiv"
        />
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
        <CurrenciesPanel
          @change-currency="currencieConvertchange"
          :currencieActivProps="currencieConvert"
        />
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
