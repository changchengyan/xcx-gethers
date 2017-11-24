// pages/word/source/source.js
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
  sourceToMiniProgram: function (event) {
    var source = event.currentTarget.dataset.source;
    var toPage = "";
    switch (source) {
      //应用
      case "video":
        toPage = "pages/view/video/video?book_id=1&match_id=1064&match_sales_id=1799&match_sales_name=app_instance";
        break;
      case "sound":
        toPage = "pages/view/sound/sound?book_id=1&match_id=1057&match_sales_id=1794&match_sales_name=app_instance";
        break;
      case "album":
        toPage = "pages/view/album/album";
        break;
      case "pdf":
        toPage = "pages/view/pdf/pdf?book_id=1&match_id=1556&match_sales_id=1801&match_sales_name=app_instance";
        break;
      case "article":
        toPage = "pages/view/article/article";
        break;
      case "live":
        toPage = "pages/view/webcast/webcast";
        break;
      //商品
      case "seed_default":
        toPage = "pages/seed/seed";
        break;
      case "seed_ebook":
        toPage = "pages/view/ebook/ebook";
        break;
      case "seed_book":
        toPage = "pages/seed/seed";
        break;
      case "seed_sound":
        toPage = "pages/view/sound/sound";
        break;
      case "seed_video":
        toPage = "pages/view/video/video";
        break;
      case "seed_match":
        toPage = "pages/view/match/match?book_id=50&match_id=1267&match_sales_id=15190&match_sales_name=seed";
        break;
      case "seed_pdf":
        toPage = "pages/view/pdf/pdf";
        break;
      case "seed_album":
        toPage = "pages/view/album/album";
        break;
      case "seed_number":
        toPage = "pages/view/number/number";
        break;
      case "seed_member":
        toPage = "pages/view/member/member";
        break;
      case "seed_pretest":
        toPage = "pages/view/pretest/pretest?book_id=1&match_id=1774&match_sales_id=19578&match_sales_name=seed";
        break;
      case "seed_question":
        toPage = "pages/view/question/question?book_id=12&match_id=1169&match_sales_id=1144&match_sales_name=seed";
        break;
    }




    wx.navigateToMiniProgram({
      appId: 'wx21293b1ab5fac316',
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