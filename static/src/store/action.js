import LoginAjax from '@/api/Login/Login'

const actions = {
  rolePermissionFn ({state, commit, rootState}) {
    LoginAjax.QueryMenus().then((response) => {
      if (response.code === 200) {
        commit('setMenuData', {menuData: response.data})
      }
    })
  },
  formatPeriod (data) {
    // 期间格式化发方法
    let formatStart = data.start.slice(0, 7).split('-').join('年')
    let formatEnd = data.end.slice(0, 7).split('-').join('年')
    if (formatStart === formatEnd) {
      this.periodContent = `${formatStart}期`
    } else {
      this.periodContent = `${formatStart}期 至 ${formatEnd}期`
    }
    this.periodData = data
  }
}

export default {
  actions
}
