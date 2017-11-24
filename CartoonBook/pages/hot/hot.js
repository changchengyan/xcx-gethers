// pages/hot/hot.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg: "",
    classify: [],
    color: "",
    index: 0,
    isFirst: true,
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
    app.pictureBook.getHot(function (res) {
      var rgb = res.data[0].classify.color_rbg.replace(/[RGB=]+/g, "").split(" ");
      for (var i = 0; i < rgb.length; i++) {
        if (rgb[i].length < 2) {
          rgb[i] = "0" + rgb[i];
        }
      }
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: '#' + rgb.join(""),
      })
      that.setData({
        classify: res.data,
        bg: res.data[0].classify.classify_pic,
        color: rgb.join("")
      })
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
    return{
      title: "热门",
      path: "pages/hot/hot"
    }
  },
  //滑动时变化
  change: function (e) {
    var that = this;
    var index = e.detail.current;
    var rgb = that.data.classify[index].classify.color_rbg.replace(/[RGB=]+/g, "").split(" ");
    for (var i = 0; i < rgb.length; i++) {
      if (rgb[i].length < 2) {
        rgb[i] = "0" + rgb[i];
      }
    }
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: '#' + rgb.join(""),
    })
    this.setData({
      bg: that.data.classify[index].classify.classify_pic,
      color: rgb.join(""),
      index: index
    })
  },
  //跳转到视频页面
  toVideoPage: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var seriesId = e.currentTarget.dataset.seriesid;
    var vid = e.currentTarget.dataset.vid;
    if(this.data.nodouble){
      wx.navigateTo({
        url: `/pages/video/video?id=${id}&seriesId=${seriesId}&vid=${vid}`,
      })
      this.setData({nodouble:false})
    }
    setTimeout(function(){
      that.setData({nodouble:true})
    },1000)
  },
  //防止拖动
  stop: function(){
    return false;
  }

})