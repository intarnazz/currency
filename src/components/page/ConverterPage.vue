<script setup>
import { onMounted, ref } from "vue";
import { actualCurrencies, latestCurrencies } from "../../api/api.js";

const SELECTED_CURRENCIES = import.meta.env.VITE_SELECTED_CURRENCIES.split(",");
const currenciesСoefficient = ref("");
const currencies = ref("");

onMounted(async () => {
  try {
    currenciesСoefficient.value = await latestCurrencies();
    currencies.value = Object.entries(await actualCurrencies());
    for (let i of SELECTED_CURRENCIES) {
      let rut = 0;
      for (let j of currencies.value) {
        const selectedIndex = j[0].indexOf(i);
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
</script>

<template>
  <div class="main">
    <section class="traid-section">
      <div class="traid-section__set">
        <div class="traid-section__text">У меня есть</div>
        <ul class="traid-section__list">
          <li
            v-for="[key] in currencies.slice(0, 4)"
            :key="key"
            class="traid-section__list-item"
          >
            {{ key }}
          </li>
          <li>Выбор...</li>
        </ul>
        <input type="num" />
      </div>
      <button class="traid-section__button">
        <span class="material-symbols-outlined"> swap_horiz </span>
      </button>
      <div class="traid-section__get">
        <div class="traid-section__text">Хочу получить</div>
        <ul class="traid-section__list">
          <li
            v-for="[key] in currencies.slice(0, 4)"
            :key="key"
            class="traid-section__list-item"
          >
            {{ key }}
          </li>
          <li>Выбор...</li>
        </ul>
        <input type="num" />
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
  &__
</style>
