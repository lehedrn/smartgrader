import Mock from 'mockjs'

export default [
  {
    url: '/api/cockpit/data',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          totalStudents: 1258,
          totalTeachers: 86,
          totalSchools: 12,
          totalHomework: 356,
          todaySubmitRate: 94.5,
          todayGradeRate: 92.3,
          homeworkStats: {
            published: 356,
            submitted: 342,
            graded: 328,
            avgScore: 82.5,
          },
          subjectDistribution: [
            { subject: '语文', count: 125, avgScore: 85.2 },
            { subject: '数学', count: 118, avgScore: 78.5 },
            { subject: '英语', count: 113, avgScore: 83.8 },
          ],
          schoolRanking: [
            { school: '泉州市实验小学', score: 88.5, rank: 1 },
            { school: '泉州市师范附属小学', score: 86.2, rank: 2 },
            { school: '泉州市第一小学', score: 84.8, rank: 3 },
            { school: '泉州市第二小学', score: 82.5, rank: 4 },
            { school: '泉州市第三小学', score: 80.2, rank: 5 },
          ],
          teacherRanking: [
            { name: '王老师', school: '泉州市第一小学', count: 28, avgScore: 88.5 },
            { name: '李老师', school: '泉州市实验小学', count: 25, avgScore: 86.2 },
            { name: '张老师', school: '泉州市师范附属小学', count: 22, avgScore: 84.8 },
            { name: '陈老师', school: '泉州市第二小学', count: 20, avgScore: 82.5 },
            { name: '林老师', school: '泉州市第三小学', count: 18, avgScore: 80.2 },
          ],
        },
      }
    },
  },
]
