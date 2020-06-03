/*
 * @Description: 
 * @Author: lc
 * @Date: 2020-06-03 09:57:26
 * @LastEditTime: 2020-06-03 10:16:56
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

console.log(321)
console.log(`App v${process.env.VUE_APP_VERSION} is running`)