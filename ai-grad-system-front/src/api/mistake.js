import request from '@/utils/request'

/**
 * 获取错题列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.studentId - 学生 ID（可选）
 * @param {string} params.subject - 科目（可选）
 * @param {number} params.mastered - 是否已掌握（可选）
 * @returns {Promise}
 */
export function getMistakeList(params) {
  return request({
    url: '/mistake/list',
    method: 'get',
    params,
  })
}

/**
 * 获取错题详情
 * @param {string} id - 错题 ID
 * @returns {Promise}
 */
export function getMistakeDetail(id) {
  return request({
    url: '/mistake/queryById',
    method: 'get',
    params: { id },
  })
}

/**
 * 保存错题
 * @param {Object} data - 错题信息
 * @returns {Promise}
 */
export function saveMistake(data) {
  return request({
    url: '/mistake/save',
    method: 'post',
    data,
  })
}

/**
 * 更新错题
 * @param {Object} data - 错题信息
 * @returns {Promise}
 */
export function updateMistake(data) {
  return request({
    url: '/mistake/update',
    method: 'put',
    data,
  })
}

/**
 * 删除错题
 * @param {string} ids - 错题 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function deleteMistake(ids) {
  return request({
    url: '/mistake/delete',
    method: 'delete',
    params: { ids },
  })
}

/**
 * 标记已掌握
 * @param {string} ids - 错题 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function markMastered(ids) {
  return request({
    url: '/mistake/markMastered',
    method: 'put',
    params: { ids },
  })
}
