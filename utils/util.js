const STATIC_URL = 'https://statics.zhuishushenqi.com'
const CONTENT_URL = 'https://chapter2.zhuishushenqi.com/chapter/'

function getImageUrl(url) { // 获取图片地址
  return STATIC_URL + url
}
function getContentUrl(url) { // 获取内容地址
  return CONTENT_URL + url
}

function getUpdateTime (dateStr) {
  if (!dateStr) return ''
  let date = new Date(dateStr)
  let now = new Date()
  let time = Math.round((now.getTime() - date.getTime()) / 1000)
  if (time < 60) {
    return `${time} 秒前更新`
  } else {
    time = Math.round(time / 60)
    if (time < 60) {
      return `${time} 分前更新`
    } else {
      time = Math.round(time / 60)
      if (time < 24) {
        return `${time} 小时前更新`
      } else {
        time = Math.round(time / 24)
        return `${time} 天前更新`
      }
    }
  }
}
module.exports = {
  getUpdateTime: getUpdateTime,
  getImageUrl: getImageUrl,
  getContentUrl: getContentUrl
}
