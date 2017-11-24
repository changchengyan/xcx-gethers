// pages/detail/detail.js\
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    platform_book_id: 0,
    bookId:0,
    bookName: [],
    pic: "",
    listen_count: 0,
    speech_book_id: 0,
    dictation_book_id: 0,
    pageIndex: 1,
    pageSize: 12,
    sourceList: {
      total_count: -1,
      count: 0,
      list: [],
    },
    loadding: false,
    loadMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      platform_book_id: options.platform_book_id,
      bookId:options.book_id,
      bookNameStr:options.book_name,
      bookName: options.book_name.split(" "),
      pic: options.pic
    })
    app.followBook.getBookInfo(options.book_id,function(res){
      that.setData({ pic:res.data.book.book_pic})
    })
    app.followBook.getBookScanCount(options.book_id, function (res) {
      that.setData({
        listen_count: res.data,
      })
    });
    app.followBook.getOtherBookID(options.book_id,function(res){
      console.log(res);
      that.setData({
        speech_book_id: res.data.speech_book_id,
        dictation_book_id: res.data.dictation_book_id
      })
    })
    that.get_konwledgeSource()
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
  get_konwledgeSource: function () {
    let that = this;
    let { platform_book_id, pageIndex, pageSize } = that.data;
    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });
      app.followBook.getBookKnowledgeList(function (res) {
        var list = res.data;
        let data = {};
        if (list.length > 0) {
          data.count = list.length + that.data.sourceList.count * 1
          data.total_count = res.totalCount * 1;
          //下拉刷新追加数据
          data.list = that.data.sourceList.list.concat(list);
          that.setData({ sourceList: data })
        }
        // 如果加载完所有数据，标记不用再加载更多
        if (that.data.sourceList.total_count == res.totalCount) {
          that.setData({ loadMore: false });
        }
        that.setData({ loadding: false });
        wx.stopPullDownRefresh();
      }, platform_book_id, pageIndex, pageSize)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    let { pageIndex } = that.data;
    pageIndex++;
    that.setData({ pageIndex: pageIndex })
    that.get_konwledgeSource();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    let { pageIndex } = that.data;
    pageIndex++;
    that.setData({ pageIndex: pageIndex })
    that.get_konwledgeSource();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //指定跳入指定的小程序
  toDictation_toWrite:function(e){
    let tmp_flag = e.currentTarget.dataset.nav;
    if(tmp_flag==0){
      wx.navigateToMiniProgram({
        appId: 'wxe2a572944d797366',
        path: `/pages/book/book?book_id=${this.data.dictation_book_id}&share=true`,
        envVersion: 'release',
        success: function () {
          console.log("成功")
        }
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wx68434135d95625ed',
        path: `/pages/item/item?id=${this.data.speech_book_id}&title=${this.data.bookNameStr}&type=book&share=true`,
        envVersion: 'release',
        success: function () {
          console.log("成功")
        }
      })
    }
  },
  stop: function () {
    return false;
  }
})