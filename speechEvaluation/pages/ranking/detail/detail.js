// pages/ranking/detail/detail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    userInfo: null,
    audioIcon: "/pages/images/audio-play.png",
    isPlayingAudio: false,
    audioInitSeconds: 2,
    audioSeconds: 2,
    audioTime: "00:00",
    rankings: [],
    pageIndex: 1,
    pageSize: 100,
    audioIconList: [],
    isPlayRcord: false,
    currentAudio: "",
    sentence_id: 0,
    organiser_uid: 0,
    uid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.weixinUserInfo) {
      that.setData({ uid: app.globalData.weixinUserInfo.weixinUser.uid });
      that.data.sentence_id = options.id;
      that.data.organiser_uid = options.organiser_uid;
      app.speechEvalution.getRankings(
        that.data.sentence_id,
        that.data.organiser_uid,
        function (res) {
          console.log("rankings", res);
          that.setData({ rankings: res.data.data.rankings });
          for (var i = 0; i < that.data.rankings.length; i++) {
            that.data.audioIconList.push('http://f3.5rs.me/upload/20170608/2017_06_08_165146276.png');
          }
          that.setData({ audioIconList: that.data.audioIconList });
        }
      );
      app.speechEvalution.getSentenceById(
        that.data.sentence_id,
        "evaluation",
        function (res) {
          console.log(res);
          that.setData(
            {
              info: res.data.data.current,
              audioInitSeconds: res.data.data.current.sentence_duration,
              audioSeconds: res.data.data.current.sentence_duration,
              evaluationState: (res.data.data.current.is_evaluation) ? 1 : 0,
            });
          that.audioCtx = wx.createAudioContext('myAudio');
          that.setAudioTime();//时间初始化        
        }
      );
    } else {
      app.uidCallback = function () {
        that.setData({ uid: app.globalData.weixinUserInfo.weixinUser.uid });
        that.data.sentence_id = options.id;
        that.data.organiser_uid = options.organiser_uid;
        app.speechEvalution.getRankings(
          that.data.sentence_id,
          that.data.organiser_uid,
          function (res) {
            console.log("rankings", res);
            that.setData({ rankings: res.data.data.rankings });
            for (var i = 0; i < that.data.rankings.length; i++) {
              that.data.audioIconList.push('http://f3.5rs.me/upload/20170608/2017_06_08_165146276.png');
            }
            that.setData({ audioIconList: that.data.audioIconList });
          }
        );
        app.speechEvalution.getSentenceById(
          that.data.sentence_id,
          "evaluation",
          function (res) {
            console.log(res);
            that.setData(
              {
                info: res.data.data.current,
                audioInitSeconds: res.data.data.current.sentence_duration,
                audioSeconds: res.data.data.current.sentence_duration,
                evaluationState: (res.data.data.current.is_evaluation) ? 1 : 0,
              });
            that.audioCtx = wx.createAudioContext('myAudio');
            that.setAudioTime();//时间初始化        
          }
        );
      }
    }

  },
  timeKeep: function () {
    var that = this;
    that.setAudioTime();
    that.setData({ audioSeconds: that.data.audioSeconds - 1 });
    if (that.data.isPlayingAudio) {
      setTimeout(function () {
        that.timeKeep();
      }, 1000);
    }
    else {

    }
  },
  playAudio: function () {
    var that = this;
    if (that.data.info.sentence_mp3_url != that.data.currentAudio) {
      that.audioCtx.setSrc(that.data.info.sentence_mp3_url);
      that.data.currentAudio = that.data.info.sentence_mp3_url;
    }
    if (!that.data.isPlayingAudio) {
      that.setData({ isPlayingAudio: true, audioIcon: "/pages/images/audio-stop.png" });

      that.audioCtx.play();
      that.timeKeep();
    }
    else {
      that.setData({ isPlayingAudio: false, audioIcon: "/pages/images/audio-play.png" });
      that.audioCtx.pause();
    }
    that.audioIconListColse();
  },
  audioPlayEnd: function () {
    var that = this;
    that.setData({ audioSeconds: that.data.audioInitSeconds });
    that.setAudioTime();
    that.setData({ isPlayingAudio: false, audioIcon: "/pages/images/audio-play.png" });
    that.audioIconListColse();
  },
  setAudioTime: function () {
    var that = this;
    if (that.data.audioSeconds <= 0) {
      that.setData({ audioTime: "00:00" });
      return;
    }
    var mintue = parseInt(that.data.audioSeconds / 60);
    if (mintue < 10) {
      mintue = "0" + mintue;
    }
    var second = that.data.audioSeconds % 60;
    if (second < 10) {
      second = "0" + second;
    }
    that.setData({ audioTime: mintue + ":" + second });
  },
  playRecord: function (event) {
    var that = this;
    that.audioPlayEnd();
    var audio = event.currentTarget.dataset.audio;
    if (audio != that.data.currentAudio) {
      that.audioCtx.setSrc(audio);
    }
    var index = event.currentTarget.dataset.index;
    that.audioIconListColse();
    if (that.data.isPlayRcord && audio == that.data.currentAudio) {
      that.data.audioIconList[index] = 'http://f3.5rs.me/upload/20170608/2017_06_08_165146276.png';
      that.setData({ audioIconList: that.data.audioIconList, isPlayRcord: false });
      that.audioCtx.pause();
    }
    else {
      that.data.audioIconList[index] = 'http://f3.5rs.me/upload/20170608/2017_06_08_151149540.gif';
      that.setData({ audioIconList: that.data.audioIconList, isPlayRcord: true });
      that.audioCtx.play();
    }
    that.data.currentAudio = audio;
  },
  audioIconListColse: function () {
    var that = this;
    for (var i = 0; i < that.data.audioIconList.length; i++) {
      that.data.audioIconList[i] = 'http://f3.5rs.me/upload/20170608/2017_06_08_165146276.png';
    }
    that.setData({ audioIconList: that.data.audioIconList });
  },
  gotoDetail(event) {
    var that = this;
    var url = '/pages/detail/detail?id=' + that.data.sentence_id + "&sentence_type=evaluation";
    app.commonNavigateTo(url);
    // wx.navigateTo({
    //   url: '/pages/detail/detail?id=' + that.data.sentence_id + "&sentence_type=evaluation"
    // })
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
    var that = this;
    if (app.globalData.weixinUserInfo) {
      app.speechEvalution.getRankings(
        that.data.sentence_id,
        that.data.organiser_uid,
        function (res) {
          console.log(res);
          that.setData({ rankings: res.data.data.rankings });
          for (var i = 0; i < that.data.rankings.length; i++) {
            that.data.audioIconList.push('http://f3.5rs.me/upload/20170608/2017_06_08_165146276.png');
          }
          that.setData({ audioIconList: that.data.audioIconList });
        }
      );
    } else {
      app.uidCallback2 = function () {
        app.speechEvalution.getRankings(
          that.data.sentence_id,
          that.data.organiser_uid,
          function (res) {
            console.log(res);
            that.setData({ rankings: res.data.data.rankings });
            for (var i = 0; i < that.data.rankings.length; i++) {
              that.data.audioIconList.push('http://f3.5rs.me/upload/20170608/2017_06_08_165146276.png');
            }
            that.setData({ audioIconList: that.data.audioIconList });
          }
        );
      }
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
    var title = that.data.rankings.length + "个好友参与了PK，快来参加吧！";
    var path = "/pages/ranking/detail/detail?id=" + that.data.sentence_id + "&organiser_uid=" + that.data.organiser_uid;
    //console.log(path);
    var imageUrl = '';
    return app.onShareAppMessage(title, path, "", 0, "evaluation", imageUrl, "小程序口语测评分享");
  }
})