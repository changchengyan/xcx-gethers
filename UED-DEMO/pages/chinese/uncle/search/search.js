// pages/chinese/uncle/search/search.js
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
  toCreate: function (event) {
    wx.navigateTo({ url: "../create/create" });
  },
  toMiniProgram: function (event) {
    var source = event.currentTarget.dataset.source;
    var toPage = "";
    var appId = "wx21293b1ab5fac316";
    console.log("source=" + source);
    switch (source) {

      case "dictation":
        toPage = "pages/desktop/desktop";
        appId = "wxe2a572944d797366";//听写100
        break;
      case "bishun":
        toPage = "pages/desktop/desktop";
        appId = "wx38be548c581f8c61";//听写100
        break;
      case "codebook":
        toPage = "pages/desk/desk";
        appId = "wx21293b1ab5fac316";//听写100
        break;

    }

    console.log("toPage=" + toPage);

    wx.navigateToMiniProgram({
      appId: appId,
      path: toPage,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    });
  }
})