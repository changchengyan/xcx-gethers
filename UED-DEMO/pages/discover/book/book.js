// pages/discover/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookBase:"over",
    bookMore:"",
    bookReport:"",
    bookSwiperIndex:0,
    bookCurrent:0,
    reportView:"default",
    reportMenuDefault:"over",
    reportMenuUser:"",
    reportMenuMoney: "",

    userView: "default",
    userMenuDefault: "over",
    userMenuComment: "",
    userMenuServer: ""
  },
  userMenuClick: function (event)
  {
    var sales = event.currentTarget.dataset.sales;
    this.setData({ userView: sales });
    if(sales=="default")
    {
      this.setData({ userMenuDefault: "over", userMenuComment: "", userMenuServer:"" });
    }
    else if (sales == "comment") {
      this.setData({ userMenuDefault: "", userMenuComment: "over", userMenuServer: "" });
    }
    else if (sales == "server") {
      this.setData({ userMenuDefault: "", userMenuComment: "", userMenuServer: "over" });
    }

  },
  reportMenuClick: function (event) {
    var sales = event.currentTarget.dataset.sales;
    this.setData({ reportView: sales });
    if (sales == "default") {
      this.setData({ reportMenuDefault: "over", reportMenuUser: "", reportMenuMoney: "" });
    }
    else if (sales == "user") {
      this.setData({ reportMenuDefault: "", reportMenuUser: "over", reportMenuMoney: "" });
    }
    else if (sales == "money") {
      this.setData({ reportMenuDefault: "", reportMenuUser: "", reportMenuMoney: "over" });
    }

  },
  swiperChange: function (event) {
    this.setData({ swiperIndex: event.detail.current });

  },
  bookSwiperChange: function (event)
  {
    this.setData({ bookSwiperIndex: event.detail.current });
    this.bookMenuShow();
    
  },
  bookMenuShow: function () 
  {
    var index = this.data.bookSwiperIndex;

    if (index == 0) {
      this.setData({ bookBase: "over", bookMore: "", bookReport: ""  });
    }
    else if (index == 1) {
      this.setData({ bookBase: "", bookMore: "over", bookReport: "" });
    }
    else if (index == 2) {
      this.setData({ bookBase: "", bookMore: "", bookReport: "over" });
    }
  },
  bookMenuClick: function (event) {
    var sales = event.currentTarget.dataset.sales;
    this.setData({ bookCurrent: sales });
    this.bookMenuShow();

  },
  toTicket:function()
  {
    wx.navigateTo({ url: "ticket/ticket" });
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