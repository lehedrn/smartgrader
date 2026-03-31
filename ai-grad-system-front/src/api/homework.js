import request from '@/utils/request'

/**
 * 获取作业列表
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
 */
export function getHomeworkDetail(id) {
  return request({
    url: `/homework/detail/${id}`,
    method: 'get',
  })
}

/**
 * 创建作业
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
 */
export function gradeHomework(data) {
  return request({
    url: '/homework/grade',
    method: 'post',
    data,
  })
}
