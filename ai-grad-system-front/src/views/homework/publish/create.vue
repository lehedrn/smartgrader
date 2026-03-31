<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑作业' : '新建作业' }}</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form
        v-loading="loading"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入作业标题" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="form.subject" placeholder="请选择学科" style="width: 100%">
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
                <el-option label="物理" value="物理" />
                <el-option label="化学" value="化学" />
                <el-option label="生物" value="生物" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择作业类型" style="width: 100%">
                <el-option label="课后作业" value="课后作业" />
                <el-option label="课堂练习" value="课堂练习" />
                <el-option label="单元测试" value="单元测试" />
                <el-option label="期中复习" value="期中复习" />
                <el-option label="期末复习" value="期末复习" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发布班级" prop="classes">
              <el-select v-model="form.classes" multiple placeholder="请选择班级" style="width: 100%">
                <el-option label="一年 (1) 班" value="一年 (1) 班" />
                <el-option label="一年 (2) 班" value="一年 (2) 班" />
                <el-option label="二年 (1) 班" value="二年 (1) 班" />
                <el-option label="二年 (2) 班" value="二年 (2) 班" />
                <el-option label="三年 (1) 班" value="三年 (1) 班" />
                <el-option label="三年 (2) 班" value="三年 (2) 班" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="布置日期" prop="publishDate">
              <el-date-picker
                v-model="form.publishDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                :disabled-date="disabledDateBefore"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker
                v-model="form.deadline"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%"
                :disabled-date="disabledDateBefore"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预计时长 (分钟)" prop="duration">
              <el-input-number v-model="form.duration" :min="1" :max="180" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="作业描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入作业描述和要求"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="题目选择">
          <div class="question-selector">
            <el-button type="primary" plain @click="handleSelectFromBank">
              <el-icon><FolderOpened /></el-icon>
              从题库选题
            </el-button>
            <el-button type="primary" plain @click="handleAddQuestion">
              <el-icon><Plus /></el-icon>
              手动添加题目
            </el-button>
            <el-button type="primary" plain @click="handleUploadPaper">
              <el-icon><Upload /></el-icon>
              上传试卷
            </el-button>
          </div>

          <div class="question-list" v-if="questions.length > 0">
            <div class="question-item" v-for="(q, index) in questions" :key="index">
              <span class="question-title">{{ q.title }}</span>
              <span class="question-score">{{ q.score }}分</span>
              <el-button link type="danger" @click="removeQuestion(index)">删除</el-button>
            </div>
            <div class="question-total">
              共 {{ questions.length }} 题，总分 {{ totalScore }} 分
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 从题库选题弹窗 -->
    <el-dialog v-model="selectQuestionVisible" title="从题库选题" width="900px" :close-on-click-modal="false">
      <el-form :inline="true" class="search-form">
        <el-form-item label="学科">
          <el-select v-model="questionSearch.subject" placeholder="请选择" clearable style="width: 120px">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select v-model="questionSearch.type" placeholder="请选择" clearable style="width: 120px">
            <el-option label="选择题" value="选择题" />
            <el-option label="填空题" value="填空题" />
            <el-option label="简答题" value="简答题" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="questionSearch.difficulty" placeholder="请选择" clearable style="width: 120px">
            <el-option label="容易" value="容易" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchQuestions">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="questionList" v-loading="questionLoading" @selection-change="handleQuestionSelection">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="题目" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="题型" width="100" />
        <el-table-column prop="subject" label="学科" width="80" />
        <el-table-column prop="difficulty" label="难度" width="70">
          <template #default="{ row }">
            <el-tag :type="getDifficultyTagType(row.difficulty)" size="small">{{ row.difficulty }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="knowledge" label="知识点" width="120" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="questionPage"
          :page-size="10"
          :total="questionTotal"
          layout="total, prev, pager, next"
          @current-change="handleQuestionPageChange"
        />
      </div>

      <template #footer>
        <div class="dialog-footer-info">
          已选择 <strong>{{ selectedQuestions.length }}</strong> 道题目
        </div>
        <el-button @click="selectQuestionVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelectQuestions" :disabled="selectedQuestions.length === 0">确定</el-button>
      </template>
    </el-dialog>

    <!-- 上传试卷弹窗 -->
    <el-dialog v-model="uploadVisible" title="上传试卷" width="600px" :close-on-click-modal="false">
      <el-upload
        ref="uploadRef"
        drag
        :auto-upload="false"
        :on-change="handleUploadChange"
        :limit="1"
        accept=".doc,.docx,.pdf,.xlsx"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将试卷文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 Word (.doc/.docx)、PDF、Excel 格式，文件大小不超过 10MB
          </div>
        </template>
      </el-upload>

      <el-divider />

      <el-form label-width="100px">
        <el-form-item label="自动识别">
          <el-switch v-model="autoRecognize" />
          <span style="margin-left: 10px; color: #909399; font-size: 12px">
            开启后将自动识别试卷中的题目
          </span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpload" :loading="uploading">上传并解析</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createHomework, updateHomework, getHomeworkDetail } from '@/api/homework'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

// 编辑模式相关
const isEdit = ref(false)
const editId = ref(null)
const loading = ref(false)
const formRef = ref(null)
const submitting = ref(false)
const questions = ref([])

// 选题相关
const selectQuestionVisible = ref(false)
const questionLoading = ref(false)
const questionList = ref([])
const selectedQuestions = ref([])
const questionPage = ref(1)
const questionTotal = ref(0)

const questionSearch = reactive({
  subject: '',
  type: '',
  difficulty: '',
})

// 上传相关
const uploadVisible = ref(false)
const uploadFile = ref(null)
const uploading = ref(false)
const autoRecognize = ref(true)
const uploadRef = ref(null)

const form = reactive({
  title: '',
  subject: '',
  type: '课后作业',
  classes: [],
  publishDate: dayjs().format('YYYY-MM-DD'),
  deadline: '',
  duration: 30,
  description: '',
})

const rules = reactive({
  title: [{ required: true, message: '请输入作业标题', trigger: 'blur' }],
  subject: [{ required: true, message: '请选择学科', trigger: 'change' }],
  type: [{ required: true, message: '请选择作业类型', trigger: 'change' }],
  classes: [{ required: true, message: '请选择班级', trigger: 'change', type: 'array' }],
  publishDate: [{ required: true, message: '请选择布置日期', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
})

const totalScore = computed(() => {
  return questions.value.reduce((sum, q) => sum + q.score, 0)
})

const disabledDateBefore = (date) => {
  return date.getTime() < Date.now() - 86400000
}

const getDifficultyTagType = (difficulty) => {
  const map = { '容易': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || ''
}

// 加载题库列表
const loadQuestionList = () => {
  questionLoading.value = true
  setTimeout(() => {
    questionList.value = [
      { id: '1', title: '下列计算正确的是（ ）23+45 等于多少', type: '选择题', subject: '数学', difficulty: '中等', knowledge: '整数加法' },
      { id: '2', title: '古诗填空：床前明月光，_____', type: '填空题', subject: '语文', difficulty: '容易', knowledge: '古诗背诵' },
      { id: '3', title: '英语单词翻译：apple 的中文意思是？', type: '选择题', subject: '英语', difficulty: '容易', knowledge: '单词记忆' },
      { id: '4', title: '计算三角形面积', type: '简答题', subject: '数学', difficulty: '中等', knowledge: '几何' },
      { id: '5', title: '写出下列单词的复数形式', type: '填空题', subject: '英语', difficulty: '中等', knowledge: '语法' },
    ]
    questionTotal.value = 156
    questionLoading.value = false
  }, 300)
}

const handleSelectFromBank = () => {
  selectQuestionVisible.value = true
  loadQuestionList()
}

const handleAddQuestion = () => {
  questions.value.push({ title: '新题目', score: 5 })
  ElMessage.success('已添加题目')
}

const handleUploadPaper = () => {
  uploadVisible.value = true
}

const removeQuestion = (index) => {
  questions.value.splice(index, 1)
  ElMessage.success('已删除题目')
}

const searchQuestions = () => {
  questionPage.value = 1
  loadQuestionList()
}

const handleQuestionSelection = (selection) => {
  selectedQuestions.value = selection
}

const handleQuestionPageChange = () => {
  loadQuestionList()
}

const confirmSelectQuestions = () => {
  selectedQuestions.value.forEach(q => {
    questions.value.push({
      id: q.id,
      title: q.title,
      score: 5,
    })
  })
  selectQuestionVisible.value = false
  ElMessage.success(`已添加 ${selectedQuestions.value.length} 道题目`)
  selectedQuestions.value = []
}

const handleUploadChange = (file) => {
  uploadFile.value = file
}

const handleConfirmUpload = () => {
  if (!uploadFile.value) {
    ElMessage.warning('请选择要上传的试卷文件')
    return
  }
  uploading.value = true
  setTimeout(() => {
    uploading.value = false
    uploadVisible.value = false
    // 模拟解析后添加题目
    questions.value.push(
      { title: '解析题目 1：从上传试卷中识别', score: 5 },
      { title: '解析题目 2：从上传试卷中识别', score: 5 },
      { title: '解析题目 3：从上传试卷中识别', score: 5 },
    )
    ElMessage.success('试卷上传成功，已识别 3 道题目')
    uploadFile.value = null
  }, 1500)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (questions.value.length === 0) {
        ElMessage.warning('请至少添加一道题目')
        return
      }

      submitting.value = true
      try {
        if (isEdit.value) {
          await updateHomework(editId.value, { ...form, questions: questions.value })
          ElMessage.success('更新成功')
        } else {
          await createHomework({ ...form, questions: questions.value })
          ElMessage.success('创建成功')
        }
        router.push('/homework/publish')
      } catch (error) {
        console.error('Create failed:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

// 加载作业详情（编辑模式）
const loadHomeworkDetail = async (id) => {
  loading.value = true
  try {
    const { data } = await getHomeworkDetail(id)
    // 填充表单数据
    form.title = data.title
    form.subject = data.subject
    form.type = data.type
    form.classes = data.classes || []
    form.publishDate = data.publishDate
    form.deadline = data.deadline
    form.duration = data.duration || 30
    form.description = data.description || ''
    // 填充题目数据
    if (data.questions && Array.isArray(data.questions)) {
      questions.value = data.questions.map(q => ({
        id: q.id,
        title: q.title,
        score: q.score || 5,
      }))
    }
    ElMessage.success('作业数据加载成功')
  } catch (error) {
    console.error('Failed to get homework detail:', error)
    ElMessage.error('加载作业数据失败')
  } finally {
    loading.value = false
  }
}

// 检查是否为编辑模式
onMounted(() => {
  const id = route.query.id
  if (id) {
    isEdit.value = true
    editId.value = id
    loadHomeworkDetail(id)
  }
})

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form {
  max-width: 800px;
}

.question-selector {
  margin-bottom: 16px;

  .el-button {
    margin-right: 8px;
  }
}

.question-list {
  border: 1px solid $border-light;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;

  .question-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid $border-light;

    &:last-child {
      border-bottom: none;
    }

    .question-title {
      flex: 1;
    }

    .question-score {
      color: $text-secondary;
      margin: 0 16px;
    }
  }

  .question-total {
    text-align: right;
    font-weight: 600;
    margin-top: 16px;
    color: $primary-color;
  }
}

.search-form {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.dialog-footer-info {
  float: left;
  line-height: 32px;
  color: #606266;
}
</style>
