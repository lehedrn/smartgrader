<template>
  <div class="page-container">
    <el-card>
      <template #header><span>个人学情报告</span></template>

      <div class="student-info">
        <el-avatar :size="80" src="">学</el-avatar>
        <div class="info">
          <h3>张明</h3>
          <p>三年 (1) 班 | 学号：20230101</p>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-item">
          <div class="label">平均分</div>
          <div class="value">92.5</div>
        </div>
        <div class="stat-item">
          <div class="label">班级排名</div>
          <div class="value">第 3 名</div>
        </div>
        <div class="stat-item">
          <div class="label">作业完成</div>
          <div class="value">22/22</div>
        </div>
        <div class="stat-item">
          <div class="label">错题数</div>
          <div class="value">15</div>
        </div>
      </div>

      <div class="chart-row">
        <el-card><div class="card-title">学科成绩</div><div ref="barChartRef" class="chart"></div></el-card>
        <el-card><div class="card-title">知识点掌握</div><div ref="radarChartRef" class="chart"></div></el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const barChartRef = ref(null)
const radarChartRef = ref(null)

const initBarChart = () => {
  const chart = echarts.init(barChartRef.value)
  chart.setOption({
    xAxis: { type: 'category', data: ['语文', '数学', '英语'] },
    yAxis: { type: 'value', max: 100 },
    series: [{ data: [88, 95, 90], type: 'bar', itemStyle: { color: '#409EFF' } }],
  })
}

const initRadarChart = () => {
  const chart = echarts.init(radarChartRef.value)
  chart.setOption({
    radar: { indicator: [{ name: '数的认识' }, { name: '加减法' }, { name: '几何' }, { name: '应用题' }, { name: '时间' }] },
    series: [{ type: 'radar', data: [{ value: [85, 90, 95, 80, 88] }] }],
  })
}

onMounted(() => { initBarChart(); initRadarChart() })
</script>

<style lang="scss" scoped>
.student-info { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding: 16px; background: #f5f7fa; border-radius: 8px; }
.info h3 { margin: 0 0 8px 0; }
.info p { margin: 0; color: #909399; }
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
.stat-item { text-align: center; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: #fff; }
.label { font-size: 14px; opacity: 0.9; }
.value { font-size: 28px; font-weight: bold; margin-top: 8px; }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
.card-title { font-weight: 600; margin-bottom: 16px; }
.chart { height: 300px; }
</style>
