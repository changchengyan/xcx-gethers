// pages/discover/manage/application/application.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appDemo:"over",
    appList:"",
    appCurrent:0,
    listStyle:"",
    orderPic:2,
    orderInfo:1,
    orderState:3,
    selectTypeName:""
  },
  toSearch: function (event)
  {
    wx.navigateTo({ url: "search/search" });
  },
  toAppInfo:function(event)
  {
    var sales = event.currentTarget.dataset.sales;
    var toPage = "";
    switch (sales) {
      case "ticket":
        toPage = "info/ticket";
        break;
      case "source":
        toPage = "manage/source/source";
        break;

      case "application":
        toPage = "manage/application/application";;
        break;
      case "report":
        toPage = "manage/report/report";
        break;
      case "message":
        toPage = "manage/message/message";
        break;
      case "accounts":
        toPage = "manage/accounts/accounts";
        break;
      case "about":
        toPage = "about/about";
        break;
      default:
        toPage = "info/info";
        break;
    }
    wx.navigateTo({ url: toPage });
  },
  toSelectType:function()
  {
    wx.navigateTo({ url: "selecttype/selecttype" });
  },
  changeLListStyle:function()
  {
    
    if (this.data.listStyle == "")
    {
      this.setData({ listStyle: "-mini" });
    }
    else
    {
      this.setData({ listStyle: "" });
    }
  },
  appSwiperChange: function (event) {
    this.setData({ appCurrent: event.detail.current });
    this.appMenuShow();

  },
  appMenuShow: function () {
    var index = this.data.appCurrent;

    if (index == 0) {
      this.setData({ appDemo: "over", appList: "" });
    }
    else if (index == 1) {
      this.setData({ appDemo: "", appList: "over" });
    }
  },
  appMenuClick: function (event) {
    var sales = event.currentTarget.dataset.sales;
    this.setData({ appCurrent: sales });
    this.appMenuShow();

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
    this.setData({ selectTypeName: app.globalData.aplicationSelectType})
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