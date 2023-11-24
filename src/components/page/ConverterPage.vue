<script setup>

</script>

<template>
  <div class="main">
    <section class="traid-section">
      <div class="traid-section__set">
        <div class="traid-section__text">У меня есть</div>
        <div class="traid-section__list">
          <div class="traid-section__list-item"></div>
        </div>
        <input type="num" />
      </div>
      <button class="traid-section__button">
        <span class="material-symbols-outlined"> swap_horiz </span>
      </button>
      <div class="traid-section__get">
        <div class="traid-section__text">Хочу получить</div>
        <div class="traid-section__list">
          <div class="traid-section__list-item"></div>
        </div>
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
</style>
