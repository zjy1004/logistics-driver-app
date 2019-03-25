import Vue from 'vue'
import 'babel-polyfill'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import actions from './action'
// import getters from './getters'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    // VoucherInput
  },
  state: {
    showSetting: false
  },
  getters: {
    formatDate: state => (date) => {
      var y = new Date(date).getFullYear()
      var m = new Date(date).getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = new Date(date).getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    formatCurrentDate: state => (date) => {
      let currentDate = new Date()
      var y = currentDate.getFullYear()
      var m = currentDate.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = currentDate.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    }
  },
  // ...getters,
  ...actions,
  ...mutations,
  plugins: debug ? [createLogger()] : []
})
