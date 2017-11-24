// pages/item/item.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    lesson: [],
    title: null,
    display: false,
    userInfo: null,
    all_star: 0,
    all_word_count: 0,
    word_count: 0,
    idx: 0,
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    that.setData({ type: options.type, id: options.id, title: options.title });

    wx.setNavigationBarTitle({
      title: that.data.title
    });
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
    that.setData({ isClick: true });
    //获取课程列表
    if (app.globalData.weixinUserInfo) {
      console.log("有uid")
      that.showGetUidcb();

    } else {
      console.log("无uid1")
      app.uidCallback = () => {
        that.showGetUidcb();
      }
    }

  },
  showGetUidcb:function(){
    let that = this;
    let { all_star, all_word_count, word_count } = that.data;
    all_word_count = 0;
    let o = 0;
    //用户头像
    if (app.globalData.weixinUserInfo.headimgurl == "") {
      app.globalData.weixinUserInfo.headimgurl = "../images/user_default.png"
      }
      //更新数据
    that.setData({ userInfo: app.globalData.weixinUserInfo })

    //添加用户对书籍的关注
    app.word.addBookFollow(that.data.id, function (res) {
      //console.log(res);
    });
    //免费关卡
    app.word.addFreeLesson(that.data.id, function (res) {
      console.log(res)
    });
    app.word.getLessons(that.data.id, function (res) {
      console.log(res.data);
      for (let i = 0; i < res.data.lessons.length; i++) {
        if (res.data.lessons[i].is_unlock > 0 && (res.data.lessons[i].star == null || res.data.lessons[i].star == 0)) {
          o = i + 1;
        }
        all_word_count = all_word_count + res.data.lessons[i].word_count;
      }
      that.setData({ lesson: res.data.lessons, all_star: res.data.star_count, all_word_count, word_count: res.data.studied_word_count, idx: o })
    })
  },
  // bindscroll:function(e){
  //   console.log(e)
  // },

  bindWord: function (event) {
    let that = this;
    if (that.data.isClick) {
      that.setData({ isClick: false })
      let { index } = event.currentTarget.dataset;
      console.log(index);
      let idx = that.data.lesson[index - 1].id;
      console.log(idx)
      if (that.data.lesson[index - 1].is_unlock == 0) {
        that.setData({ display: true })
      } else {
        wx.navigateTo({
          url: `/pages/word/word?lesson_id=${idx}&ind=${index}&title=${that.data.title}&id=${that.data.id}`,
        })
      }
    }

  },
  //复习
  toReview: function () {
    let that = this;
    if (that.data.isClick) {
      wx.navigateTo({
        url: `/pages/review/review?&title=${that.data.title}&book_id=${that.data.id}`,
      });
      that.setData({ isClick: false })
    }

  },

  displayBox: function () {
    let that = this;
    that.setData({ display: false, isClick:true })
  },

  //PK
  toPK: function () {
    let that = this;
    if (that.data.isClick) {
      wx.navigateTo({
        url: `/pages/PK/PK?book_id=${that.data.id}`,
      });
      that.setData({ isClick: false })
    }

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
    var title = '';
    var path = `/pages/item/item?id=${that.data.id}&title=${that.data.title}`;
    return app.onShareAppMessage(title, path, 0, "pass", "小程序单词100分享");
  }
})
