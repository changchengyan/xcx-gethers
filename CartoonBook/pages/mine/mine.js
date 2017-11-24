// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userInstanceList: [],
    userHistory: [],
    nodouble: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  if (app.globalData.userInfo) {
    var uid = app.globalData.userInfo.weixinUser.uid;
    that.setData({ uid: uid })
    app.pictureBook.getUserInstanceList(1, 99999, function (res) {
      that.setData({
        userInstanceList: res.data
      })
    })
    app.pictureBook.getUserHistory(1, 99999, function (res) {
      that.setData({
        userHistory: res.data
      })
    })
    //取内存中的userinfo
    var userInfo = wx.getStorageSync("weixinUserInfo");
    that.setData({
      userInfo: userInfo
    })
  } else {
    app.userLogin(function () {
      app.pictureBook.getUserInstanceList(1, 99999, function (res) {
        that.setData({
          userInstanceList: res.data
        })
      })
      app.pictureBook.getUserHistory(1, 99999, function (res) {
        that.setData({
          userHistory: res.data
        })
      })
      //取内存中的userinfo
      var userInfo = wx.getStorageSync("weixinUserInfo");
      that.setData({
        userInfo: userInfo
      })
    })
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
  return {
    title: '我的',
    path: 'pages/mine/mine'
  }
},
//跳转到历史看单
toHistory: function() {
  var that = this;
  if (this.data.nodouble) {
    wx.navigateTo({
      url: '/pages/history/history',
    })
    this.setData({ nodouble: false })
  }
  setTimeout(function () {
    that.setData({ nodouble: true })
  }, 1000)
},
//到视频页
toVideoPage: function (e) {
  var that = this;
  var id = e.currentTarget.dataset.id;
  var seriesId = e.currentTarget.dataset.seriesid;
  var vid = e.currentTarget.dataset.vid;
  if (this.data.nodouble) {
    wx.navigateTo({
      url: `/pages/video/video?id=${id}&seriesId=${seriesId}&vid=${vid}`,
    })
    this.setData({ nodouble: false })
  }
  setTimeout(function () {
    that.setData({ nodouble: true })
  }, 1000)
},
//跳转到看单页
toList: function() {
  var that = this;
  if (this.data.nodouble) {
    wx.navigateTo({
      url: '/pages/list/list',
    })
    this.setData({ nodouble: false })
  }
  setTimeout(function () {
    that.setData({ nodouble: true })
  }, 1000)
},
//跳转到设置
toSetting: function() {
  var that = this;
  if (this.data.nodouble) {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
    this.setData({ nodouble: false })
  }
  setTimeout(function () {
    that.setData({ nodouble: true })
  }, 1000)
}
})