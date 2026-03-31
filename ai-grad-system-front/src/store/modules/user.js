import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/auth'
import { setToken, getToken, removeToken, setUserInfo } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: null,
    roles: [],
    permissions: [],
  }),

  getters: {
    userId: (state) => state.userInfo?.id || '',
    username: (state) => state.userInfo?.username || '',
    realName: (state) => state.userInfo?.realName || '',
    avatar: (state) => state.userInfo?.avatar || '',
    organization: (state) => state.userInfo?.organization || '',
  },

  actions: {
    // 登录
    async login(loginForm) {
      try {
        const { data } = await login(loginForm)
        setToken(data.token)
        this.token = data.token
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 获取用户信息
    async getInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data
        setUserInfo(data)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 退出登录
    async logout() {
      try {
        await logout()
      } finally {
        this.token = ''
        this.userInfo = null
        this.roles = []
        this.permissions = []
        removeToken()
      }
    },

    // 重置
    reset() {
      this.token = ''
      this.userInfo = null
      this.roles = []
      this.permissions = []
      removeToken()
    },
  },

  persist: {
    key: 'smart_grad_user',
    storage: localStorage,
    paths: ['token', 'userInfo'],
  },
})
