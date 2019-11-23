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

/**
 *  关注用户
 * @param {*integer} target 用户id
 */
export const following = (target) => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'post',
    data: { target }
  })
}

/**
 *  取消关注用户
 * @param {*integer} target 用户id
 */
export const unFollowing = (target) => {
  return request({
    url: `/app/v1_0/user/followings/${target}`,
    method: 'delete'
  })
}
