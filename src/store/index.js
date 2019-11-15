import Vue from 'vue'
import Vuex from 'vuex'
// 批量导入指定成员导出的方法
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: auth.getUser()
  },
  mutations: {
    // 设置token  data 为对象
    setToken (state, data) {
      console.log('***', data)
      // 设置给state中的数据
      state.token = data
      // 修改本地存储中的token
      auth.setUser(data)
    },
    // 删除token
    delToken (state) {
      // 清空state中的数据
      state.token = {}
      // 清空本地存储
      auth.delUser()
    }
  },
  actions: {

  }
})
