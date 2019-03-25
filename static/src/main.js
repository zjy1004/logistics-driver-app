// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import { ToastPlugin, Cell } from 'vux'
import store from './store/index'
import './assets/iconfont/iconfont.css'
import '@/style/reset.less'
import './style/base.less'
import './style/common-compont-css.css'
import { baseFn } from './components/BaseFn/BaseFn'
import vFilters from './tools/vFilters'
import animated from 'animate.css'
// import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(baseFn)
Vue.use(ToastPlugin)
Vue.use(Cell)
Vue.use(animated)
// Vue.use(MintUI)

for (let filter in vFilters) {
  Vue.filter(filter, vFilters[filter])
}

Vue.config.productionTip = false

window.onresize = setHtmlFontSize
function setHtmlFontSize () {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
  const htmlDom = document.getElementsByTagName('html')[0]
  htmlDom.style.fontSize = htmlWidth / 10 + 'px'
}
setHtmlFontSize()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
