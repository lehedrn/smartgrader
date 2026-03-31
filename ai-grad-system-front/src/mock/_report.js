import Mock from 'mockjs'

export default [
  {
    url: '/api/report/class',
    method: 'get',
    response: () => {
      const classList = []
      for (let i = 0; i < 6; i++) {
        classList.push({
          className: `三年 (${i + 1}) 班`,
          studentCount: Mock.Random.integer(40, 50),
          avgScore: Mock.Random.integer(75, 90),
          passRate: Mock.Random.integer(85, 98),
          excellentRate: Mock.Random.integer(30, 50),
          homeworkCount: Mock.Random.integer(15, 25),
        })
      }
      return {
        code: 200,
        message: 'success',
        data: {
          classList,
          gradeAvgScore: 82.5,
          gradePassRate: 92.3,
          gradeExcellentRate: 38.5,
        },
      }
    },
  },
  {
    url: '/api/report/person',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          studentName: '张明',
          className: '三年 (1) 班',
          studentId: '20260001',
          totalTime: 1280,
          homeworkCount: 24,
          avgScore: 88.5,
          subjectRadar: [
            { subject: '语文', score: 85, avg: 82 },
            { subject: '数学', score: 92, avg: 85 },
            { subject: '英语', score: 88, avg: 80 },
          ],
          trend: [
            { date: '03-01', score: 85 },
            { date: '03-08', score: 88 },
            { date: '03-15', score: 90 },
            { date: '03-22', score: 87 },
            { date: '03-29', score: 92 },
          ],
        },
      }
    },
  },
]
