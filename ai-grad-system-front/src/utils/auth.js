import Cookies from 'js-cookie'

const TOKEN_KEY = 'smart_grad_token'
const USER_INFO_KEY = 'smart_grad_user_info'

// 获取 token
export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

// 设置 token
export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 天过期
    path: '/',
  })
}

// 删除 token
export function removeToken() {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(USER_INFO_KEY)
}

// 获取用户信息
export function getUserInfo() {
  const userInfo = Cookies.get(USER_INFO_KEY)
  if (userInfo) {
    try {
      return JSON.parse(userInfo)
    } catch (e) {
      return null
    }
  }
  return null
}

// 设置用户信息
export function setUserInfo(userInfo) {
  return Cookies.set(USER_INFO_KEY, JSON.stringify(userInfo), {
    expires: 7,
    path: '/',
  })
}
