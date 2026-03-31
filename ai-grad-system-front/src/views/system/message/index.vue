<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>消息中心</span>
          <el-button @click="handleMarkAll">全部已读</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="未读消息" name="unread">
          <el-empty v-if="unreadMessages.length === 0" description="暂无未读消息" />
          <div v-else>
            <div class="message-item" v-for="msg in unreadMessages" :key="msg.id">
              <div class="message-icon unread"></div>
              <div class="message-content">
                <div class="message-title">{{ msg.title }}</div>
                <div class="message-text">{{ msg.content }}</div>
                <div class="message-time">{{ msg.time }}</div>
              </div>
              <div class="message-actions">
                <el-button link type="primary" @click="handleRead(msg)">标记已读</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已读消息" name="read">
          <div class="message-item read" v-for="msg in readMessages" :key="msg.id">
            <div class="message-icon read"></div>
            <div class="message-content">
              <div class="message-title">{{ msg.title }}</div>
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('unread')

const unreadMessages = ref([
  { id: '1', title: '系统通知', content: '系统将于本周六凌晨 2:00-5:00 进行维护升级，请提前保存数据。', time: '10 分钟前' },
  { id: '2', title: '作业批阅提醒', content: '您有 5 份作业待批阅，请及时处理。', time: '30 分钟前' },
])

const readMessages = ref([
  { id: '3', title: '功能更新', content: '相似题推荐功能已上线，帮助学生更好地巩固知识点。', time: '昨天' },
  { id: '4', title: '成绩报告', content: '三年 (1) 班的单元测试成绩报告已生成，请查看。', time: '3 天前' },
])

const handleMarkAll = () => {
  unreadMessages.value = []
  ElMessage.success('已全部标记为已读')
}

const handleRead = (msg) => {
  unreadMessages.value = unreadMessages.value.filter(m => m.id !== msg.id)
  ElMessage.success('已标记为已读')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.card-header { display: flex; justify-content: space-between; align-items: center; }
.message-item { display: flex; gap: 16px; padding: 16px; border-bottom: 1px solid $border-light; transition: background 0.2s; }
.message-item:hover { background: $bg-page; }
.message-item.read { opacity: 0.7; }
.message-icon { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
.message-icon.unread { background: $primary-color; }
.message-icon.read { background: $border-color; }
.message-content { flex: 1; }
.message-title { font-weight: 600; margin-bottom: 8px; }
.message-text { color: $text-regular; margin-bottom: 8px; }
.message-time { font-size: 12px; color: $text-placeholder; }
.message-actions { display: flex; align-items: center; }
</style>
