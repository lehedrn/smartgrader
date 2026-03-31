export default {
  title: '智能作业批阅平台',

  // 主题设置
  theme: {
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
  },

  // 侧边栏设置
  sidebar: {
    defaultOpened: true,
    defaultActive: '/dashboard',
  },

  // 布局设置
  layout: {
    sidebarWidth: 210,
    headerHeight: 50,
    tagsViewHeight: 34,
  },

  // Mock 数据配置
  mock: {
    // 泉州市背景数据
    location: {
      province: '福建省',
      city: '泉州市',
    },
    // 当前学年
    schoolYear: '2025-2026',
    // 当前学期
    semester: '第二学期',
  },

  // 分页设置
  pagination: {
    defaultPageSize: 10,
    pageSizes: [10, 20, 50, 100],
  },
}
