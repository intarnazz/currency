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
      <div class="traid-section__box">
        <div class="traid-section__text">У меня есть</div>
        <ul class="traid-section__list">
          <li
            v-for="[key] in currencies.slice(0, 4)"
            :key="key"
            class="traid-section__list-item"
          >
            {{ key }}
          </li>
          <li class="traid-section__list-item">Выбор...</li>
        </ul>
        <input type="number" />
      </div>
      <button class="traid-section__button">
        <span class="material-symbols-outlined"> swap_horiz </span>
      </button>
      <div class="traid-section__box">
        <div class="traid-section__text">Хочу получить</div>
        <ul class="traid-section__list">
          <li
            v-for="[key] in currencies.slice(0, 4)"
            :key="key"
            class="traid-section__list-item"
          >
            {{ key }}
          </li>
          <li class="traid-section__list-item">Выбор...</li>
        </ul>
        <input type="number" />
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
    display: flex
  &__list-item
    padding: .5em 1em
    border: 1px $textColor solid
</style>
