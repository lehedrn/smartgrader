import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.roleCode - 角色编码（可选）
 * @param {string} params.roleName - 角色名称（可选）
 * @returns {Promise}
 */
export function getRoleList(params) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params,
  })
}

/**
 * 获取角色详情
 * @param {string} id - 角色 ID
 * @returns {Promise}
 */
export function getRoleDetail(id) {
  return request({
    url: '/system/role/queryById',
    method: 'get',
    params: { id },
  })
}

/**
 * 获取所有角色
 * @returns {Promise}
 */
export function getAllRoles() {
  return request({
    url: '/system/role/listAll',
    method: 'get',
  })
}

/**
 * 保存角色
 * @param {Object} data - 角色信息
 * @returns {Promise}
 */
export function saveRole(data) {
  return request({
    url: '/system/role/save',
    method: 'post',
    data,
  })
}

/**
 * 更新角色
 * @param {Object} data - 角色信息
 * @returns {Promise}
 */
export function updateRole(data) {
  return request({
    url: '/system/role/update',
    method: 'put',
    data,
  })
}

/**
 * 删除角色
 * @param {string} ids - 角色 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function deleteRole(ids) {
  return request({
    url: '/system/role/delete',
    method: 'delete',
    params: { ids },
  })
}
