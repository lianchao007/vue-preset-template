/*
 * @Description: 
 * @Author: lc
 * @Date: 2020-06-03 10:16:22
 * @LastEditTime: 2020-06-03 14:38:07
 * @LastEditors: lc
 */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')