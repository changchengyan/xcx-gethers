// pages/special-2/special-2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      style:"-c",
      styleA:"",
      styleB: "",
      styleC: "-over"
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
  , seedStyle: function (event)
  {
    var that = this;
    var sales = event.currentTarget.dataset.sales;
    that.setData({ style: sales });
    if(sales=="-b")
    {
      that.setData({ styleA: "", styleB: "-over", styleC: "" });
    }
    else if (sales == "-c")
    {
      that.setData({ styleA: "", styleB: "", styleC: "-over" });

    }
    else{
      that.setData({ styleA: "-over", styleB: "", styleC: "" });
    }

  }
})