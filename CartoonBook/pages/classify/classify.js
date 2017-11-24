// pages/classify/classify.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur:["cur"],
    curIndex: 0,
    classify: [],
    secondClassify: [],
    curId: null,
    nodouble: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
      app.pictureBook.getClassify(function (res) {
        that.setData({
          classify: res.data
        })
        app.pictureBook.getInstance(that.data.classify[0].second_classifys[0].id, 1, 3, function (res) {
          that.setData({ secondClassify: res.data })
        })
      })
    }else{
      app.userLogin(function(){
        app.pictureBook.getClassify(function (res) {
          that.setData({
            classify: res.data
          })
          app.pictureBook.getInstance(that.data.classify[0].second_classifys[0].id, 1, 3, function (res) {
            that.setData({ secondClassify: res.data })
          })
        })
      })
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
    return {
      title: '分类',
      path: 'pages/classify/classify'
    }
  },
  //点击切换分类
  changeClassify: function(e) {
    var that = this;
    var index = e.target.dataset.index;
    var cur = [];
    cur[index] = "cur";
    this.setData({
      cur: cur,
      curIndex: index
    })
    var id = that.data.classify[index].second_classifys[0].id;
    app.pictureBook.getInstance(id, 1, 3, function (res) {
      that.setData({ secondClassify: res.data, curId: id })
    })
  },
  //到列表页
  toListPage: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if (this.data.nodouble) {
      wx.navigateTo({
        url: `/pages/videolist/videolist?id=${id}&index=${index}`,
      })
      this.setData({ nodouble: false })
    }
    setTimeout(function () {
      that.setData({ nodouble: true })
    }, 1000)
  },
  //到视频页
  toVideoPage: function (e) {
    var id = e.currentTarget.dataset.id;
    var seriesId = e.currentTarget.dataset.seriesid;
    var vid = e.currentTarget.dataset.vid;
    if (this.data.nodouble) {
      wx.navigateTo({
        url: `/pages/video/video?id=${id}&seriesId=${seriesId}&vid=${vid}`,
      })
      this.setData({ nodouble: false })
    }
    setTimeout(function () {
      that.setData({ nodouble: true })
    }, 1000)
  },
  //改变二级分类内容
  changeSecondClassify: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    if(that.data.curId !== id) {
      app.pictureBook.getInstance(id, 1, 3, function (res) {
        that.setData({ secondClassify: res.data, curId: id })
      })
    }
  } 
})