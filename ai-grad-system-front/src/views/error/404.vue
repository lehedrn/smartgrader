<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-description">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: $bg-page;
}

.error-content {
  text-align: center;

  .error-code {
    font-size: 120px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }

  .error-title {
    font-size: 32px;
    color: $text-primary;
    margin: 16px 0;
  }

  .error-description {
    font-size: 16px;
    color: $text-secondary;
    margin-bottom: 32px;
  }
}
</style>
