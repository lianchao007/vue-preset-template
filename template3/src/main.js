import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Resource from 'vue-resource'
import ElementUI from 'element-ui'
import publicFn from './assets/js/public'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/css/style.css'
import './assets/font/iconfont.css'
import './assets/css/element-ui-reset.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Resource)
Vue.prototype.$public = publicFn // 公共方法
Vue.prototype.$loading = true // 公共方法
ElementUI.Dialog.props.closeOnClickModal.default = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
