// pages/component/component.js
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
  toSales: function (event) {
    var sales = event.currentTarget.dataset.sales;
    console.log(sales)
    var toPage = "";
    switch (sales) {
      case "word":
        toPage = "word/word";
        break;
      case "book":
        toPage = "../book/book";
        break;
      case "special":
        toPage = "../special/special";
        break;
      case "special-2":
        toPage = "../special-2/special-2";
        break;
      case "word-1":
        toPage = "../word/word?color=1";
        break;
      case "word-2":
        toPage = "../word/word?color=2";
        break;
      case "word-3":
        toPage = "../word/word?color=3";
        break;
      case "word-4":
        toPage = "../word/word?color=4";
        break;
      case "word-5":
        toPage = "../word/word?color=5";
        break;
      case "answer":
        toPage = "../answer/answer";
        break;
      default:
        break;
    }
    wx.navigateTo({ url: toPage });

  }
})