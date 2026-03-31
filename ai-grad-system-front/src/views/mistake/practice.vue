<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>相似题练习</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div class="practice-content">
        <!-- 原错题展示 -->
        <div class="original-question">
          <div class="section-header">
            <h4><el-icon><CircleCloseFilled /></el-icon> 原错题</h4>
            <el-tag :type="originalQuestion.status === '已掌握' ? 'success' : 'danger'">
              {{ originalQuestion.status }}
            </el-tag>
          </div>
          <div class="question-body">
            <p class="question-text">{{ originalQuestion.title }}</p>
            <div class="question-meta">
              <el-tag size="small">{{ originalQuestion.subject }}</el-tag>
              <el-tag size="small" type="info">{{ originalQuestion.knowledge }}</el-tag>
            </div>
          </div>
          <div class="answer-compare">
            <div class="answer-item user">
              <span class="label">你的答案：</span>
              <span class="value">{{ originalQuestion.userAnswer }}</span>
            </div>
            <div class="answer-item correct">
              <span class="label">正确答案：</span>
              <span class="value">{{ originalQuestion.correctAnswer }}</span>
            </div>
            <div class="analysis" v-if="originalQuestion.analysis">
              <span class="label"><el-icon><Document /></el-icon> 解析：</span>
              <p>{{ originalQuestion.analysis }}</p>
            </div>
          </div>
        </div>

        <!-- 相似题练习 -->
        <div class="similar-questions">
          <div class="section-header">
            <h4><el-icon><RefreshRight /></el-icon> 相似题练习</h4>
            <el-tag type="info">共 {{ similarQuestions.length }} 道题</el-tag>
          </div>

          <div class="question-card" v-for="(q, index) in similarQuestions" :key="q.id">
            <div class="question-header">
              <span class="question-tag">
                <el-icon><Collection /></el-icon>
                练习题 {{ index + 1 }}
              </span>
              <el-tag size="small" type="warning">
                <el-icon><Link /></el-icon>
                相似度 {{ q.similarity }}%
              </el-tag>
            </div>
            <div class="question-body">
              <p class="question-text">{{ q.title }}</p>
              <div class="question-options">
                <el-radio-group v-model="answers[q.id]" class="options-list">
                  <div class="option-item" v-for="opt in q.options" :key="opt.label">
                    <el-radio :label="opt.label">{{ opt.label }}. {{ opt.text }}</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </div>
            <div class="question-actions">
              <el-button type="primary" size="small" @click="submitAnswer(q.id)" :loading="submittingIds.has(q.id)">
                提交
              </el-button>
              <el-button size="small" @click="showAnswer(q.id)">
                查看答案
              </el-button>
            </div>
            <!-- 答案反馈 -->
            <div v-if="feedback[q.id]" class="question-feedback" :class="feedback[q.id].isCorrect ? 'correct' : 'incorrect'">
              <el-icon v-if="feedback[q.id].isCorrect"><CircleCheck /></el-icon>
              <el-icon v-else><CircleClose /></el-icon>
              <span>{{ feedback[q.id].message }}</span>
              <span class="feedback-answer" v-if="!feedback[q.id].isCorrect">
                正确答案：{{ feedback[q.id].correctAnswer }}
              </span>
            </div>
          </div>
        </div>

        <div class="actions">
          <el-button type="primary" size="large" @click="handleSubmitAll" :loading="submittingAll">
            提交全部答案
          </el-button>
          <el-button size="large" @click="goBack">退出练习</el-button>
        </div>
      </div>

      <!-- 练习结果弹窗 -->
      <el-dialog v-model="resultVisible" title="练习结果" width="500px" :close-on-click-modal="false">
        <el-result icon="success" :title="resultTitle" :sub-title="resultSubtitle">
          <template #extra>
            <div class="result-stats">
              <div class="stat-item">
                <span class="stat-label">总题数</span>
                <span class="stat-value">{{ similarQuestions.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">正确数</span>
                <span class="stat-value correct">{{ correctCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">正确率</span>
                <span class="stat-value" :class="{ correct: correctRate >= 60 }">{{ correctRate }}%</span>
              </div>
            </div>
            <div class="result-actions">
              <el-button type="primary" @click="continuePractice">继续练习</el-button>
              <el-button @click="goBack">返回错题本</el-button>
            </div>
          </template>
        </el-result>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const answers = ref({})
const feedback = ref({})
const submittingIds = ref(new Set())
const submittingAll = ref(false)
const resultVisible = ref(false)
const submittedCount = ref(0)

const originalQuestion = ref({
  id: '1',
  title: '下列计算正确的是（ ）23+45 等于多少',
  subject: '数学',
  knowledge: '整数加法',
  status: '未掌握',
  userAnswer: 'B. 67',
  correctAnswer: 'A. 68',
  analysis: '23+45=68，注意个位和十位分别相加。个位：3+5=8，十位：2+4=6，所以答案是 68。',
})

const similarQuestions = ref([
  {
    id: 's1',
    title: '下列计算正确的是（ ）34+56 等于多少',
    similarity: 95,
    options: [
      { label: 'A', text: '90' },
      { label: 'B', text: '89' },
      { label: 'C', text: '91' },
      { label: 'D', text: '88' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 's2',
    title: '计算：47+38 等于（ ）',
    similarity: 92,
    options: [
      { label: 'A', text: '84' },
      { label: 'B', text: '85' },
      { label: 'C', text: '86' },
      { label: 'D', text: '87' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 's3',
    title: '56+27 的结果是（ ）',
    similarity: 90,
    options: [
      { label: 'A', text: '82' },
      { label: 'B', text: '84' },
      { label: 'C', text: '83' },
      { label: 'D', text: '85' },
    ],
    correctAnswer: 'C',
  },
])

const correctCount = computed(() => {
  let count = 0
  similarQuestions.value.forEach(q => {
    if (feedback.value[q.id]?.isCorrect) count++
  })
  return count
})

const correctRate = computed(() => {
  if (submittedCount.value === 0) return 0
  return Math.round((correctCount.value / submittedCount.value) * 100)
})

const resultTitle = computed(() => {
  if (correctRate.value >= 80) return '太棒了！'
  if (correctRate.value >= 60) return '不错哦！'
  if (correctRate.value >= 40) return '继续加油！'
  return '再接再厉！'
})

const resultSubtitle = computed(() => {
  return `你答对了 ${correctCount.value} 道题，正确率 ${correctRate.value}%`
})

const submitAnswer = async (questionId) => {
  const answer = answers.value[questionId]
  if (!answer) {
    ElMessage.warning('请先选择答案')
    return
  }

  submittingIds.value.add(questionId)
  
  // 模拟提交
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const question = similarQuestions.value.find(q => q.id === questionId)
  feedback.value[questionId] = {
    isCorrect: answer === question.correctAnswer,
    message: answer === question.correctAnswer ? '回答正确！' : '回答错误',
    correctAnswer: question.correctAnswer,
  }
  
  submittingIds.value.delete(questionId)
  ElMessage.success(answer === question.correctAnswer ? '回答正确！' : '已提交')
}

const showAnswer = (questionId) => {
  const question = similarQuestions.value.find(q => q.id === questionId)
  ElMessage.info(`正确答案是：${question.correctAnswer}`)
}

const handleSubmitAll = async () => {
  const unanswered = similarQuestions.value.filter(q => !answers.value[q.id])
  if (unanswered.length > 0) {
    ElMessage.warning(`还有 ${unanswered.length} 道题未作答`)
    return
  }

  submittingAll.value = true
  
  // 批量提交
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  similarQuestions.value.forEach(q => {
    if (!feedback.value[q.id]) {
      feedback.value[q.id] = {
        isCorrect: answers.value[q.id] === q.correctAnswer,
        message: answers.value[q.id] === q.correctAnswer ? '回答正确！' : '回答错误',
        correctAnswer: q.correctAnswer,
      }
    }
  })
  
  submittedCount.value = similarQuestions.value.length
  submittingAll.value = false
  resultVisible.value = true
}

const continuePractice = () => {
  resultVisible.value = false
  // 重置状态
  answers.value = {}
  feedback.value = {}
  submittedCount.value = 0
  ElMessage.success('已重新开始练习')
}

const goBack = () => router.back()

onMounted(() => {
  // 可以根据 route.params.id 加载对应的错题和相似题
  console.log('Practice page loaded, question id:', route.params.id)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.practice-content {
  max-width: 900px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: $primary-color;
  }
}

.original-question, .similar-questions {
  background: $bg-page;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.question-body {
  .question-text {
    font-size: 16px;
    margin-bottom: 16px;
    line-height: 1.6;
  }
  
  .question-meta {
    display: flex;
    gap: 8px;
  }
}

.answer-compare {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-light;
  
  .answer-item {
    margin-bottom: 12px;
    
    .label {
      font-weight: 500;
      color: $text-secondary;
    }
    
    .value {
      &.user {
        color: $warning-color;
      }
      
      &.correct {
        color: $success-color;
      }
    }
  }
  
  .analysis {
    margin-top: 12px;
    padding: 12px;
    background: #fff;
    border-radius: 4px;
    
    .label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      color: $primary-color;
    }
    
    p {
      margin-top: 8px;
      color: $text-regular;
      line-height: 1.6;
    }
  }
}

.question-card {
  border: 1px solid $border-light;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
  
  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  .question-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    color: $text-primary;
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .option-item {
    padding: 8px 12px;
    border-radius: 4px;
    transition: background 0.2s;
    
    &:hover {
      background: $primary-light;
    }
  }
}

.question-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.question-feedback {
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.correct {
    background: #f0f9eb;
    color: $success-color;
  }
  
  &.incorrect {
    background: #fef0f0;
    color: $danger-color;
  }
  
  .feedback-answer {
    margin-left: auto;
    font-weight: 500;
  }
}

.actions {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid $border-light;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
  
  .stat-item {
    text-align: center;
    
    .stat-label {
      display: block;
      color: $text-secondary;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      
      &.correct {
        color: $success-color;
      }
    }
  }
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
