// pages/review/reviewword/reviewword.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word_list: [],
    book_id: 0,
    pageIndex: 1,
    pageSize: 10,
    pageTotal: 0,
    isLoad: true,
    load: false,
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ book_id: options.book_id })
    console.log(that.data.book_id);
    console.log("onload");
    if (app.globalData.weixinUserInfo) {
      that.getUserWrongWordById(that.data.pageIndex);
    } else {
      app.uidCallback = () => {
        that.getUserWrongWordById(that.data.pageIndex);
      }
    }
   

  },

  //根据uid和bookId分页返回用户的错词集
  getUserWrongWordById: function (pageIndex) {
    let that = this;
    let { word_list } = that.data;
    if (pageIndex == 1) {
      app.word.getUserWrongWordById(that.data.book_id, pageIndex, that.data.pageSize, function (res) {
        console.log(res)
        if (res.pageTotal==1){
          that.setData({ isLoad: false  })
        }
        that.setData({ word_list: res.data, pageTotal: res.pageTotal, totalCount: res.totalCount, load: true,})
      })
    } else {
      app.word.getUserWrongWordById(that.data.book_id, pageIndex, that.data.pageSize, function (res) {
        console.log(res.data)
        word_list = word_list.concat(res.data)
        that.setData({ word_list })
      })
    }
  },

  //下拉加载
  loadMore: function () {
    let that = this;
    console.log("加载")
    that.setData({ isLoad:true })
    let { pageTotal, pageIndex, isLoad } = that.data;
    if (isLoad) {
      // console.log(pageTotal, pageIndex)
      if (pageTotal > 1) {//&& pageIndex < pageTotal
        pageIndex++;
      }
      console.log(pageTotal, pageIndex)
      if (pageIndex > pageTotal) {
        that.setData({ isLoad: false })
      }
      console.log(pageIndex)
      that.setData({ pageIndex })
      that.getUserWrongWordById(pageIndex);
    }
  },

  //单词详情
  toWorddetail: function (e) {
    let that = this;
    let { index } = e.currentTarget.dataset;
    let word_id = that.data.word_list[index].id;
    console.log(word_id)
    wx.navigateTo({
      url: `/pages/review/reviewword/detailreview/detailreview?word_id=${word_id}&word_index=${index + 1}&all_words=${that.data.totalCount}&book_id=${that.data.book_id}`,
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
    let that = this;
    console.log('sds');
    that.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var title = '';
    // var path = `/pages/review/review?id=${that.data.book_id}&title=${that.data.title}`;
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, path, 0, "reviewword", "小程序单词100分享");
  }
})