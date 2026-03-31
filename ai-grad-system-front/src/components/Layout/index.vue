<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device === 'mobile' && sidebarOpened" class="drawer-bg" @click="handleClickOutside" />

    <Sidebar class="sidebar-container" />

    <div class="main-container">
      <Navbar />
      <TagsView v-if="showTagsView" />
      <div class="app-main">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@/store/modules/system'
import { asyncRoutes } from '@/router/routes'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import TagsView from './TagsView.vue'

const route = useRoute()
const systemStore = useSystemStore()

const sidebarOpened = computed(() => systemStore.sidebarOpened)
const showTagsView = computed(() => true)
const cachedViews = computed(() => systemStore.cachedViews)
const device = computed(() => systemStore.device)

const classObj = computed(() => ({
  hideSidebar: !sidebarOpened.value,
  openSidebar: sidebarOpened.value,
  mobile: device.value === 'mobile',
}))

const handleClickOutside = () => {
  systemStore.closeSidebar()
}

watch(
  () => route.path,
  (newPath) => {
    systemStore.addVisitedView({
      name: route.name,
      path: newPath,
      meta: { ...route.meta },
    })
    systemStore.addCachedView(route)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  width: $sidebar-width;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  transition: width 0.28s;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sidebar-width;
  position: relative;
}

.hideSidebar {
  .sidebar-container {
    width: 54px !important;
  }

  .main-container {
    margin-left: 54px;
  }
}

.mobile {
  .sidebar-container {
    transition: transform 0.28s;
    width: $sidebar-width !important;
  }

  .main-container {
    margin-left: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      transform: translateX(-$sidebar-width);
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.app-main {
  min-height: calc(100vh - #{$header-height} - #{$tags-view-height});
  width: 100%;
  background-color: $bg-page;
  overflow: hidden;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
