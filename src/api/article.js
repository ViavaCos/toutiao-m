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

/**
 * 不喜欢文章
 * @param {integer} target  文章Id
 */
export const disLike = (target) => {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target
    }
  })
}

/**
 * 举报文章
 * @param {integer} target 被举报的文章id
 * @param {integer} type  举报的类型
 */
export const report = (target, type) => {
  return request({
    url: '/app/v1_0/article/reports',
    method: 'post',
    data: {
      target,
      type
    }
  })
}

/**
 * 拉黑用户
 * @param {integer} target 将要拉黑的用户id
 */
export const blackList = (target) => {
  return request({
    url: '/app/v1_0/user/blacklists',
    method: 'post',
    data: {
      target
    }
  })
}

/**
 * 联想搜索
 * @param {String} q 搜索关键字
 */
export const suggest = (q) => {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'get',
    data: { q }
  })
}

/**
 *  搜索结果
 * @param {integer} page 页数
 * @param {integer} per_Page 每页数量
 * @param {integer} q 搜索关键字
 */
export const searchResult = ({ page, perPage, q }) => {
  return request({
    url: '/app/v1_0/search',
    method: 'get',
    data: { page, per_Page: perPage, q }
  })
}

/**
 *  获取文章详情
 * @param {integer} articleID  文章详情
 */
export const getArticleDetails = (articleID) => {
  // console.log(articleID)
  return request({
    url: `/app/v1_0/articles/${articleID}`,
    method: 'get'
  })
}

/**
 * 点赞文章
 * @param {integer} target  点赞的文章id
 */
export const likings = (target) => {
  return request({
    url: '/app/v1_0/article/likings',
    method: 'post',
    data: { target }
  })
}

/**
 * 取消点赞文章
 * @param {integer} target  点赞的文章id
 */
export const unLikings = (target) => {
  return request({
    url: `/app/v1_0/article/likings/${target}`,
    method: 'delete'
  })
}

/**
 * 不喜欢文章
 * @param {integer} target  不喜欢的文章id
 */
export const dislikes = (target) => {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: { target }
  })
}

/**
 * 取消不喜欢文章
 * @param {integer} target  不喜欢的文章id
 */
export const unDislikes = (target) => {
  return request({
    url: `/app/v1_0/article/dislikes/${target}`,
    method: 'delete'
  })
}

/**
 * 获取评论、回复
 * @param {String} type  评论类型
 * @param {Integer} source  文章id/评论Id
 * @param {Integer} offset  评论数据的偏移量（上一次获取到的Offset值）
 * @param {Integer} limit  获取评论的个数
 */
export const getReply = ({ type, source, offset }) => {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    data: { type, source, offset, limit: 10 }
  })
}
