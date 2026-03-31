import request from '@/utils/request'

/**
 * 获取题库列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.subject - 科目（可选）
 * @param {string} params.type - 题目类型（可选）
 * @param {string} params.difficulty - 难度（可选）
 * @param {string} params.knowledge - 知识点（可选）
 * @returns {Promise}
 */
export function getQuestionList(params) {
  return request({
    url: '/resource/question/list',
    method: 'get',
    params,
  })
}

/**
 * 获取题目详情
 * @param {string} id - 题目 ID
 * @returns {Promise}
 */
export function getQuestionDetail(id) {
  return request({
    url: '/resource/question/queryById',
    method: 'get',
    params: { id },
  })
}

/**
 * 保存题目
 * @param {Object} data - 题目信息
 * @returns {Promise}
 */
export function saveQuestion(data) {
  return request({
    url: '/resource/question/save',
    method: 'post',
    data,
  })
}

/**
 * 更新题目
 * @param {Object} data - 题目信息
 * @returns {Promise}
 */
export function updateQuestion(data) {
  return request({
    url: '/resource/question/update',
    method: 'put',
    data,
  })
}

/**
 * 删除题目
 * @param {string} ids - 题目 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function deleteQuestion(ids) {
  return request({
    url: '/resource/question/delete',
    method: 'delete',
    params: { ids },
  })
}

/**
 * 导出题目
 * @param {Object} params - 查询参数
 * @param {string} params.subject - 科目（可选）
 * @param {string} params.type - 题目类型（可选）
 * @returns {Promise}
 */
export function exportQuestion(params) {
  return request({
    url: '/resource/question/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
