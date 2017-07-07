//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    bookcase: app.data.bookcase,
    userInfo: {},
    loading: false
  },
  onPullDownRefresh: function () {
    this.checkUpdate().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onShow () {
    this.setData({ // 显示的时候更新书架信息
      bookcase: app.data.bookcase
    })
  },
  checkUpdate () { // 检查是否有书籍更新
    return app.getRes(`book?view=updated&id=${Object.keys(this.data.bookcase)}`).then((data) => {
      let bookcase = {}
      data.map(item => {
        let book = this.data.bookcase[item._id]
        book.updated = app.getUpdateTime(item.updated)
        book.lastChapter = item.lastChapter
        book.isUpdate = book.isUpdate || item.chaptersCount > book.chaptersCount
        book.chaptersCount = item.chaptersCount
        bookcase[item._id] = book
        if (item.chaptersCount > book.chaptersCount) {
          this.getInfo(item._id)
        }
      })
      this.setData({ // 显示的时候更新书架信息
        bookcase: bookcase
      })
      app.data.bookcase = bookcase
      wx.setStorageSync('bookcase', bookcase)
    })
  },
  getInfo (bookid) {
    app.getRes(`toc?view=summary&book=${bookid}`).then((data) => {
      let sources = data.length > 2 ? data.slice(2, data.length) : data
      this.setData({
        sources
      })
      app.addSource(bookid, sources)
      return sources[0]._id
    }).then((id) => {
      app.getRes(`toc/${id}?view=chapters&channel=mweb`).then((data) => {
        this.setData({
          chapters: data.chapters
        })
        app.addChapters(bookid, data.chapters)
      })
    })
  },
  toSearch: () => {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  skip (e) {
    let bookid = e.currentTarget.dataset.bookid
    if (app.data.bookcase[bookid].isUpdate) {
      app.data.bookcase[bookid].isUpdate = false // 点击后 把更新的标识去掉
      this.setData({ // 显示的时候更新书架信息
        bookcase: app.data.bookcase
      })
      wx.setStorageSync('bookcase', app.data.bookcase)
    }
    app.selectBook(app.data.bookcase[bookid])
    wx.navigateTo({
      url: `../book/chapter`
    })
  }
})
