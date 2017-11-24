// evaluation.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    evaluationInfo: {
      sentenceId: 0,
      totalSocre: 0,
      accuracySocre: 0,
      fluencySocre: 0,
      integritySocre: 0,
      speechFilePath: "",
      speechSeconds: 0,
      sentence: null,
      enText: "",
      // evaluation_count: 0,
      bookId: 0,
      isFree: false
    },
    audioIcon: "/pages/images/audio_img.png",
    isPlayingAudio: false,
    audioInitSeconds: 2,
    audioSeconds: 2,
    audioTime: "00:00",
    ok: false,
    isPK: false,
    // 支付相关参数
    payInfo: {
      isBuy: false,
      name: "",
      price: "",
      pic: "",
      count: 0
    },
    isPaying: false,
    payShow: false,
    // 支付相关参数END
    id: 0,
    evaluation_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo
      (
      function (userInfo) {
        if (userInfo.avatarUrl == "") {
          userInfo.avatarUrl = "../images/user_default.png"
        }
        //更新数据
        that.setData
          (
          {
            userInfo: userInfo
          }
          )
      }
      );
    that.setData({ id: options.id, })
    if (options.isEvalution == 1) {
      app.speechEvalution.getEvaluationById(
        options.id,
        function (res) {
          console.log(res);
          that.setData({
            evaluationInfo: {
              sentenceId: options.id,
              totalSocre: res.data.data.score,
              accuracySocre: res.data.data.accuracy,
              fluencySocre: res.data.data.fluency,
              integritySocre: res.data.data.integrity,
              speechFilePath: res.data.data.record_audio_url,
              speechSeconds: res.data.data.record_sentence_duration,
              sentence: JSON.parse(res.data.data.record_sentence),
              // evaluation_count: res.data.data.evaluation_count,
              bookId: res.data.data.book_id,
              isFree: res.data.data.is_free == 0 ? false : true
            },
            evaluation_count: res.data.data.evaluation_count,
          });
          //console.log(that.data.evaluationInfo);
          that.data.audioInitSeconds = that.data.evaluationInfo.speechSeconds;
          that.data.audioSeconds = that.data.evaluationInfo.speechSeconds;
          that.audioCtx = wx.createAudioContext('myAudio');
          that.setAudioTime();//时间初始化

          if (that.data.evaluationInfo.bookId) {//可能是主题句子
            app.speechEvalution.getSeedInfoByBookId(
              that.data.evaluationInfo.bookId,
              function (subRes) {
                console.log(subRes);
                that.setData(
                  {
                    payInfo:
                    {
                      isBuy: res.data.data.is_pay == 0 ? false : true,
                      name: subRes.data.data.book_name,
                      pic: subRes.data.data.book_pic,
                      price: subRes.data.data.sale_price,
                      count: subRes.data.data.sentence_count
                    }
                  });
              }
            );
          }
        }
      );
    }
    else {
      that.setData({
        evaluationInfo: {
          sentenceId: options.id,
          totalSocre: options.totalSocre,
          accuracySocre: options.accuracySocre,
          fluencySocre: options.fluencySocre,
          integritySocre: options.integritySocre,
          speechFilePath: options.speechFilePath,
          speechSeconds: options.speechSeconds,
          sentence: app.globalData.currentData.sentence
        }
      });
      app.speechEvalution.saveEvalaution(
        that.data.evaluationInfo,
        function (res) {
          console.log("saveEvalaution");
          console.log(res);
        }
      );
    }
    that.data.audioInitSeconds = that.data.evaluationInfo.speechSeconds;
    that.data.audioSeconds = that.data.evaluationInfo.speechSeconds;
    that.audioCtx = wx.createAudioContext('myAudio');
    that.setAudioTime();//时间初始化
  },
  playAudio: function () {
    var that = this;
    if (!that.data.isPlayingAudio) {
      that.setData({ isPlayingAudio: true, audioIcon: "/pages/images/audio_img-stop.png" });
      that.audioCtx.play();
      that.timeKeep();
    }
    else {
      that.setData({ isPlayingAudio: false, audioIcon: "/pages/images/audio_img.png" });
      that.audioCtx.pause();
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
  audioPlayEnd: function () {
    var that = this;
    that.setData({ audioSeconds: that.data.audioInitSeconds });
    that.setAudioTime();
    that.setData({ isPlayingAudio: false, audioIcon: "/pages/images/audio_img.png" });
    that.setData({ isPlayingRecord: false, recordplayIcon: "/pages/images/record-play.png" });
  },
  setAudioTime: function () {
    var that = this;
    //console.log(that.data.audioSeconds);
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
  gotoDetail: function () {
    var that = this;
    wx.navigateBack({
      delta: 1
    })
  },
  launchPK: function () {
    var that = this;
    that.setData({ isPK: true });
    that.audioCtx.pause();
  },
  closePK: function () {
    var that = this;
    that.setData({ isPK: false, });
    if (that.data.isPlayingAudio) {
      that.audioCtx.play();
    } else {
      // that.setData({ isPlayingAudio: false })
      // that.audioCtx.pause();
    }
    app.speechEvalution.getEvaluationById(that.data.id, function (res) {
      that.setData({
        evaluation_count: res.data.data.evaluation_count,
      })
    });

  },
  gotoRankingDetail: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var url = '/pages/ranking/detail/detail?id=' + that.data.evaluationInfo.sentenceId + '&organiser_uid=' + app.globalData.weixinUserInfo.weixinUser.uid + '&challenger_uid=' + app.globalData.weixinUserInfo.weixinUser.uid;
    app.commonNavigateTo(url);
    // wx.navigateTo({
    //   url: '/pages/ranking/detail/detail?id=' + that.data.evaluationInfo.sentenceId + '&organiser_uid=' + app.globalData.weixinUserInfo.weixinUser.uid + '&challenger_uid=' + app.globalData.weixinUserInfo.weixinUser.uid
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
  onShow: function (options) {

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
  onShareAppMessage: function (res) {
    var that = this;
    var title = "比比谁的口语强";
    var path = "/pages/ranking/detail/detail?id=" + that.data.evaluationInfo.sentenceId + '&organiser_uid=' + app.globalData.weixinUserInfo.weixinUser.uid;
    var imgUrl = "http://f3.5rs.me/upload/20170916/2017_09_16_144905293.png";
    return app.onShareAppMessage(title, path, imgUrl, 0, "evaluation", "小程序码书阅读分享",
      function (res) {
        //创建当前用户的PK
        app.speechEvalution.addEvaluationPK(
          that.data.evaluationInfo.sentenceId,
          app.globalData.weixinUserInfo.weixinUser.uid,
          app.globalData.weixinUserInfo.weixinUser.uid,
          function (res) {
            console.log(res);
          }
        );
      }
    );
  },
  //是否推送
  yesOrNo: function () {
    let that = this;
    that.setData({
      ok: !that.data.ok
    })
  },
  //支付相关函数
  gotoPay: function () {
    var that = this;
    that.setData({ payShow: true });
  },
  fastBuySeed: function () {
    var that = this;
    if (!that.data.isPaying) {
      that.data.isPaying = true;
      if (that.data.evaluationInfo.bookId) {
        app.fastBuySeed(
          that.data.evaluationInfo.bookId,
          0,
          function (res) {
            that.payClose();
            wx.showToast({
              title: '支付成功',
            });
            that.data.isPaying = false;
            that.data.payInfo.isBuy = true;
            that.setData({ payInfo: that.data.payInfo });
          },
          function(res) {
            that.data.isPaying = false;
          }
        );
      }
      else {
        wx.showToast({
          title: '找不到书籍信息',
        });
      }
    }
  },
  payClose: function () {
    var that = this;
    that.setData({ payShow: false });
  },
  //支付相关函数END
})