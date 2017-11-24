// pages/word/write/write.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    writeAsk:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options.ask=" + options.ask);
    var that = this;

    that.setData({ writeAsk: options.ask == "yes" });
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
  onAddMedia:function()
  {
    var that = this;
    wx.showActionSheet({
      itemList: ['图片', '录音', '视频'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            that.toSelectImg();
            break;
          case 1:
            that.startRecord();
            break;
          case 2:
            that.toSelectVideo();
            break;
            
          default:
            break;
        }
        

      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  toSelectImg:function()
  {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })

  },
  startRecord:function()
  {
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
    }, 10000)

  },
  toSelectVideo:function()
  {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })

  },
  writeToSales: function (event) {
    var page = event.currentTarget.dataset.page;
    var toPage = "";
    switch (page) {
      case "topic":
        toPage = "topic/topic";
        break;
      case "map":
        toPage = "map/map";
        break;
      default:
        break;
    }
    wx.navigateTo({ url: toPage });

  }

})