import request from '@/utils/request'
import store from '@/store'

const CHANNEL_KEY = 'toutiao-m-channel'

// 获取我的频道列表
export const getMyChannel = () => {
  return new Promise(async (resolve, reject) => {
    const { token } = store.state

    // 判断用户状态：是否已登录
    if (token.token) {
      const { channels } = await request({
        url: '/app/v1_0/user/channels',
        method: 'get'
      })
      // console.log(data)
      // 返回数据
      resolve(channels)
    } else {
      // 未登录
      const localChannel = window.localStorage.getItem(CHANNEL_KEY)
      // 判断本地是否已存储频道信息
      if (!localChannel) {
        // 未存储
        const { channels } = await request({
          url: '/app/v1_0/user/channels',
          method: 'get'
        })
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels))
        // console.log('未存储', data)
        resolve(channels)
      } else {
        // 已存储
        // console.log('已存储', localChannel)
        resolve(JSON.parse(localChannel))
      }
    }
  })
}

/**
 * 获取全部频道列表
 */
export const getAllChannel = () => {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}

/**
 * 删除频道
 * @param {integer} channelID 频道id
 */
export const delChannel = (channelID) => {
  return new Promise(async (resolve, reject) => {
    const { token } = store.state

    // 判断用户状态：是否已登录
    if (token.token) {
      const data = await request({
        url: `/app/v1_0/user/channels/${channelID}`,
        method: 'DELETE'
      })
      // 返回数据
      resolve(data)
    } else {
      // 未登录
      const localChannel = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
      const index = localChannel.findIndex(item => item.id === channelID)
      localChannel.splice(index, 1)

      window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannel))

      // console.log(localChannel)
      // console.log(channelID)
      resolve()
    }
  })
}

/**
 * 添加频道
 * @param {object} param0 频道中的单个对象
 * @param {integer} seq 可选频道索引
 */
export const addChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    const { token } = store.state

    // 判断用户状态：是否已登录
    if (token.token) {
      await request({
        url: `/app/v1_0/user/channels`,
        method: 'put',
        data: { channels: orderChannels }
      })
      resolve()
    } else {
      const localChannel = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
      const { id, name } = orderChannels[orderChannels.length - 1]
      localChannel.push({ id, name })
      window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannel))
      // 必须返回一个状态，否则页面莫得反应
      resolve()
    }
  })
}
