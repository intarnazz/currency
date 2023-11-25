<script setup>
import { onMounted, ref } from "vue";

const API_KEY = import.meta.env.VITE_API_KEY
const API_URL = import.meta.env.VITE_API_URL
const userStatus = ref("");
const err = ref(false);

onMounted(async () => {
  await fetch(`${API_URL}status?apikey=${API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      userStatus.value = json.quotas.month;
    })
    .catch((e) => {
      err.value = true;
    });
});
</script>

<template>
  <header class="header">
    <div class="header__logo">
      <RouterLink :to="{ name: 'Home' }">
        <img src="./assets/img/logo.png" alt="Logo" />
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