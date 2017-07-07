//app.js
const STATIC_URL = 'https://statics.zhuishushenqi.com'
const CONTENT_URL = 'https://chapter2.zhuishushenqi.com/chapter/'
App({
  data: { // 全局变量 (当vuex来用)
    bookcase: {}, // 书架
    currentBook: {}, // 当前正在浏览的书籍
    sources: {}, // 书源  
    chapters: {} // 书籍目录
  },
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    this.data.bookcase = wx.getStorageSync('bookcase') || {}
    this.data.chapters = wx.getStorageSync('chapters') || {}
  },
  selectBook(book) { // 添加书籍到当前正在阅读的数据
    this.data.currentBook = {
      _id: book._id,
      title: book.title,
      cover: book.cover,
      updated: book.updated,
      lastChapter: book.lastChapter,
      currentChapter: book.currentChapter || 0,
      chaptersCount: book.chaptersCount // 总章节数
    }
  },
  addBook (book) { // 添加书籍到书架
    this.data.bookcase[book._id] = {
      _id: book._id,
      title: book.title,
      cover: book.cover,
      updated: book.updated,
      lastChapter: book.lastChapter,
      currentChapter: 0,
      chaptersCount: book.chaptersCount, // 总章节数 (ps.该总章节数 数值可能有问题) <!-- TODO -->
      isUpdate: false // 是否有更新 (新加入书架的书籍都为没有更新)
    }
    wx.setStorageSync('bookcase', this.data.bookcase)
  },
  getBook(id) {
    return this.data.bookcase[id] || {}
  },
  deleteBook(id) { // 从书架中删除某本书架
    delete this.data.bookcase[id]
    wx.setStorageSync('bookcase', this.data.bookcase)
  },
  addSource(bookid, source) { // 增加/修改 书源信息
    this.data.sources[bookid] = source
  },
  getSource(bookid) { // 获取某本书的书源
    return this.data.sources[bookid] || []
  },
  addChapters(bookid, chapters) { // 增加/修改 章节目录
    this.data.chapters[bookid] = chapters
    wx.setStorageSync('chapters', this.data.chapters) // 缓存章节目录
  },
  getChapters(bookid) { // 获取某本书的章节目录
    return this.data.chapters[bookid] || []
  },
  getImageUrl(url) { // 获取图片地址
    return STATIC_URL + url
  },
  getContentUrl(url) { // 获取内容地址
    return CONTENT_URL + url
  },
  getUpdateTime (dateStr) { // 获取更新时间
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
  },
  getRes: function (url, param = {}) {
    wx.showLoading({
      title: '加载中...'
    })
    if (url.indexOf('://') == -1) {
      url = 'https://api.zhuishushenqi.com/' + url
    }
    let query = []
    Object.keys(param).forEach((item) => {
      query.push(`${item}=${encodeURIComponent(param[item])}`)
    })
    let params = query.length > 0 ? '?' + query.join('&') : ''  // fixme

    return new Promise((resolve, reject) => {
      wx.request({
        url: url + params,
        success: (res) => {
          wx.hideLoading()
          resolve(res.data)
        },
        fail: (res) => {
          wx.hideLoading()
          reject(res)
        }
      })
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
