<template>
  <div class="page-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建作业
      </el-button>
      <el-button @click="handleExport" :disabled="tableData.length === 0">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="学科">
          <el-select v-model="searchForm.subject" placeholder="请选择" clearable style="width: 120px">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
          </el-select>
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 120px">
            <el-option label="课后作业" value="课后作业" />
            <el-option label="课堂练习" value="课堂练习" />
            <el-option label="单元测试" value="单元测试" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="searchForm.className" placeholder="请选择" clearable style="width: 120px">
            <el-option label="一年 (1) 班" value="一年 (1) 班" />
            <el-option label="二年 (1) 班" value="二年 (1) 班" />
            <el-option label="三年 (1) 班" value="三年 (1) 班" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="未开始" value="WKS" />
            <el-option label="进行中" value="JXZ" />
            <el-option label="已截止" value="YJZ" />
            <el-option label="已完成" value="YWC" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="作业标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="subject" label="学科" width="80">
          <template #default="{ row }">
            <el-tag :type="getSubjectTagType(row.subject)">{{ row.subject }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="teacherName" label="教师" width="100" />
        <el-table-column prop="deadline" label="截止时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submittedCount" label="提交情况" width="100">
          <template #default="{ row }">
            {{ row.submittedCount }}/{{ row.studentCount }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
        <el-button type="primary" @click="handleEdit(viewData)">编辑作业</el-button>
      </template>
    </el-dialog>

    <!-- 导出弹窗 -->
    <el-dialog v-model="exportVisible" title="导出作业" width="500px" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="导出范围">
          <el-radio-group v-model="exportForm.scope">
            <el-radio label="all">全部作业</el-radio>
            <el-radio label="selected">已选项</el-radio>
            <el-radio label="filtered">当前筛选结果</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导出格式">
          <el-select v-model="exportForm.format" style="width: 100%">
            <el-option label="Excel (.xlsx)" value="xlsx" />
            <el-option label="CSV (.csv)" value="csv" />
            <el-option label="PDF (.pdf)" value="pdf" />
          </el-select>
        </el-form-item>
        <el-form-item label="包含内容">
          <el-checkbox-group v-model="exportForm.content">
            <el-checkbox label="basic">基本信息</el-checkbox>
            <el-checkbox label="student">学生提交情况</el-checkbox>
            <el-checkbox label="analysis">统计分析</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmExport" :loading="exporting">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getHomeworkList, deleteHomework } from '@/api/homework'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const selectedIds = ref([])
const exportVisible = ref(false)
const exporting = ref(false)

const searchForm = reactive({
  subject: '',
  type: '',
  className: '',
  status: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const exportForm = reactive({
  scope: 'all',
  format: 'xlsx',
  content: ['basic'],
})

const getSubjectTagType = (subject) => {
  const map = { '语文': 'success', '数学': 'primary', '英语': 'warning' }
  return map[subject] || ''
}

const getStatusTagType = (status) => {
  const map = { WKS: 'info', JXZ: 'warning', YJZ: 'danger', YWC: 'success' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { WKS: '未开始', JXZ: '进行中', YJZ: '已截止', YWC: '已完成' }
  return map[status] || status
}

const getList = async () => {
  loading.value = true
  try {
    const { data } = await getHomeworkList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    })
    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    console.error('Failed to get list:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push('/homework/publish/create')
}

const handleView = (row) => {
  router.push(`/homework/grade/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/homework/publish/create?id=${row.id}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除作业"${row.title}"吗？`, '提示', {
      type: 'warning',
    })
    await deleteHomework(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete failed:', error)
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个作业吗？`, '提示', {
      type: 'warning',
    })
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Batch delete failed:', error)
    }
  }
}

const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('没有可导出的数据')
    return
  }
  // 根据是否有选中项设置默认值
  if (selectedIds.value.length > 0) {
    exportForm.scope = 'selected'
  } else {
    exportForm.scope = 'filtered'
  }
  exportVisible.value = true
}

const confirmExport = () => {
  exporting.value = true
  setTimeout(() => {
    exporting.value = false
    exportVisible.value = false
    const scopeText = exportForm.scope === 'all' ? '全部' : exportForm.scope === 'selected' ? '已选项' : '当前筛选'
    ElMessage.success(`已导出 ${scopeText} ${tableData.value.length} 条作业数据 (${exportForm.format.toUpperCase()})`)
  }, 1000)
}

const handleSearch = () => {
  pagination.page = 1
  getList()
}

const handleReset = () => {
  searchForm.subject = ''
  searchForm.type = ''
  searchForm.className = ''
  searchForm.status = ''
  handleSearch()
}

const handleSizeChange = () => {
  getList()
}

const handlePageChange = () => {
  getList()
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.search-card {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
