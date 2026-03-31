<template>
  <div class="page-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="班级报告" name="class">
        <div class="stat-row">
          <el-card class="stat-card">
            <div class="stat-label">年级平均分</div>
            <div class="stat-value">82.5</div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-label">年级及格率</div>
            <div class="stat-value">92.3%</div>
          </el-card>
          <el-card class="stat-card">
            <div class="stat-label">年级优秀率</div>
            <div class="stat-value">38.5%</div>
          </el-card>
        </div>

        <el-card class="mt-4">
          <template #header><span>班级成绩统计</span></template>
          <el-table :data="classList">
            <el-table-column prop="className" label="班级" width="120" />
            <el-table-column prop="studentCount" label="学生数" width="80" />
            <el-table-column prop="avgScore" label="平均分" width="80" />
            <el-table-column prop="passRate" label="及格率" width="80" />
            <el-table-column prop="excellentRate" label="优秀率" width="80" />
            <el-table-column prop="homeworkCount" label="作业数" width="80" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="个人报告" name="personal">
        <el-card>
          <template #header><span>学生成绩</span></template>
          <el-table :data="studentList">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="className" label="班级" width="120" />
            <el-table-column prop="avgScore" label="平均分" width="80" />
            <el-table-column prop="rank" label="排名" width="80" />
            <el-table-column prop="correctRate" label="正确率" width="80" />
            <el-table-column prop="mistakeCount" label="错题数" width="80" />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 班级详情弹窗 - 显示班级内每个学生的具体报告 -->
    <el-dialog v-model="detailVisible" :title="`班级详情 - ${currentClass.className}`" width="900px" :close-on-click-modal="false">
      <!-- 班级概况 -->
      <el-descriptions :column="4" border class="mb-4">
        <el-descriptions-item label="班级名称">{{ currentClass.className }}</el-descriptions-item>
        <el-descriptions-item label="学生人数">{{ currentClass.studentCount }}人</el-descriptions-item>
        <el-descriptions-item label="平均分">{{ currentClass.avgScore }}分</el-descriptions-item>
        <el-descriptions-item label="作业总数">{{ currentClass.homeworkCount }}次</el-descriptions-item>
        <el-descriptions-item label="及格率">{{ currentClass.passRate }}%</el-descriptions-item>
        <el-descriptions-item label="优秀率">{{ currentClass.excellentRate }}%</el-descriptions-item>
      </el-descriptions>

      <el-divider>学生个人报告</el-divider>

      <!-- 学生列表 -->
      <el-table :data="studentReportList" v-loading="studentLoading" :default-sort="{ prop: 'avgScore', order: 'descending' }">
        <el-table-column prop="name" label="姓名" width="80" fixed />
        <el-table-column prop="avgScore" label="平均分" width="80" sortable />
        <el-table-column prop="rank" label="班级排名" width="90" sortable />
        <el-table-column prop="correctRate" label="正确率" width="80" sortable />
        <el-table-column prop="mistakeCount" label="错题数" width="80" sortable />
        <el-table-column prop="homeworkCompleted" label="作业完成" width="90" />
        <el-table-column prop="goodHomework" label="优秀作业" width="80" />
        <el-table-column prop="improvement" label="进步情况" width="100">
          <template #default="{ row }">
            <el-tag :type="getImprovementTagType(row.improvement)" size="small">{{ row.improvement }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewStudentDetail(row)">个人详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 学生个人详情弹窗 -->
    <el-dialog v-model="studentDetailVisible" title="学生个人报告详情" width="800px" :close-on-click-modal="false">
      <div v-if="currentStudent">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentStudent.name }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ currentStudent.className }}</el-descriptions-item>
          <el-descriptions-item label="平均分">{{ currentStudent.avgScore }}分</el-descriptions-item>
          <el-descriptions-item label="班级排名">第 {{ currentStudent.rank }}名</el-descriptions-item>
          <el-descriptions-item label="正确率">{{ currentStudent.correctRate }}%</el-descriptions-item>
          <el-descriptions-item label="错题数">{{ currentStudent.mistakeCount }}题</el-descriptions-item>
        </el-descriptions>

        <el-divider>作业完成情况</el-divider>
        <el-table :data="currentStudent.homeworkList" size="small">
          <el-table-column prop="title" label="作业标题" min-width="150" />
          <el-table-column prop="score" label="得分" width="70" />
          <el-table-column prop="correctRate" label="正确率" width="80" />
          <el-table-column prop="mistakes" label="错题数" width="70" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <el-divider>知识点掌握情况</el-divider>
        <div class="knowledge-tags">
          <el-tag v-for="(item, index) in currentStudent.knowledgeTags" :key="index" :type="item.type" style="margin-right: 8px; margin-bottom: 8px;">
            {{ item.name }}: {{ item.rate }}
          </el-tag>
        </div>
      </div>

      <template #footer>
        <el-button @click="studentDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('class')
const detailVisible = ref(false)
const studentDetailVisible = ref(false)
const studentLoading = ref(false)
const currentClass = ref({})
const currentStudent = ref(null)

const classList = ref([
  { className: '三年 (1) 班', studentCount: 45, avgScore: 85.2, passRate: 93, excellentRate: 40, homeworkCount: 22 },
  { className: '三年 (2) 班', studentCount: 43, avgScore: 83.5, passRate: 91, excellentRate: 35, homeworkCount: 22 },
  { className: '三年 (3) 班', studentCount: 44, avgScore: 84.8, passRate: 92, excellentRate: 38, homeworkCount: 22 },
])

const studentList = ref([
  { name: '张明', className: '三年 (1) 班', avgScore: 92, rank: 1, correctRate: 95, mistakeCount: 8 },
  { name: '李华', className: '三年 (1) 班', avgScore: 88, rank: 5, correctRate: 90, mistakeCount: 12 },
  { name: '王芳', className: '三年 (1) 班', avgScore: 95, rank: 2, correctRate: 97, mistakeCount: 5 },
])

// 班级详情中的学生报告列表
const studentReportList = ref([
  { name: '张明', className: '三年 (1) 班', avgScore: 92, rank: 1, correctRate: 95, mistakeCount: 8, homeworkCompleted: '22/22', goodHomework: 18, improvement: '进步明显',
    homeworkList: [
      { title: '语文第一单元作业', score: 90, correctRate: '90%', mistakes: 3, status: '已完成' },
      { title: '数学第一单元作业', score: 95, correctRate: '95%', mistakes: 2, status: '已完成' },
      { title: '英语第一单元作业', score: 88, correctRate: '88%', mistakes: 4, status: '已完成' },
    ],
    knowledgeTags: [
      { name: '整数加法', rate: '95%', type: 'success' },
      { name: '古诗背诵', rate: '90%', type: 'success' },
      { name: '单词记忆', rate: '85%', type: 'warning' },
    ]
  },
  { name: '李华', className: '三年 (1) 班', avgScore: 88, rank: 5, correctRate: 90, mistakeCount: 12, homeworkCompleted: '21/22', goodHomework: 14, improvement: '保持稳定',
    homeworkList: [
      { title: '语文第一单元作业', score: 85, correctRate: '85%', mistakes: 5, status: '已完成' },
      { title: '数学第一单元作业', score: 92, correctRate: '92%', mistakes: 3, status: '已完成' },
      { title: '英语第一单元作业', score: 87, correctRate: '87%', mistakes: 4, status: '已完成' },
    ],
    knowledgeTags: [
      { name: '整数加法', rate: '92%', type: 'success' },
      { name: '古诗背诵', rate: '88%', type: 'warning' },
      { name: '单词记忆', rate: '90%', type: 'success' },
    ]
  },
  { name: '王芳', className: '三年 (1) 班', avgScore: 95, rank: 2, correctRate: 97, mistakeCount: 5, homeworkCompleted: '22/22', goodHomework: 20, improvement: '进步明显',
    homeworkList: [
      { title: '语文第一单元作业', score: 96, correctRate: '96%', mistakes: 1, status: '已完成' },
      { title: '数学第一单元作业', score: 98, correctRate: '98%', mistakes: 1, status: '已完成' },
      { title: '英语第一单元作业', score: 92, correctRate: '92%', mistakes: 3, status: '已完成' },
    ],
    knowledgeTags: [
      { name: '整数加法', rate: '98%', type: 'success' },
      { name: '古诗背诵', rate: '96%', type: 'success' },
      { name: '单词记忆', rate: '94%', type: 'success' },
    ]
  },
  { name: '刘洋', className: '三年 (1) 班', avgScore: 82, rank: 8, correctRate: 85, mistakeCount: 18, homeworkCompleted: '20/22', goodHomework: 10, improvement: '有待提高',
    homeworkList: [
      { title: '语文第一单元作业', score: 80, correctRate: '80%', mistakes: 6, status: '已完成' },
      { title: '数学第一单元作业', score: 85, correctRate: '85%', mistakes: 5, status: '已完成' },
      { title: '英语第一单元作业', score: 78, correctRate: '78%', mistakes: 7, status: '已完成' },
    ],
    knowledgeTags: [
      { name: '整数加法', rate: '85%', type: 'warning' },
      { name: '古诗背诵', rate: '82%', type: 'warning' },
      { name: '单词记忆', rate: '80%', type: 'danger' },
    ]
  },
  { name: '陈静', className: '三年 (1) 班', avgScore: 78, rank: 12, correctRate: 80, mistakeCount: 22, homeworkCompleted: '19/22', goodHomework: 8, improvement: '需要努力',
    homeworkList: [
      { title: '语文第一单元作业', score: 75, correctRate: '75%', mistakes: 8, status: '已完成' },
      { title: '数学第一单元作业', score: 82, correctRate: '82%', mistakes: 6, status: '已完成' },
      { title: '英语第一单元作业', score: 76, correctRate: '76%', mistakes: 8, status: '已完成' },
    ],
    knowledgeTags: [
      { name: '整数加法', rate: '82%', type: 'warning' },
      { name: '古诗背诵', rate: '75%', type: 'danger' },
      { name: '单词记忆', rate: '78%', type: 'danger' },
    ]
  },
])

const getImprovementTagType = (improvement) => {
  const map = { '进步明显': 'success', '保持稳定': '', '有待提高': 'warning', '需要努力': 'danger' }
  return map[improvement] || ''
}

const handleDetail = (row) => {
  currentClass.value = row
  studentLoading.value = true
  // 模拟加载数据
  setTimeout(() => {
    studentLoading.value = false
    detailVisible.value = true
  }, 300)
}

const viewStudentDetail = (row) => {
  currentStudent.value = row
  studentDetailVisible.value = true
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
.stat-card { text-align: center; padding: 24px; }
.stat-label { font-size: 14px; color: #909399; }
.stat-value { font-size: 36px; font-weight: bold; color: #409EFF; margin-top: 8px; }
.mt-4 { margin-top: 20px; }
.mb-4 { margin-bottom: 16px; }
.knowledge-tags { display: flex; flex-wrap: wrap; padding: 8px 0; }
</style>
