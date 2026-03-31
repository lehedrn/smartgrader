import Mock from 'mockjs'

export default [
  {
    url: '/api/resource/question/list',
    method: 'get',
    response: () => {
      const list = []
      const types = ['选择题', '填空题', '判断题', '简答题', '计算题', '应用题']
      const subjects = ['语文', '数学', '英语']
      const difficulties = ['容易', '中等', '困难']

      for (let i = 0; i < 20; i++) {
        list.push({
          id: String(i + 1),
          title: Mock.Random.ctitle(20, 50),
          type: Mock.Random.pick(types),
          subject: Mock.Random.pick(subjects),
          difficulty: Mock.Random.pick(difficulties),
          knowledge: Mock.Random.ctitle(2, 5) + '知识点',
          grade: Mock.Random.pick(['三年级', '四年级', '五年级', '六年级']),
          source: Mock.Random.pick(['校本题库', '区域题库', '导入题目']),
          creator: Mock.Random.cname(),
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        })
      }
      return {
        code: 200,
        message: 'success',
        data: { list, total: 156 },
      }
    },
  },
  {
    url: '/api/resource/question/queryById',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          id: '1',
          title: '下列词语中注音正确的一项是？',
          type: '选择题',
          subject: '语文',
          difficulty: '中等',
          knowledge: '字音字形',
          grade: '三年级',
          options: ['A. 参差（cēn cī）', 'B. 参差（cān chā）', 'C. 参差（cān cī）'],
          answer: 'A',
          analysis: '参差的正确读音是 cēn cī',
          source: '校本题库',
          creator: '王老师',
          createTime: '2026-03-15 10:30:00',
        },
      }
    },
  },
  {
    url: '/api/resource/question/save',
    method: 'post',
    response: () => {
      return { code: 200, message: '保存成功', data: { id: Mock.Random.id() } }
    },
  },
  {
    url: '/api/resource/question/delete',
    method: 'delete',
    response: () => {
      return { code: 200, message: '删除成功', data: null }
    },
  },
]
