import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const UserProfile = () => import('@/views/user/profile')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login')
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/home/article')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home, meta: { keepAlive: true } },
      { path: '/question', component: Question },
      { path: '/video', component: Video },
      { path: '/user', component: User }
    ]
  },
  { path: '/user/profile', component: UserProfile },
  { path: '/user/chat', component: UserChat },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/search/result', component: SearchResult },
  { path: '/article', component: Article, meta: { keepAlive: true } }
]

const router = new VueRouter({
  routes
})

// 导航守卫 -- 访问权限控制
router.beforeEach((to, from, next) => {
  // window.console.log(store.state.token)
  const { token } = store.state
  // 判断前往路由是否在user模块下且token不存在
  if (to.path.startsWith('/user') && (!token || !token.token)) {
  // if (to.path.startsWith('/user') && !token.token) {
    // 如果token不存在，记录去哪并重定向至登录页
    return next({ path: '/login', query: { returnUrl: to.path } })
  }
  next()
})

export default router
