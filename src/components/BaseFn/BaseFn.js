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
  // 获取cookie cookieName
  Vue.prototype.getCookie = function (megOptions) {
    let reg = RegExp(megOptions + '=([^;]+)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return arr[1]
    } else {
      return ''
    }
  }
  // 设置cookie cookieObj
  Vue.prototype.setCookie = function (megOptions) {
    let {name, value, day} = megOptions
    let date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = name + '=' + value + ';expires=' + date
  }
  // 删除cookie cookieName
  Vue.prototype.delCookie = function (megOptions) {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    document.cookie = megOptions + '=' + null + ';expires=' + date
  }
  // 字符串base64加密解密
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]
  // 加密
  Vue.prototype.base64encode = function (str) {
    var out, i, len
    var c1, c2, c3
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += base64EncodeChars.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
      out += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return out
  }
  // 解密
  Vue.prototype.base64decode = function (str) {
    var c1, c2, c3, c4
    var i, len, out
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c1 === -1)
      if (c1 === -1) break
      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c2 === -1)
      if (c2 === -1) break
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 === 61) return out
        c3 = base64DecodeChars[c3]
      }
      while (i < len && c3 === -1)
      if (c3 === -1) break
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 === 61) return out
        c4 = base64DecodeChars[c4]
      }
      while (i < len && c4 === -1)
      if (c4 === -1) break
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  }
}
export { baseFn }
