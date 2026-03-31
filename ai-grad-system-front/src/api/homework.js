import request from '@/utils/request'

/**
 * 获取作业列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.subject - 科目（可选）
 * @param {string} params.type - 作业类型（可选）
 * @param {string} params.className - 班级名称（可选）
 * @returns {Promise}
 */
export function getHomeworkList(params) {
  return request({
    url: '/homework/list',
    method: 'get',
    params,
  })
}

/**
 * 获取作业详情
 * @param {string} id - 作业 ID
 * @returns {Promise}
 */
export function getHomeworkDetail(id) {
  return request({
    url: `/homework/detail/${id}`,
    method: 'get',
  })
}

/**
 * 创建作业
 * @param {Object} data - 作业信息
 * @returns {Promise}
 */
export function createHomework(data) {
  return request({
    url: '/homework/create',
    method: 'post',
    data,
  })
}

/**
 * 更新作业
 * @param {string} id - 作业 ID
 * @param {Object} data - 作业信息
 * @returns {Promise}
 */
export function updateHomework(id, data) {
  return request({
    url: `/homework/update/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除作业
 * @param {string} ids - 作业 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function deleteHomework(ids) {
  return request({
    url: '/homework/delete',
    method: 'delete',
    params: { ids },
  })
}

/**
 * 提交作业
 * @param {Object} data - 提交信息
 * @returns {Promise}
 */
export function submitHomework(data) {
  return request({
    url: '/homework/submit',
    method: 'post',
    data,
  })
}

/**
 * 批阅作业
 * @param {Object} data - 批阅信息
 * @returns {Promise}
 */
export function gradeHomework(data) {
  return request({
    url: '/homework/grade',
    method: 'post',
    data,
  })
}
