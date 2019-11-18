import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {object} param0 channelId - 频道列表 && timestamp - 时间戳
 */
export const getArticles = ({ channelId, timestamp }) => {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    data: {
      channel_id: channelId,
      timestamp,
      with_top: 1

    }

  })
}
