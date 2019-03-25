const mutations = {
  // 个人中心显示状态更新
  updatePersonSettingShow (state, options) {
    let {showSetting} = options
    state.showSetting = showSetting
  }
}

export default {
  mutations
}
