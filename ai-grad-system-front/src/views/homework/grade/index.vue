<template>
  <div class="page-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待批阅" name="pending">
        <el-table :data="pendingList" v-loading="loading">
          <el-table-column prop="studentName" label="学生姓名" width="100" />
          <el-table-column prop="homeworkTitle" label="作业标题" min-width="180" />
          <el-table-column prop="className" label="班级" width="120" />
          <el-table-column prop="submitTime" label="提交时间" width="160" />
          <el-table-column prop="aiStatus" label="AI 批阅" width="100">
            <template #default="{ row }">
              <el-tag :type="row.aiStatus === 'completed' ? 'success' : 'warning'">
                {{ row.aiStatus === 'completed' ? '已完成' : '进行中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="aiScore" label="AI 判分" width="80" />
          <el-table-column prop="waitReviewCount" label="待复核" width="80" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleGrade(row)">批阅</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="已批阅" name="graded">
        <el-table :data="gradedList" v-loading="loading">
          <el-table-column prop="studentName" label="学生姓名" width="100" />
          <el-table-column prop="homeworkTitle" label="作业标题" min-width="180" />
          <el-table-column prop="className" label="班级" width="120" />
          <el-table-column prop="gradeTime" label="批阅时间" width="160" />
          <el-table-column prop="gradeTeacher" label="批阅教师" width="100" />
          <el-table-column prop="finalScore" label="最终得分" width="80" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleView(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const activeTab = ref('pending')

const pendingList = ref([
  { id: '1', studentName: '张明', homeworkTitle: '数学第三单元测试', className: '三年 (1) 班', submitTime: '2026-03-28 10:30', aiStatus: 'completed', aiScore: 85, waitReviewCount: 2 },
  { id: '2', studentName: '李华', homeworkTitle: '数学第三单元测试', className: '三年 (1) 班', submitTime: '2026-03-28 09:45', aiStatus: 'completed', aiScore: 92, waitReviewCount: 0 },
  { id: '3', studentName: '王芳', homeworkTitle: '数学第三单元测试', className: '三年 (1) 班', submitTime: '2026-03-28 09:20', aiStatus: 'processing', aiScore: 0, waitReviewCount: 0 },
])

const gradedList = ref([
  { id: '4', studentName: '刘洋', homeworkTitle: '语文第二单元测试', className: '三年 (1) 班', gradeTime: '2026-03-27 15:30', gradeTeacher: '王老师', finalScore: 88 },
  { id: '5', studentName: '陈静', homeworkTitle: '语文第二单元测试', className: '三年 (1) 班', gradeTime: '2026-03-27 14:20', gradeTeacher: '王老师', finalScore: 95 },
])

const handleGrade = (row) => {
  router.push(`/homework/grade/${row.id}`)
}

const handleView = (row) => {
  ElMessage.info(`查看批阅详情：${row.homeworkTitle}`)
}

onMounted(() => {
  loading.value = false
})
</script>
