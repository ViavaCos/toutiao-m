import request from '@/utils/request'

// 获取我的频道列表
export const getMyChannel = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
}
