<template>
  <div class="page-container">
    <div class="btn-group">
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建题目
      </el-button>
      <el-button @click="handleBatchImport">
        <el-icon><Upload /></el-icon>
        批量导入
      </el-button>
      <el-button @click="handleBatchExport" :disabled="selectedIds.length === 0">
        <el-icon><Download /></el-icon>
        批量导出
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
        <el-form-item label="题型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 120px">
            <el-option label="选择题" value="选择题" />
            <el-option label="填空题" value="填空题" />
            <el-option label="判断题" value="判断题" />
            <el-option label="简答题" value="简答题" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="searchForm.difficulty" placeholder="请选择" clearable style="width: 120px">
            <el-option label="容易" value="容易" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识点">
          <el-input v-model="searchForm.knowledge" placeholder="请输入知识点" clearable style="width: 150px" />
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
      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="题目" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="题型" width="100" />
        <el-table-column prop="subject" label="学科" width="80" />
        <el-table-column prop="difficulty" label="难度" width="80">
          <template #default="{ row }">
            <el-tag :type="getDifficultyTagType(row.difficulty)">{{ row.difficulty }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="knowledge" label="知识点" width="120" />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
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

    <!-- 批量导入弹窗 -->
    <el-dialog v-model="importVisible" title="批量导入题目" width="700px" :close-on-click-modal="false">
      <el-steps :active="importStep" align-center class="import-steps">
        <el-step title="选择文件" />
        <el-step title="解析预览" />
        <el-step title="导入完成" />
      </el-steps>

      <div class="import-content" style="margin-top: 20px">
        <!-- 步骤 1：选择文件 -->
        <div v-if="importStep === 0" class="import-step">
          <el-upload
            ref="uploadRef"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :limit="1"
            accept=".xlsx,.xls,.csv"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 Excel (.xlsx/.xls) 和 CSV 格式文件，单次最多导入 100 道题目
                <br />
                <el-link type="primary" @click="downloadTemplate" :underline="false">
                  <el-icon><Download /></el-icon> 下载导入模板
                </el-link>
              </div>
            </template>
          </el-upload>

          <el-divider>或直接粘贴题目内容</el-divider>
          
          <el-input
            v-model="importText"
            type="textarea"
            :rows="8"
            placeholder="请按格式粘贴题目内容，每行一道题目..."
          />
        </div>

        <!-- 步骤 2：解析预览 -->
        <div v-else-if="importStep === 1" class="import-step">
          <el-alert
            title="解析结果预览"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 16px"
          >
            共解析出 <strong>{{ importPreview.length }}</strong> 道题目，请确认无误后点击导入
          </el-alert>
          <el-table :data="importPreview" max-height="300" v-loading="importLoading">
            <el-table-column prop="title" label="题目" min-width="200" show-overflow-tooltip />
            <el-table-column prop="type" label="题型" width="80" />
            <el-table-column prop="subject" label="学科" width="80" />
            <el-table-column prop="difficulty" label="难度" width="70" />
            <el-table-column prop="knowledge" label="知识点" width="100" />
          </el-table>
        </div>

        <!-- 步骤 3：导入完成 -->
        <div v-else-if="importStep === 2" class="import-step import-success">
          <el-result icon="success" title="导入成功" :sub-title="`成功导入 ${importSuccessCount} 道题目`">
            <template #extra>
              <el-button type="primary" @click="closeImport">查看题目列表</el-button>
            </template>
          </el-result>
        </div>
      </div>

      <template #footer v-if="importStep < 2">
        <el-button @click="importVisible = false">取消</el-button>
        <el-button v-if="importStep === 0" type="primary" @click="handleParse">下一步：解析预览</el-button>
        <el-button v-else type="primary" @click="handleConfirmImport" :loading="importLoading">确认导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const selectedIds = ref([])

// 导入相关
const importVisible = ref(false)
const importStep = ref(0)
const importFile = ref(null)
const importText = ref('')
const importPreview = ref([])
const importLoading = ref(false)
const importSuccessCount = ref(0)
const uploadRef = ref(null)

const searchForm = reactive({
  subject: '',
  type: '',
  difficulty: '',
  knowledge: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const getDifficultyTagType = (difficulty) => {
  const map = { '容易': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || ''
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: '1', title: '下列计算正确的是（ ）23+45 等于多少', type: '选择题', subject: '数学', difficulty: '中等', knowledge: '整数加法', grade: '三年级', creator: '王老师' },
      { id: '2', title: '古诗填空：床前明月光，_____', type: '填空题', subject: '语文', difficulty: '容易', knowledge: '古诗背诵', grade: '三年级', creator: '李老师' },
      { id: '3', title: '英语单词翻译：apple 的中文意思是？', type: '选择题', subject: '英语', difficulty: '容易', knowledge: '单词记忆', grade: '三年级', creator: '陈老师' },
      { id: '4', title: '计算三角形面积，底为 6cm，高为 8cm', type: '简答题', subject: '数学', difficulty: '中等', knowledge: '三角形面积', grade: '四年级', creator: '王老师' },
      { id: '5', title: '写出下列单词的复数形式：child', type: '填空题', subject: '英语', difficulty: '中等', knowledge: '名词复数', grade: '五年级', creator: '陈老师' },
    ]
    pagination.total = 156
    loading.value = false
  }, 500)
}

const handleCreate = () => {
  router.push('/resource/question/edit')
}

const handleEdit = (row) => {
  router.push(`/resource/question/edit/${row.id}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除题目"${row.title}"吗？`, '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

const handleBatchImport = () => {
  importStep.value = 0
  importFile.value = null
  importText.value = ''
  importPreview.value = []
  importVisible.value = true
}

const handleFileChange = (file) => {
  importFile.value = file
}

const handleFileRemove = () => {
  importFile.value = null
}

const downloadTemplate = () => {
  ElMessage.success('模板文件开始下载')
}

const handleParse = () => {
  if (!importFile.value && !importText.value.trim()) {
    ElMessage.warning('请选择文件或粘贴题目内容')
    return
  }
  
  importLoading.value = true
  // 模拟解析
  setTimeout(() => {
    importLoading.value = false
    importPreview.value = [
      { id: 'temp1', title: '解析后的题目 1：下列计算正确的是...', type: '选择题', subject: '数学', difficulty: '中等', knowledge: '整数加法' },
      { id: 'temp2', title: '解析后的题目 2：古诗填空...', type: '填空题', subject: '语文', difficulty: '容易', knowledge: '古诗背诵' },
      { id: 'temp3', title: '解析后的题目 3：英语单词翻译...', type: '选择题', subject: '英语', difficulty: '容易', knowledge: '单词记忆' },
    ]
    importStep.value = 1
  }, 1000)
}

const handleConfirmImport = () => {
  importLoading.value = true
  setTimeout(() => {
    importLoading.value = false
    importSuccessCount.value = importPreview.value.length
    importStep.value = 2
  }, 1500)
}

const closeImport = () => {
  importVisible.value = false
  loadData()
}

const handleBatchExport = () => {
  ElMessage.success(`已导出 ${selectedIds.value.length} 道题目`)
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.subject = ''
  searchForm.type = ''
  searchForm.difficulty = ''
  searchForm.knowledge = ''
  handleSearch()
}

const handleSizeChange = loadData
const handlePageChange = loadData

onMounted(() => {
  loadData()
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

.import-steps {
  margin-bottom: 20px;
}

.import-step {
  min-height: 300px;
  
  .el-upload {
    width: 100%;
  }
}

.import-success {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
