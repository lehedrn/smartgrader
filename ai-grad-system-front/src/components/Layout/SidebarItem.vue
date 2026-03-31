<template>
  <div v-if="!isCollapse">
    <template v-if="hasOneShowingChild(item.children, item)">
      <!-- 数据驾驶舱在新窗口打开 -->
      <a v-if="item.meta?.target === '_blank'" :href="getFullUrl(onlyOneChild.path)" target="_blank" style="text-decoration: none;">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <el-icon v-if="onlyOneChild.meta?.icon">
            <component :is="onlyOneChild.meta.icon" />
          </el-icon>
          <template #title>
            <span>{{ onlyOneChild.meta?.title || item.meta?.title }}</span>
          </template>
        </el-menu-item>
      </a>
      <el-menu-item v-else :index="resolvePath(onlyOneChild.path)" @click="handleClick(onlyOneChild.path)">
        <el-icon v-if="onlyOneChild.meta?.icon">
          <component :is="onlyOneChild.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ onlyOneChild.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <template v-for="child in item.children.filter(child => !child.meta?.hidden)" :key="child.path">
        <!-- 子路由有 target: '_blank' 时在新窗口打开 -->
        <a
          v-if="child.meta?.target === '_blank'"
          :href="getFullUrl(child.path)"
          target="_blank"
          style="text-decoration: none;"
        >
          <el-menu-item :index="resolvePath(child.path)">
            <el-icon v-if="child.meta?.icon">
              <component :is="child.meta.icon" />
            </el-icon>
            <template #title>
              <span>{{ child.meta?.title }}</span>
            </template>
          </el-menu-item>
        </a>
        <SidebarItem
          v-else
          :item="child"
          :base-path="resolvePath(child.path)"
          :is-collapse="isCollapse"
        />
      </template>
    </el-sub-menu>
  </div>

  <!-- 折叠模式下的单个菜单项 -->
  <el-tooltip v-else placement="right" :content="item.meta?.title">
    <!-- 数据驾驶舱在新窗口打开 -->
    <a v-if="item.meta?.target === '_blank'" :href="getFullUrl(item.path)" target="_blank" style="text-decoration: none;">
      <el-menu-item :index="resolvePath(item.path)">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </a>
    <el-menu-item v-else :index="resolvePath(item.path)" @click="handleClick(item.path)">
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import path from 'path-browserify'

const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isCollapse: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const onlyOneChild = ref(null)

const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter(item => {
    // 安全检查：如果 meta 不存在或 hidden 为 true，则隐藏
    if (!item.meta || item.meta.hidden) {
      return false
    }
    onlyOneChild.value = item
    return true
  })

  if (showingChildren.length === 1) {
    return true
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath) => {
  // 处理空路径的情况
  if (!routePath || routePath === '') {
    return props.basePath || '/'
  }
  // 如果路径已经是绝对路径，直接返回
  if (routePath.startsWith('/')) {
    return routePath
  }
  // 否则拼接 basePath
  return path.resolve(props.basePath, routePath)
}

// 获取完整 URL（用于新窗口打开）
const getFullUrl = (routePath) => {
  const fullPath = resolvePath(routePath)
  return window.location.origin + window.location.pathname + '#' + fullPath
}

// 处理菜单点击跳转
const handleClick = (routePath) => {
  const fullPath = resolvePath(routePath)
  router.push(fullPath)
}
</script>
