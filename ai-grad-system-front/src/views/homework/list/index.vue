<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>作业列表</span>
      </template>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="title" label="作业标题" min-width="180" />
        <el-table-column prop="subject" label="学科" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 查看作业详情弹窗 -->
    <el-dialog v-model="viewVisible" title="作业详情" width="800px" :close-on-click-modal="false">
      <div v-loading="viewLoading">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="作业标题">{{ viewData.homeworkTitle || viewData.title }}</el-descriptions-item>
          <el-descriptions-item label="学科">
            <el-tag :type="getSubjectTagType(viewData.subject)">{{ viewData.subject }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="作业类型">{{ viewData.type }}</el-descriptions-item>
          <el-descriptions-item label="发布班级">{{ viewData.classes?.join('、') || viewData.className }}</el-descriptions-item>
          <el-descriptions-item label="布置日期">{{ viewData.publishDate }}</el-descriptions-item>
          <el-descriptions-item label="截止时间">{{ viewData.deadline }}</el-descriptions-item>
          <el-descriptions-item label="预计时长">{{ viewData.duration }} 分钟</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(viewData.status)">{{ getStatusText(viewData.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>作业描述</el-divider>
        <p style="color: #606266; line-height: 1.6; padding: 12px; background: #f5f7fa; border-radius: 4px;">
          {{ viewData.description || '暂无描述' }}
        </p>

        <el-divider>题目列表</el-divider>
        <div v-if="viewData.questions && viewData.questions.length > 0" class="question-list">
          <div v-for="(q, index) in viewData.questions" :key="q.id" class="question-item">
            <div class="question-header">
              <span class="question-title">题目 {{ index + 1 }}：{{ q.title }}</span>
              <span class="question-score">{{ q.score }}分</span>
            </div>
          </div>
          <div class="question-total">
            共 {{ viewData.questions.length }} 题，总分 {{ calculateTotalScore }} 分
          </div>
        </div>
        <el-empty v-else description="暂无题目" />
      </div>

      <template #footer>
        <el-button @click="viewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getHomeworkList, getHomeworkDetail } from '@/api/homework'

const loading = ref(false)
const tableData = ref([])
const viewVisible = ref(false)
const viewLoading = ref(false)
const viewData = ref({})

const calculateTotalScore = computed(() => {
  if (!viewData.value.questions || viewData.value.questions.length === 0) {
    return 0
  }
  return viewData.value.questions.reduce((sum, q) => sum + (q.score || 0), 0)
})

const getStatusTagType = (status) => {
  const map = { WKS: 'info', JXZ: 'warning', YJZ: 'danger', YWC: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { WKS: '未开始', JXZ: '进行中', YJZ: '已截止', YWC: '已完成' }
  return map[status] || status
}

const getSubjectTagType = (subject) => {
  const map = { '语文': 'success', '数学': 'primary', '英语': 'warning' }
  return map[subject] || ''
}

const getList = async () => {
  loading.value = true
  try {
    const { data } = await getHomeworkList({ page: 1, pageSize: 10 })
    tableData.value = data.list
  } catch (error) {
    console.error('Failed to get list:', error)
  } finally {
    loading.value = false
  }
}

const handleView = async (row) => {
  viewData.value = {}
  viewVisible.value = true
  viewLoading.value = true
  try {
    const { data } = await getHomeworkDetail(row.id)
    viewData.value = {
      ...data,
      homeworkTitle: data.homeworkTitle || data.title,
      className: data.className || data.classes?.[0],
    }
  } catch (error) {
    console.error('Failed to get detail:', error)
    ElMessage.error('加载作业详情失败')
  } finally {
    viewLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.question-list {
  .question-item {
    padding: 16px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    margin-bottom: 12px;

    .question-header {
      display: flex;
      justify-content: space-between;

      .question-title {
        font-weight: 500;
        color: #303133;
      }

      .question-score {
        color: #409EFF;
        font-weight: 600;
      }
    }
  }

  .question-total {
    text-align: right;
    font-weight: 600;
    margin-top: 16px;
    color: #409EFF;
  }
}
</style>
