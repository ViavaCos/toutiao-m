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

/**
 *  获取用户个人信息
 */
export const getUserInfo = () => {
  return request({
    url: '/app/v1_0/user',
    method: 'get'
  })
}

/**
 * 获取用户编辑信息
 */
export const getUserEditInfo = () => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'get'
  })
}

/**
 * 上传头像
 * @param {FormData} formData  图片对象
 */
export const uploadPhoto = (formData) => {
  return request({
    url: '/app/v1_0/user/photo',
    method: 'patch',
    data: formData
  })
}

/**
 * 上传用户信息
 * @param {String} name 姓名
 * @param {String} gender 性别
 * @param {String} birthday 出生日期
 */
export const uploadUserInfo = (name, gender, birthday) => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'patch',
    data: {
      name,
      gender,
      birthday
    }
  })
}
