// directory.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapters: [],
    currentChapter: 0,
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let book = app.data.currentBook
    wx.setNavigationBarTitle({
      title: book.title
    })
    this.setData({
      chapters: app.getChapters(book._id),
      currentChapter: book.currentChapter
    })
  },
  toChapter (e) {
    app.data.currentBook.currentChapter = e.currentTarget.dataset.index
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      scrollTop: ((this.data.currentChapter - 6) || 0) * 36
    })
    wx.hideLoading()
  }
})