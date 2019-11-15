import request from '@/utils/request'

/**
 * 登录
 * @param {Object} param0  传递的参数
 */
export const login = (data) => {
  // bug:没有返回数据
  return request({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data
  })
}
