<script setup>
import { onMounted, ref } from "vue";
import { latestCurrencies } from "../../api/api.js";
import CurrenciesPanel from "../CurrenciesPanel.vue";

const currenciesСoefficient = ref("");
const iHave = ref(5000);
const currencieActiv = ref(import.meta.env.VITE_BASE_CURRENCY);
const currencieConvert = ref(import.meta.env.VITE_SECOND_CURRENCY);
const tooManyRequests = ref(false);
const loading = ref(true);

async function latestCurrenciesCol() {
  const res = await latestCurrencies(currencieActiv.value);
  if (!res) {
    tooManyRequests.value = true;
    return null;
  }
  tooManyRequests.value = false;
  return res;
};

onMounted(async () => {
  try {
    currenciesСoefficient.value = await latestCurrenciesCol();
    console.log("latestCurrenciesCol", currenciesСoefficient.value);
    loading.value = false;
  } catch (e) {
    console.log(e);
  }
});

async function currenciesReverse() {
  console.log("currenciesReverse");
  const save = currencieActiv.value;
  currencieActiv.value = currencieConvert.value;
  currencieConvert.value = save;
  currenciesСoefficient.value = await latestCurrenciesCol();
};

function currencieConvertchange(key) {
  currencieConvert.value = key;
};

async function currencieActivchange(key) {
  currencieActiv.value = key;
  currenciesСoefficient.value = await latestCurrenciesCol();
};
</script>

<template>
  <n-space v-if="loading">
    <n-spin size="large" />
  </n-space>
  <div v-else class="main">
    <div v-if="tooManyRequests" class="fall">
      <i> Too Many Request! </i>
    </div>
    <section class="traid-section">
      <div class="traid-section__box">
        <div class="traid-section__text">У меня есть</div>
        <CurrenciesPanel
          @change-currency="currencieActivchange"
          :currencieActivProps="currencieActiv"
          class="popup_1"
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
          class="popup_2"
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
  &__currency
    background: none
    border: none
    font-size: 2em
    width: 200px
  &__currency:focus
    outline: none
    -webkit-appearance: none

.popup
  top: 30dvh
  left: 191px
  &_1
    z-index: 2
  &_2
    z-index: 1
  &__close
    display: none
.focus
  background-color: $aColorHover

@media screen and (max-width: 780px)
  .traid-section
    gap: 1em
    flex-direction: column
</style>
