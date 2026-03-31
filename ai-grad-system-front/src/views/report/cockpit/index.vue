<template>
  <div class="cockpit-container">
    <div class="cockpit-header">
      <h1>智能作业批阅平台·数据驾驶舱</h1>
      <p class="subtitle">泉州市教育局 · {{ currentTime }}</p>
    </div>

    <!-- 核心指标 -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon"><el-icon><User /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-value">1,258</div>
          <div class="kpi-label">学生总数</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><el-icon><UserFilled /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-value">86</div>
          <div class="kpi-label">教师总数</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><el-icon><OfficeBuilding /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-value">12</div>
          <div class="kpi-label">学校数量</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><el-icon><Document /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-value">356</div>
          <div class="kpi-label">作业总数</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><el-icon><UploadFilled /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-value">94.5%</div>
          <div class="kpi-label">今日提交率</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><el-icon><Edit /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-value">92.3%</div>
          <div class="kpi-label">今日批阅率</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <div class="chart-row">
        <el-card class="chart-card"><div class="card-title">作业趋势</div><div ref="trendChartRef" class="chart"></div></el-card>
        <el-card class="chart-card"><div class="card-title">学科分布</div><div ref="pieChartRef" class="chart"></div></el-card>
        <el-card class="chart-card"><div class="card-title">知识点掌握</div><div ref="radarChartRef" class="chart"></div></el-card>
      </div>
    </div>

    <!-- 排名和动态 -->
    <div class="bottom-section">
      <el-card class="ranking-card">
        <div class="card-title">学校排名</div>
        <el-table :data="schoolRanking" size="small">
          <el-table-column prop="rank" label="排名" width="60" />
          <el-table-column prop="school" label="学校" />
          <el-table-column prop="score" label="平均分" width="80" />
        </el-table>
      </el-card>
      <el-card class="activity-card">
        <div class="card-title">实时动态</div>
        <el-timeline size="small">
          <el-timeline-item timestamp="10:30">三年 (1) 班 张明 提交了数学作业</el-timeline-item>
          <el-timeline-item timestamp="10:15">王老师 批阅了 英语第二单元测试</el-timeline-item>
          <el-timeline-item timestamp="09:50">李老师 发布了 语文第四单元作业</el-timeline-item>
          <el-timeline-item timestamp="09:30">陈老师 导出了 班级学情报告</el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const currentTime = ref(dayjs().format('YYYY 年 MM 月 DD 日 HH:mm:ss'))
const trendChartRef = ref(null)
const pieChartRef = ref(null)
const radarChartRef = ref(null)
const chartInstances = ref([])

const schoolRanking = ref([
  { rank: 1, school: '泉州市实验小学', score: 88.5 },
  { rank: 2, school: '泉州市师范附属小学', score: 86.2 },
  { rank: 3, school: '泉州市第一小学', score: 84.8 },
  { rank: 4, school: '泉州市第二小学', score: 82.5 },
  { rank: 5, school: '泉州市第三小学', score: 80.2 },
])

const initCharts = () => {
  // 初始化趋势图
  const trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    xAxis: { type: 'category', data: ['03-01', '03-05', '03-10', '03-15', '03-20', '03-25', '03-30'] },
    yAxis: { type: 'value' },
    series: [
      { name: '提交率', type: 'line', smooth: true, data: [92, 93, 91, 94, 95, 93, 94.5], itemStyle: { color: '#409EFF' } },
      { name: '批阅率', type: 'line', smooth: true, data: [90, 91, 90, 92, 93, 91, 92.3], itemStyle: { color: '#67C23A' } },
      { name: '平均分', type: 'line', smooth: true, data: [80, 81, 80, 82, 83, 82, 82.5], itemStyle: { color: '#E6A23C' } },
    ],
  })
  chartInstances.value.push(trendChart)

  // 初始化饼图
  const pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    series: [{
      type: 'pie', radius: ['40%', '70%'],
      data: [
        { value: 125, name: '语文' },
        { value: 118, name: '数学' },
        { value: 113, name: '英语' },
      ],
    }],
  })
  chartInstances.value.push(pieChart)

  // 初始化雷达图
  const radarChart = echarts.init(radarChartRef.value)
  radarChart.setOption({
    radar: { indicator: [{ name: '数的认识' }, { name: '四则运算' }, { name: '几何图形' }, { name: '应用题' }, { name: '单位换算' }, { name: '统计图表' }] },
    series: [{ type: 'radar', data: [{ value: [88, 82, 90, 75, 85, 78] }] }],
  })
  chartInstances.value.push(radarChart)

  setInterval(() => {
    currentTime.value = dayjs().format('YYYY 年 MM 月 DD 日 HH:mm:ss')
  }, 1000)
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  chartInstances.value.forEach(chart => {
    chart && chart.resize()
  })
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstances.value.forEach(chart => {
    chart && chart.dispose()
  })
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cockpit-container {
  padding: 20px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  width: 100%;
  color: #fff;
  overflow-x: hidden;
}

.cockpit-header {
  text-align: center;
  margin-bottom: 30px;
}

.cockpit-header h1 {
  font-size: 32px;
  margin: 0 0 8px 0;
  background: linear-gradient(90deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cockpit-header .subtitle {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.kpi-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  font-size: 24px;
  flex-shrink: 0;
}

.kpi-value {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

.kpi-label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.chart-section {
  margin-bottom: 24px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chart-card {
  background: rgba(255,255,255,0.95);
  color: #333;
}

.card-title {
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
}

.chart {
  height: 280px;
  width: 100%;
}

.bottom-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.ranking-card,
.activity-card {
  background: rgba(255,255,255,0.95);
  color: #333;
}

/* 响应式布局 - 大屏幕 */
@media screen and (max-width: 1600px) {
  .kpi-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 平板和中等屏幕 */
@media screen and (max-width: 1400px) {
  .cockpit-header h1 {
    font-size: 24px;
  }

  .chart-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .chart {
    height: 250px;
  }
}

@media screen and (max-width: 1024px) {
  .cockpit-container {
    padding: 12px;
  }

  .cockpit-header {
    margin-bottom: 20px;
  }

  .cockpit-header h1 {
    font-size: 20px;
  }

  .cockpit-header .subtitle {
    font-size: 12px;
  }

  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }

  .kpi-card {
    padding: 12px;
    gap: 10px;
  }

  .kpi-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .kpi-value {
    font-size: 18px;
  }

  .kpi-label {
    font-size: 10px;
  }

  .chart-section {
    margin-bottom: 16px;
  }

  .chart {
    height: 200px;
  }

  .card-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .bottom-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 手机屏幕 */
@media screen and (max-width: 600px) {
  .cockpit-header h1 {
    font-size: 18px;
  }

  .kpi-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .kpi-card {
    padding: 10px;
  }

  .kpi-value {
    font-size: 16px;
  }
}
</style>
