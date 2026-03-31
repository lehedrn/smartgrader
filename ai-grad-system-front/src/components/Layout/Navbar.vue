<template>
  <div class="navbar">
    <div class="navbar-left">
      <el-icon class="hamburger" @click="toggleSidebar">
        <Fold v-if="sidebarOpened" />
        <Expand v-else />
      </el-icon>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="navbar-right">
      <!-- 消息通知 -->
      <el-dropdown trigger="click" @command="handleMessageCommand">
        <el-badge :value="unreadCount" class="message-badge">
          <el-icon><Bell /></el-icon>
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="read">
              <div class="message-item">
                <el-icon><Document /></el-icon>
                <span>系统通知：平台将于下周进行维护升级</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="read">
              <div class="message-item">
                <el-icon><Check /></el-icon>
                <span>作业批阅完成：高三 (1) 班数学作业</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="all">
              <span style="color: #409EFF">查看全部消息</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 全屏切换 -->
      <el-icon class="screen-full" @click="toggleScreenFull">
        <FullScreen v-if="!isFullscreen" />
        <DArrowLeft v-else />
      </el-icon>

      <!-- 用户信息 -->
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="32" :src="avatar">
            {{ realName?.charAt(0) }}
          </el-avatar>
          <span class="user-name">{{ realName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleProfile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="handleSettings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 个人中心弹窗 -->
    <el-dialog v-model="profileVisible" title="个人中心" width="500px" :close-on-click-modal="false">
      <el-form :model="profileForm" label-width="100px" class="profile-form">
        <el-form-item label="头像">
          <el-avatar :size="80" :src="avatar">{{ realName?.charAt(0) }}</el-avatar>
          <el-button link type="primary" style="margin-left: 16px">更换头像</el-button>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="profileForm.realName" />
        </el-form-item>
        <el-form-item label="所属单位">
          <el-input v-model="profileForm.organization" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileVisible = false">取消</el-button>
        <el-button type="primary" @click="handleProfileSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 系统设置弹窗 -->
    <el-dialog v-model="settingsVisible" title="系统设置" width="600px" :close-on-click-modal="false">
      <el-tabs v-model="settingsActiveTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="settingsForm" label-width="120px" class="settings-form">
            <el-form-item label="系统名称">
              <el-input v-model="settingsForm.systemName" />
            </el-form-item>
            <el-form-item label="系统 Logo">
              <el-upload action="#" :auto-upload="false" :show-file-list="false">
                <el-button type="primary">上传 Logo</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="分页大小">
              <el-select v-model="settingsForm.pageSize" style="width: 120px">
                <el-option label="10 条" value="10" />
                <el-option label="20 条" value="20" />
                <el-option label="50 条" value="50" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="settingsForm" label-width="120px" class="settings-form">
            <el-form-item label="消息提醒">
              <el-switch v-model="settingsForm.enableNotify" />
            </el-form-item>
            <el-form-item label="提醒频率">
              <el-radio-group v-model="settingsForm.notifyFrequency">
                <el-radio label="realtime">实时</el-radio>
                <el-radio label="hourly">每小时</el-radio>
                <el-radio label="daily">每日</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="settingsForm" label-width="120px" class="settings-form">
            <el-form-item label="会话超时">
              <el-select v-model="settingsForm.sessionTimeout" style="width: 150px">
                <el-option label="30 分钟" value="30" />
                <el-option label="1 小时" value="60" />
                <el-option label="2 小时" value="120" />
                <el-option label="8 小时" value="480" />
              </el-select>
            </el-form-item>
            <el-form-item label="登录验证">
              <el-switch v-model="settingsForm.requireVerification" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSettingsSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useSystemStore } from '@/store/modules/system'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const systemStore = useSystemStore()
const userStore = useUserStore()

const sidebarOpened = computed(() => systemStore.sidebarOpened)
const unreadCount = computed(() => systemStore.unreadCount)
const realName = computed(() => userStore.realName)
const avatar = computed(() => userStore.avatar)
const username = computed(() => userStore.username)
const organization = computed(() => userStore.organization)

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title,
  }))
})

const isFullscreen = ref(false)

// 个人中心相关
const profileVisible = ref(false)
const profileForm = reactive({
  username: '',
  realName: '',
  organization: '',
  phone: '',
  email: '',
})

// 系统设置相关
const settingsVisible = ref(false)
const settingsActiveTab = ref('basic')
const settingsForm = reactive({
  systemName: 'AI 智能作业评阅系统',
  logo: '',
  pageSize: '10',
  enableNotify: true,
  notifyFrequency: 'realtime',
  sessionTimeout: '60',
  requireVerification: true,
})

const toggleSidebar = () => {
  systemStore.toggleSidebar()
}

const toggleScreenFull = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleMessageCommand = (command) => {
  if (command === 'all') {
    router.push('/system/message')
  } else if (command === 'read') {
    ElMessage.success('已标记为已读')
  }
}

const handleProfile = () => {
  profileForm.username = username.value
  profileForm.realName = realName.value
  profileForm.organization = organization.value
  profileForm.phone = ''
  profileForm.email = ''
  profileVisible.value = true
}

const handleProfileSave = () => {
  ElMessage.success('个人信息保存成功')
  profileVisible.value = false
}

const handleSettings = () => {
  settingsVisible.value = true
}

const handleSettingsSave = () => {
  ElMessage.success('系统设置保存成功')
  settingsVisible.value = false
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确认退出登录吗？', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await userStore.logout()
    router.push(`/login?redirect=${route.path}`)
    ElMessage.success('已退出登录')
  } catch {
    // 取消退出
  }
}

onMounted(() => {
  systemStore.setMessages([
    { id: 1, title: '系统通知', read: false },
    { id: 2, title: '作业批阅完成', read: false },
    { id: 3, title: '新增功能通知', read: true },
  ])
})

onUnmounted(() => {
  // 清理
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.navbar {
  height: $header-height;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.navbar-left {
  display: flex;
  align-items: center;

  .hamburger {
    font-size: 20px;
    cursor: pointer;
    margin-right: 16px;
    color: $text-regular;

    &:hover {
      color: $primary-color;
    }
  }

  :deep(.el-breadcrumb) {
    .el-breadcrumb__item {
      font-size: 14px;
    }
  }
}

.navbar-right {
  display: flex;
  align-items: center;

  .message-badge {
    margin-right: 20px;
    cursor: pointer;

    .el-icon {
      font-size: 18px;
      color: $text-regular;
    }
  }

  .screen-full {
    font-size: 18px;
    cursor: pointer;
    margin-right: 20px;
    color: $text-regular;

    &:hover {
      color: $primary-color;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;

    .user-name {
      margin-left: 8px;
      font-size: 14px;
      color: $text-primary;
    }

    &:hover {
      .user-name {
        color: $primary-color;
      }
    }
  }
}

.message-item {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 250px;
}

.profile-form, .settings-form {
  padding: 16px 0;
}
</style>
