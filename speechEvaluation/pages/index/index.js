//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    info: [],
    banner: [],
    pageIndex: 1,
    pageSize: 10,
    loadingState: false,
    loadMore: true,
    cur_year: 0,
    cur_month: 0,
    cur_day: 0,
  },
  onLoad: function () {
    let that = this;
    let date = new Date();
    let cur_year = date.getFullYear();
    let cur_month = date.getMonth() + 1;
    let cur_day = date.getDate();
    if (cur_month < 10) {
      cur_month = '0' + cur_month
    }
    if (cur_day < 10) {
      cur_day = '0' + cur_day;
    } 
    that.setData({
      cur_year, cur_month, cur_day
    })

  },
  gotoDetail: function (event) {
    var id = event.currentTarget.dataset.id
    var sentence_type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&sentence_type=' + sentence_type
    })
  },
  loadItemInfo: function () {
    var that = this;
    if (!that.data.loadingState && that.data.loadMore) {
      that.setData({ loadingState: true });
      app.speechEvalution.getTodayInfo(
        function (res) {
          console.log(res);
          that.setData({ info: that.data.info.concat(res.data.data) });
          if (that.data.pageIndex == res.data.pageTotal) {
            that.setData({ loadMore: false });
          }
          that.setData({ loadingState: false, pageIndex: that.data.pageIndex + 1 });
        }
      );
    }
  },
  gotoBookshelf: function (event) {
    var grade = event.currentTarget.dataset.grade
    wx.navigateTo({
      url: '/pages/book/bookshelf/bookshelf?grade=' + grade,
    })
  },
  loadBanner: function () {
    var that = this;
    app.speechEvalution.getBannerSentence(
      1,
      3,
      function (res) {
        //console.log(res);
        that.setData({ banner: res.data.data });
      }
    );
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.weixinUserInfo) {
      that.data.info = [];
      that.data.pageIndex = 1;
      that.data.pageSize = 10;
      that.data.loadingState = false;
      that.data.loadMore = true;
      that.loadItemInfo();
      that.loadBanner();
    } else {
      app.uidCallback = function () {
        that.data.info = [];
        that.data.pageIndex = 1;
        that.data.pageSize = 10;
        that.data.loadingState = false;
        that.data.loadMore = true;
        that.loadItemInfo();
        that.loadBanner();
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
    var path = "/pages/index/index";
    var imageUrl = "";
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl, "小程序口语测评分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  }
})
