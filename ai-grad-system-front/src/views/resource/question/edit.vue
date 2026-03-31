<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑题目' : '新建题目' }}</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="学科" prop="subject">
          <el-select v-model="form.subject" placeholder="请选择学科" style="width: 200px">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
          </el-select>
        </el-form-item>

        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型" style="width: 200px">
            <el-option label="选择题" value="选择题" />
            <el-option label="填空题" value="填空题" />
            <el-option label="判断题" value="判断题" />
            <el-option label="简答题" value="简答题" />
            <el-option label="计算题" value="计算题" />
            <el-option label="应用题" value="应用题" />
          </el-select>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" placeholder="请选择难度" style="width: 200px">
            <el-option label="容易" value="容易" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级" style="width: 200px">
            <el-option label="三年级" value="三年级" />
            <el-option label="四年级" value="四年级" />
            <el-option label="五年级" value="五年级" />
            <el-option label="六年级" value="六年级" />
          </el-select>
        </el-form-item>

        <el-form-item label="知识点" prop="knowledge">
          <el-input v-model="form.knowledge" placeholder="请输入知识点" style="width: 400px" />
        </el-form-item>

        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入题目内容"
          />
        </el-form-item>

        <el-form-item label="选项" v-if="form.type === '选择题'">
          <div class="options-editor">
            <div class="option-item" v-for="(opt, index) in form.options" :key="index">
              <el-input v-model="opt.key" placeholder="选项 key" style="width: 60px" maxlength="1" />
              <span>:</span>
              <el-input v-model="opt.value" placeholder="选项内容" style="flex: 1" />
              <el-button link type="danger" @click="removeOption(index)" v-if="form.options.length > 2">删除</el-button>
            </div>
            <el-button type="primary" plain size="small" @click="addOption">添加选项</el-button>
          </div>
        </el-form-item>

        <el-form-item label="参考答案" prop="answer">
          <el-input v-model="form.answer" placeholder="请输入参考答案" />
        </el-form-item>

        <el-form-item label="解析" prop="analysis">
          <el-input
            v-model="form.analysis"
            type="textarea"
            :rows="4"
            placeholder="请输入题目解析"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  subject: '',
  type: '',
  difficulty: '',
  grade: '',
  knowledge: '',
  content: '',
  options: [{ key: 'A', value: '' }, { key: 'B', value: '' }, { key: 'C', value: '' }, { key: 'D', value: '' }],
  answer: '',
  analysis: '',
})

const rules = reactive({
  subject: [{ required: true, message: '请选择学科', trigger: 'change' }],
  type: [{ required: true, message: '请选择题型', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入参考答案', trigger: 'blur' }],
})

const addOption = () => {
  const nextKey = String.fromCharCode(65 + form.options.length)
  form.options.push({ key: nextKey, value: '' })
}

const removeOption = (index) => {
  form.options.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        ElMessage.success('保存成功')
        router.push('/resource/question')
        submitting.value = false
      }, 500)
    }
  })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  if (isEdit.value) {
    // 模拟加载题目详情
    form.subject = '数学'
    form.type = '选择题'
    form.difficulty = '中等'
    form.grade = '三年级'
    form.knowledge = '整数加法'
    form.content = '下列计算正确的是（ ）'
    form.answer = 'A'
    form.analysis = '23 + 45 = 68'
  }
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options-editor {
  width: 100%;

  .option-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
}
</style>
