// pages/videolist/videolist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    secondClassify: [],
    classIndex: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var index = options.index;
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
      app.pictureBook.getInstance(id, 1, 12, function (res) {
        that.setData({ secondClassify: res.data, classIndex: index })
        wx.setNavigationBarTitle({
          title: that.data.secondClassify[index].series.series_name,
        })
      })
    }else{
      app.userLogin(function(){
        app.pictureBook.getInstance(id, 1, 12, function (res) {
          that.setData({ secondClassify: res.data, classIndex: index })
          wx.setNavigationBarTitle({
            title: that.data.secondClassify[index].series.series_name,
          })
        })
      })
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
    return {
      title: this.data.secondClassify[this.data.classIndex].series.series_name,
      path: `pages/videolist/videolist?id=${this.data.secondClassify[this.data.classIndex].series.classify_id}&index=${this.data.classIndex}`
    
    }
  },
  //到视频页
  toVideoPage: function (e) {
    var id = e.currentTarget.dataset.id;
    var seriesId = e.currentTarget.dataset.seriesid;
    var vid = e.currentTarget.dataset.vid;
    wx.navigateTo({
      url: `/pages/video/video?id=${id}&seriesId=${seriesId}&vid=${vid}`,
    })
  },
})