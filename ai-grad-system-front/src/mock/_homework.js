import Mock from 'mockjs'

// 泉州市背景数据
const QUZHOU_DATA = {
  schools: [
    '泉州市第一小学', '泉州市第二小学', '泉州市第三小学',
    '泉州市实验小学', '泉州市师范附属小学',
  ],
  classes: ['一年 (1) 班', '一年 (2) 班', '二年 (1) 班', '二年 (2) 班', '三年 (1) 班'],
  subjects: ['语文', '数学', '英语'],
  teachers: ['王老师', '李老师', '张老师', '陈老师', '林老师'],
  students: ['张明', '李华', '王芳', '刘洋', '陈静', '杨帆'],
}

export default [
  {
    url: '/api/homework/list',
    method: 'get',
    response: (options) => {
      const { page = 1, pageSize = 10 } = options.query
      const list = []
      // 学生提交状态
      const submitStatuses = ['WTJ', 'YTI', 'YPY']
      for (let i = 0; i < pageSize; i++) {
        const id = (page - 1) * pageSize + i + 1
        const title = `${Mock.Random.pick(QUZHOU_DATA.subjects)}${Mock.Random.pick(['第一', '第二', '第三', '第四', '第五'])}单元作业`
        list.push({
          id: String(id),
          title: title,
          homeworkTitle: title,
          subject: Mock.Random.pick(QUZHOU_DATA.subjects),
          type: Mock.Random.pick(['课后作业', '课堂练习', '单元测试']),
          className: Mock.Random.pick(QUZHOU_DATA.classes),
          teacherName: Mock.Random.pick(QUZHOU_DATA.teachers),
          schoolName: Mock.Random.pick(QUZHOU_DATA.schools),
          createDate: Mock.Random.date('2026-03-01', '2026-03-31'),
          deadline: Mock.Random.date('2026-03-25', '2026-04-15'),
          status: submitStatuses[i % 3],
          studentCount: Mock.Random.integer(30, 50),
          submittedCount: Mock.Random.integer(20, 45),
          correctedCount: Mock.Random.integer(15, 40),
        })
      }
      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: 45,
          page,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/homework/detail/:id',
    method: 'get',
    response: ({ url }) => {
      // 从 URL 中提取 ID
      const id = url.split('/').pop()
      const status = ['WTJ', 'YTI', 'YPY', 'YQR'][Math.floor(Math.random() * 4)]
      return {
        code: 200,
        message: 'success',
        data: {
          id: id,
          title: `${Mock.Random.pick(QUZHOU_DATA.subjects)}${Mock.Random.pick(['第一', '第二', '第三'])}单元作业`,
          homeworkTitle: `${Mock.Random.pick(QUZHOU_DATA.subjects)}${Mock.Random.pick(['第一', '第二', '第三'])}单元作业`,
          subject: Mock.Random.pick(QUZHOU_DATA.subjects),
          type: Mock.Random.pick(['课后作业', '课堂练习', '单元测试']),
          classes: [Mock.Random.pick(QUZHOU_DATA.classes)],
          className: Mock.Random.pick(QUZHOU_DATA.classes),
          publishDate: '2026-03-15',
          deadline: '2026-04-01',
          duration: 30,
          description: '请完成第一单元的练习题，注意书写工整，按时提交。',
          status: status,
          questions: [
            { id: '1', title: '选择题：下列计算正确的是（ ）23+45 等于多少', score: 10 },
            { id: '2', title: '填空题：床前明月光，_____', score: 10 },
            { id: '3', title: '简答题：请简述三角形面积公式', score: 20 },
          ],
          // 用户答案（已提交时有值）
          userAnswer: status !== 'WTJ' ? [
            'A. 68',
            '疑是地上霜',
            '三角形面积 = 底 × 高 ÷ 2',
          ] : [],
          // 参考答案
          correctAnswer: [
            'A. 68',
            '疑是地上霜',
            '三角形面积 = 底 × 高 ÷ 2',
          ],
          // 教师评语（已批阅时有值）
          teacherComment: ['YPY', 'YQR'].includes(status) ? '完成得很好，继续保持！' : '',
          // 得分（已批阅时有值）
          score: ['YPY', 'YQR'].includes(status) ? Mock.Random.integer(30, 40) : 0,
          // 提交时间
          submitTime: status !== 'WTJ' ? '2026-03-20 14:30' : '',
        },
      }
    },
  },
  {
    url: '/api/homework/update/:id',
    method: 'put',
    response: () => {
      return {
        code: 200,
        message: '更新成功',
        data: null,
      }
    },
  },
  {
    url: '/api/homework/save',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '保存成功',
        data: { id: Mock.Random.id() },
      }
    },
  },
  // 创建作业（与 save 别名，用于兼容不同调用）
  {
    url: '/api/homework/create',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '创建成功',
        data: { id: Mock.Random.id() },
      }
    },
  },
  // 提交作业
  {
    url: '/api/homework/submit',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '提交成功',
        data: null,
      }
    },
  },
  // 批阅作业
  {
    url: '/api/homework/grade',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '批阅成功',
        data: null,
      }
    },
  },
  {
    url: '/api/homework/delete',
    method: 'delete',
    response: (options) => {
      const { ids } = options.query || {}
      console.log('[Mock] 删除作业，IDs:', ids)
      return { code: 200, message: '删除成功', data: null }
    },
  },
]
