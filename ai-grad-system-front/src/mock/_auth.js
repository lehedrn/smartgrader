import Mock from 'mockjs'

export default [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    response: (options) => {
      const { username, password } = options.body
      if (username === 'admin' && password === 'admin123') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: Mock.Random.guid(),
            expires: 7 * 24 * 60 * 60,
          },
        }
      }
      return {
        code: 401,
        message: '账号或密码错误',
        data: null,
      }
    },
  },
  // 获取用户信息
  {
    url: '/api/auth/userinfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          id: '1',
          username: 'admin',
          realName: '管理员',
          avatar: '',
          organization: '泉州市教育局',
          roles: ['admin'],
          permissions: ['*:*:*'],
        },
      }
    },
  },
  // 退出登录
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '退出成功',
        data: null,
      }
    },
  },
  // 修改密码
  {
    url: '/api/auth/password',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '密码修改成功',
        data: null,
      }
    },
  },
]
