// pages/PK/PK.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: [],
    book_id: 0,
    pageLength: 10,
    pageIndex: 1,
    pageMore: true,
    pageLoading: false,
    doubleClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options || options.book_id) {
      this.setData({ book_id: options.book_id })
    }
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
    let that = this;
    that.data.record =[];
    that.setData({
      pageIndex: 1,
      pageMore: true,
      pageLoading: false,
      doubleClick: false
    })
    if (app.globalData.weixinUserInfo) {
      that.GetRecordsPK()
    } else {
      app.uidCallback = () => {
        that.GetRecordsPK()
      }
    }
    

  },

  GetRecordsPK: function () {
    let that = this;
    let { record, pageLoading, pageMore, pageIndex, pageLength } = that.data;
    if (!pageLoading && pageMore) {
      that.setData({ pageLoading: true })
      app.word.GetRecordsPK(pageIndex, pageLength, function (res) {
         console.log("PKrecord", res);
        pageIndex = pageIndex + 1;
        record = record.concat(res.data);

        if (record.length == res.totalCount) {
          pageMore = false;
        } else {
          pageMore = true;
        }
        that.setData({
          record: record,
          pageLoading: false,
          pageMore: pageMore,
          pageIndex,
        })
      })
    }

  },
  toBook: function () {
    let that = this;
    let { doubleClick } = that.data;
    if (!doubleClick) {
      doubleClick = true;
      that.setData({ doubleClick })
 
      wx.navigateTo({
        url: '/pages/PK/PK_answer/PK_answer?book_id=' + that.data.book_id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) {
          
        
        },
      })
    }
  },
  toDetail: function (e) {
    let that = this;
    let question_id = e.currentTarget.dataset.question;
    let { doubleClick } = that.data;
    if (!doubleClick) {
      doubleClick = true;
      that.setData({ doubleClick})
      wx.navigateTo({
        url: `/pages/PK/PK_detail/PK_detail?&question_id=${question_id}&book_id=${that.data.book_id}`,
        complete: function () {
        
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    let { doubleClick } = that.data;
    doubleClick = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
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
    let that = this;
    that.GetRecordsPK()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})