import request from '@/utils/request'

/**
 * 获取知识点列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.subject - 科目（可选）
 * @param {string} params.grade - 年级（可选）
 * @returns {Promise}
 */
export function getKnowledgeList(params) {
  return request({
    url: '/resource/knowledge/list',
    method: 'get',
    params,
  })
}

/**
 * 获取知识点详情
 * @param {string} id - 知识点 ID
 * @returns {Promise}
 */
export function getKnowledgeDetail(id) {
  return request({
    url: '/resource/knowledge/queryById',
    method: 'get',
    params: { id },
  })
}

/**
 * 获取所有知识点
 * @returns {Promise}
 */
export function getAllKnowledges() {
  return request({
    url: '/resource/knowledge/listAll',
    method: 'get',
  })
}

/**
 * 保存知识点
 * @param {Object} data - 知识点信息
 * @returns {Promise}
 */
export function saveKnowledge(data) {
  return request({
    url: '/resource/knowledge/save',
    method: 'post',
    data,
  })
}

/**
 * 更新知识点
 * @param {Object} data - 知识点信息
 * @returns {Promise}
 */
export function updateKnowledge(data) {
  return request({
    url: '/resource/knowledge/update',
    method: 'put',
    data,
  })
}

/**
 * 删除知识点
 * @param {string} ids - 知识点 ID 列表（逗号分隔）
 * @returns {Promise}
 */
export function deleteKnowledge(ids) {
  return request({
    url: '/resource/knowledge/delete',
    method: 'delete',
    params: { ids },
  })
}
