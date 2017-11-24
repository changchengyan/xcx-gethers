// pages/review/review.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    book_id: 29,
    words_num: 0,
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ title: options.title, book_id: options.book_id,})
    wx.setNavigationBarTitle({
      title: that.data.title
    });
  },

  toMyReview: function () {
    let that = this;
    let { words_num } = that.data;
    if (words_num == 0) {
      wx.showToast({
        title: '没有复习单词',
      })
    } else if (words_num!==0&&that.data.isClick){
      wx.navigateTo({
        url: `/pages/review/myreview/myreview?book_id=${that.data.book_id}&title=${that.data.title}`,
      });
      that.setData({ isClick: false })
    }

  },

  toReviewWord: function () {
    let that = this;
    let { words_num } = that.data;
    if (words_num == 0) {
      wx.showToast({
        title: '没有复习单词',
      })
    } else if (words_num !== 0 && that.data.isClick ){
      wx.navigateTo({
        url: `/pages/review/reviewword/reviewword?book_id=${that.data.book_id}`,
      });
      that.setData({ isClick: false })
    }

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
    let that = this;
    that.setData({ isClick: true })
    if (app.globalData.weixinUserInfo) {
      that.showGetUidcb();
    } else {
      app.uidCallback = () => {
        that.showGetUidcb();
      }
    }
    
  },
  showGetUidcb:function(){
    let that = this;
    //获取当前用户每本书需要复习的单词数
    app.word.getUserWrongWordCount(that.data.book_id, function (res) {
      console.log(res.data)
      that.setData({ words_num: res.data })
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
    var title = '';
    // var path = `/pages/review/review?id=${that.data.book_id}&title=${that.data.title}`;
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, path, 0, "review", "小程序单词100分享");
  }
})