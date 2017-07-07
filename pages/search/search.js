// search.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    showClear: false,
    books: [],
    tags: [
      '一念永恒',
      '天道图书馆',
      '雪鹰领主',
      '全职法师',
      '修真聊天群',
      '通天仙路',
      '修炼狂潮',
      '我真是大明星',
      '全职高手'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
  
  },
  skip (e) {
    wx.navigateTo({
      url: '../book/detail?id=' + e.currentTarget.dataset.bookid
    })
  },
  clearWord: function (e) {
    this.setData({
      search: '',
      showClear: false,
      books: []
    })
  },
  setSearchWord: function (e) {
    let showClear = true
    if (e.detail.value.trim() === '') {
      showClear = false
    }
    this.setData({
      search: e.detail.value,
      showClear
    })
  },
  setWord: function (e) {
    this.setData({
      search: e.currentTarget.dataset.word,
      showClear: true
    })
    this.search()
  },
  search: function () {
    app.getRes(`book/fuzzy-search`, { query: this.data.search }).then((data) => {
      if (data.ok) {
        let books = []
        data.books.map(item => {
          item.cover = item.cover ? app.getImageUrl(item.cover) : '../../static/image/default_book_cover.png'
          books.push(item)
        })
        this.setData({
          books
        })
      }
    })
  }
})