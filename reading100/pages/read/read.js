// pages/read/read.js
var util = require('../../utils/util.js')
var interval;
var time = 0;
var listenInterval;
var scrollTimeout;
var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index_cur: 0,
    title: "",
    bookId: 0,
    uid: 0,
    timeBeginText: "00:00",
    timeEndText: "00:00",
    proLoadWidth: "0%",
    proLightWidth: "0%",
    playPauseStyle: "play-out",
    progressValue: 0,
    progressMax: NaN,
    mp3Url: "",
    playStyle: "",
    angle: 0,
    noWifiPlay: false,
    lrc: [],
    lrc_display: true,
    lrc_blur: "blur",
    lrc_distance: 0,
    cur_lrc: [],
    lrc_index: 0,
    circle_style: "liebiao",
    isLrcSlide: false,//防止跳歌词时出现三角
    isShare: false,
    //底部样式
    controls_lrc: "control-lrc",
    isDragged: false,
    listShow: false,
    noDouble: true,
    // 支付
    isPay: 0,
    key_rest_count: 0,
    isKey: 0,
    isPaying: false,
    money: "5.00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var lesson_id = options.lesson_id;
    var index = 0;
    that.setData({
      bookId: options.book_id,
      circle_style: "liebiao",
      isShare: options.share
    })
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth
        })
      },
    });
    //如果从分享进入
    if (options.share == "true") {
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          // that.adviserIdFun();
          // that.addBrowser();
          let share_uid = options.share_uid;
          app.read.getCardByShare(share_uid, function (res) {
            console.log("增加钥匙", res);
            app.read.addBookById(that.data.bookId);
            // app.Writing.bindUserAndAdviser(options.adviser_id);
          });
          that.load(options.book_id, options.lesson_id, options.time);
        });
      } else {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        // that.adviserIdFun();
        // that.addBrowser();
        let share_uid = options.share_uid;
        app.read.getCardByShare(share_uid, function (res) {
          console.log("增加钥匙", res);
          app.read.addBookById(that.data.bookId);
          // app.Writing.bindUserAndAdviser(options.adviser_id);
          that.load(options.book_id, options.lesson_id, options.time);
        });
      }
    }else{
      that.load(options.book_id, options.lesson_id, options.time);
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
    // this.pause();
  },

  /**
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {
    var that = this;
    that.setData({
      circle_style: "onUnload"
    })
    var lastClass = {
      bookId: that.data.bookId,
      lesson_id: that.data.list[that.data.index_cur].id,
      time: that.data.progressValue
    }
    wx.setStorageSync("lastClass", lastClass);
    wx.stopBackgroundAudio();
    clearInterval(interval);
    time = 0;
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
    var lesson_id = this.data.list[this.data.index_cur].id;
    var bookId = this.data.bookId;
    var uid = this.data.uid;
    return {
      title: this.data.title,
      path: `pages/read/read?lesson_id=${lesson_id}&book_id=${bookId}&share=true&share_uid=${uid}`
    }
  },
  //加载数据
  load: function (bookId,lesson_id, o_time) {
    var that = this;
    var index = 0;
    // 获取用户钥匙
    that.getUserKeyCount();
    // var index = that.data.index_cur;
    app.read.getList(bookId, function (res) {
      for (var key in res.data) {
        if (res.data[key].lesson_subtitle_url) {
          var url = 'https:' + res.data[key].lesson_subtitle_url.split(":")[1];
          res.data[key].lesson_subtitle_url = url;
        } else {
          wx.showToast({
            title: '歌词维护中',
            duration: 3000
          })
          continue;
        }
      }
      that.setData({
        list: res.data
      })
      for (var key = 0; key < that.data.list.length; key++) {
        if (that.data.list[key].id == lesson_id) {
          index = key;
        }
      }
      that.setData({
        index_cur: index
      });
      var url = res.data[index].lesson_audio_url;
      var minute = String(res.data[index].lesson_time_length / 60).split(".")[0]
      var second = res.data[index].lesson_time_length % 60;
      var mp3Length = util.formatNumber(minute) + ":" + util.formatNumber(second);
      if (!res.data[index].lesson_time_length) {
        minute = 0;
        second = 0;
        wx.showToast({
          title: '获取音频失败',
          duration: 2000
        })
      }
      that.setData({
        mp3Url: url,
        progressMax: res.data[index].lesson_time_length,
        timeEndText: mp3Length,
        title: res.data[index].lesson_name,
        bookName: res.data[0].book_name,
        bookPic: res.data[0].book_pic
      })
      that.toPlay();
      wx.request({
        url: that.data.list[index].lesson_subtitle_url,
        success: function (res) {
          that.setData({
            lrc: that.parseLyric(res.data)
          })
        },
      })
      wx.setNavigationBarTitle({
        title: `《${that.data.title}》`,
      })
      if (o_time) {
        var time = o_time;
        var minute = String(time / 60).split(".")[0]
        var second = time % 60;
        minute = Math.floor(minute);
        second = Math.floor(second);
        var now = util.formatNumber(minute) + ":" + util.formatNumber(second);
        that.setData({
          progressValue: Number(time),
          timeBeginText: now
        })
        wx.seekBackgroundAudio({
          position: that.data.progressValue,
        })
      }
    })
  },

  //监听
  listen: function () {
    var that = this;
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        if (res.currentPosition == NaN) {
          res.currentPosition = 0;
        }
        res.currentPosition += 1;
        if (res.currentPosition > that.data.progressMax) {
          res.currentPosition = that.data.progressMax;
        }
        var minute = String(res.currentPosition / 60).split(".")[0];
        var second = res.currentPosition % 60;
        minute = Math.floor(minute);
        second = Math.floor(second);
        var now = util.formatNumber(minute) + ":" + util.formatNumber(second);
        if (now == "NaN:NaN") {
          now = "00:00";
        }
        that.setData({
          progressValue: res.currentPosition,
          timeBeginText: now
        })
        that.lrcSlide();
        wx.onBackgroundAudioStop(function () {
          if (that.data.timeBeginText !== that.data.timeEndText) {
            that.pause();
            return false;
          }
          console.log("in")
          if (that.data.circle_style == 'onUnload') {
            console.log("onUnload")
            return false;
          }
          if (that.data.circle_style == 'liebiao') {
            console.log("列表循环");
            that.audioNext();
          } else {
            console.log("单曲循环")
            time = 0;
            that.setData({
              timeBeginText: "00:00",
              progressValue: 0,
              angle: 0
            })
            that.pause();
            that.toPlay();
          }
        })
        if (that.data.progressValue > 30 || that.data.progressValue == 30) {
          if (!that.data.list[that.data.index_cur].iskey && !that.data.list[that.data.index_cur].isPay) {
            that.showPayBox();
            that.pause();
          }
        }
      }
    })
  },
  //开始播放
  toPlay: function () {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        //非wifi状态下验证
        if (networkType !== "wifi") {
          //已经验证过
          if (that.data.noWifiPlay) {
            that.startPlay();
          }
          //未验证过
          else {
            wx.showModal({
              title: '当前网络非WiFi状态',
              content: '是否继续播放？',
              success: function (res) {
                if (res.confirm) {
                  that.startPlay();
                  that.setData({
                    noWifiPlay: true
                  })
                } else if (res.cancel) {
                  return false
                }
              }
            })
          }
        } else {
          that.startPlay();
        }
      },
    })
  },
  //开始播放
  startPlay: function () {
    var that = this;
    var duration;
    // if (!that.data.lrc_display) {
    //   setTimeout(function(){//延迟开始旋转（解决性能问题）
    //     interval = setInterval(function () {
    //       time += 10;
    //       that.setData({
    //         angle: time / 18000 * 360
    //       })
    //     }, 10)
    //   },500)
    // }
    wx.playBackgroundAudio({
      dataUrl: that.data.mp3Url,
      title: that.data.title,
      coverImgUrl: that.data.bookPic,
      success: function () {
        wx.seekBackgroundAudio({
          position: that.data.progressValue,
        })
        that.setData({
          playPauseStyle: "play-in",
          playStyle: "isPlaying",
        })
        that.listen();
        listenInterval = setInterval(function () {
          that.listen()
        }, 1000)
      }
    })
  },
  //暂停
  pause: function () {
    var that = this;
    // setTimeout(function(){
    // for(var i = 0; i < 100; i ++){
    //   clearInterval(interval);
    // }
    // },1000)
    clearInterval(listenInterval);
    that.setData({
      playPauseStyle: "play-out",
      playStyle: "playPause",
    })
    wx.pauseBackgroundAudio();
  },
  //拖动
  sliderChange: function (e) {
    var that = this;
    var value = e.detail.value;
    var minute = String(value / 60).split(".")[0]
    var second = value % 60;
    minute = Math.floor(minute);
    second = Math.floor(second);
    var now = util.formatNumber(minute) + ":" + util.formatNumber(second);
    that.setData({
      timeBeginText: now,
      progressValue: value
    })
    if (value == 0) {
      wx.stopBackgroundAudio();
      setTimeout(function () {
        that.toPlay();
      }, 200)
    } else if (value == that.data.progressMax) {
      wx.stopBackgroundAudio();
      time = 0;
      that.setData({
        timeBeginText: "00:00",
        progressValue: 0,
        angle: 0
      })
      that.pause();
    }
    else {
      if (that.data.playPauseStyle == "play-out") {
        wx.seekBackgroundAudio({
          position: that.data.progressValue,
        })
        that.toPlay();
      } else {
        wx.seekBackgroundAudio({
          position: that.data.progressValue,
        })
      }
    }
  },
  audioPrev: function () {
    if (!this.data.noDouble) {
      return false;
    }
    var that = this;
    var id = Number(that.data.index_cur) - 1;
    var list = that.data.list;
    if (id < 0) {
      wx.showToast({
        title: '已是第一曲',
        duration: 1000
      })
      return false;
    }
    this.pause();
    wx.stopBackgroundAudio();
    time = 0;
    this.setData({
      timeBeginText: "00:00",
      progressValue: 0,
      angle: 0,
      noDouble: false
    })
    app.read.AddBookScan(that.data.bookId);//添加收听次数
    clearInterval(interval);
    clearInterval(listenInterval);
    var url = list[id].lesson_audio_url;
    var minute = String(list[id].lesson_time_length / 60).split(".")[0]
    var second = list[id].lesson_time_length % 60;
    var mp3Length = util.formatNumber(minute) + ":" + util.formatNumber(second);
    that.setData({
      mp3Url: url,
      progressMax: list[id].lesson_time_length,
      timeEndText: mp3Length,
      title: list[id].lesson_name,
      index_cur: id
    })
    setTimeout(function () {
      that.toPlay();
      that.requestLrc();
      wx.setNavigationBarTitle({
        title: `《${that.data.title}》`,
      })
    }, 500)
    setTimeout(function () {
      that.setData({
        noDouble: true
      })
    }, 1000)
  },
  audioNext: function () {
    // wx.stopBackgroundAudio();
    if (!this.data.noDouble) {
      return false;
    }
    var that = this;
    var id = Number(that.data.index_cur) + 1;
    var list = that.data.list;
    if (id > (list.length - 1)) {
      wx.showToast({
        title: '已是最后一曲',
        duration: 1000
      })
      return false;
    }
    this.pause();
    wx.stopBackgroundAudio();
    time = 0;
    this.setData({
      timeBeginText: "00:00",
      progressValue: 0,
      angle: 0,
      noDouble: false
    })
    app.read.AddBookScan(that.data.bookId);//添加收听次数
    clearInterval(interval);
    clearInterval(listenInterval);
    var url = list[id].lesson_audio_url;
    var minute = String(list[id].lesson_time_length / 60).split(".")[0]
    var second = list[id].lesson_time_length % 60;
    var mp3Length = util.formatNumber(minute) + ":" + util.formatNumber(second);
    that.setData({
      mp3Url: url,
      progressMax: list[id].lesson_time_length,
      timeEndText: mp3Length,
      title: list[id].lesson_name,
      index_cur: id
    })
    setTimeout(function () {
      that.toPlay();
      that.requestLrc();
      wx.setNavigationBarTitle({
        title: `《${that.data.title}》`,
      })
    }, 500)
    setTimeout(function () {
      that.setData({
        noDouble: true
      })
    }, 1000)
  },
  // //点击圆盘显示歌词
  // toLrc: function () {
  //   clearInterval(interval);
  //   this.setData({
  //     lrc_display: true,
  //     lrc_blur: "blur",
  //     controls_lrc: "control-lrc"
  //   })
  //   wx.setNavigationBarTitle({
  //     title: `《${this.data.title}》`,
  //   })
  // },
  // //隐藏歌词
  // hideLrc: function () {
  //   var that = this;
  //   if (that.data.playStyle !== "playPause") {
  //     interval = setInterval(function () {
  //       time += 10;
  //       that.setData({
  //         angle: time / 18000 * 360
  //       })
  //     }, 10)
  //   }
  //   this.setData({
  //     lrc_display: false,
  //     lrc_blur: "",
  //     controls_lrc: ""
  //   })
  //   wx.setNavigationBarTitle({
  //     title: `朗读100`,
  //   })
  // },
  //分割歌词
  parseLyric: function (text) {
    //将文本分隔成一行一行，存入数组
    var lines = text.split('\r\n'),
      //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
      //保存最终结果的数组
      result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern);
      //提取歌词
      var value = v.replace(pattern, '');
      //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      try {
        time.forEach(function (v1, i1, a1) {
          //去掉时间里的中括号得到xx:xx.xx
          var t = v1.slice(1, -1).split(':');
          //将结果压入最终数组
          result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
      } catch (e) {

      }
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  lrcSlide: function () {
    var that = this;
    var t = that.data.timeBeginText.split(':');
    var time = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
    var lrc = that.data.lrc;
    var cur = [];//改变当前歌词样式
    cur.length = lrc.length;
    var index = -1;
    for (var key in lrc) {
      if (lrc[key][0] < time) {
        index++;
      }
    }
    cur[index] = "cur";
    that.setData({
      cur_lrc: cur
    });
    if (!that.data.isDragged) {
      that.setData({
        isLrcSlide: true
      })
      that.setData({
        lrc_distance: (index) * 40
      })
    }
  },
  //滑动时停止跳转
  scroll: function (e) {
    var that = this;
    var lrcIndex = Math.ceil((e.detail.scrollTop - 20) / 40)
    if (lrcIndex == -0) {
      lrcIndex = 0;
    }
    that.data.lrc_index = lrcIndex;
    clearTimeout(scrollTimeout);
    if (!that.data.isDragged) {
      if (that.data.isLrcSlide) {
        that.setData({
          isLrcSlide: false
        })
      } else {
        that.setData({
          isDragged: true
        })
      }
    }
    scrollTimeout = setTimeout(function () {
      that.setData({
        isDragged: false,
        lrc_index: 0
      })
    }, 3000);
  },
  //点击跳转到线指的歌词
  toLine: function () {
    var that = this;
    var time = Math.floor(that.data.lrc[that.data.lrc_index][0]);
    var minute = String(time / 60).split(".")[0]
    var second = time % 60;
    minute = Math.floor(minute);
    second = Math.floor(second);
    var now = util.formatNumber(minute) + ":" + util.formatNumber(second);
    that.setData({
      progressValue: time,
      timeBeginText: now
    })
    that.waitForDownload();

  },

  //显示list
  toList: function () {
    // clearInterval(interval);
    this.setData({
      listShow: true
    })
  },
  //隐藏list
  hideList: function () {
    var that = this;
    // if (that.data.playStyle !== "playPause") {
    //   interval = setInterval(function () {
    //     time += 10;
    //     that.setData({
    //       angle: time / 18000 * 360
    //     })
    //   }, 10)
    // }
    this.setData({
      listShow: false
    })
  },
  //点击列表中的课程跳转播放
  toLesson: function (e) {
    if (!this.data.noDouble) {
      return false;
    }
    this.pause();
    wx.stopBackgroundAudio();
    time = 0;
    this.setData({
      timeBeginText: "00:00",
      progressValue: 0,
      angle: 0,
      noDouble: false
    })
    var that = this;
    app.read.AddBookScan(that.data.bookId);//添加收听次数
    var id = Number(e.currentTarget.dataset.index);
    if (id == that.data.index_cur) {
      return false;
    }
    else {
      clearInterval(interval);
      clearInterval(listenInterval);
      var list = that.data.list;
      var url = list[id].lesson_audio_url;
      var minute = String(list[id].lesson_time_length / 60).split(".")[0]
      var second = list[id].lesson_time_length % 60;
      var mp3Length = util.formatNumber(minute) + ":" + util.formatNumber(second);
      that.setData({
        mp3Url: url,
        progressMax: list[id].lesson_time_length,
        timeEndText: mp3Length,
        title: list[id].lesson_name,
        index_cur: id
      })
      setTimeout(function () {
        that.toPlay();
        that.requestLrc();
        wx.setNavigationBarTitle({
          title: `《${that.data.title}》`,
        })
      }, 500)
      setTimeout(function () {
        that.setData({
          noDouble: true
        })
      }, 1000)
    }
  },
  stop: function () {
    return false;
  },
  //请求歌词
  requestLrc: function () {
    var that = this;
    wx.request({
      url: that.data.list[that.data.index_cur].lesson_subtitle_url,
      success: function (res) {
        that.setData({
          lrc: that.parseLyric(res.data)
        })
      },
    })
  },
  //
  changeCircleStyle: function () {
    var that = this;
    if (that.data.circle_style == "liebiao") {
      that.setData({ circle_style: "danqu" })
    }
    else {
      that.setData({ circle_style: "liebiao" })
    }
  },
  waitForDownload: function () {
    var that = this;
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var downloadPercent = res.downloadPercent;
        if ((that.data.progressValue / that.data.progressMax) > downloadPercent) {
          that.waitForDownload();
          return false;
        }
        else {
          wx.seekBackgroundAudio({
            position: that.data.progressValue,
          })
        }
      }
    })
  },
  listCancel: function () {
    if (this.data.listShow == true) {
      this.setData({
        listShow: false
      })
    }
  },
  toBookPage: function () {
    if (this.data.isShare) {
      wx.redirectTo({
        url: `/pages/book/book?book_id=${this.data.bookId}`,
      })
    } else {
      wx.navigateBack({

      })
    }
  },
  // 花钱解锁全部课程
  openAllBook() {
    if (this.data.isPay == 1) {
      return false;
    }
    const that = this;
    let uid = this.data.uid;
    // var adviserId = wx.getStorageSync("adviser_id");
    let bookId = this.data.bookId;
    app.read.fastBuySeed(bookId, 0, function (rts) {
      wx.requestPayment
        (
        {
          'timeStamp': rts.data.timeStamp,
          'nonceStr': rts.data.nonceStr,
          'package': rts.data.package,
          'signType': rts.data.signType,
          'paySign': rts.data.paySign,
          'success': function (res) {
            //支付成功
            that.setData({ isPay: 1 });
            that.data.list[that.data.index_cur].isPay = 1;
            that.returnToUnit();
            that.toPlay();
            wx.showToast({
              title: '支付成功啦',
            })
          },
          'fail': function (res) {
            //支付失败
            wx.showToast({
              title: '支付失败',
            })
          }
        }
        );
    });
  },
  // 解锁当前课程
  unlockLesson() {
    let that = this;
    let uid = this.data.uid;
    let lessonId = this.data.list[this.data.index_cur].id;
    let bookId = this.data.bookId;
    let isKey = this.data.list[this.data.index_cur].iskey;
    let isPay = this.data.list[this.data.index_cur].isPay;
    if (isPay || isKey) {
      return false;
    }
    if (this.data.key_rest_count) {
      app.read.unlockLesson(uid, lessonId, bookId, function (res) {
        if (res.data.success) {
          that.setData({ isKey: 1 });
          that.data.list[that.data.index_cur].iskey = 1;
          that.returnToUnit();
          that.toPlay();
          that.getUserKeyCount();
        }
      });
    }
    else {
      this.openAllBook();
    }
  },
  // 显示支付弹框，30s时验证
  showPayBox() {
    this.setData({ isPaying: true });
  },
  // 关闭支付弹窗
  returnToUnit() {
    this.setData({ isPaying: false });
  },
  // 获取用户钥匙
  getUserKeyCount() {
    const that = this;
    app.read.ownKeyNum(function (res) {
      let rest_key = res.data.key_rest_count;
      that.setData({ key_rest_count: rest_key });
    });
  },
})