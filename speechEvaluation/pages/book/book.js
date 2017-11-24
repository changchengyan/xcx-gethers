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
    swiperItemStyle: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // app.speechEvalution.getBookTopData(
    //   function (res) {
    //     console.log(res);
    //     that.setData({ books: res.data.data.books, books_count: res.data.data.books_count });
    //   }
    // );
    if (app.globalData.weixinUserInfo) {
      app.speechEvalution.getBookTopData(
        function (res) {
          //console.log(res);
          that.setData({ books: res.data.data.books, books_count: res.data.data.books_count });
        }
      );
    } else {
      app.uidCallback = function () {
        app.speechEvalution.getBookTopData(
          function (res) {
            //console.log(res);
            that.setData({ books: res.data.data.books, books_count: res.data.data.books_count });
          }
        );
      }
    }
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
    if (that.data.isShowDelete) {
      that.setData({ isShowDelete: false });
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
    var that = this;
    var bookId = event.currentTarget.dataset.id;

    app.speechEvalution.delBook(
      bookId,
      function (res) {
        that.setData({ isShowDelete: false });
        app.speechEvalution.getBookTopData(
          function (res) {
            console.log(res);
            that.setData({ books: res.data.data.books, books_count: res.data.data.books_count });
            if (that.data.books.length < 6) {
              that.setData({ current: 0 })
            }
          }
        );
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let style = '';
    for (let i = 0; i < 6; i++) {
      style = 'background-color:#f8f8f8;position: absolute; width: 610rpx;margin-left:72rpx; height: 850rpx; transform: translate(' + (i * 100) + '%, 0%) translateZ(0px); will-change: auto;'
      that.data.swiperItemStyle.push(style)
    }
    that.setData({ swiperItemStyle: that.data.swiperItemStyle })
  },
  bindchange: function (event) {
    var that = this;
    console.log(event);
    for (var i = 0; i < 6; i++) {
      //console.log(event.detail.current == i);
      if (event.detail.current == i) {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px); will-change: auto; position: absolute; width: 610rpx; height: 850rpx;margin-left:72rpx;z-index:101";
      }
      else if (event.detail.current - 1 == i) {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px); will-change: auto; position: absolute; width: 610rpx; height: 850rpx;margin-left:72rpx;z-index:100";
      }
      else if (event.detail.current + 1 == i) {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px); will-change: auto; position: absolute; width: 610rpx; height: 850rpx;margin-left:72rpx;z-index:100";
      }
      else {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px); will-change: auto; position: absolute; width: 610rpx; height: 850rpx;margin-left:72rpx;z-index:99";
      }
    }
    //console.log(that.data.swiperItemStyle);
    that.setData({ swiperItemStyle: that.data.swiperItemStyle });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.weixinUserInfo) {
      app.speechEvalution.getBookTopData(
        function (res) {
          //console.log(res);
          that.setData({ books: res.data.data.books, books_count: res.data.data.books_count });
        }
      );
    } else {
      app.uidCallback = function () {
        app.speechEvalution.getBookTopData(
          function (res) {
            //console.log(res);
            that.setData({ books: res.data.data.books, books_count: res.data.data.books_count });
          }
        );
      }
    }


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
    var path = "/pages/book/book";
    var imageUrl = "";
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl, "小程序口语测评分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  },
  change: function (event) {
    let that = this;
    let c = event.detail.current;
    console.log(c);
    that.setData({
      current: c
    })
  },
  outbind: function () {
    var that = this;
    that.setData({ isShowDelete: false });
  }
})