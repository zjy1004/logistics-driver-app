// JS获取最近三天和最近3天日期
function getDay (day) {
  var today = new Date()
  var targetday = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth (month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
export {getDay}
