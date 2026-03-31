<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="page-title">欢迎使用智能作业批阅平台</h2>
      <p class="page-subtitle">泉州市教育局 · 2025-2026 学年 第二学期</p>
    </div>

    <div class="dashboard-content">
      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stat-row">
        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card stat-card-1">
            <div class="stat-icon"><el-icon><Document /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">356</div>
              <div class="stat-label">作业总数</div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card stat-card-2">
            <div class="stat-icon"><el-icon><UploadFilled /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">94.5%</div>
              <div class="stat-label">今日提交率</div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card stat-card-3">
            <div class="stat-icon"><el-icon><Edit /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">92.3%</div>
              <div class="stat-label">今日批阅率</div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :lg="6">
          <div class="stat-card stat-card-4">
            <div class="stat-icon"><el-icon><TrendCharts /></el-icon></div>
            <div class="stat-info">
              <div class="stat-value">82.5</div>
              <div class="stat-label">平均分数</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :xs="24" :lg="12">
          <div class="chart-card">
            <div class="card-title">作业提交趋势</div>
            <div ref="trendChartRef" class="chart"></div>
          </div>
        </el-col>

        <el-col :xs="24" :lg="12">
          <div class="chart-card">
            <div class="card-title">学科作业分布</div>
            <div ref="pieChartRef" class="chart"></div>
          </div>
        </el-col>
      </el-row>

      <!-- 待办事项 -->
      <el-row :gutter="20">
        <el-col :xs="24" :lg="8">
          <div class="info-card">
            <div class="card-title">待批阅作业</div>
            <el-table :data="toGradeList" size="small">
              <el-table-column prop="studentName" label="学生" width="80" />
              <el-table-column prop="homeworkTitle" label="作业" show-overflow-tooltip />
              <el-table-column prop="submitTime" label="提交时间" width="100" />
            </el-table>
          </div>
        </el-col>

        <el-col :xs="24" :lg="8">
          <div class="info-card">
            <div class="card-title">班级排名</div>
            <el-table :data="classRanking" size="small">
              <el-table-column prop="rank" label="排名" width="60" />
              <el-table-column prop="class" label="班级" />
              <el-table-column prop="avgScore" label="平均分" width="80" />
            </el-table>
          </div>
        </el-col>

        <el-col :xs="24" :lg="8">
          <div class="info-card">
            <div class="card-title">系统消息</div>
            <el-timeline size="small">
              <el-timeline-item timestamp="10:30" placement="top">
                <el-card>
                  <p>系统将于本周六进行维护升级</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item timestamp="昨天" placement="top">
                <el-card>
                  <p>新增相似题推荐功能</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item timestamp="3 天前" placement="top">
                <el-card>
                  <p>作业批阅准确率提升至 95%</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const trendChartRef = ref(null)
const pieChartRef = ref(null)

const toGradeList = ref([
  { studentName: '张明', homeworkTitle: '数学第三单元测试', submitTime: '10:30' },
  { studentName: '李华', homeworkTitle: '语文第四单元作业', submitTime: '09:45' },
  { studentName: '王芳', homeworkTitle: '英语 Unit3 练习', submitTime: '09:20' },
  { studentName: '刘洋', homeworkTitle: '数学第三单元测试', submitTime: '昨天' },
  { studentName: '陈静', homeworkTitle: '科学第二单元', submitTime: '昨天' },
])

const classRanking = ref([
  { rank: 1, class: '六年 (1) 班', avgScore: 92.5 },
  { rank: 2, class: '五年 (2) 班', avgScore: 90.8 },
  { rank: 3, class: '四年 (1) 班', avgScore: 88.5 },
  { rank: 4, class: '三年 (1) 班', avgScore: 86.2 },
  { rank: 5, class: '六年 (2) 班', avgScore: 84.5 },
])

const initTrendChart = () => {
  const chart = echarts.init(trendChartRef.value)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['提交率', '批阅率', '平均分'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['03-01', '03-05', '03-10', '03-15', '03-20', '03-25', '03-30'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '提交率',
        type: 'line',
        data: [92, 93, 91, 94, 95, 93, 94.5],
        smooth: true,
        itemStyle: { color: '#409EFF' },
      },
      {
        name: '批阅率',
        type: 'line',
        data: [90, 91, 90, 92, 93, 91, 92.3],
        smooth: true,
        itemStyle: { color: '#67C23A' },
      },
      {
        name: '平均分',
        type: 'line',
        data: [80, 81, 80, 82, 83, 82, 82.5],
        smooth: true,
        itemStyle: { color: '#E6A23C' },
      },
    ],
  })

  window.addEventListener('resize', () => chart.resize())
}

const initPieChart = () => {
  const chart = echarts.init(pieChartRef.value)
  chart.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '作业数量',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 125, name: '语文' },
          { value: 118, name: '数学' },
          { value: 113, name: '英语' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })

  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  initTrendChart()
  initPieChart()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.dashboard-container {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 8px 0;
  }

  .page-subtitle {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: $shadow-light;
  margin-bottom: 16px;

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #ffffff;
    margin-right: 16px;
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: $text-primary;
    }

    .stat-label {
      font-size: 14px;
      color: $text-secondary;
      margin-top: 4px;
    }
  }
}

.stat-card-1 .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-2 .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card-3 .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card-4 .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: $shadow-light;
  margin-bottom: 16px;

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16px;
  }

  .chart {
    height: 300px;
  }
}

.info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: $shadow-light;
  margin-bottom: 16px;

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16px;
  }
}
</style>
