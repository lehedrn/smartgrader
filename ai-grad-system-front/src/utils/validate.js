// 表单验证工具

/**
 * 验证邮箱
 */
export function isEmail(value) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(value)
}

/**
 * 验证手机号
 */
export function isPhone(value) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(value)
}

/**
 * 验证身份证
 */
export function isIdCard(value) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(value)
}

/**
 * 验证 URL
 */
export function isUrl(value) {
  const reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return reg.test(value)
}

/**
 * 验证 IP 地址
 */
export function isIp(value) {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(value)
}

/**
 * 验证是否为空
 */
export function isEmpty(value) {
  return value === null || value === undefined || value === ''
}

/**
 * 验证长度
 */
export function isLength(value, min, max) {
  if (isEmpty(value)) return false
  const len = String(value).length
  if (min !== undefined && len < min) return false
  if (max !== undefined && len > max) return false
  return true
}

/**
 * 验证数字
 */
export function isNumber(value) {
  const reg = /^\d+\.?\d*$/
  return reg.test(value)
}

/**
 * 验证整数
 */
export function isInteger(value) {
  const reg = /^\d+$/
  return reg.test(value)
}
