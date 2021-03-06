// 定义字段名
const USER_KEY = 'toutiao-m'

// 获取
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}

// 设置
export const setUser = data => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

// 删除
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
