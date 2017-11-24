// pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      { url:"http://f3.5rs.me/upload/20170906/2017_09_06_163800119.jpg",cn:"整洁近于美德",en:"Cleanliness is next to godliness."},
      { url: "http://f3.5rs.me/upload/20170906/2017_09_06_164137305.jpg", cn: "事业在线，享乐在后", en: "Business before pleasure" },
      { url: "http://f3.5rs.me/upload/20170906/2017_09_06_164155912.jpg", cn: "追求永无止境", en: "There is no end to the pursuit." }
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    mainMenu: "evaluate"
  },
  menuSales: function (event) {
    var menu = event.currentTarget.dataset.menu;
    this.setData({ mainMenu: menu });
  },
  toBook:function()
  {
    wx.navigateTo({ url: "book/book" });
  },
  toSearch: function () {
    wx.navigateTo({ url: "search/search" });
  },
  toDisplay: function () {
    wx.navigateTo({ url: "display/display" });
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
  
  }
})