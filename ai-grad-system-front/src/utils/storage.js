// 本地存储工具类

const STORAGE_PREFIX = 'smart_grad_'

// localStorage 操作
export const storage = {
  // 设置存储
  set(key, value) {
    try {
      const stringValue = typeof value === 'string'
        ? value
        : JSON.stringify(value)
      localStorage.setItem(STORAGE_PREFIX + key, stringValue)
    } catch (e) {
      console.error('LocalStorage set error:', e)
    }
  },

  // 获取存储
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(STORAGE_PREFIX + key)
      if (value === null) return defaultValue
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    } catch (e) {
      console.error('LocalStorage get error:', e)
      return defaultValue
    }
  },

  // 删除存储
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (e) {
      console.error('LocalStorage remove error:', e)
    }
  },

  // 清空存储
  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.error('LocalStorage clear error:', e)
    }
  },
}

// sessionStorage 操作
export const session = {
  set(key, value) {
    try {
      const stringValue = typeof value === 'string'
        ? value
        : JSON.stringify(value)
      sessionStorage.setItem(STORAGE_PREFIX + key, stringValue)
    } catch (e) {
      console.error('SessionStorage set error:', e)
    }
  },

  get(key, defaultValue = null) {
    try {
      const value = sessionStorage.getItem(STORAGE_PREFIX + key)
      if (value === null) return defaultValue
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    } catch (e) {
      console.error('SessionStorage get error:', e)
      return defaultValue
    }
  },

  remove(key) {
    try {
      sessionStorage.removeItem(STORAGE_PREFIX + key)
    } catch (e) {
      console.error('SessionStorage remove error:', e)
    }
  },
}
