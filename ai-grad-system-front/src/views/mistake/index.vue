<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>错题本</span>
          <div class="header-actions">
            <el-button type="primary" @click="handlePracticeAll">
              <el-icon><RefreshRight /></el-icon>
              全部练习
            </el-button>
            <el-button @click="handleClearMistakes" :disabled="tableData.length === 0">
              <el-icon><Delete /></el-icon>
              清空错题
            </el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="学科">
          <el-select v-model="searchForm.subject" placeholder="请选择" clearable style="width: 120px">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
          </el-select>
        </el-form-item>
        <el-form-item label="掌握状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="未掌握" value="未掌握" />
            <el-option label="待巩固" value="待巩固" />
            <el-option label="已掌握" value="已掌握" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="questionTitle" label="题目" min-width="200" show-overflow-tooltip />
        <el-table-column prop="subject" label="学科" width="80">
          <template #default="{ row }">
            <el-tag :type="getSubjectTagType(row.subject)" size="small">{{ row.subject }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="knowledge" label="知识点" width="120" />
        <el-table-column prop="errorCount" label="错误次数" width="80">
          <template #default="{ row }">
            <span :class="{ 'error-high': row.errorCount >= 3 }">{{ row.errorCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastErrorTime" label="最后错误时间" width="160" />
        <el-table-column prop="status" label="掌握状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已掌握' ? 'success' : row.status === '待巩固' ? 'warning' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handlePracticeItem(row)">
              <el-icon><RefreshRight /></el-icon>
              练一练
            </el-button>
            <el-button link type="danger" @click="handleRemove(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 题目详情弹窗 -->
    <el-dialog v-model="detailVisible" title="题目详情" width="700px" :close-on-click-modal="false">
      <div v-if="currentQuestion" class="question-detail">
        <div class="detail-row">
          <span class="label">题目：</span>
          <span class="value">{{ currentQuestion.questionTitle }}</span>
        </div>
        <div class="detail-row">
          <span class="label">学科：</span>
          <el-tag :type="getSubjectTagType(currentQuestion.subject)" size="small">{{ currentQuestion.subject }}</el-tag>
        </div>
        <div class="detail-row">
          <span class="label">知识点：</span>
          <span class="value">{{ currentQuestion.knowledge }}</span>
        </div>
        <div class="detail-row">
          <span class="label">错误次数：</span>
          <span class="value error-high">{{ currentQuestion.errorCount }} 次</span>
        </div>
        <div class="detail-row">
          <span class="label">掌握状态：</span>
          <el-tag :type="currentQuestion.status === '已掌握' ? 'success' : currentQuestion.status === '待巩固' ? 'warning' : 'danger'">
            {{ currentQuestion.status }}
          </el-tag>
        </div>
        <div class="detail-row">
          <span class="label">你的答案：</span>
          <span class="value user-answer">{{ currentQuestion.userAnswer || '未作答' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">正确答案：</span>
          <span class="value correct-answer">{{ currentQuestion.correctAnswer }}</span>
        </div>
        <div class="detail-row" v-if="currentQuestion.analysis">
          <span class="label">解析：</span>
          <div class="value analysis">{{ currentQuestion.analysis }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToPractice">去练习</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const searchForm = reactive({ subject: '', status: '' })
const dateRange = ref([])
const tableData = ref([])
const detailVisible = ref(false)
const currentQuestion = ref(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const getSubjectTagType = (subject) => {
  const map = { '语文': 'success', '数学': 'primary', '英语': 'warning' }
  return map[subject] || ''
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { 
        id: '1', 
        questionTitle: '下列计算正确的是（ ）23+45 等于多少', 
        subject: '数学', 
        knowledge: '整数加法', 
        errorCount: 3, 
        lastErrorTime: '2026-03-28 10:30', 
        status: '未掌握',
        userAnswer: 'B. 67',
        correctAnswer: 'A. 68',
        analysis: '23+45=68，注意个位和十位分别相加'
      },
      { 
        id: '2', 
        questionTitle: '古诗填空：床前明月光，_____', 
        subject: '语文', 
        knowledge: '古诗背诵', 
        errorCount: 2, 
        lastErrorTime: '2026-03-27 15:20', 
        status: '待巩固',
        userAnswer: '疑是地上霜',
        correctAnswer: '疑是地上霜',
        analysis: '出自李白《静夜思》'
      },
      { 
        id: '3', 
        questionTitle: '英语单词翻译：apple 的中文意思是？', 
        subject: '英语', 
        knowledge: '单词记忆', 
        errorCount: 1, 
        lastErrorTime: '2026-03-26 09:15', 
        status: '已掌握',
        userAnswer: '苹果',
        correctAnswer: '苹果',
        analysis: 'apple 是基础单词，意为苹果'
      },
      { 
        id: '4', 
        questionTitle: '三角形内角和等于多少度？', 
        subject: '数学', 
        knowledge: '几何基础', 
        errorCount: 4, 
        lastErrorTime: '2026-03-29 14:00', 
        status: '未掌握',
        userAnswer: '90 度',
        correctAnswer: '180 度',
        analysis: '三角形内角和定理：三角形内角和等于 180 度'
      },
    ]
    pagination.total = tableData.value.length
    loading.value = false
  }, 300)
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.subject = ''
  searchForm.status = ''
  dateRange.value = []
  handleSearch()
}

const handleView = (row) => {
  currentQuestion.value = { ...row }
  detailVisible.value = true
}

const handlePracticeItem = (row) => {
  router.push(`/mistake/practice/${row.id}`)
}

const handlePracticeAll = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无错题可练习')
    return
  }
  router.push('/mistake/practice/all')
}

const goToPractice = () => {
  if (currentQuestion.value) {
    router.push(`/mistake/practice/${currentQuestion.value.id}`)
    detailVisible.value = false
  }
}

const handleRemove = async (row) => {
  try {
    await ElMessageBox.confirm(`确认移除该错题吗？`, '提示', { type: 'warning' })
    ElMessage.success('移除成功')
    loadData()
  } catch (e) {}
}

const handleClearMistakes = async () => {
  try {
    await ElMessageBox.confirm(`确认清空所有错题吗？此操作不可恢复！`, '警告', { type: 'warning', confirmButtonText: '确定清空' })
    tableData.value = []
    pagination.total = 0
    ElMessage.success('已清空所有错题')
  } catch (e) {}
}

const handleSizeChange = loadData
const handlePageChange = loadData

onMounted(() => loadData())
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.search-form {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.error-high {
  color: $danger-color;
  font-weight: 600;
}

.question-detail {
  .detail-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;
    
    .label {
      min-width: 80px;
      color: $text-secondary;
      font-weight: 500;
    }
    
    .value {
      flex: 1;
      color: $text-primary;
      
      &.user-answer {
        color: $warning-color;
      }
      
      &.correct-answer {
        color: $success-color;
      }
      
      &.analysis {
        background: $bg-page;
        padding: 12px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.6;
      }
    }
  }
}
</style>
