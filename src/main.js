import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant 和懒加载
import Vant, { Lazyload } from 'vant'
// 引入amfe-flexible
import 'amfe-flexible'
// 引入全局样式
import 'vant/lib/index.less'
import '@/styles/index.less'
// 引入自己定义的插件
import plugin from '@/utils/plugin'
// 使用vant
Vue.use(Vant)
// 使用懒加载
Vue.use(Lazyload)
// 使用自己定义好的插件
Vue.use(plugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
