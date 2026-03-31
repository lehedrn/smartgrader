<template>
  <div class="sidebar-container">
    <div class="logo-container">
      <router-link to="/">
        <div class="logo-icon">
          <el-icon :size="32"><School /></el-icon>
        </div>
        <span v-if="sidebarOpened" class="logo-title">智能作业批阅</span>
      </router-link>
    </div>

    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebarOpened"
        :background-color="''"
        :text-color="''"
        :active-text-color="''"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 作业报告菜单：手动添加数据驾驶舱子菜单项 -->
          <el-sub-menu
            v-if="route.path === '/report'"
            :index="route.path"
          >
            <template #title>
              <el-icon v-if="route.meta.icon">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta.title }}</span>
            </template>
            <!-- 正常的子路由 -->
            <SidebarItem
              v-for="child in route.children.filter(child => !child.meta?.hidden)"
              :key="child.path"
              :item="child"
              :base-path="resolveChildPath(route.path, child.path)"
              :is-collapse="!sidebarOpened"
            />
            <!-- 数据驾驶舱菜单项（在新窗口打开） -->
            <a
              href="#/report/cockpit"
              target="_blank"
              style="text-decoration: none;"
            >
              <el-menu-item index="/report/cockpit">
                <el-icon><DataAnalysis /></el-icon>
                <template #title>
                  <span>数据驾驶舱</span>
                </template>
              </el-menu-item>
            </a>
          </el-sub-menu>
          <!-- 其他菜单项 -->
          <SidebarItem
            v-else
            :item="route"
            :base-path="route.path"
            :is-collapse="!sidebarOpened"
          />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@/store/modules/system'
import { constantRoutes, asyncRoutes } from '@/router/routes'
import SidebarItem from './SidebarItem.vue'
import { DataAnalysis } from '@element-plus/icons-vue'

const route = useRoute()
const systemStore = useSystemStore()

const sidebarOpened = computed(() => systemStore.sidebarOpened)
const activeMenu = computed(() => route.path)

// 解析子路由路径
const resolveChildPath = (parentPath, childPath) => {
  if (childPath.startsWith('/')) return childPath
  return parentPath + '/' + childPath
}

// 合并路由，过滤掉隐藏的和不需要的路由
const menuRoutes = computed(() => {
  // 从 constantRoutes 中提取 dashboard（排除 login、404 和根路由）
  const dashboardRoute = constantRoutes.find(r => r.path === '/' && r.children?.[0])
  const dashboard = dashboardRoute ? {
    ...dashboardRoute.children[0],
    path: '/dashboard',
  } : null

  // 从 asyncRoutes 中提取所有可见路由
  const visibleRoutes = asyncRoutes.filter(route => {
    // 排除通配符路由
    if (route.path === '/:pathMatch(.*)*') return false
    // 排除 meta.hidden 为 true 的路由
    if (route.meta?.hidden) return false
    // 排除数据驾驶舱（手动添加到作业报告菜单下）
    if (route.name === 'DataCockpit') return false
    return true
  })

  // 合并 dashboard 和其他路由
  return dashboard ? [dashboard, ...visibleRoutes] : visibleRoutes
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebar-container {
  .logo-container {
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    a {
      display: flex;
      align-items: center;
      width: 100%;
      text-decoration: none;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }

    .logo-title {
      margin-left: 12px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  :deep(.el-menu) {
    border: none;
    height: 100%;

    .el-menu-item {
      &:hover {
        background-color: $primary-light !important;
      }

      &.is-active {
        background-color: $primary-light !important;
        color: $primary-color !important;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: $primary-color;
        }
      }
    }
  }
}
</style>
