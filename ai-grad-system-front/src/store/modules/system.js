import { defineStore } from 'pinia'
import settings from '@/settings'

export const useSystemStore = defineStore('system', {
  state: () => ({
    title: settings.title,
    sidebarOpened: settings.sidebar.defaultOpened,
    device: 'desktop',
    visitedViews: [],
    cachedViews: [],
    messages: [],
    unreadCount: 0,
  }),

  getters: {
    sidebarWidth: (state) => {
      return state.sidebarOpened ? settings.layout.sidebarWidth : '54px'
    },

    visitedViewPaths: (state) => {
      return state.visitedViews.map(view => view.path)
    },
  },

  actions: {
    // 初始化系统设置
    initSettings() {
      // 加载系统配置
    },

    // 切换侧边栏
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened
    },

    // 关闭侧边栏
    closeSidebar() {
      this.sidebarOpened = false
    },

    // 设置设备类型
    setDevice(device) {
      this.device = device
    },

    // 添加访问过的视图
    addVisitedView(view) {
      if (view.meta?.hidden) return
      if (this.visitedViews.some(v => v.path === view.path)) return
      this.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta?.title || '',
        icon: view.meta?.icon || '',
        meta: { affix: view.meta?.affix || false },
      })
    },

    // 关闭视图
    closeView(view) {
      const { visitedViews, cachedViews } = this
      const index = visitedViews.findIndex(v => v.path === view.path)
      if (index !== -1) {
        visitedViews.splice(index, 1)
        const cachedIndex = cachedViews.findIndex(v => v === view.name)
        if (cachedIndex !== -1) {
          cachedViews.splice(cachedIndex, 1)
        }
      }
    },

    // 关闭其他视图
    closeOtherViews(view) {
      this.visitedViews = this.visitedViews.filter(v =>
        v.path === view.path || v.meta.affix
      )
    },

    // 关闭全部视图
    closeAllViews() {
      this.visitedViews = this.visitedViews.filter(v => v.meta.affix)
      this.cachedViews = []
    },

    // 添加缓存视图
    addCachedView(view) {
      if (this.cachedViews.includes(view.name)) return
      this.cachedViews.push(view.name)
    },

    // 移除缓存视图
    removeCachedView(view) {
      const index = this.cachedViews.indexOf(view.name)
      if (index !== -1) {
        this.cachedViews.splice(index, 1)
      }
    },

    // 设置消息
    setMessages(messages) {
      this.messages = messages
      this.unreadCount = messages.filter(m => !m.read).length
    },

    // 标记消息为已读
    markMessageAsRead(messageId) {
      const message = this.messages.find(m => m.id === messageId)
      if (message) {
        message.read = true
        this.unreadCount = this.messages.filter(m => !m.read).length
      }
    },

    // 标记全部已读
    markAllAsRead() {
      this.messages.forEach(m => m.read = true)
      this.unreadCount = 0
    },
  },

  persist: {
    key: 'smart_grad_system',
    storage: localStorage,
    paths: ['sidebarOpened'],
  },
})
