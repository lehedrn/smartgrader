export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '工作台',
          icon: 'HomeFilled',
        },
      },
    ],
  },
]

// 业务路由
export const asyncRoutes = [
  {
    path: '/homework',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/homework/publish',
    meta: {
      title: '作业管理',
      icon: 'EditPen',
    },
    children: [
      {
        path: 'publish',
        name: 'HomeworkPublish',
        component: () => import('@/views/homework/publish/index.vue'),
        meta: { title: '作业发布', icon: 'DocumentAdd' },
      },
      {
        path: 'publish/create',
        name: 'HomeworkCreate',
        component: () => import('@/views/homework/publish/create.vue'),
        meta: { title: '新建作业', icon: 'Plus', hidden: true },
      },
      {
        path: 'submit',
        name: 'HomeworkSubmit',
        component: () => import('@/views/homework/submit/index.vue'),
        meta: { title: '作业提交', icon: 'UploadFilled' },
      },
      {
        path: 'grade',
        name: 'HomeworkGrade',
        component: () => import('@/views/homework/grade/index.vue'),
        meta: { title: '作业批阅', icon: 'Edit' },
      },
      {
        path: 'grade/:id',
        name: 'HomeworkGradeDetail',
        component: () => import('@/views/homework/grade/detail.vue'),
        meta: { title: '批阅详情', hidden: true },
      },
      {
        path: 'list',
        name: 'HomeworkList',
        component: () => import('@/views/homework/list/index.vue'),
        meta: { title: '作业列表', icon: 'Document' },
      },
    ],
  },
  {
    path: '/resource',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/resource/question',
    meta: {
      title: '资源管理',
      icon: 'FolderOpened',
    },
    children: [
      {
        path: 'question',
        name: 'ResourceQuestion',
        component: () => import('@/views/resource/question/index.vue'),
        meta: { title: '题库管理', icon: 'Collection' },
      },
      {
        path: 'question/edit/:id?',
        name: 'QuestionEdit',
        component: () => import('@/views/resource/question/edit.vue'),
        meta: { title: '题目编辑', hidden: true },
      },
      {
        path: 'paper',
        name: 'ResourcePaper',
        component: () => import('@/views/resource/paper/index.vue'),
        meta: { title: '试卷管理', icon: 'Notebook' },
      },
      {
        path: 'paper/compose/:id?',
        name: 'PaperCompose',
        component: () => import('@/views/resource/paper/compose.vue'),
        meta: { title: '组卷', hidden: true },
      },
      {
        path: 'knowledge',
        name: 'ResourceKnowledge',
        component: () => import('@/views/resource/knowledge/index.vue'),
        meta: { title: '知识点管理', icon: 'Grid' },
      },
    ],
  },
  {
    path: '/report',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/report/class',
    meta: {
      title: '作业报告',
      icon: 'TrendCharts',
    },
    children: [
      {
        path: 'class',
        name: 'ClassReport',
        component: () => import('@/views/report/class/index.vue'),
        meta: { title: '班级报告', icon: 'OfficeBuilding' },
      },
      {
        path: 'personal',
        name: 'PersonalReport',
        component: () => import('@/views/report/personal/index.vue'),
        meta: { title: '个人报告', icon: 'User' },
      },
    ],
  },
  // 数据驾驶舱 - 独立路由，使用全屏布局（无侧边栏和导航栏）
  {
    path: '/report/cockpit',
    component: () => import('@/views/report/cockpit/index.vue'),
    name: 'DataCockpit',
    meta: { title: '数据驾驶舱', icon: 'DataAnalysis', target: '_blank' },
  },
  {
    path: '/mistake',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/mistake/index',
    meta: {
      title: '错题再练',
      icon: 'RefreshRight',
    },
    children: [
      {
        path: 'index',
        name: 'MistakeList',
        component: () => import('@/views/mistake/index.vue'),
        meta: { title: '错题本', icon: 'DocumentRemove' },
      },
      {
        path: 'practice/:id',
        name: 'MistakePractice',
        component: () => import('@/views/mistake/practice.vue'),
        meta: { title: '相似题练习', hidden: true },
      },
    ],
  },
  {
    path: '/system',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/system/message',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        path: 'message',
        name: 'SystemMessage',
        component: () => import('@/views/system/message/index.vue'),
        meta: { title: '消息中心', icon: 'Bell' },
      },
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'UserFilled' },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'Avatar' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]

export default constantRoutes
