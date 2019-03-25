// 全局过滤器
const vFilters = {
  // 年-月-日时间过滤器
  nowDate: function (value) {
    let currentDate = value ? new Date(value) : new Date()
    var y = currentDate.getFullYear()
    var m = currentDate.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = currentDate.getDate()
    d = d < 10 ? '0' + d : d
    return y + '-' + m + '-' + d
  },
  monthDay: function (value) {
    let currentDate = value ? new Date(value) : new Date()
    var m = currentDate.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = currentDate.getDate()
    d = d < 10 ? '0' + d : d
    return m + '-' + d
  }
}
export default vFilters
