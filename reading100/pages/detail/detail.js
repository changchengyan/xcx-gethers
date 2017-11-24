// pages/detail/detail.js\
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: 0,
    bookName: [],
    pic: "",
    listen_count: 0,
    write_book_id: 0,
    dictation_book_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      bookId: options.book_id,
      bookName: options.book_name.split(" "),
      pic: options.pic
    })
    app.read.getBookScanCount(options.book_id, function (res) {
      that.setData({
        listen_count: res.data.data,
        grade: that.data.bookName[2].substring(0,3)
      })
    });
    app.read.GetOtherBookID(options.book_id,function(res){
      that.setData({
        write_book_id: res.data.data.write_book_id,
        dictation_book_id: res.data.data.dictation_book_id
      })
    })
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
    var that = this;
    var name = this.data.bookName.join(" ");
    console.log(`book_id=${that.data.bookId}&book_name=${name}&pic=${this.data.pic}`);
    return{
      title: "书籍同步课程",
      path: `/pages/detail/detail?book_id=${that.data.bookId}&book_name=${name}&pic=${this.data.pic}`
    }
  },
  //to听写
  toDictation: function () {
    wx.navigateToMiniProgram({
      appId: 'wxe2a572944d797366',
      path: `/pages/book/book?book_id=${this.data.dictation_book_id}&share=true`,
      envVersion: 'develop',
      success: function () {
        console.log("成功")
      }
    })
  },
  //to笔顺
  toWrite: function() {
    wx.navigateToMiniProgram({
      appId: 'wx38be548c581f8c61',
      path: `/pages/book/book?book_id=${this.data.write_book_id}`,
      // extraData: {
      //   book_id: this.data.write_book_id,
      // },
      envVersion: 'develop',
      success: function () {
        console.log("成功")
      }
    })
  },
  stop: function () {
    return false;
  }
})