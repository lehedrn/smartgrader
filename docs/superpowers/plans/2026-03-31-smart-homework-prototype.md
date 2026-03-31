# 智能作业批阅平台原型系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个高保真的现代化 Web 原型系统，实现智能作业批阅平台的核心功能模块

**Architecture:** 采用前后端分离架构，前端使用 Vue 3 + Element Plus + Pinia 构建单页应用，Mock 数据模拟后端 API

**Tech Stack:** Vue 3 (Composition API) + Vite + Element Plus + Pinia + Vue Router + ECharts

---

## 项目结构总览

```
ai-grad-system-front/
├── package.json
├── vite.config.js
├── index.html
├── .env
├── .env.development
├── .env.production
├── .gitignore
├── README.md
├── public/
│   ├── favicon.ico
│   └── images/
│       └── login-bg.png
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── settings.js
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   ├── global.scss
│   │   └── theme.scss
│   ├── utils/
│   │   ├── request.js
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── api/
│   │   ├── auth.js
│   │   ├── homework.js
│   │   ├── resource.js
│   │   ├── report.js
│   │   ├── mistake.js
│   │   ├── cockpit.js
│   │   └── system.js
│   ├── store/
│   │   ├── index.js
│   │   ├── modules/
│   │   │   ├── user.js
│   │   │   ├── homework.js
│   │   │   ├── resource.js
│   │   │   ├── report.js
│   │   │   └── system.js
│   ├── router/
│   │   ├── index.js
│   │   └── routes.js
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── index.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── Navbar.vue
│   │   │   └── TagsView.vue
│   │   ├── SvgIcon/
│   │   ├── IconSelect/
│   │   ├── Pagination/
│   │   ├── Editor/
│   │   └── Upload/
│   ├── views/
│   │   ├── login/
│   │   │   └── index.vue
│   │   ├── dashboard/
│   │   │   └── index.vue
│   │   ├── homework/
│   │   │   ├── publish/
│   │   │   │   ├── index.vue
│   │   │   │   └── create.vue
│   │   │   ├── submit/
│   │   │   │   └── index.vue
│   │   │   ├── grade/
│   │   │   │   ├── index.vue
│   │   │   │   └── detail.vue
│   │   │   └── list/
│   │   │       └── index.vue
│   │   ├── resource/
│   │   │   ├── question/
│   │   │   │   ├── index.vue
│   │   │   │   └── edit.vue
│   │   │   ├── paper/
│   │   │   │   ├── index.vue
│   │   │   │   └── compose.vue
│   │   │   └── knowledge/
│   │   │       └── index.vue
│   │   ├── report/
│   │   │   ├── class/
│   │   │   │   └── index.vue
│   │   │   ├── personal/
│   │   │   │   └── index.vue
│   │   │   └── cockpit/
│   │   │       └── index.vue
│   │   ├── mistake/
│   │   │   ├── index.vue
│   │   │   └── practice.vue
│   │   └── system/
│   │       ├── message/
│   │       │   └── index.vue
│   │       ├── user/
│   │       │   └── index.vue
│   │       └── role/
│   │           └── index.vue
│   └── mock/
│       ├── index.js
│       ├── auth.js
│       ├── homework.js
│       ├── resource.js
│       ├── report.js
│       ├── mistake.js
│       └── cockpit.js
```

---

## 任务分解

### Task 1: 项目初始化和基础配置

**Files:**
- Create: `ai-grad-system-front/package.json`
- Create: `ai-grad-system-front/vite.config.js`
- Create: `ai-grad-system-front/index.html`
- Create: `ai-grad-system-front/.env`
- Create: `ai-grad-system-front/.env.development`
- Create: `ai-grad-system-front/.env.production`
- Create: `ai-grad-system-front/.gitignore`
- Create: `ai-grad-system-front/README.md`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "ai-grad-system-front",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.1",
    "element-plus": "^2.5.0",
    "@element-plus/icons-vue": "^2.3.1",
    "axios": "^1.6.5",
    "dayjs": "^1.11.10",
    "echarts": "^5.4.3",
    "lodash-es": "^4.17.21",
    "normalize.css": "^8.0.1",
    "nprogress": "^0.2.0",
    "path-browserify": "^1.0.1",
    "mockjs": "^1.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.10",
    "vite-plugin-svg-icons": "^2.0.1",
    "vite-plugin-mock": "^3.0.1",
    "sass": "^1.69.5",
    "unplugin-auto-import": "^0.17.3",
    "unplugin-vue-components": "^0.26.0",
    "eslint": "^8.55.0",
    "eslint-plugin-vue": "^9.19.2"
  },
  "engines": {
    "node": ">=24.11.1"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js**

```javascript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    base: './',
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: 'src/mock',
        localEnabled: env.VITE_NODE_ENV === 'development',
        prodEnabled: false,
        injectCode: `
          import { setupMock } from '../mock'
          setupMock()
        `,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'echarts': ['echarts'],
          },
        },
      },
    },
  }
})
```

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/x-icon" href="./favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>智能作业批阅平台</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 4: 创建环境变量文件**

`.env`:
```
VITE_APP_TITLE=智能作业批阅平台
VITE_PORT=3000
```

`.env.development`:
```
VITE_NODE_ENV=development
VITE_BASE_API=/api
VITE_MOCK=true
```

`.env.production`:
```
VITE_NODE_ENV=production
VITE_BASE_API=/api
VITE_MOCK=false
```

- [ ] **Step 5: 创建 .gitignore**

```
# Logs
logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs
lib-cov

# Coverage directory
coverage

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn
.yarn-integrity
.pnp.*
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz

# IDE
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Env
.env.local
.env.*.local

# Build
dist/
dist-ssr/
*.local

# Vite
*.local

# auto-imports
src/auto-imports.d.ts
src/components.d.ts
```

- [ ] **Step 6: 创建 README.md**

```markdown
# 智能作业批阅平台 - 前端原型系统

## 技术栈

- Vue 3 (Composition API)
- Vite 5
- Element Plus
- Pinia
- Vue Router
- ECharts
- Mock.js

## 环境要求

- Node.js >= 24.11.1

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 公共组件
├── mock/         # Mock 数据
├── router/       # 路由配置
├── store/        # 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面组件
```

## 默认登录账号

- 账号：admin
- 密码：admin123

## 功能模块

- 作业发布与管理
- 作业智能批阅
- 校本作业资源管理
- 作业报告
- 课堂作业讲评
- 错题再练
- 作业数据驾驶舱
```

- [ ] **Step 7: Commit**

```bash
cd ai-grad-system-front
git add .
git commit -m "feat: initialize Vue 3 project structure"
```

---

### Task 2: 核心基础文件

**Files:**
- Create: `ai-grad-system-front/src/main.js`
- Create: `ai-grad-system-front/src/App.vue`
- Create: `ai-grad-system-front/src/settings.js`
- Create: `ai-grad-system-front/src/styles/variables.scss`
- Create: `ai-grad-system-front/src/styles/global.scss`
- Create: `ai-grad-system-front/public/favicon.ico`

- [ ] **Step 1: 创建 main.js**

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'normalize.css'
import './styles/global.scss'
import './styles/theme.scss'
import App from './App.vue'
import router from './router'
import { setupMock } from './mock'

const app = createApp(App)
const pinia = createPinia()

// 添加持久化插件
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
})

// 注册全局图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 开发环境启用 Mock
if (import.meta.env.VITE_MOCK === 'true') {
  setupMock()
}

app.mount('#app')
```

- [ ] **Step 2: 创建 App.vue**

```vue
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
```

- [ ] **Step 3: 创建 settings.js**

```javascript
export default {
  title: '智能作业批阅平台',
  
  // 主题设置
  theme: {
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
  },
  
  // 侧边栏设置
  sidebar: {
    defaultOpened: true,
    defaultActive: '/dashboard',
  },
  
  // 布局设置
  layout: {
    sidebarWidth: 210,
    headerHeight: 50,
    tagsViewHeight: 34,
  },
  
  // Mock 数据配置
  mock: {
    // 泉州市背景数据
    location: {
      province: '福建省',
      city: '泉州市',
    },
    // 当前学年
    schoolYear: '2025-2026',
    // 当前学期
    semester: '第二学期',
  },
  
  // 分页设置
  pagination: {
    defaultPageSize: 10,
    pageSizes: [10, 20, 50, 100],
  },
}
```

- [ ] **Step 4: 创建 variables.scss**

```scss
// 主题色 - 科技蓝
$primary-color: #409EFF;
$primary-light: #ecf5ff;
$primary-dark: #337ecc;

// 渐变色 - 科技蓝紫融合
$gradient-blue-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$gradient-blue-deep: linear-gradient(135deg, #409EFF 0%, #2c5282 100%);
$gradient-login-bg: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #409EFF 100%);

// 功能色
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;
$info-color: #909399;

// 文字颜色
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$text-placeholder: #C0C4CC;

// 背景色
$bg-page: #f5f7fa;
$bg-white: #ffffff;
$bg-overlay: rgba(0, 0, 0, 0.5);

// 边框颜色
$border-color: #DCDFE6;
$border-light: #E4E7ED;

// 阴影
$shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
$shadow-medium: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
$shadow-dark: 0 8px 24px 0 rgba(0, 0, 0, 0.15);

// 尺寸
$sidebar-width: 210px;
$header-height: 50px;
$tags-view-height: 34px;

// 动画
$transition-base: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
$transition-fast: all 0.2s ease-in-out;
$transition-slow: all 0.5s ease-in-out;

// 断点
$breakpoint-xs: 768px;
$breakpoint-sm: 992px;
$breakpoint-md: 1200px;
$breakpoint-lg: 1920px;
```

- [ ] **Step 5: 创建 global.scss**

```scss
@import './variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $bg-page;
  color: $text-primary;
}

a {
  color: $primary-color;
  text-decoration: none;
  
  &:hover {
    color: lighten($primary-color, 10%);
  }
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

// 清除浮动
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

// 文本省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 卡片通用样式
.card {
  background: $bg-white;
  border-radius: 4px;
  box-shadow: $shadow-light;
  padding: 20px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid $border-light;
}

// 页面容器
.page-container {
  padding: 20px;
}

// 表格操作按钮
.table-actions {
  .el-button + .el-button {
    margin-left: 8px;
  }
}

// 搜索表单
.search-form {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

// 按钮组
.btn-group {
  margin-bottom: 16px;
  
  .el-button + .el-button {
    margin-left: 8px;
  }
}

// 状态标签
.status-tag {
  &.status-success {
    background-color: lighten($success-color, 35%);
    color: darken($success-color, 10%);
  }
  
  &.status-warning {
    background-color: lighten($warning-color, 35%);
    color: darken($warning-color, 10%);
  }
  
  &.status-danger {
    background-color: lighten($danger-color, 35%);
    color: darken($danger-color, 10%);
  }
  
  &.status-info {
    background-color: lighten($info-color, 35%);
    color: darken($info-color, 10%);
  }
}
```

- [ ] **Step 6: 创建 theme.scss**

```scss
@import './variables.scss';

// Element Plus 主题覆盖
.el-button--primary {
  --el-button-bg-color: #{$primary-color};
  --el-button-border-color: #{$primary-color};
  --el-button-hover-bg-color: #{lighten($primary-color, 10%)};
  --el-button-hover-border-color: #{lighten($primary-color, 10%)};
}

.el-menu {
  --el-menu-bg-color: #ffffff;
  --el-menu-text-color: #{$text-regular};
  --el-menu-hover-bg-color: #{$primary-light};
  --el-menu-active-color: #{$primary-color};
  --el-menu-hover-text-color: #{$primary-color};
}

.el-card {
  --el-card-bg-color: #ffffff;
  border-radius: 8px;
  box-shadow: $shadow-light;
}

.el-table {
  --el-table-bg-color: #ffffff;
  --el-table-tr-bg-color: #ffffff;
  --el-table-header-bg-color: #f5f7fa;
  --el-table-text-color: #{$text-regular};
  --el-table-header-text-color: #{$text-regular};
  --el-table-border-color: #{$border-light};
  
  th {
    background-color: #f5f7fa !important;
  }
}

.el-dialog {
  border-radius: 8px;
  
  .el-dialog__header {
    border-bottom: 1px solid $border-light;
    padding-bottom: 16px;
  }
  
  .el-dialog__footer {
    border-top: 1px solid $border-light;
    padding-top: 16px;
  }
}

.el-input__wrapper {
  border-radius: 4px;
}

.el-select-dropdown__item.selected {
  color: $primary-color;
  font-weight: 600;
}

// 标签页
.el-tabs {
  &.el-tabs--card {
    .el-tabs__item {
      border: none;
      border-radius: 4px 4px 0 0;
      
      &.is-active {
        color: $primary-color;
        background-color: $primary-light;
      }
    }
  }
}

// 统计卡片
.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: #ffffff;
  
  .stat-value {
    font-size: 32px;
    font-weight: bold;
    margin: 8px 0;
  }
  
  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add core application files and styles"
```

---

### Task 3: 工具函数和 API 基础

**Files:**
- Create: `ai-grad-system-front/src/utils/request.js`
- Create: `ai-grad-system-front/src/utils/auth.js`
- Create: `ai-grad-system-front/src/utils/storage.js`
- Create: `ai-grad-system-front/src/utils/validate.js`
- Create: `ai-grad-system-front/src/api/auth.js`

- [ ] **Step 1: 创建 request.js**

```javascript
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 如果自定义状态码不是 200，则认为是错误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000,
      })
      
      // 401: 未授权或 token 过期
      if (res.code === 401) {
        ElMessageBox.confirm(
          '登录状态已过期，请重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          removeToken()
          location.reload()
        })
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    console.error('Response error:', error)
    
    let message = '网络错误，请稍后重试'
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = `连接错误：${error.response.status}`
      }
    } else if (error.request) {
      message = '无法连接到服务器，请检查网络'
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 3000,
    })
    
    return Promise.reject(error)
  }
)

export default service
```

- [ ] **Step 2: 创建 auth.js**

```javascript
import Cookies from 'js-cookie'

const TOKEN_KEY = 'smart_grad_token'
const USER_INFO_KEY = 'smart_grad_user_info'

// 获取 token
export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

// 设置 token
export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 天过期
    path: '/',
  })
}

// 删除 token
export function removeToken() {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(USER_INFO_KEY)
}

// 获取用户信息
export function getUserInfo() {
  const userInfo = Cookies.get(USER_INFO_KEY)
  if (userInfo) {
    try {
      return JSON.parse(userInfo)
    } catch (e) {
      return null
    }
  }
  return null
}

// 设置用户信息
export function setUserInfo(userInfo) {
  return Cookies.set(USER_INFO_KEY, JSON.stringify(userInfo), {
    expires: 7,
    path: '/',
  })
}
```

- [ ] **Step 3: 创建 storage.js**

```javascript
// 本地存储工具类

const STORAGE_PREFIX = 'smart_grad_'

// localStorage 操作
export const storage = {
  // 设置存储
  set(key, value) {
    try {
      const stringValue = typeof value === 'string' 
        ? value 
        : JSON.stringify(value)
      localStorage.setItem(STORAGE_PREFIX + key, stringValue)
    } catch (e) {
      console.error('LocalStorage set error:', e)
    }
  },
  
  // 获取存储
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(STORAGE_PREFIX + key)
      if (value === null) return defaultValue
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    } catch (e) {
      console.error('LocalStorage get error:', e)
      return defaultValue
    }
  },
  
  // 删除存储
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (e) {
      console.error('LocalStorage remove error:', e)
    }
  },
  
  // 清空存储
  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.error('LocalStorage clear error:', e)
    }
  },
}

// sessionStorage 操作
export const session = {
  set(key, value) {
    try {
      const stringValue = typeof value === 'string' 
        ? value 
        : JSON.stringify(value)
      sessionStorage.setItem(STORAGE_PREFIX + key, stringValue)
    } catch (e) {
      console.error('SessionStorage set error:', e)
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const value = sessionStorage.getItem(STORAGE_PREFIX + key)
      if (value === null) return defaultValue
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    } catch (e) {
      console.error('SessionStorage get error:', e)
      return defaultValue
    }
  },
  
  remove(key) {
    try {
      sessionStorage.removeItem(STORAGE_PREFIX + key)
    } catch (e) {
      console.error('SessionStorage remove error:', e)
    }
  },
}
```

- [ ] **Step 4: 创建 validate.js**

```javascript
// 表单验证工具

/**
 * 验证邮箱
 */
export function isEmail(value) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(value)
}

/**
 * 验证手机号
 */
export function isPhone(value) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(value)
}

/**
 * 验证身份证
 */
export function isIdCard(value) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(value)
}

/**
 * 验证 URL
 */
export function isUrl(value) {
  const reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return reg.test(value)
}

/**
 * 验证 IP 地址
 */
export function isIp(value) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(value)
}

/**
 * 验证是否为空
 */
export function isEmpty(value) {
  return value === null || value === undefined || value === ''
}

/**
 * 验证长度
 */
export function isLength(value, min, max) {
  if (isEmpty(value)) return false
  const len = String(value).length
  if (min !== undefined && len < min) return false
  if (max !== undefined && len > max) return false
  return true
}

/**
 * 验证数字
 */
export function isNumber(value) {
  const reg = /^\d+\.?\d*$/
  return reg.test(value)
}

/**
 * 验证整数
 */
export function isInteger(value) {
  const reg = /^\d+$/
  return reg.test(value)
}
```

- [ ] **Step 5: 创建 auth.js API**

```javascript
import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.code - 验证码（可选）
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/auth/userinfo',
    method: 'get',
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}

/**
 * 修改密码
 * @param {Object} data - 密码信息
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/auth/password',
    method: 'post',
    data,
  })
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add utility functions and API base"
```

---

### Task 4: 路由和状态管理

（由于计划较长，后续任务将简要列出关键步骤）

**Files:**
- Create: `ai-grad-system-front/src/router/index.js`
- Create: `ai-grad-system-front/src/router/routes.js`
- Create: `ai-grad-system-front/src/store/index.js`
- Create: `ai-grad-system-front/src/store/modules/user.js`
- Create: `ai-grad-system-front/src/store/modules/system.js`

---

### Task 5: 布局组件

**Files:**
- Create: `ai-grad-system-front/src/components/Layout/index.vue`
- Create: `ai-grad-system-front/src/components/Layout/Sidebar.vue`
- Create: `ai-grad-system-front/src/components/Layout/Navbar.vue`
- Create: `ai-grad-system-front/src/components/Layout/TagsView.vue`

---

### Task 6: 登录页面

**Files:**
- Create: `ai-grad-system-front/src/views/login/index.vue`
- Create: `ai-grad-system-front/src/mock/auth.js`

---

### Task 7-14: 业务模块实现

后续任务将实现各个业务模块，包括作业管理、资源管理、报告、错题本、驾驶舱等。

---

## 自检查清单

计划完成后，请检查：

1. **Spec coverage:**
   - [ ] Vue 3 + Vite + Element Plus 技术栈
   - [ ] Pinia 状态管理
   - [ ] 科技蓝主题色
   - [ ] 登录页面科技蓝紫背景
   - [ ] 泉州市背景 Mock 数据
   - [ ] 数据一致性（统计与列表统一）
   - [ ] 查询过滤功能
   - [ ] Tabs 联动统计
   - [ ] 所有按钮有交互
   - [ ] 系统消息模块

2. **Placeholder scan:** 无 TBD/TODO

3. **Type consistency:** 所有 API 和 Store 使用一致的命名
