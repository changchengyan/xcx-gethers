// pages/video/video.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    danmuList: "",
    index: 0,
    cover_view: "hide",
    addPic: "add",
    infoStyle: "",
    cur: ["cur"],
    secondClassify: [],
    classIndex: null,
    videoIndex: null,
    browser_id: null,
    vid: null,
    seriesId: null,
    time: 0,
    isadd: false,
    canPlay: false,
    videoUrl: "",
    // 设置是否自动播放
    isAutoplay: false,
    firstLogin: false,
    times: [2.78159408, 8.06038347, 18.85883059, 37.69589596, 46.48468852, 55.65219576, 65.56117122, 74.34996378, 85.51841950, 93.93575244, 109.12351729, 128.09117394, 142.65790474, 159.36633240, 172.42400851]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.videoContext = wx.createVideoContext('myVideo');
    if (options.id && options.seriesId && options.vid) {
      var classId = options.id;
      var seriesId = options.seriesId;
      var vid = options.vid;
      if (app.globalData.userInfo) {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid });
        that.load(classId, seriesId, vid);
      } else {
        app.userLogin(function () {
          that.load(classId, seriesId, vid);
        })
      }
    }
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType === "wifi") {
          that.setData({ isAutoplay: true });
        }
      },
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
    this.addBrowser();
    app.pictureBook.updateBrowserTime(this.data.browser_id);
    app.pictureBook.updateTimelength(this.data.history_id, this.data.time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.addBrowser();
    app.pictureBook.updateBrowserTime(this.data.browser_id);
    app.pictureBook.updateTimelength(this.data.history_id, this.data.time);
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
    console.log(`pages/video/video?id=${this.data.second_classify_id}&seriesId=${this.data.seriesId}$vid=${this.data.vid}`)
    return {
      title: this.data.secondClassify[this.data.classIndex].series.series_name,
      path: `pages/video/video?id=${this.data.second_classify_id}&seriesId=${this.data.seriesId}&vid=${this.data.vid}`
    }
  },
  //加载数据
  load: function (classId, seriesId, vid) {
    var that = this;
    app.pictureBook.getInstance(classId, 1, 999, function (res) {
      var videoIndex = 0;
      var index = 0;
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].series.id == seriesId) {
          index = i;
        }
        for (let j = 0; j < res.data[i].instances.length; j++) {
          if (res.data[i].instances[j].id == vid) {
            videoIndex = j;
            res.data[i].instances[j].times = res.data[i].instances[j].times.split(",");
          }
        }
      }
      var cur = [];
      cur[videoIndex] = "cur";
      that.setData({
        secondClassify: res.data,
        classIndex: index,
        videoIndex: videoIndex,
        vid: res.data[index].instances[videoIndex].id,
        cur: cur,
        videoUrl: res.data[index].instances[videoIndex].instance_video_url,
        seriesId: res.data[index].series.id,
        second_classify_id: classId,
        // name: that.data.secondClassify[index].series.series_name,
        isadd: res.data[index].instances[videoIndex].isadd
      })
      wx.setNavigationBarTitle({
        title: that.data.secondClassify[index].series.series_name,
      })
      that.addBrowser();
    })
  },
  //点击跳上一个进度
  last: function () {
    var that = this;
    var times = that.data.secondClassify[that.data.classIndex].instances[that.data.videoIndex].times;
    for (var i = times.length - 1; i >= 0; i--) {
      if (that.data.time > times[i]) {
        this.videoContext.seek(times[i - 1]);
        break;
      }
    }
  },
  //点击跳下一个进度
  next: function () {
    var that = this;
    var times = that.data.secondClassify[that.data.classIndex].instances[that.data.videoIndex].times;
    for (var i = 0; i < times.length; i++) {
      if (that.data.time < times[i]) {
        this.videoContext.seek(times[i]);
        break;
      }
    }
  },
  //切换全屏时
  fullscreenchange: function () {
    var that = this;
    let firstLogin = Number(wx.getStorageSync("firstLogin"));
    console.log(firstLogin,typeof firstLogin);
    if (this.data.cover_view == "hide") {
      setTimeout(function () {
        that.setData({
          cover_view: "cover",
          firstLogin: firstLogin
        })
      }, 1000);
    } else {
      this.setData({
        cover_view: "hide"
      })
    }
  },
  //加入看单
  addToList: function () {
    if (!this.data.isadd) {
      this.setData({
        isadd: true
      })
      app.pictureBook.addUserInstanceList(this.data.seriesId, this.data.vid);
      wx.showToast({
        title: '已加入看单',
        duration: 2000
      })
    } else {
      this.setData({
        isadd: false
      })
      app.pictureBook.addUserInstanceList(this.data.seriesId, this.data.vid);
      wx.showToast({
        title: '已从看单移除',
        duration: 2000
      })
    }
  },
  //切换集数
  changeVideo: function (e) {
    var that = this;
    that.addBrowser();
    app.pictureBook.updateBrowserTime(this.data.browser_id);
    app.pictureBook.updateTimelength(this.data.history_id, this.data.time, function () {
      var cur = [];
      var index = e.currentTarget.dataset.index
      cur[index] = "cur";
      that.setData({
        cur: cur,
        videoIndex: index,
        vid: that.data.secondClassify[that.data.classIndex].instances[index].id,
        isadd: that.data.secondClassify[that.data.classIndex].instances[index].isadd,
        videoUrl: that.data.secondClassify[that.data.classIndex].instances[index].instance_video_url
      })
    });
  },
  //添加浏览记录
  addBrowser: function () {
    var that = this;
    //添加应用实例浏览记录
    app.pictureBook.addBrowser
      (
      that.data.vid,
      function (rbs) {
        that.data.browser_id = rbs.data.data.browser_id;
      }
      );
    app.pictureBook.addHistory(that.data.vid, function (res) {
      that.setData({
        history_id: res.data.data.history_id
      })
    })
  },
  //更新播放时间
  timeUpdate: function (e) {
    var time = Math.floor(e.detail.currentTime);
    this.data.time = time;
  },
  //隐藏简介
  hideInfo: function () {
    if (this.data.infoStyle == "") {
      this.setData({
        infoStyle: "-hide"
      })
    }
    else {
      this.setData({
        infoStyle: ""
      })
    }
  },
  //开始播放
  toPlay: function () {
    var that = this;
    if (!this.data.canPlay) {
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType !== "wifi") {
            that.videoContext.pause();
            wx.showModal({
              title: '当前不是WIFI状态',
              content: '是否继续播放？',
              success: function (res) {
                if (res.confirm) {
                  that.setData({ canPlay: true })
                  that.videoContext.play();
                } else if (res.cancel) {
                  var url = that.data.videoUrl;
                  that.setData({
                    videoUrl: ""
                  })
                  that.setData({
                    videoUrl: url
                  })
                }
              }
            })
          }
        },
      })
    }
  },

  notDisplay() {
    this.setData({firstLogin: false});
    wx.setStorageSync('firstLogin', "0");
  }

})