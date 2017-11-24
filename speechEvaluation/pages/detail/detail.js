// detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    nextId: 0,
    prevId: 0,
    info: null,
    audioIcon: "/pages/images/audio-play.png",
    isPlayingAudio: false,
    audioInitSeconds: 2,
    audioSeconds: 2,
    audioTime: "00:00",
    recordIcon: "/pages/images/record-hover.png",
    recordStaus: -1, //-1未录音；0正在录音；1录音完成
    tempRecordFilePath: "",
    recordplayIcon: "/pages/images/record-play.png",
    isPlayingRecord: false,
    recordSeconds: 0,
    recordTime: "00:00",
    evaluationState: 0,//0没有测评，-1测评失败，1测评成功
    evaluationInfo: {
      totalSocre: 0,
      accuracySocre: 0,
      fluencySocre: 0,
      integritySocre: 0,
      speechFilePath: "",
      speechSeconds: 0,
      sentenceId: 0,
      sentence: null
    },
    loading: {
      isShow: false,
      text: ""
    },
    isPoster: false,
    posterUrl: "",
    sentence_type: "",
    currentAudio: "",
    isRecordTip: true
  },
  playAudio: function () {
    var that = this;
    if (that.data.recordStaus != 0) {
      that.setData({ isPlayingRecord: false, recordplayIcon: "/pages/images/record-play.png" });
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
    }
    else {
      wx.showToast({
        title: '正在录音',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.weixinUserInfo) {
      that.data.id = options.id;
      that.data.sentence_type = options.sentence_type;
      app.speechEvalution.getSentenceById(
        that.data.id,
        that.data.sentence_type,
        function (res) {
          console.log(res);
          that.setData(
            {
              info: res.data.data.current,
              nextId: res.data.data.next_id,
              prevId: res.data.data.prev_id,
              audioInitSeconds: res.data.data.current.sentence_duration,
              audioSeconds: res.data.data.current.sentence_duration,
              evaluationState: (res.data.data.current.is_evaluation) ? 1 : 0,
              recordStaus: (res.data.data.current.is_evaluation) ? 1 : -1
            });
          that.audioCtx = wx.createAudioContext('myAudio');
          that.setAudioTime();//时间初始化
          app.globalData.currentData.enText = that.data.info.sentence;
        }
      );

      //设置录音提示缓存
      try {
        var isRecordTip = wx.getStorageSync('isRecordTip')
        if (isRecordTip) {

        } else {
          wx.setStorage({
            key: "isRecordTip",
            data: false
          });
          that.setData({ isRecordTip: false })
        }
      } catch (e) {
        // Do something when catch error
      }
      //设置录音提示缓存END
    } else {
      app.uidCallback = function () {
        that.data.id = options.id;
        that.data.sentence_type = options.sentence_type;
        app.speechEvalution.getSentenceById(
          that.data.id,
          that.data.sentence_type,
          function (res) {
            console.log(res);
            that.setData(
              {
                info: res.data.data.current,
                nextId: res.data.data.next_id,
                prevId: res.data.data.prev_id,
                audioInitSeconds: res.data.data.current.sentence_duration,
                audioSeconds: res.data.data.current.sentence_duration,
                evaluationState: (res.data.data.current.is_evaluation) ? 1 : 0,
                recordStaus: (res.data.data.current.is_evaluation) ? 1 : -1
              });
            that.audioCtx = wx.createAudioContext('myAudio');
            that.setAudioTime();//时间初始化
            app.globalData.currentData.enText = that.data.info.sentence;
          }
        );

        //设置录音提示缓存
        try {
          var isRecordTip = wx.getStorageSync('isRecordTip')
          if (isRecordTip) {

          } else {
            wx.setStorage({
              key: "isRecordTip",
              data: false
            });
            that.setData({ isRecordTip: false })
          }
        } catch (e) {
          // Do something when catch error
        }
        //设置录音提示缓存END
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
  audioPlayEnd: function () {
    var that = this;
    that.setData({ audioSeconds: that.data.audioInitSeconds });
    that.setAudioTime();
    that.setData({ isPlayingAudio: false, audioIcon: "/pages/images/audio-play.png" });
    that.setData({ isPlayingRecord: false, recordplayIcon: "/pages/images/record-play.png" });
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
  secondsToTime: function (seconds) {
    if (seconds <= 0) {
      return "00:00";
    }
    var mintue = parseInt(seconds / 60);
    if (mintue < 10) {
      mintue = "0" + mintue;
    }
    var second = seconds % 60;
    if (second < 10) {
      second = "0" + second;
    }
    return mintue + ":" + second;
  },
  recordOption: function () {
    var that = this;
    if (that.data.recordStaus == -1) {
      that.setData({
        recordStaus: 0,
        recordIcon: "/pages/images/record-stop.png",
        recordSeconds: 0,
        recordTime: "00:00"
      });
      that.setData({ tempRecordFilePath: "1" });//避免卡顿的机器出现分数为null的情况
      wx.getSetting({
        success: function (res) {
          console.log(res);
          if (!res.authSetting['scope.record'] || res.authSetting['scope.record'] != undefined) {
            wx.authorize({
              scope: 'scope.record',
              success: function (errMsg) {
                // 用户已经授权录音  
                console.log(errMsg);
                cun();
              },
              fail: function () {
                console.log("保存成功")
                // 用户没有授权录音
                wx.openSetting({
                  success: function (res) {
                    that.setData({
                      recordStaus: -1,
                      recordIcon: "/pages/images/record-hover.png",
                      recordSeconds: 0,
                      recordTime: "00:00"
                    });
                    // 用户已经授权录音
                  },
                  fail: function (res) {
                  }
                })
              }
            })
          } else {
            // 用户已经授权录音
            cun();
          }
        }
      })

      function cun() {
        that.audioPlayEnd();
        that.audioCtx.pause();
        that.calaRecordTime();
        wx.startRecord({
          success: function (res) {
            that.setData({
              loading: {
                isShow: true,
                text: "正在测评"
              }
            });
            that.setData({ tempRecordFilePath: res.tempFilePath });
            wx.uploadFile({
              //url: 'https://f3.5rs.me/index.aspx?method=speechEvaluation',
              url: 'http://devefile.chubanyun.net/index.aspx?method=speechEvaluation',
              //url: 'http://loc.file.chubanyun.net/index.aspx?method=speechEvaluation',
              filePath: that.data.tempRecordFilePath,
              formData: { enText: that.data.info.sentence_evaluation == null ? that.data.info.sentence : that.data.info.sentence_evaluation },
              name: 'file',
              success: function (res) {
                console.log(res.data);
                var info = JSON.parse(res.data);
                if (info.success) {
                  that.data.evaluationState = 1;
                  that.data.info.is_evaluation = true;
                  that.setData({
                    evaluationInfo: {
                      totalSocre: info.data.totalSocre,
                      accuracySocre: info.data.accuracySocre,
                      fluencySocre: info.data.fluencySocre,
                      integritySocre: info.data.integritySocre,
                      speechFilePath: info.data.speechFilePath,
                      speechSeconds: info.data.speechSeconds,
                      sentenceId: that.data.id,
                      sentence: info.data.sentence
                    }
                  });
                  app.globalData.currentData.sentence = info.data.sentence;
                  //保存评测
                  app.speechEvalution.saveEvalaution(
                    that.data.evaluationInfo,
                    function (res) {
                      console.log("saveEvalaution");
                      console.log(res);
                    }
                  );
                  that.setData({
                    loading: {
                      isShow: false,
                      text: "正在测评"
                    }
                  });
                }
                else {
                  that.data.evaluationState = -1;
                }
              }
            });
          },
          fail: function (res) {
            that.setData({
              recordStaus: -1,
              recordIcon: "/pages/images/record-hover.png",
              recordSeconds: 0,
              recordTime: "00:00"
            })
            //录音失败
            wx.showToast({
              title: '录音失败',
              icon: 'success',
              duration: 2000
            })
          }
        });
      }

    }
    else if (that.data.recordStaus == 0) {
      that.setData({ recordStaus: 1 });
      wx.stopRecord();
    }
  },
  calaRecordTime: function () {
    var that = this;
    if (that.data.recordStaus == 0) {
      setTimeout(function () {
        that.setData({
          recordSeconds: that.data.recordSeconds + 1,
          recordTime: that.secondsToTime(that.data.recordSeconds + 1)
        });
        if (that.data.recordSeconds < 60) {
          that.calaRecordTime();
        }
        else {
          that.recordOption();
        }
      }, 1000);
    }
  },
  recordPlay: function () {
    var that = this;
    that.setData({ isPlayingAudio: false, audioIcon: "/pages/images/audio-play.png" });
    var audio = that.data.evaluationInfo.speechFilePath;
    if (audio != that.data.currentAudio) {
      that.audioCtx.setSrc(audio);
    }
    if (that.data.isPlayingRecord && audio == that.data.currentAudio) {
      that.setData({ isPlayingRecord: false, recordplayIcon: "/pages/images/record-play.png" });
      that.audioCtx.pause();
    }
    else {
      that.setData({ isPlayingRecord: true, recordplayIcon: "/pages/images/record-stop.png" });
      that.audioCtx.play();
    }
    that.data.currentAudio = audio;
  },
  reRecord: function () {
    var that = this;
    var that = this;
    that.setData({ recordStaus: -1, recordIcon: "/pages/images/record-hover.png", evaluationState: 0 });
    that.data.info.is_evaluation = false;
  },
  evaluation: function () {
    var that = this;
    that.audioPlayEnd();
    that.audioCtx.pause();
    if (that.data.info.is_evaluation) {
      var url = '/pages/evaluation/evaluation?id=' + that.data.info.id + '&isEvalution=1';
      app.commonNavigateTo(url);
      // wx.navigateTo({
      //     url: '/pages/evaluation/evaluation?id=' + that.data.info.id + '&isEvalution=1'
      // });
    }
    else {
      that.setData({
        loading: {
          isShow: true,
          text: "正在测评"
        }
      });
      that.evaluationTimer();
    }
    //详情页支付（已弃用）
    // if (that.data.payInfo.isBuy || that.data.info.is_free == 1) {
    //   wx.navigateTo({
    //     url: '/pages/evaluation/evaluation?id=' + that.data.info.id + '&isEvalution=1'
    //   });
    // }
    // else {
    //   that.setData({ payShow: true });
    // }
  },
  evaluationTimer: function () {
    var that = this;
    if (that.data.evaluationState == 1) {
      that.setData({
        loading: {
          isShow: false,
          text: "正在测评"
        }
      });
      wx.navigateTo({
        //url: '/pages/evaluation/evaluation?id=' + that.data.info.id + '&isEvalution=0&totalSocre=' + that.data.evaluationInfo.totalSocre + '&accuracySocre=' + that.data.evaluationInfo.accuracySocre + '&fluencySocre=' + that.data.evaluationInfo.fluencySocre + '&integritySocre=' + that.data.evaluationInfo.integritySocre + '&speechFilePath=' + that.data.evaluationInfo.speechFilePath + '&speechSeconds=' + that.data.evaluationInfo.speechSeconds
        url: '/pages/evaluation/evaluation?id=' + that.data.info.id + '&isEvalution=1'
      });
    }
    else if (that.data.evaluationState == -1) {
      //测评失败提示
      that.setData({
        loading: {
          isShow: false,
          text: "正在测评"
        }
      });
      wx.showToast({
        title: '测评失败,请检查网络',
        icon: 'success',
        duration: 2000
      });
    }
    else {
      setTimeout(function () {
        that.evaluationTimer();
      }, 1000);
    }
  },
  createPoster: function () {
    var that = this;
    that.setData({
      loading: {
        isShow: true,
        text: "正在生成海报"
      }
    });
    app.speechEvalution.createPoster(
      that.data.id,
      function (res) {
        if (res.data.data.success) {
          that.setData({ posterUrl: res.data.data.data });
          that.showPoster();
        }
        that.setData({
          loading: {
            isShow: false,
            text: "正在生成海报"
          }
        });
      }
    );
  },
  showPoster: function () {
    var that = this;
    that.setData({ isPoster: true });
  },
  closePoster: function () {
    var that = this;
    that.setData({ isPoster: false });
  },
  savePoster: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.writePhotosAlbum'] && res.authSetting['scope.writePhotosAlbum'] != undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              // 用户已经授权保存相册
              saveImg();
            },
            fail: function () {
              console.log("保存成功")
              // 用户没有授权保存相册
              wx.openSetting({
                success: function (res) {
                  // 用户已经授权保存相册
                  saveImg();
                },
                fail: function (res) {
                }
              })
            }
          })
        } else {
          // 用户已经授权保存相册
          saveImg();
        }
      }
    })

    function saveImg() {
      wx.downloadFile({
        //url: that.data.posterUrl.replace(/http:/g, "https:"),
        url: that.data.posterUrl,
        success: function (res) {
          console.log(that.data.posterUrl);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast
                (
                {
                  title: "保存成功",
                  icon: 'success',
                  duration: 2000
                }
                )
            },
            fail() {
              wx.showToast
                (
                {
                  title: "保存失败",
                  icon: 'success',
                  duration: 2000
                }
                )
            }
          })
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "保存失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      });
      that.closePoster();
    }
  },
  gotoDetail: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id
    if (id > 0) {
      wx.redirectTo({
        url: '/pages/detail/detail?id=' + id + "&sentence_type=" + that.data.sentence_type
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
    var that = this;
    var title = "";
    var imageUrl = "";
    var path = "/pages/detail/detail?id=" + that.data.id + "&sentence_type=" + that.data.sentence_type;
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl, "小程序口语测评分享");
  },
  gotoHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  gotoItem: function (event) {
    var that = this;
    var bookId = event.currentTarget.dataset.bookId;
    var title = event.currentTarget.dataset.title;
    var url = '/pages/item/item?id=' + bookId + "&title=" + title + "&type=book";
    if (that.data.sentence_type == 'book') {
      app.commonNavigateTo(url);
    }

    // wx.navigateTo({
    //   url: url
    // })
  },
  closeRecordTip: function () {
    var that = this;
    wx.setStorage({
      key: "isRecordTip",
      data: true
    });
    that.setData({ isRecordTip: true })
  }
})