/*
 * @Description: router
 * @Author: lc
 * @Date: 2019-12-19 16:13:36
 * @LastEditTime: 2020-06-03 15:36:36
 * @LastEditors: lc
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
