/*
 * @Description: 
 * @Author: lc
 * @Date: 2020-06-03 10:16:22
 * @LastEditTime: 2020-06-03 16:39:58
 * @LastEditors: lc
 */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import echarts from 'echarts'
import axios from './assets/js/axios'
import publics from './assets/js/public'
import IntroJs from 'intro.js'

import 'intro.js/introjs.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/css/element-ui-reset.scss'
import './assets/css/style.scss'
import './assets/font/iconfont.css'

Vue.config.productionTip = false
ElementUI.Dialog.props.modalAppendToBody.default = false
ElementUI.Dialog.props.closeOnClickModal.default = false

Vue.use(ElementUI, { size: 'small' })
Vue.use(IntroJs)
Vue.prototype.$IntroJs = IntroJs
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.$public = publics

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')