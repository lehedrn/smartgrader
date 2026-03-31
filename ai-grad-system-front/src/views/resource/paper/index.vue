<template>
  <div class="page-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate"><el-icon><Plus /></el-icon>新建试卷</el-button>
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
        <el-form-item label="年级">
          <el-select v-model="searchForm.grade" placeholder="请选择" clearable style="width: 120px">
            <el-option label="三年级" value="三年级" />
            <el-option label="四年级" value="四年级" />
            <el-option label="五年级" value="五年级" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 120px">
            <el-option label="期中试卷" value="期中试卷" />
            <el-option label="期末试卷" value="期末试卷" />
            <el-option label="单元测试" value="单元测试" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="title" label="试卷标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="subject" label="学科" width="80" />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="questionCount" label="题目数" width="80" />
        <el-table-column prop="totalScore" label="总分" width="80" />
        <el-table-column prop="duration" label="时长 (分钟)" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : ''">{{ row.status === 'published' ? '已发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleCompose(row)">组卷</el-button>
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
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

    <!-- 新建/编辑试卷弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="试卷标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入试卷标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试卷类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
                <el-option label="期中试卷" value="期中试卷" />
                <el-option label="期末试卷" value="期末试卷" />
                <el-option label="单元测试" value="单元测试" />
                <el-option label="月考" value="月考" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="form.subject" placeholder="请选择" style="width: 100%">
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-select v-model="form.grade" placeholder="请选择" style="width: 100%">
                <el-option label="三年级" value="三年级" />
                <el-option label="四年级" value="四年级" />
                <el-option label="五年级" value="五年级" />
                <el-option label="六年级" value="六年级" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试时长" prop="duration">
              <el-input-number v-model="form.duration" :min="10" :max="180" style="width: 100%" />
              <span style="margin-left: 10px; color: #909399">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总分" prop="totalScore">
              <el-input-number v-model="form.totalScore" :min="10" :max="150" style="width: 100%" />
              <span style="margin-left: 10px; color: #909399">分</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="试卷描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入试卷描述（可选）" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="draft">保存为草稿</el-radio>
            <el-radio label="published">保存并发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const searchForm = reactive({
  subject: '',
  grade: '',
  type: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const form = reactive({
  id: '',
  title: '',
  type: '',
  subject: '',
  grade: '',
  duration: 90,
  totalScore: 100,
  description: '',
  status: 'draft',
})

const rules = reactive({
  title: [{ required: true, message: '请输入试卷标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择试卷类型', trigger: 'change' }],
  subject: [{ required: true, message: '请选择学科', trigger: 'change' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
})

const dialogTitle = computed(() => isEdit.value ? '编辑试卷' : '新建试卷')

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: '1', title: '三年级数学期中试卷', type: '期中试卷', subject: '数学', grade: '三年级', questionCount: 32, totalScore: 100, duration: 90, status: 'published' },
      { id: '2', title: '五年级语文期末试卷', type: '期末试卷', subject: '语文', grade: '五年级', questionCount: 38, totalScore: 100, duration: 120, status: 'draft' },
      { id: '3', title: '四年级英语单元测试', type: '单元测试', subject: '英语', grade: '四年级', questionCount: 25, totalScore: 100, duration: 60, status: 'published' },
    ]
    pagination.total = tableData.value.length
    loading.value = false
  }, 300)
}

const resetForm = () => {
  form.id = ''
  form.title = ''
  form.type = ''
  form.subject = ''
  form.grade = ''
  form.duration = 90
  form.totalScore = 100
  form.description = ''
  form.status = 'draft'
}

const handleCreate = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
}

const handleCompose = (row) => {
  router.push(`/resource/paper/compose/${row.id}`)
}

const handleView = (row) => {
  router.push(`/resource/paper/compose/${row.id}?view=1`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除"${row.title}"吗？`, '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {}
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        dialogVisible.value = false
        ElMessage.success(isEdit.value ? '修改成功' : '创建成功')
        loadData()
      }, 500)
    }
  })
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.subject = ''
  searchForm.grade = ''
  searchForm.type = ''
  handleSearch()
}

const handleSizeChange = loadData
const handlePageChange = loadData

onMounted(() => loadData())
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
