const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf8'
  },
  transformRequest: [function (data, headers) {
    let result = ''
    Object.keys(data).forEach(key => {
      result += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`
    })
    return result.substring(-1, result.length - 1)
  }]
}
export default config
