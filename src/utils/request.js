import axios from 'axios'
import store from '@/store'
import JSONBIG from 'json-bigint'

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
  config.headers.Authorization = `Bearer ${store.state.token.token}`
  //   返回配置
  return config
}, err => Promise.reject(err))

// 响应拦截器
instance.interceptors.response.use((res) => {
  // 处理响应数据
  try {
    //   返回想要的数据
    return res.data.data
  } catch (error) {
    return res
  }
})

// 导出处理函数
export default (url, method, data) => {
  instance({
    url,
    method,
    // 判断是params传参还是data传参
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
