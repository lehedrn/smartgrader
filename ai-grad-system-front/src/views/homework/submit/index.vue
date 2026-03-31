<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>作业提交</span>
      </template>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="homeworkTitle" label="作业标题" min-width="180" />
        <el-table-column prop="subject" label="学科" width="80" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="deadline" label="截止时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" v-if="row.status === 'WTJ'" @click="handleUpload(row)">上传答案</el-button>
            <el-button link type="primary" v-else @click="handleViewDetail(row)">查看结果</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 上传答案弹窗 -->
    <el-dialog v-model="uploadVisible" title="上传答案" width="600px" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="作业标题">
          <span>{{ currentHomework.homeworkTitle }}</span>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            ref="uploadRef"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将图片拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="可选：添加说明或备注"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload" :loading="uploading">提交</el-button>
      </template>
    </el-dialog>

    <!-- 查看结果弹窗 -->
    <el-dialog v-model="viewVisible" title="作业详情" width="800px" :close-on-click-modal="false">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="作业标题">{{ currentHomework.homeworkTitle }}</el-descriptions-item>
        <el-descriptions-item label="学科">{{ currentHomework.subject }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ currentHomework.className }}</el-descriptions-item>
        <el-descriptions-item label="截止时间">{{ currentHomework.deadline }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(currentHomework.status)">{{ getStatusText(currentHomework.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间" v-if="currentHomework.submitTime">
          {{ currentHomework.submitTime }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider>作业描述</el-divider>
      <p style="color: #606266; line-height: 1.6;">
        {{ currentHomework.description || '暂无描述' }}
      </p>

      <el-divider>题目列表</el-divider>
      <div v-if="currentHomework.questions && currentHomework.questions.length > 0" class="question-list">
        <div v-for="(q, index) in currentHomework.questions" :key="q.id" class="question-item">
          <div class="question-header">
            <span class="question-title">{{ q.title }}</span>
            <span class="question-score">{{ q.score }}分</span>
          </div>
          <div class="question-answer" v-if="currentHomework.userAnswer">
            <el-alert
              :title="`我的答案`"
              type="info"
              :closable="false"
              show-icon
            />
            <p>{{ currentHomework.userAnswer[index] || '未作答' }}</p>
          </div>
          <div class="question-answer" v-if="currentHomework.correctAnswer && currentHomework.status !== 'WTJ'">
            <el-alert
              :title="`参考答案`"
              type="success"
              :closable="false"
              show-icon
            />
            <p>{{ currentHomework.correctAnswer[index] || '暂无' }}</p>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无题目" />

      <el-divider v-if="currentHomework.teacherComment" />
      <div v-if="currentHomework.teacherComment" class="teacher-comment">
        <el-alert
          title="教师评语"
          type="warning"
          :closable="false"
          show-icon
        />
        <p style="margin-top: 12px; color: #606266;">
          {{ currentHomework.teacherComment }}
        </p>
        <p v-if="currentHomework.score" style="margin-top: 8px; font-weight: 600; color: #409EFF;">
          得分：{{ currentHomework.score }} 分
        </p>
      </div>

      <template #footer>
        <el-button @click="viewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getHomeworkList, getHomeworkDetail, submitHomework } from '@/api/homework'

const loading = ref(false)
const tableData = ref([])
const uploadVisible = ref(false)
const viewVisible = ref(false)
const uploading = ref(false)
const currentHomework = ref({})
const uploadFile = ref(null)
const uploadRef = ref(null)

const uploadForm = reactive({
  description: '',
})

const getStatusTagType = (status) => {
  const map = { WTJ: 'info', YTI: 'warning', YPY: 'primary', YQR: 'success', YFB: 'success' }
  return map[status] || ''
}

const getStatusText = (status) => {
  const map = { WTJ: '未提交', YTI: '已提交', YPY: '待批阅', YQR: '已确认', YFB: '已发布' }
  return map[status] || status
}

const getList = async () => {
  loading.value = true
  try {
    const { data } = await getHomeworkList({ page: 1, pageSize: 10 })
    tableData.value = data.list.map(item => ({
      ...item,
      status: ['WTJ', 'YTI', 'YPY'][Math.floor(Math.random() * 3)],
      description: item.description || '请完成本单元的练习题',
      questions: item.questions || [],
    }))
  } catch (error) {
    console.error('Failed to get list:', error)
  } finally {
    loading.value = false
  }
}

const handleUpload = (row) => {
  currentHomework.value = { ...row }
  uploadForm.description = ''
  uploadFile.value = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  uploadVisible.value = true
}

const handleFileChange = (file) => {
  uploadFile.value = file
}

const confirmUpload = async () => {
  if (!uploadFile.value) {
    ElMessage.warning('请选择要上传的答案图片')
    return
  }
  uploading.value = true
  try {
    // 模拟上传
    await new Promise(resolve => setTimeout(resolve, 1000))
    await submitHomework({
      homeworkId: currentHomework.value.id,
      description: uploadForm.description,
      file: uploadFile.value,
    })
    ElMessage.success('答案提交成功')
    uploadVisible.value = false
    // 更新列表状态
    const item = tableData.value.find(i => i.id === currentHomework.value.id)
    if (item) {
      item.status = 'YTI'
      item.submitTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  } catch (error) {
    console.error('Submit failed:', error)
  } finally {
    uploading.value = false
  }
}

const handleViewDetail = async (row) => {
  currentHomework.value = { ...row }
  viewVisible.value = true
  // 加载作业详情
  try {
    const { data } = await getHomeworkDetail(row.id)
    currentHomework.value = {
      ...currentHomework.value,
      ...data,
      description: data.description || '暂无描述',
      questions: data.questions || [],
      userAnswer: data.userAnswer || [],
      correctAnswer: data.correctAnswer || [],
      teacherComment: data.teacherComment || '',
      score: data.score || 0,
    }
  } catch (error) {
    console.error('Failed to get detail:', error)
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
      margin-bottom: 12px;

      .question-title {
        font-weight: 500;
        color: #303133;
      }

      .question-score {
        color: #409EFF;
        font-weight: 600;
      }
    }

    .question-answer {
      margin-top: 8px;
      padding: 8px;
      background-color: #f5f7fa;
      border-radius: 4px;

      p {
        margin: 8px 0 0;
        color: #606266;
        font-size: 14px;
      }
    }
  }
}

.teacher-comment {
  padding: 16px;
  background-color: #fdf6ec;
  border-radius: 4px;
  margin-top: 12px;
}
</style>
