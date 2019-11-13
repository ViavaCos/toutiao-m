import Vue from 'vue'
import VueRouter from 'vue-router'

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
      { path: '/', component: Home },
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
  { path: '/article', component: Article }
]

const router = new VueRouter({
  routes
})

export default router
