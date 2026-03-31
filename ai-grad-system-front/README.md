# 智能作业批阅平台 - 前端原型系统

## 技术栈

- Vue 3 (Composition API)
- Vite 5
- Element Plus
- Pinia
- Vue Router
- ECharts
- Mock.js

## 环境要求

- Node.js >= 24.11.1
- pnpm >= 9.0.0

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 公共组件
├── mock/         # Mock 数据
├── router/       # 路由配置
├── store/        # 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面组件
```

## 默认登录账号

- 账号：admin
- 密码：admin123

## 功能模块

- 作业发布与管理
- 作业智能批阅
- 校本作业资源管理
- 作业报告
- 课堂作业讲评
- 错题再练
- 作业数据驾驶舱
