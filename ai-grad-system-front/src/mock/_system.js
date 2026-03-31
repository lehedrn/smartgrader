import Mock from 'mockjs'

// 泉州市学校数据
const SCHOOLS = [
  '泉州市教育局',
  '泉州市实验小学',
  '泉州市第二小学',
  '泉州市第三小学',
  '泉州市师范附属小学',
]

const ROLES = ['超级管理员', '教师', '学生', '家长']
const STATUS = ['normal', 'disabled']
const SUBJECTS = ['语文', '数学', '英语']

// 生成随机手机号
function genPhone() {
  const prefix = ['138', '139', '150', '151', '158', '159', '186', '189']
  return prefix[Math.floor(Math.random() * prefix.length)] + String(Math.floor(Math.random() * 100000000)).padStart(8, '0')
}

// 生成随机邮箱
function genEmail(name) {
  const domains = ['qq.com', '163.com', 'gmail.com', 'example.com']
  const domain = domains[Math.floor(Math.random() * domains.length)]
  return (name || 'user') + '@' + domain
}

// 用户管理 Mock
export default [
  // 用户列表
  {
    url: '/api/system/user/list',
    method: 'get',
    response: (options) => {
      const { page = 1, pageSize = 10, username, realName, role } = options.query
      const list = []
      const names = ['张明', '李华', '王芳', '刘洋', '陈静', '杨帆', '赵敏', '周杰', '吴磊', '徐丽']
      for (let i = 0; i < pageSize; i++) {
        const id = (page - 1) * pageSize + i + 1
        const name = names[i % names.length]
        list.push({
          id: String(id),
          username: username || `user${id}`,
          realName: realName || name,
          organization: SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)],
          roles: role || ROLES[Math.floor(Math.random() * ROLES.length)],
          phone: genPhone(),
          email: genEmail(`user${id}`),
          status: STATUS[Math.floor(Math.random() * STATUS.length)],
          createTime: `2026-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        })
      }
      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: 128,
          page,
          pageSize,
        },
      }
    },
  },
  // 用户详情
  {
    url: '/api/system/user/detail',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          id: '1',
          username: 'admin',
          realName: '管理员',
          organization: '泉州市教育局',
          roles: '超级管理员',
          phone: '13800138000',
          email: 'admin@example.com',
          status: 'normal',
          createTime: '2026-01-01 00:00:00',
        },
      }
    },
  },
  // 创建用户
  {
    url: '/api/system/user/create',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '创建成功',
        data: { id: 'user_' + Date.now() },
      }
    },
  },
  // 更新用户
  {
    url: '/api/system/user/update',
    method: 'put',
    response: () => {
      return {
        code: 200,
        message: '更新成功',
        data: null,
      }
    },
  },
  // 删除用户
  {
    url: '/api/system/user/delete',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null,
      }
    },
  },
  // 重置密码
  {
    url: '/api/system/user/resetPassword',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '密码重置成功',
        data: null,
      }
    },
  },
  // 角色列表
  {
    url: '/api/system/role/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: '1', name: '超级管理员', code: 'admin', description: '系统超级管理员，拥有所有权限', userCount: 3, status: 'normal', createTime: '2026-01-01 00:00:00' },
            { id: '2', name: '教师', code: 'teacher', description: '普通教师用户', userCount: 86, status: 'normal', createTime: '2026-01-01 00:00:00' },
            { id: '3', name: '学生', code: 'student', description: '学生用户', userCount: 1258, status: 'normal', createTime: '2026-01-01 00:00:00' },
            { id: '4', name: '家长', code: 'parent', description: '家长用户', userCount: 800, status: 'normal', createTime: '2026-01-01 00:00:00' },
          ],
          total: 4,
        },
      }
    },
  },
  // 创建角色
  {
    url: '/api/system/role/create',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '创建成功',
        data: { id: 'role_' + Date.now() },
      }
    },
  },
  // 更新角色
  {
    url: '/api/system/role/update',
    method: 'put',
    response: () => {
      return {
        code: 200,
        message: '更新成功',
        data: null,
      }
    },
  },
  // 删除角色
  {
    url: '/api/system/role/delete',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null,
      }
    },
  },
  // 获取权限树
  {
    url: '/api/system/permission/tree',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          tree: [
            {
              id: '1',
              label: '系统管理',
              children: [
                { id: '1-1', label: '用户管理' },
                { id: '1-2', label: '角色管理' },
                { id: '1-3', label: '消息中心' },
              ],
            },
            {
              id: '2',
              label: '作业管理',
              children: [
                { id: '2-1', label: '作业发布' },
                { id: '2-2', label: '作业提交' },
                { id: '2-3', label: '作业批阅' },
                { id: '2-4', label: '作业列表' },
              ],
            },
            {
              id: '3',
              label: '资源管理',
              children: [
                { id: '3-1', label: '题库管理' },
                { id: '3-2', label: '试卷管理' },
                { id: '3-3', label: '知识点管理' },
              ],
            },
            {
              id: '4',
              label: '作业报告',
              children: [
                { id: '4-1', label: '班级报告' },
                { id: '4-2', label: '个人报告' },
                { id: '4-3', label: '数据驾驶舱' },
              ],
            },
          ],
        },
      }
    },
  },
  // 保存角色权限
  {
    url: '/api/system/role/permission',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '权限配置成功',
        data: null,
      }
    },
  },
]
