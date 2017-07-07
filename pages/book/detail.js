// detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {}, // 书籍详情信息
    recommends: [], // 相关推荐书籍
    counts: {
      latelyFollower: '追书人数',
      retentionRatio: '读者留存率',
      serializeWordCount: '更新字/天'
    },
    isWatch: false, // 是否正在追更
    sources: [], // 书源
    chapters: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isWatch: app.data.bookcase[options.id] != null,
      sources: app.getSource(options.id)
    })
    // 加载书籍信息
    app.getRes(`book/${options.id}`).then((data) => {
      data.cover = data.cover ? app.getImageUrl(data.cover) : '../../static/image/default_book_cover.png'
      data.wordCount = parseInt(data.wordCount / 1000) + '万字'
      data.updated = app.getUpdateTime(data.updated)
      this.setData({
        book: data
      })
    })
    // 加载推荐书籍
    app.getRes(`book/${options.id}/recommend`).then((data) => {
      let recommends = []
      data.books.slice(0, 4).map(item => {
        item.cover = item.cover ? app.getImageUrl(item.cover) : '../../static/image/default_book_cover.png'
        recommends.push(item)
      })
      this.setData({
        recommends
      })
    })

    app.getRes(`toc?view=summary&book=${options.id}`).then((data) => {
      let sources = data.slice(1, data.length).filter(item => item.link.indexOf('.aspx') === -1)
      // let sources = data.length > 2 ? data.slice(2, data.length) : data
      this.setData({
        sources
      })
      app.addSource(options.id, sources)
      return sources[0]._id
    }).then((id) => {
      app.getRes(`toc/${id}?view=chapters&channel=mweb`).then((data) => {
        this.setData({
          chapters: data.chapters
        })
        app.addChapters(options.id, data.chapters)
      })
    })
  },
  // 跳转书籍
  skip(e) {
    wx.redirectTo({
      url: 'detail?id=' + e.currentTarget.dataset.bookid
    })
  },
  toContent (e) {
    // 若已经在书架中则直接获取书架中的书籍信息, 否则使用本页里的信息
    let book = app.data.bookcase[e.currentTarget.dataset.bookid] || this.data.book
    app.selectBook(book)
    wx.navigateTo({
      url: `chapter`
    })
  },
  // 是否追本小说
  toggleWatch (e) {
    if (this.data.isWatch) {
      app.deleteBook(this.data.book._id)
    } else {
      app.addBook(this.data.book)
    }
    this.setData({
      isWatch: !this.data.isWatch
    })
  }
})