// pages/checkpoint/checkpoint.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word_list: [],
    lesson_id: 0,
    ind: 0,
    title: null,
    id: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.setData({ lesson_id: options.lesson_id, ind: options.ind, title: options.title, id: options.id })
    app.word.getWord(that.data.lesson_id, function (res) {
      console.log(res.data)
      that.setData({ word_list: res.data })
    })

    wx.setNavigationBarTitle({
      title: '第' + that.data.ind + '关'
    });

  },
  //单词详情
  toWorddetail: function (e) {
    let that = this;
    let { index } = e.currentTarget.dataset;
    let word_id = that.data.word_list[index].id;
    console.log(word_id)
    wx.navigateTo({
      url: `/pages/word/worddetail/worddetail?word_id=${word_id}&word_index=${index + 1}&all_words=${that.data.word_list.length}`,
    })
  },

  //闯关
  toCheckpoint: function () {
    let that = this;
    wx.redirectTo({
      url: `/pages/pass/pass?lesson_id=${that.data.lesson_id}&title=${that.data.title}&id=${that.data.id}&ind=${that.data.ind}`,
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
    var title = "";
    var path = "/pages/index/index";
    return app.onShareAppMessage(title, path, 0, "index", "小程序单词100分享");
  }
})