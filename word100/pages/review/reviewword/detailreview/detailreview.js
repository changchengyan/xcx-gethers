// pages/review/reviewword/detailreview/detailreview.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word_id: 0,
    word: [],
    word_index: 0,
    all_words: 0,
    book_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ word_id: options.word_id, word_index: options.word_index, all_words: options.all_words, book_id: options.book_id })
    console.log(that.data.word_id)
    //复习单词详情
    app.word.GetReviewWordInfo(that.data.word_id, that.data.book_id, function (res) {
      if (res.success) {
        console.log(res)
        that.setData({ word: res.data })
      }
    })
  },

  //上一个单词
  bindprev: function () {
    let that = this;
    // that.audioCtx.pause()
    let { word, word_index } = that.data;
    if (word.prev_id == 0) {

    } else {
      word_index--
      app.word.GetReviewWordInfo(that.data.word.prev_id, that.data.book_id, function (res) {
        that.setData({ word: res.data, word_index })
      })
    }
  },

  //下一个单词
  bindnext: function () {
    let that = this;
    // that.audioCtx.pause()
    let { word, word_index } = that.data;
    if (word.next_id == 0) {

    } else {
      word_index++
      app.word.GetReviewWordInfo(that.data.word.next_id, that.data.book_id, function (res) {
        that.setData({ word: res.data, word_index });
      })
    }
  },

  //播放单词
  audio: function () {
    let that = this;
    that.audioCtx = wx.createAudioContext('myAudio');
    that.audioCtx.setSrc(that.data.word.current.word_mp3_url);
    that.audioCtx.play()
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
    var title = "";
    var path = "/pages/index/index";
    return app.onShareAppMessage(title, path, 0, "index", "小程序单词100分享");
  }
})