/*
 * @Description:
 * @Author: lc
 * @Date: 2019-11-21 10:52:57
 * @LastEditTime: 2020-06-05 08:36:03
 * @LastEditors: lc
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import echarts from 'echarts'
import axios from './assets/js/axios'

import publicFn from './assets/js/public'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/css/style.css'
import './assets/font/iconfont.css'
import './assets/css/element-ui-reset.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Resource)
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

Vue.prototype.$public = publicFn // 公共方法
Vue.prototype.$loading = true // 公共方法
ElementUI.Dialog.props.closeOnClickModal.default = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
