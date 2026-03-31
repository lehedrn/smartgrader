<template>
  <div class="page-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增知识点
      </el-button>
    </div>

    <el-card>
      <template #header><span>知识点管理</span></template>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="name" label="知识点名称" min-width="150" />
        <el-table-column prop="subject" label="学科" width="80" />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="parentName" label="所属单元" width="120" />
        <el-table-column prop="questionCount" label="题目数量" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
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

    <!-- 查看/编辑 知识点弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px" :close-on-click-modal="false">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        :disabled="isViewMode"
      >
        <el-form-item label="知识点名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入知识点名称" />
        </el-form-item>
        <el-form-item label="学科" prop="subject">
          <el-select v-model="formData.subject" placeholder="请选择学科" style="width: 100%">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="物理" value="物理" />
            <el-option label="化学" value="化学" />
            <el-option label="生物" value="生物" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="formData.grade" placeholder="请选择年级" style="width: 100%">
            <el-option label="一年级" value="一年级" />
            <el-option label="二年级" value="二年级" />
            <el-option label="三年级" value="三年级" />
            <el-option label="四年级" value="四年级" />
            <el-option label="五年级" value="五年级" />
            <el-option label="六年级" value="六年级" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属单元" prop="parentName">
          <el-input v-model="formData.parentName" placeholder="请输入所属单元名称" />
        </el-form-item>
        <el-form-item label="知识点描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入知识点描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="学习要求" prop="requirement">
          <el-input
            v-model="formData.requirement"
            type="textarea"
            :rows="3"
            placeholder="请输入学习要求"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="题目标签" prop="tags">
          <el-input v-model="formData.tags" placeholder="请输入标签，多个标签用逗号分隔" />
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">
            例如：整数加法，口算，基础题
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ isViewMode ? '关闭' : '取消' }}</el-button>
        <el-button v-if="!isViewMode" type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isViewMode = ref(false)
const formRef = ref(null)

const formData = reactive({
  id: '',
  name: '',
  subject: '',
  grade: '',
  parentName: '',
  description: '',
  requirement: '',
  tags: '',
  questionCount: 0,
})

const formRules = reactive({
  name: [{ required: true, message: '请输入知识点名称', trigger: 'blur' }],
  subject: [{ required: true, message: '请选择学科', trigger: 'change' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  parentName: [{ required: true, message: '请输入所属单元', trigger: 'blur' }],
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const dialogTitle = computed(() => {
  if (isViewMode.value) return '查看知识点'
  return formData.id ? '编辑知识点' : '新增知识点'
})

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: '1', name: '整数加法', subject: '数学', grade: '三年级', parentName: '第一单元', questionCount: 56, description: '学习整数的加法运算', requirement: '掌握进位加法', tags: '整数，加法，口算' },
      { id: '2', name: '古诗背诵', subject: '语文', grade: '三年级', parentName: '第二单元', questionCount: 32, description: '背诵经典古诗', requirement: '能正确默写', tags: '古诗，背诵，语文' },
      { id: '3', name: '单词记忆', subject: '英语', grade: '三年级', parentName: 'Unit 1', questionCount: 45, description: '记忆基础英语单词', requirement: '能正确拼写和翻译', tags: '单词，英语，基础' },
      { id: '4', name: '三角形面积', subject: '数学', grade: '四年级', parentName: '几何初步', questionCount: 28, description: '学习三角形面积的计算方法', requirement: '掌握面积公式', tags: '几何，面积，三角形' },
    ]
    pagination.total = tableData.value.length
    loading.value = false
  }, 300)
}

// 打开新增弹窗
const handleCreate = () => {
  resetForm()
  isViewMode.value = false
  dialogVisible.value = true
}

// 打开查看弹窗
const handleView = (row) => {
  Object.assign(formData, row)
  isViewMode.value = true
  dialogVisible.value = true
}

// 打开编辑弹窗
const handleEdit = (row) => {
  Object.assign(formData, row)
  isViewMode.value = false
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除知识点"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 模拟保存
      setTimeout(() => {
        if (formData.id) {
          // 编辑模式
          const index = tableData.value.findIndex(item => item.id === formData.id)
          if (index !== -1) {
            tableData.value[index] = { ...formData }
          }
          ElMessage.success('更新成功')
        } else {
          // 新增模式
          const newId = String(Date.now())
          tableData.value.unshift({
            ...formData,
            id: newId,
            questionCount: 0,
          })
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
      }, 300)
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.subject = ''
  formData.grade = ''
  formData.parentName = ''
  formData.description = ''
  formData.requirement = ''
  formData.tags = ''
  formData.questionCount = 0
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const handleSizeChange = loadData
const handlePageChange = loadData

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.btn-group {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
