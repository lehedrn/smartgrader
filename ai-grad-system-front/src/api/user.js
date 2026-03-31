import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.username - 用户名（可选）
 * @param {string} params.realName - 真实姓名（可选）
 * @param {string} params.userType - 用户类型（可选）
 * @param {string} params.status - 状态（可选）
 * @returns {Promise}
 */
export function getUserList(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params,
  })
}

/**
 * 获取用户详情
 * @param {string} id - 用户 ID
 * @returns {Promise}
 */
export function getUserDetail(id) {
  return request({
    url: '/system/user/queryById',
    method: 'get',
    params: { id },
  })
}

/**
 * 保存用户
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export function saveUser(data) {
  return request({
    url: '/system/user/save',
    method: 'post',
    data,
  })
}

/**
 * 更新用户
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export function updateUser(data) {
  return request({
    url: '/system/user/update',
    method: 'put',
    data,
  })
}

/**
 * 删除用户
 * @param {string} ids - 用户 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function deleteUser(ids) {
  return request({
    url: '/system/user/delete',
    method: 'delete',
    params: { ids },
  })
}

/**
 * 重置密码
 * @param {string} id - 用户 ID
 * @returns {Promise}
 */
export function resetPassword(id) {
  return request({
    url: '/system/user/resetPassword',
    method: 'post',
    params: { id },
  })
}
