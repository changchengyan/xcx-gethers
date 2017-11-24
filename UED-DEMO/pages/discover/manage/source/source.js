// pages/discover/manage/source/source.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sourceA: "over",
    sourceB: "",
    sourceC: "",
    sourceD: "",
    sourceE: "",
    sourceF: "",
    sourceCurrent:0
  },
  sourceSwiperChange: function (event) {
    this.setData({ sourceCurrent: event.detail.current });
    this.sourceMenuShow();

  },
  sourceMenuShow: function () {
    var index = this.data.sourceCurrent;

    if (index == 0) {
      this.setData({ sourceA: "over", sourceB: "", sourceC: "", sourceD: "", sourceE: "", sourceF: "" });
    }
    else if (index == 1) {
      this.setData({ sourceA: "", sourceB: "over", sourceC: "", sourceD: "", sourceE: "", sourceF: "" });
    }
    else if (index == 2) {
      this.setData({ sourceA: "", sourceB: "", sourceC: "over", sourceD: "", sourceE: "", sourceF: "" });
    }
    else if (index == 3) {
      this.setData({ sourceA: "", sourceB: "", sourceC: "", sourceD: "over", sourceE: "", sourceF: "" });
    }
    else if (index == 4) {
      this.setData({ sourceA: "", sourceB: "", sourceC: "", sourceD: "", sourceE: "over", sourceF: "" });
    }
    else if (index == 5) {
      this.setData({ sourceA: "", sourceB: "", sourceC: "", sourceD: "", sourceE: "", sourceF: "over" });
    }

  },
  sourceMenuClick: function (event) {
    var sales = event.currentTarget.dataset.sales;
    this.setData({ sourceCurrent: sales });
    this.sourceMenuShow();

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