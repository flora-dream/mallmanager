import Vue from 'vue'
import Router from 'vue-router'
// @会自动找到src文件夹下文件
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Test from '@/components/test.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: 'users',
          component: Users
        }
      ]
    },
    {
      name: 'test',
      path: '/test',
      component: Test
    }

  ]
})
