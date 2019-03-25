let baseFn = {}
baseFn.install = function (Vue, options) {
  // 格式化月-日
  Vue.prototype.formatMonthDay = function (megOptions) {
    let m = new Date(megOptions).getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = new Date(megOptions).getDate()
    d = d < 10 ? '0' + d : d
    return m + '-' + d
  }
  Vue.prototype.isIphoneX = function () {
    return /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
  }
  // 获取某天日期
  Vue.prototype.getDateStr = function (megOptions) {
    let dd = new Date()
    dd.setDate(dd.getDate() + megOptions) // 获取AddDayCount天后的日期
    let y = dd.getFullYear()
    let m = (dd.getMonth() + 1).toString().padStart(2, '0') // 获取当前月份的日期
    let d = dd.getDate().toString().padStart(2, '0')
    return y + '-' + m + '-' + d
  }
  // 获取手机型号
  Vue.prototype.getPhoneInfo = function () {
    let app = navigator.appVersion
    // 根据括号进行分割
    let left = app.indexOf('(')
    let right = app.indexOf(')')
    let str = app.substring(left + 1, right)
    // console.log(str+'裁剪过后的')
    let Str = str.split(';')
    // 手机型号--苹果 iPhone
    let mobileIphone = Str[0]
    // 手机型号--安卓
    let mobileAndroid = Str[2]
    // 红米手机等特殊型号处理 匹配字符
    let res = /Android/
    let reslut = res.test(mobileAndroid)
    // 根据设备型号判断设备系统
    if (mobileIphone === 'iPhone') {
      console.log('访问设备型号' + mobileIphone + '系统版本' + Str[1].substring(4, 19))
      return 'iPhone'
    } else if (mobileAndroid === 'Linux') {
      if (reslut) {
        console.log('访问设备型号' + Str[4].substring(0, 9) + '系统版本' + Str[2])
        return Str[4].substring(0, 9)
      } else {
        console.log('访问设备型号' + mobileAndroid.substring(0, 9) + '系统版本' + Str[1])
        return mobileAndroid.substring(0, 9)
      }
    } else if (mobileIphone === 'iPad') {
      console.log('访问设备' + Str[0] + '系统版本' + Str[1].substring(4, 12))
      return 'iPad'
    }
  }
}
export { baseFn }
