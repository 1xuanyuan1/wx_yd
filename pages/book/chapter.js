// content.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {},
    chapter: {},
    scrollTop: 0,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let book = app.data.currentBook
    this.setData({
      book,
      total: app.getChapters(book._id).length
    })
  },
  // 从目录回调显示
  onShow: function () {
    this.getContent(app.data.currentBook.currentChapter)
  },
  getContent(currentChapter) {
    app.data.currentBook.currentChapter = currentChapter
    this.data.book.currentChapter = currentChapter
    let chapter = app.getChapters(this.data.book._id)[this.data.book.currentChapter] || {}
    app.getRes(app.getContentUrl(chapter.link)).then((data) => {
      this.setData({
        scrollTop: 0,
        chapter: data.chapter,
        book: this.data.book
      })
    })
  },
  getNext (e) {
    this.getContent(this.data.book.currentChapter + 1)
  },
  getPre (e) {
    this.getContent(this.data.book.currentChapter - 1)
  },
  toDirectory(e) {
    wx.navigateTo({
      url: `directory?bookid=${this.data.book._id}&title=${this.data.book.title}&currentChapter=${this.data.book.currentChapter}`
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (app.data.bookcase[this.data.book._id]) {
      app.data.bookcase[this.data.book._id].currentChapter = this.data.book.currentChapter
      wx.setStorageSync('bookcase', app.data.bookcase)
    }
  }
})