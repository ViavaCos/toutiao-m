import axios from 'axios'
import store from '@/store'
import JSONBIG from 'json-bigint'
// import router from 'vue-router'
import router from '@/router'

const instance = axios.create({
  // 设置基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  //   处理js最大安全数值
  transformResponse: [(data) => {
    try {
      return JSONBIG.parse(data)
    } catch (error) {
      return data
    }
  }]
})

// 请求拦截器
instance.interceptors.request.use((config) => {
  // 设置携带请求头
  const { token } = store.state
  // bug: 这里应该是token.token而不是token,因为只有/user下的模块发起的请求需要携带token
  // 否则你手动跳转到主页也会被重定向回登录页。。。
  if (token.token) {
    config.headers.Authorization = `Bearer ${token.token}`
  }
  //   返回配置
  return config
}, err => Promise.reject(err))

// 响应拦截器
instance.interceptors.response.use((res) => {
  // 处理响应数据
  try {
    //   返回想要的数据
    // console.log(res)
    return res.data.data
  } catch (error) {
    return res
  }
}, async err => {
  // 处理token失效问题
  // 1.判断用户是否登录
  // 1.1 否，跳转至登录页 [需回跳]
  // 1.2 是，则为token失效
  // 2. 发送请求刷新token
  // 2.1 成功，修改vuex 和 localStorage中的token
  // 重新发送失败的请求
  //  2.2 失败，跳转至登录页 [需回跳]
  if (err.response.status === 401) {
    const { token } = store.state
    // 定义回跳参数
    const redirectUrl = { path: '/login', query: { returnUrl: router.currentRoute.path } }
    // console.log('redirectUrl', redirectUrl)
    if (!token || !token.token || !token.refresh_token) {
      // 判断token是否存在
      return router.push(redirectUrl)
    }
    // 发请求刷新token
    try {
      // 捕获请求中的异常
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${token.refresh_token}`
        }
      })
      // 修改vuex和本地的token
      store.commit('setToken', { token: data.token, refresh_token: token.refresh_token })
      // 重新发送之前的请求，之前的请求存放在err.config中
      return instance(err.config)
    } catch (error) {
      // 刷新token失败,清空无效token
      store.commit('delToken')
      // 并跳回登录页[需要回跳，所以设置回跳地址]
      return router.push(redirectUrl)
    }
  }
  return Promise.reject(err)
})

// 导出处理函数
export default ({ url, method, data }) => {
  // bug:没写return
  return instance({
    url,
    method,
    // 判断是params传参还是data传参
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
