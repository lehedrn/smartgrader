<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>批阅详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div class="grade-detail">
        <div class="student-info">
          <h3>学生信息</h3>
          <p><span class="label">姓名：</span>张明</p>
          <p><span class="label">班级：</span>三年 (1) 班</p>
          <p><span class="label">提交时间：</span>2026-03-28 10:30</p>
        </div>

        <div class="score-summary">
          <div class="score-card">
            <div class="score-value">85</div>
            <div class="score-label">总分 (100 分)</div>
          </div>
        </div>

        <div class="question-grades">
          <h3>题目批阅详情</h3>
          <div class="question-grade-item" v-for="i in 5" :key="i">
            <div class="question-header">
              <span class="question-title">第{{ i }}题 - 选择题</span>
              <span class="question-score">得分：3/3</span>
            </div>
            <div class="question-content">
              <p>题目：下列计算正确的是（ ）</p>
              <p>学生答案：A</p>
              <p>正确答案：A</p>
              <p class="analysis">解析：23 + 45 = 68，个位 3+5=8，十位 2+4=6</p>
            </div>
          </div>
        </div>

        <div class="teacher-comment">
          <h3>教师评语</h3>
          <el-input
            v-model="comment"
            type="textarea"
            :rows="3"
            placeholder="请输入评语"
          />
          <el-button type="primary" class="mt-2" @click="handleSubmit">提交批阅</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const comment = ref('')

const handleSubmit = () => {
  ElMessage.success('批阅提交成功')
  router.push('/homework/grade')
}

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

.grade-detail {
  .student-info {
    background: $bg-page;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;

    h3 {
      margin-bottom: 12px;
    }

    p {
      margin: 8px 0;
      color: $text-regular;

      .label {
        font-weight: 600;
        color: $text-primary;
      }
    }
  }

  .score-summary {
    text-align: center;
    margin: 20px 0;

    .score-card {
      display: inline-block;
      padding: 24px 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: #ffffff;

      .score-value {
        font-size: 48px;
        font-weight: bold;
      }

      .score-label {
        font-size: 14px;
        opacity: 0.9;
        margin-top: 8px;
      }
    }
  }

  .question-grades {
    margin: 20px 0;

    h3 {
      margin-bottom: 16px;
    }

    .question-grade-item {
      border: 1px solid $border-light;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;

      .question-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-weight: 600;

        .question-score {
          color: $primary-color;
        }
      }

      .question-content {
        p {
          margin: 8px 0;
          color: $text-regular;
        }

        .analysis {
          color: $success-color;
          background: lighten($success-color, 45%);
          padding: 8px 12px;
          border-radius: 4px;
        }
      }
    }
  }

  .teacher-comment {
    margin-top: 20px;

    h3 {
      margin-bottom: 12px;
    }

    .mt-2 {
      margin-top: 12px;
    }
  }
}
</style>
