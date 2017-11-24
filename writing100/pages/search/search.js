/// pages/search/search.js
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
    words_default: ["请", "输", "入", "汉", "字"],
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
    input: "",
    charArray: [],
    confirmFlag: false,
    scrollFlag: false,
    count: 10,
    isFirst: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth
        })
      },
    })
    var ctxbg = wx.createCanvasContext("bg");
    ctxbg.drawImage("../../images/write/mi.png", 0, 0, 300, 300);
    ctxbg.draw();
    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
      // app.Writing.bindUserAndAdviser(options.adviser_id);
    }
    that.adviserIdFun();
    if (options.isShare == "share") {
      var words = options.charArray.split(",");
      that.setData({
        charArray: words
      })
      that.toWriting();
      return false;
    }
    //从字典跳转过来
    if (options.word) {
      console.log(options.word);
      var words = options.word.split(",");
      that.setData({
        charArray: words
      })
      that.toWriting();
      return false;
    }
    app.write.getBishun(that.data.words_default[0], function (res) {
      var words = that.data.words;
      res.data.imgurl = "http://image.chubanyun.net/images/writing/fontimage/" + res.data.imgurl + ".png";
      res.data.content = JSON.parse(res.data.content).chinese;
      words.push(res.data);
      that.setData({
        words: words,
        cur_img: res.data.imgurl
      })
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
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
    if(this.data.isFirst){return false}
    if (this.data.words_display.length == 0) {
      this.changeWordDefault(0);
    }
    else {
      this.changeWord(this.data.cur_play);
    }
    this.setData({
      isFirst: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
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
    if (that.data.words_display.length == 0) {
      return {
        title: "笔顺100",
        path: `pages/search/search?adviser_id=${adviser_id}`
      }
    } else {
      var charArray = that.data.words_display;
      return {
        title: "笔顺100",
        path: `pages/search/search?adviser_id=${adviser_id}&charArray=${charArray}&isShare=share`
      }
    }
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
    this.drawFrame(this.data.cur_play);
    this.fill(this.data.cur_play);
  },
  changeWord: function (e) {
    var that = this;
    if (!this.data.quickClick) { return false }
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
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      that.count();
      return false;
    }
    app.write.getBishun(that.data.words_display[index], function (res) {
      console.log(res);
      if(res.data == null){
        wx.showToast({
          title: '找不到汉字',
          duration: 2000
        })
        setTimeout(function () {
          that.setData({
            quickClick: true
          })
        }, 300)
        return false;
      }
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
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      that.count();
    })
  },
  //默认时更改文字
  changeWordDefault: function (e) {
    var that = this;
    if (!this.data.quickClick) { return false }
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
    console.log("index",index);
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
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      that.count();
      return false;
    }
    app.write.getBishun(that.data.words_default[index], function (res) {
      console.log(index);
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

  /* 处理输入的文字 */
  splitToArray(event) {
    let str = event.detail.value;
    let strArray = str.split("");
    this.data.charArray = strArray;
  },

  /* 获取文字开始书写 */
  toWriting() {
    const that = this;
    let re = /[\u4e00-\u9fa5]/g;
    let filterStr = that.data.charArray.join("");
    filterStr = filterStr.match(re);
    if (!filterStr) {
      wx.showToast({
        title: '仅能输入汉字',
      });
      return false;
    }
    else {
      if (that.data.charArray.length !== filterStr.length) {
        wx.showToast({
          title: '仅能输入汉字',
        });
        return false;
      }
    }
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
    var newArr = that.data.charArray.concat(that.data.words_display);
    if(newArr.length > 7){
      newArr = newArr.slice(0, 7);
      wx.showToast({
        title: '只能搜索七个',
        duration: 1000
      })
    }
    var newWords = [];
    for (var i = 0; i < that.data.charArray.length; i++) {
      newWords[i] = "";
    }
    that.data.words = newWords.concat(that.data.words);
    that.setData({
      words_display: newArr,
      charArray: "",
      confirmFlag: true
    })
    that.changeWord(0);
  },
  //输入框聚焦时清空动画
  searchFocus: function () {
    this.setData({
      confirmFlag: false
    })
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
  },
  //输入框失焦时重播动画
  searchBlur: function () {
    var that = this;
    setTimeout(function () {
      if (that.data.confirmFlag) {
        return false
      } else {
        that.changeWord(that.data.cur_play);
      }
    }, 100)
  },
  stop: function () {
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
      that.changeWord(that.data.cur_play);
    }, 100);
  },
  //计算笔画
  count: function () {
    var num = this.data.words[this.data.cur_play].content.bihua.length;
    this.setData({
      count: num
    })
  },
  //adviserIdfunction
  adviserIdFun: function () {
    var that = this;
    if (!app.globalData.userInfo) {
      setTimeout(that.adviserIdFun, 100);
    } else {
      var adviser_id = wx.getStorageSync('adviser_id');
      console.log("缓存中adviser_id", adviser_id);

      if (!adviser_id || adviser_id == "0") {
        app.Writing.GetUserSpreadAdviser(function (res) {
          console.log("GetUserSpreadAdviser", res)
          wx.setStorageSync('adviser_id', res.data.data.adviser_id);
          console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
        })
      } else {
        app.Writing.bindUserAndAdviser(adviser_id, function () {
          console.log("插入res.data.data.adviser_id成功", adviser_id)
        })
      }
    }
  },
})