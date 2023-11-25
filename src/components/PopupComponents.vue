<script setup>
import { defineProps, defineEmits  } from "vue";
const props = defineProps(["currencies"]);
const emits = defineEmits();

const baseCurrencyChange = (key) => {
  emits("change-currency", key);
};
</script>

<template>
  <div class="all-currencies__popup popup">
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
</template>

<style lang="sass" scoped>
@import "../sass/var.sass"

.all-currencies
  position: relative
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
  &__button:hover
    color: $aColorHover

.popup
    position: absolute
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6)
    background-color: $main
    border-radius: 15px
    top: 5.5dvh
    &__close
        display: none
</style>
