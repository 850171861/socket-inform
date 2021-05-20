import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Send from '../views/Send.vue'
import store from '@/store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/send',
    name: 'Send',
    component: Send
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  

  if (!store.state.ws && store.state.token !== '') {
        store.commit('initWebSocket', {})
    }
    next()
})

// 解决-重定向当前路由时会有警告
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}


export default router
