<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useSystemStore } from '@/store/modules/system'

const systemStore = useSystemStore()

onMounted(() => {
  // 初始化系统配置
  systemStore.initSettings()
})
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
