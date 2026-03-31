<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path }"
        class="tags-view-item"
        :class="{ active: isActive(tag) }"
      >
        {{ tag.title }}
        <el-icon v-if="!tag?.meta?.affix" class="close-icon" @click.prevent.stop="closeTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>

    <ul class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }" v-if="visible">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/store/modules/system'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()

const visitedViews = computed(() => systemStore.visitedViews)
const cachedViews = computed(() => systemStore.cachedViews)

const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedTag = ref({})

const isActive = (tag) => {
  return tag.path === route.path
}

const closeTag = (tag) => {
  systemStore.closeView(tag)
  if (isActive(tag)) {
    toLastView(visitedViews.value, tag)
  }
}

const closeSelectedTag = (tag) => {
  systemStore.closeView(tag)
  if (isActive(tag)) {
    toLastView(visitedViews.value, tag)
  }
}

const refreshSelectedTag = (tag) => {
  systemStore.removeCachedView(tag)
  router.replace({ path: '/redirect' + tag.path })
}

const closeOthersTags = () => {
  systemStore.closeOtherViews(selectedTag.value)
}

const closeAllTags = () => {
  systemStore.closeAllViews()
  router.push('/')
}

const toLastView = (visitedViews, tag) => {
  const index = visitedViews.findIndex(view => view.path === tag.path)
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

const openMenu = (tag, e) => {
  const menuMinWidth = 105
  const offsetLeft = 0
  const offsetWidth = document.documentElement.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const leftPos = e.clientX

  left.value = Math.min(maxLeft, leftPos)
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const closeMenu = () => {
  visible.value = false
}

defineExpose({
  openMenu,
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.tags-view-container {
  height: $tags-view-height;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid $border-light;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);

  .tags-view-wrapper {
    height: 100%;

    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid $border-light;
      color: $text-regular;
      background: #ffffff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      border-radius: 2px;

      &:first-of-type {
        margin-left: 15px;
      }

      &.active {
        background-color: $primary-color;
        color: #ffffff;
        border-color: $primary-color;

        &::before {
          content: '';
          background: #ffffff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }

      .close-icon {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        transition: all 0.3s;

        &:hover {
          background-color: rgba(0, 0, 0, 0.3);
          color: #ffffff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #ffffff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: $text-regular;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: $primary-light;
        color: $primary-color;
      }
    }
  }
}
</style>
