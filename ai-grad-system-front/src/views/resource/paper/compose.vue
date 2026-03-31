<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>组卷</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div class="compose-container">
        <div class="question-bank">
          <h4>题库选题</h4>
          <el-input v-model="searchQuery" placeholder="搜索题目" style="margin-bottom: 12px" />
          <el-table :data="questionBank" size="small" max-height="400">
            <el-table-column type="selection" width="40" />
            <el-table-column prop="title" label="题目" show-overflow-tooltip />
            <el-table-column prop="type" label="题型" width="80" />
            <el-table-column prop="score" label="分值" width="60" />
          </el-table>
        </div>

        <div class="selected-questions">
          <h4>已选题目 ({{ selectedCount }})</h4>
          <div class="question-item" v-for="i in 3" :key="i">
            <span>题目 {{ i }}</span>
            <el-button link type="danger" size="small">删除</el-button>
          </div>
          <div class="total-score">总分：{{ selectedCount * 5 }}</div>
        </div>
      </div>

      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit">保存试卷</el-button>
        <el-button @click="goBack">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchQuery = ref('')

const questionBank = ref([
  { id: '1', title: '下列计算正确的是（ ）', type: '选择题', score: 3 },
  { id: '2', title: '古诗填空', type: '填空题', score: 2 },
  { id: '3', title: '英语翻译', type: '选择题', score: 3 },
])

const selectedCount = ref(3)

const handleSubmit = () => {
  ElMessage.success('试卷保存成功')
  router.push('/resource/paper')
}

const goBack = () => router.back()
</script>

<style lang="scss" scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.compose-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.question-bank, .selected-questions { border: 1px solid #e4e7ed; border-radius: 8px; padding: 16px; }
.question-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
.total-score { text-align: right; font-weight: 600; color: #409EFF; margin-top: 16px; }
.form-actions { margin-top: 20px; text-align: center; }
</style>
