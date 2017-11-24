// pages/word/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  
  },
  moreToSales: function (event) {
    var page = event.currentTarget.dataset.page;
    var toPage = "";
    switch (page) {
      case "share":
        toPage = "../share/share";
        break;
      case "notice":
        toPage = "../notice/notice";
        break;
      case "nickname":
        toPage = "../nickname/nickname";
        break;
      case "noteview":
        toPage = "../../notes/noteview/noteview";
        break;
      case "book":
        toPage = "../book/book";
        break;
      case "member":
        toPage = "../member/member";
        break;
      case "paymodel":
        toPage = "../paymodel/paymodel";
        break;   
      case "favorites":
        toPage = "../favorites/favorites";
        break;  
      case "message":
        toPage = "../message/message";
        break;   
               
      default:
        break;
    }
    wx.navigateTo({ url: toPage });

  }

})