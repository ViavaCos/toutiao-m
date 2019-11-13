import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant
import Vant from 'vant'
// 引入amfe-flexible
import 'amfe-flexible'
// 引入全局样式
import 'vant/lib/index.css'
import '@/styles/index.less'
// 使用vant
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
