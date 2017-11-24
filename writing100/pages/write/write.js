// write.js
var templateJs = require("../../utils/template.js");
var util = require("../../utils/util.js");
var interval;
var timeout;
var scrollTimeout;
var content;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words_display: [],
    words: [],
    mp3: [],
    cur: ["cur"],
    cur_img: "",
    images: {},
    cur_play: 0,
    quickClick: true,
    scrollLeft: 0,
    screenWidth: 0,
    count: 0,
    lesson_id: 0,
    uid: 0,
    book_name: "",
    book_pic: "",
    canvas_container: "canvas-container",
    isWrote: 0,
    //支付
    bookId: 0,
    key_rest_count: 0,
    access: "false",
    money: "5.00",
    isPaying: false,
    isFirst: true,
    canPlay: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth
        })
      },
    })
    that.setData({
      lesson_name: options.lesson_name
    })
    wx.setNavigationBarTitle({
      title: options.lesson_name
    })
    let uid = wx.getStorageSync("weixinUserInfo").weixinUser.uid;
    var word = options.word.split(",");
    app.Writing.ifAssess(uid, options.lesson_id, function (res) {
      that.setData({ access: String(res.data.unlock) })
    })
    app.Writing.ownKeyNum(uid, function (res) {
      let key_count = res.data[0].key_rest_count;
      // 获取课程价格
      app.Writing.getBookPriceById(options.bookId, function (res) {
        let bookPrice = res.data.price;
        that.setData({
          words_display: word,
          mp3: options.mp3.split(","),
          bookId: options.bookId,
          key_rest_count: key_count,
          lesson_id: options.lesson_id,
          book_name: wx.getStorageSync("book").book_name,
          book_pic: wx.getStorageSync("book").book_pic,
          uid: uid,
          money: bookPrice,
          isWrote: options.isWrote
        });
        if (that.data.canPlay) {
          wx.playBackgroundAudio({
            dataUrl: that.data.mp3[0],
          })
        }
        that.addBrowser();
        // 如果课文只有一个字 点进去即标已学
        if (that.data.words_display.length == 1) {
          app.Writing.AddLessonRecord(that.data.bookId, that.data.lesson_id, function (res) {
            that.setData({ isWrote: 1 })
          })
        }
      });
    })
    // 获取笔顺数据
    app.write.getBishun(word[0], function (res) {
      var words = that.data.words;
      res.data.imgurl = "http://image.chubanyun.net/images/writing/fontimage/" + res.data.imgurl + ".png";
      res.data.content = JSON.parse(res.data.content).chinese;
      words.push(res.data);
      that.setData({
        words: words,
        cur_img: res.data.imgurl,
        isFirst: false
      });
      //如果是分享进入，则要将书籍添加到书架
      if (options.share == "true") {
        if (that.data.uid == 0) {//重新登陆
          app.userLogin(function () {
            // that.addBrowser();
            let share_uid = options.share_uid;
            app.Writing.getPenByShare(share_uid, function (res) {
              console.log("增加钥匙", res);
              console.log("bookid", options.bookId);
              app.Writing.addBookById(options.bookId);
              // app.Writing.bindUserAndAdviser(options.adviser_id);
            });
          });
        } else {
          // that.getUserKeyCount(that.data.uid);
          // that.addBrowser();
          let share_uid = options.share_uid;
          app.Writing.getPenByShare(share_uid, function (res) {
            console.log("增加钥匙", res);
            console.log("bookid", options.bookId);
            app.Writing.addBookById(options.bookId);
            // app.Writing.bindUserAndAdviser(options.adviser_id);
          });
        }

        // return false;
      }
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      var ctxbg = wx.createCanvasContext("bg");

      ctxbg.drawImage("../../images/write/mi.png", 0, 0, 300, 300);
      ctxbg.draw();
      that.count();
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
    if (this.data.isFirst) {
      return false
    } else {
      this.reWrite();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
    app.Writing.UpdateBrowserTime(this.data.browser_id);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
    app.Writing.UpdateBrowserTime(this.data.browser_id);
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
    var adviser_id = wx.getStorageSync('adviser_id');
    let uid = this.data.uid;
    let word = this.data.words_display;
    let word_mp3 = this.data.mp3;
    let lesson_id = this.data.lesson_id;
    let lesson_name = this.data.lesson_name;
    let bookId = this.data.bookId;
    // let access = this.data.access;
    let book_name = this.data.book_name;
    let book_pic = this.data.book_pic;
    let isWrote = this.data.isWrote;
    return {
      title: book_name,
      path: `/pages/write/write?adviser_id=${adviser_id}&word=${word}&mp3=${word_mp3}&isWrote=${isWrote}&lesson_id=${lesson_id}&lesson_name=${lesson_name}&bookId=${that.data.bookId}&book_name=${book_name}&book_pic=${book_pic}&share=true`
    }
    console.log("分享");
  },
  reWrite: function () {
    var that = this;
    if (!this.data.quickClick) { return false }
    this.setData({
      quickClick: false
    })
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
    setTimeout(function () {
      that.setData({
        quickClick: true
      })
    }, 300)
    if (that.data.canPlay) {
      wx.playBackgroundAudio({
        dataUrl: that.data.mp3[that.data.cur_play],
      })
    }
    this.drawFrame(this.data.cur_play);
    this.fill(this.data.cur_play);
  },
  //更换播放的汉字
  changeWord: function (e) {
    const that = this;
    let access = this.data.access;
    if (access === "false") {
      console.log(access);
      this.setData({ isPaying: true, canvas_container: "not_show" });
      return false;
    }

    if (!this.data.quickClick) { return false }
    if (this.data.isWrote == 0) {
      app.Writing.AddLessonRecord(that.data.bookId, that.data.lesson_id, function (res) {
        that.setData({ isWrote: 1 })
      })
    }
    this.setData({
      quickClick: false
    })
    var now = [];
    var index;
    try {
      index = e.currentTarget.dataset.index;
    } catch (error) {
      index = e;
    }
    now[index] = "cur";
    if (that.data.words[index]) {
      that.setData({
        cur: now,
        cur_img: that.data.words[index].imgurl,
        cur_play: index
      })
      var ctx = wx.createCanvasContext("word");
      for (let i = timeout; i < timeout + 3500; i++) {
        clearTimeout(i);
      }
      setTimeout(function () {
        that.setData({
          quickClick: true
        })
      }, 300)
      if (that.data.canPlay) {
        wx.playBackgroundAudio({
          dataUrl: that.data.mp3[that.data.cur_play],
        })
      }
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      that.count();
      return false;
    }
    app.write.getBishun(that.data.words_display[index], function (res) {
      var words = that.data.words;
      res.data.imgurl = "http://image.chubanyun.net/images/writing/fontimage/" + res.data.imgurl + ".png";
      res.data.content = JSON.parse(res.data.content).chinese;
      words[index] = res.data;
      that.data.words = words;
      that.setData({
        cur_img: res.data.imgurl,
        cur: now,
        cur_play: index
      })
      var ctx = wx.createCanvasContext("word");
      for (let i = timeout; i < timeout + 3500; i++) {
        clearTimeout(i);
      }
      setTimeout(function () {
        that.setData({
          quickClick: true
        })
      }, 300)
      if (that.data.canPlay) {
        wx.playBackgroundAudio({
          dataUrl: that.data.mp3[index],
        })
      }
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      that.count();
    })
  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewHeight = 93,
      viewWidth = 93 * ratio;
    var image = this.data.images;
    image = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  //画底部字
  drawFrame: function (index) {
    var that = this;
    var ctx = wx.createCanvasContext("word");
    ctx.clearRect(0, 0, 300, 300);
    ctx.draw();
    ctx.setFillStyle('gray');
    for (var line in that.data.words[index].content.bihua) {
      var bihua_data = that.data.words[index].content.bihua[line];
      ctx.beginPath();
      for (var dot in bihua_data) {
        var x = bihua_data[dot][0] * 300 / 760;
        var y = bihua_data[dot][1] * 300 / 760;
        if (dot == 0) {
          ctx.moveTo(x, y);
        }
        else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.draw(true);
  },
  //填充汉字
  fill: function (index) {
    var that = this;
    var timer = 0;

    // for (let dot in that.data.words[index].bishun[0]) {
    //   var now = that.data.words[index].bishun[0][dot];
    //   var x = now[0] * 300 / 760;
    //   var y = now[1] * 300 / 760;
    //   console.log(x, y);
    //   if (dot == 0) {
    //     ctx.moveTo(x, y)
    //   }
    //   else {
    //     ctx.moveTo(that.data.words[index].bishun[0][dot-1][0] * 300 / 760, that.data.words[index].bishun[0][dot-1][1] * 300 / 760);
    //     ctx.lineTo(x, y);
    //     ctx.stroke();
    //     ctx.draw(true);
    //   }
    // }

    var ctx = wx.createCanvasContext("word");

    // interval = setInterval(function () {
    // 填充汉字
    ctx.setFillStyle('black');
    ctx.setLineWidth(2);
    ctx.setLineCap('round');
    timeout = setTimeout(function () { }, 100);
    for (let line in that.data.words[index].content.bishun) {
      setTimeout(function () {
        for (let dot in that.data.words[index].content.bishun[line]) {
          setTimeout(function () {
            var now = that.data.words[index].content.bishun[line][dot];
            var x = now[0] * 300 / 760;
            var y = now[1] * 300 / 760;
            if (dot == 0) {
              ctx.moveTo(x, y)
            }
            else {
              ctx.moveTo(that.data.words[index].content.bishun[line][dot - 1][0] * 300 / 760, that.data.words[index].content.bishun[line][dot - 1][1] * 300 / 760);
              ctx.lineTo(x, y);
              ctx.stroke();
              ctx.draw(true);
            }
          }, 5 * dot);
        }
      }, timer * 5);
      timer += that.data.words[index].content.bishun[line].length;
    }
    // var temp3 = setTimeout(function () {
    //   timeout.push(temp3);
    //   ctx.clearRect(0, 0, 300, 300);
    //   ctx.draw();
    //   that.drawFrame(index);
    // }, timer * 5 + 500)
    // }, 1000)
  },
  last: function () {
    var that = this;
    if (that.data.cur_play == 0) {
      return false;
    }
    var index = that.data.cur_play - 1;
    that.changeWord(index);
    if (index < (that.data.words_display.length - 1)) {
      var num = index * 100;
      that.setData({
        scrollLeft: num * (that.data.screenWidth / 750)
      })
    }
  },
  next: function () {
    var that = this;
    var length = that.data.words_display.length - 1;
    if (that.data.cur_play === length) {
      return false;
    }
    var index = that.data.cur_play + 1;
    that.changeWord(index);
    if (index > 6) {
      var num = (index - 6) * 100;
      that.setData({
        scrollLeft: num * (that.data.screenWidth / 750)
      })
    }
  },

  stop() {
    return false;
  },
  //滑动时停止动画
  scroll: function () {
    var that = this;
    clearTimeout(scrollTimeout);
    if (!that.data.scrollFlag) {
      for (let i = timeout; i < timeout + 3500; i++) {
        clearTimeout(i);
      }
      that.setData({
        scrollFlag: true
      })
    }
    scrollTimeout = setTimeout(function () {
      that.setData({
        scrollFlag: false
      })
      that.reWrite();
    }, 100);
  },
  //计算笔画
  count: function () {
    var num = this.data.words[this.data.cur_play].content.bihua.length;
    this.setData({
      count: num
    })
  },
  //声音开关
  controlMp3: function () {
    if (this.data.canPlay) {
      this.setData({
        canPlay: false
      })
    } else {
      this.setData({
        canPlay: true
      })
    }
  },

  // 关闭支付弹框
  returnToUnit() {
    this.setData({ isPaying: false, canvas_container: "canvas-container" });
  },
  //用钥匙解锁课程
  openThisUnitWithKey() {
    const that = this;
    let uid = this.data.uid;
    let lesson_id = this.data.lesson_id;
    let bookId = this.data.bookId;
    app.Writing.keyToLesson(uid, bookId, lesson_id, function (res) {
      if (res.success) {
        console.log("keyunlock", res.success);
        that.setData({ access: "true", isPaying: false, canvas_container: "canvas-container" });
      }
    });
    this.changeWord();
  },

  // 花钱解锁全部课程
  openAllBook() {
    const that = this;
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == "none") {
          wx.showToast({
            title: '当前无网络',
            duration: 2000
          })
          return false;
        }
      },
    })
    let uid = this.data.uid;
    var adviserId = wx.getStorageSync("adviser_id");
    let bookId = this.data.bookId;
    app.Writing.fastBuySeed(uid, bookId, adviserId, function (rts) {
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
            // console.log(res);
            // console.log("支付成功啦");
            // that.data.canView = true;
            that.setData({ access: "true", isPaying: false, canvas_container: "canvas-container" });
          },
          'fail': function (res) {
            //支付失败
            // console.log("支付失败");
            // that.setData({ goTap: false });
            wx.showToast({
              title: '支付失败',
              duration: 2000
            })
            that.setData({ access: "false", isPaying: false, canvas_container: "canvas-container" });
          }
        }
        );
    });
  },
  addBrowser: function () {
    var that = this;
    //添加应用实例浏览记录
    app.Writing.addBrowser
      (
      that.data.bookId,
      'dictation_writing',
      0,
      function (rbs) {
        that.data.browser_id = rbs.data.data.browser_id;
      }
      );
    //刷新书籍最后阅读时间
    if (that.data.bookId) {
      app.Writing.updateBookReadTime(that.data.bookId, function () { });
    }

  },
})