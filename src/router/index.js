import Vue from 'vue'
import Router from 'vue-router'
// @会自动找到src文件夹下文件
import Login from '@/components/login/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
