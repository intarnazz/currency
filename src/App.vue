<script setup>
import { onMounted, ref } from "vue";

import { status } from "./api/api.js";

const userStatus = ref("");
const err = ref(false);

const statusCol = async () => {
  const res = await status()
  if (!res) {
    err.value = true
    return null
  }
  return res
}

onMounted(async () => {
  userStatus.value = await statusCol();
});
</script>

<template>
  <header class="header">
    <div class="header__logo-wrapper">
      <RouterLink :to="{ name: 'Home' }">
        <img class="header__logo" src="./assets/img/logo.png" alt="Logo" />
      </RouterLink>
    </div>
    <nav class="header__nav">
      <RouterLink :to="{ name: 'Home' }">Home</RouterLink> |
      <RouterLink :to="{ name: 'Converter' }">Converter</RouterLink>
    </nav>
    <ul v-if="!err" class="header__user-status user-status">
      <li
        v-for="[key, value] in Object.entries(userStatus)"
        :key="key"
        class="user-status__row"
      >
        <div class="user-status__key">{{ key }}:</div>
        <div class="user-status__value">
          {{ value }}
        </div>
      </li>
    </ul>
    <div v-else class="err">not found</div>
  </header>
  <hr />
  <RouterView />
</template>

<style lang="sass">
@import "./sass/style.sass"
</style>
