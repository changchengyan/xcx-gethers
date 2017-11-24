// pages/book/book.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    books_count: 0,
    isShowDelete: false,
    current: 0,
    double:false//防止触发双击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },
  gotoBookshelf: function () {
    wx.navigateTo({
      url: '/pages/book/bookshelf/bookshelf',
    })
  },
  gotoItem: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id
    var title = event.currentTarget.dataset.title
    if (that.data.double){
      console.log("这是双击")
      return
    }
    that.data.double = true;
    if (that.data.isShowDelete) {
      that.setData({ isShowDelete: false, double:false });
    } else {
      wx.navigateTo({
        url: '/pages/item/item?id=' + id + '&title=' + title + "&type=book",
     
      })
  
    }

  },
  showDeletBook: function (event) {
    var that = this;
    that.setData({ isShowDelete: !that.data.isShowDelete });
  },
  deleteBook: function (event) {
    console.log("deleteBook", event)
    var that = this;
    var bookId = event.currentTarget.dataset.id;
    var idx = event.currentTarget.dataset.index;
    var lastIdx = idx-1;
    if (that.data.double){
      console.log("这是双击")
      return
    }
    that.data.double = true;
    app.word.delBook(
      bookId,
      function (res) {
        that.setData({ isShowDelete: false });
        app.word.getBookTopData(
          function (res) {
            console.log(res);
            that.setData({ books: res.data.books, books_count: res.data.books_count });
            if (that.data.books.length < 6) {
                if (idx==0){
                  that.setData({ current: 0 })
                } else if (idx == that.data.books.length){
                  that.setData({ current: lastIdx })
                }
                else {
                  that.setData({ current: idx })
                }
            }
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({ double:false})
          }
        );
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  bindchange: function (event) {
    var that = this;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.weixinUserInfo) {
      app.word.getBookTopData(
        function (res) {
          console.log("有uid");
          that.setData({ books: res.data.books, books_count: res.data.books_count, double: false });
        }
      );
    }else {
      app.uidCallback = ()=>{
        app.word.getBookTopData(
          function (res) {
            console.log("没有uid");
            that.setData({ books: res.data.books, books_count: res.data.books_count, double: false });
          }
        );
      }
    }
   
    
  },

  goReview:function(event){
    let that =this;
    let { id, title } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/review/review?title=${title}&book_id=${id}`,
    })
  },

  goPK: function (event){
    let that = this;
    let { id, title } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/PK/PK?title=${title}&book_id=${id}`,
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var title = "";
    var path = `/pages/book/book`;
    return app.onShareAppMessage(title, path, 0, "book", "小程序单词100分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  },
  change: function (event) {
    let that = this;
    let c = event.detail.current;
    let idx = event.detail.index;
    console.log(c);
    that.setData({
      current: c
    })
  },
  outbind: function () {
    var that = this;
    console.log("outbind")
    that.setData({ isShowDelete: false });
  }
})