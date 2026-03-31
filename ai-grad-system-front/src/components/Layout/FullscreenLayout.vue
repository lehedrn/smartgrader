<template>
  <div class="fullscreen-layout">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.fullscreen-layout {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 确保全屏模式下 html 和 body 也是 100% */
:global(html), :global(body) {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
