// pages/word/word.js
var templateJs = require("../utils/template.js");
var util = require("../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    book_id: null,
    lesson_id: null,
    dictation_lesson_id: 0,
    words: [],
    words_show: [],
    standard_words: [],
    del_words: [],
    del_words_show: [],
    originWord: [],
    words_number: 0,
    user_input: "",
    input_area_display: "hide",
    button_display: "show",
    navigation_type: "book",
    custom_time: util.formatTime(new Date()),
    focus: false,
    font: app.globalData.font,
    nodouble: true,
    isEdit: false,
    longTimeOver: false,
    isRepeat: false,
    showKey: false,
    goPayDetail: false,
    money:3,
    Name:null,
    resourceNum:0,
    goTap: false,
    lesson_name: null,
    book_name:null,
    canPlay: true,
    key_rest_count:0,
    uid:null,
    unlock:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var uid = app.globalData.userInfo.weixinUser.uid;
    // wx.setNavigationBarTitle({
    //   title: options.lesson_name
    // })
    that.setData({
      navigation_type: options.navigation_type,
      Name: options.lesson_name,
      resourceNum: 3,
      money: 0,      
      uid: uid, 
      lesson_name: options.lesson_name,
      book_name:options.bookname
    });
    if (options.book_id || options.book_id == 0) {
      this.setData({
        book_id: options.book_id
      })
    }
    if (options.lesson_id || options.lesson_id == 0) {
      this.setData({
        lesson_id: options.lesson_id
      })
    };
    
    app.Dictation.ifAssess(that.data.uid, that.data.lesson_id, function (res) {
      console.log(res);
      that.setData({ unlock: res.data.unlock });
    })
    app.Dictation.ownKeyNum(that.data.uid, function (res) {
      that.setData({ key_rest_count: res.data.key_rest_count });
      console.log("钥匙个数为"+that.data.key_rest_count);
    })
    if (options.share == 'true') {
      //分享页面过来的
      if (this.data.book_id || this.data.book_id == 0) {
        //课本 --已跳首页   			

      } else {
        //我的自定义
        app.userLogin(function () {
          app.Dictation.getLessonByShare(options.lesson_id, function (res) {
            console.log('分享我的自定义')
            console.log(res)
            //getLessonWord();
            that.setData({
              id: res.data.id,
              lesson_name: res.data.lesson_name,
              words: res.data.wordlist,
              originWord: res.data.wordlist,
              navigation_type: options.navigation_type
            })
            that.getShowWords(that.data.words);
            that.wordsCount(that.data.words);
            return false;
          });
        });
      }
    } else {
      getLessonWord();
    }

    function getLessonWord() {
      console.log("tianjia")
      if (that.data.navigation_type === "book") {
        app.Dictation.getBookLessonWord(options.lesson_id, function (res) {
          console.log(res);
          that.setData({
            id: res.data.id,
            lesson_name: res.data.lesson_name,
            words: res.data.wordlist,
            originWord: res.data.wordlist,
            standard_words: res.data.orignalwordlist,
            del_words: res.data.delwordlist,
            navigation_type: options.navigation_type
          })
          that.getShowWords(that.data.words);
          that.getDelShowWords(that.data.del_words);
          that.wordsCount(that.data.words);
        })
      }
      if ((that.data.navigation_type === "custom") && (options.lesson_id)) {
        app.Dictation.getLessonWord(options.lesson_id, function (res) {
          console.log(res)
          that.setData({
            id: res.data.id,
            lesson_name: res.data.lesson_name,
            words: res.data.wordlist,
            originWord: res.data.wordlist,
            navigation_type: options.navigation_type
          })
          that.getShowWords(that.data.words);
          that.wordsCount(that.data.words);
        })
        setTimeout(function () {
          that.editShow();
        }, 1000)
      }
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
    var that = this;
    //判断网络
    wx.getNetworkType
      ({
        success: function (res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType == "none") {
            wx.showToast({
              title: '网络异常',
              duration: 2000
            });

          }
        }
      });
    if (this.data.user_input !== "") {
      this.editShow();
    }
    //重新进入时，如果之前正在编辑，弹起输入法
    if (this.data.input_area_display === "show") {
      that.setData({
        focus: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      focus: false
    })
  },

  /**
   * 返回的时候如果单词有修改，提交更新
   */
  onUnload: function () {
    var that = this;
    var wordList = [];
    that.data.words.forEach(function (value, index, array) {
      wordList[index] = value.dictation_word;
    })
    wordList = wordList.join(";");

    if (that.data.id == 0) {
      app.Dictation.addLesson(wordList, function (res) {
        that.setData({
          id: res.data.userLessonId,
          originWord: res.data.wordlist
        })

      })
      return false
    }
    if (JSON.stringify(that.data.words) !== JSON.stringify(that.data.originWord)) {
      app.Dictation.updateLesson(that.data.id, wordList, function (res) {

        that.setData({
          originWord: that.data.words
        })
      })

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
    if (that.data.navigation_type === "custom") {
      //自定义编辑页--跳首页
      return {
        title: 'Rays听写',
        path: '/pages/desktop/desktop'
      }

    } else if (that.data.navigation_type === "book") {
      //我的自定义列表的单元页  课本列表的单元页
      if (this.data.book_id || this.data.book_id == 0) {
        //课本列表的单元页--跳首页
        return {
          title: 'Rays听写',
          path: '/pages/desktop/desktop'
        }

      } else {
        //我的自定义列表的单元页
        return {
          title: this.data.lesson_name,
          path: '/pages/unit/unit?navigation_type=' + this.data.navigation_type + '&lesson_id=' + this.data.id + '&share=true'
        }
      }
    }

  },
  //计算单词总数
  wordsCount: function (words) {
    var length = words.length;
    this.setData({
      words_number: length
    })
  },
  inputWord: function (e) {
    this.setData({
      user_input: e.detail.value,
    })
  },
  sendWords: function (e) {
    var that = this;
    //确认input输入长度
    if (that.data.user_input.length == 0) { return false; }
    //去掉首尾空格和首尾分号，把多个分号和中文分号都换成英文分号，并输出数组
    var input = that.data.user_input.replace(/(^[;]+)/g, "")
      .replace(/(^[；]+)/g, "")
      .replace(/(^\s*)|(\s*$)|([;]+$)/g, "")
      .replace(/([；]+$)/g, "")
      .replace(/([；]+)/g, ";")
      .replace(/([;]+)/g, ";").split(";");
    var input_norepeat = [];
    input.forEach(function (value, index, input) {
      if (input.indexOf(value) === index) {
        input_norepeat.push(value);
      }
      else {
        that.setData({
          isRepeat: true
        })
      }
    })
    var inputs = [];
    for (var i = 0; i < input_norepeat.length; i++) {
      var o = {
        dictation_word: input_norepeat[i]
      };
      inputs.push(o);
    }
    for (var i = 0; i < inputs.length; i++) {
      for (var j = 0; j < that.data.words.length; j++) {
        if (inputs[i]) {
          if (inputs[i].dictation_word === that.data.words[j].dictation_word) {
            inputs[i].dictation_word = null;
            that.setData({
              isRepeat: true
            })
          }
        }
      }
    }
    var finalInput = [];
    inputs.forEach(function (value, index, inputs) {
      if (value.dictation_word !== null) {
        var o = {
          dictation_word: value.dictation_word,
          is_standard: 0
        }
        finalInput.push(o);
      }
    })
    var newWords = that.data.words.concat(finalInput);
    that.setData({
      words: newWords
    })
    that.wordsCount(that.data.words);
    if (that.data.isRepeat) {
      wx.showToast({
        title: '重复单词已去除',
        duration: 2000
      })
    }
    //点击添加后，更新单词表，获取mp3Url
    if(this.data.id !== 0){
      var wordList = [];
      that.data.words.forEach(function (value, index, array) {
        wordList[index] = value.dictation_word;
      })
      wordList = wordList.join(";");
      app.Dictation.updateLesson(that.data.id, wordList, function (res) {
        that.setData({
          originWord: that.data.words
        })
      })
      setTimeout(function () {
        app.Dictation.getLessonWord(that.data.id, function (res) {
          that.setData({
            words: res.data.wordlist
          })
        })
      }, 1500)
    }
    that.getShowWords(that.data.words);
    //清空输入
    that.setData({
      user_input: "",
      isRepeat: false
    });
  },
  //输入框的隐藏和显示
  editShow: function () {
    var that = this;
    this.setData({
      input_area_display: "show",
      button_display: "hide",
      focus: true
    });
  },
  editHide: function (e) {
    var that = this;
    this.setData({
      input_area_display: "hide",
      button_display: "show",
      focus: false,
    });
    // that.getShowWords(that.data.words);
  },
  gotoNext: function () {
    let that = this;
    if (that.data.nodouble) {
      that.data.nodouble = false;
      //禁止1s中内连续点击
      setTimeout(function () { that.data.nodouble = true }, 1000);
      var wordList = [];
      that.data.words.forEach(function (value, index, array) {
        wordList[index] = value.dictation_word;
      })
      wordList = wordList.join(";");
      //判断是否为空
      if (that.data.words_number === 0) {
        wx.showToast({
          title: '单词不能为空',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        return false;
      }
      //如果从书籍跳转过来
      if (that.data.navigation_type === "book") {
        if (JSON.stringify(that.data.words) == JSON.stringify(that.data.originWord)) {
          templateJs.goPlay(that.data.id,that.data.lesson_name);
          return true;
        }
        app.Dictation.updateLesson(that.data.id, wordList, function (res) {
          that.setData({
            originWord: that.data.words
          })
          console.log("update success");
          templateJs.goPlay(that.data.id,that.data.lesson_name)
        })
      }
      //从自定义跳转过来
      if (that.data.navigation_type === "custom") {
        if (that.data.id === 0) {
          app.Dictation.addLesson(wordList, function (res) {
            that.setData({
              id: res.data.userLessonId,
              originWord: res.data.wordlist
            })
            console.log("custom success");
            templateJs.goPlay(res.data.userLessonId);
          })
        }
        else {
          var originWordString = [];
          that.data.originWord.forEach(function (value, index, array) {
            originWordString[index] = value.dictation_word;
          })
          originWordString = originWordString.join(";");
          if (wordList == originWordString) {
            templateJs.goPlay(that.data.id,that.data.lesson_name);
            return true;
          }
          app.Dictation.updateLesson(that.data.id, wordList, function (res) {
            console.log("update success");
            that.setData({
              originWord: that.data.words
            })
            templateJs.goPlay(that.data.id,that.data.lesson_name)
          })
        }
      }
    }
  },
  getShowWords: function (words) {
    var showWords = [];
    words.forEach(function (value, index, array) {
      var o = {
        dictation_word: words[index].dictation_word.replace(/[，]+/g, ",").split(",")[0],
        is_standard: words[index].is_standard
      }
      showWords.push(o);
    })
    this.setData({
      words_show: showWords
    })
  },
  getDelShowWords: function (words) {
    var showWords = [];
    words.forEach(function (value, index, array) {
      var o = {
        dictation_word: words[index].dictation_word.replace(/[，]+/g, ",").split(",")[0]
      }
      showWords.push(o);
    })
    this.setData({
      del_words_show: showWords
    })
  },
  //点击删除的词语恢复
  recover: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var newWords = this.data.words;
    newWords.push(this.data.del_words[index]);
    this.setData({
      words: newWords
    })
    var newDelWords = this.data.del_words;
    newDelWords.splice(index, 1);
    if (newDelWords.length === 0) {
      that.setData({
        del_words: []
      })
    }
    else {
      that.setData({
        del_words: newDelWords
      })
    }
    this.getShowWords(this.data.words);
    this.getDelShowWords(this.data.del_words);
    this.wordsCount(this.data.words);
  },
  //点击叉删除词语
  deleteWord: function (e) {
    var that = this;
    var wordindex = e.currentTarget.dataset.index;
    this.data.standard_words.forEach(function (value, index, input) {
      if (that.data.standard_words[index].dictation_word === that.data.words[wordindex].dictation_word) {
        var newDelWords = that.data.del_words;
        newDelWords.push(that.data.words[wordindex]);
        that.setData({
          del_words: newDelWords
        })

      }
    })
    var newWords = this.data.words;
    newWords.splice(wordindex, 1);
    this.setData({
      words: newWords
    });
    this.getShowWords(that.data.words);
    this.getDelShowWords(this.data.del_words);
    this.wordsCount(this.data.words);
  },
  //单击单词后播放单个单词
  play: function (e) {
    if (this.data.canPlay) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      console.log(index);
      wx.playBackgroundAudio({
        dataUrl: that.data.words[index].word_mp3_url,
      })
    }
  },
  //长按出现删除按钮
  longTapDelete: function () {
    var that = this;
    // var newList = [];
    // that.data.words.forEach(function(value,index,array){
    //   var o ={
    //     dictation_word: value.dictation_word
    //   }
    //   newList.push(o);
    // })
    this.setData({
      isEdit: true,
      canPlay: false,
      // words_show: newList
    })
    setTimeout(function () {
      that.setData({
        longTimeOver: true,
        canPlay: true
      })
    }, 2000);
  },
  deleteCancel: function () {
    if (this.data.longTimeOver) {
      this.setData({
        isEdit: false,
        longTimeOver: false,
      })
      this.getShowWords(this.data.words);
    }
  },

  toKeyOrLesson: function () {
    var that = this;
    if (!that.data.unlock){
      if (that.data.key_rest_count === 0){
        if (that.data.goTap === true) {
          that.setData({ goTap: false });
        }
        that.setData({ showKey: true });
      }else{
        app.Dictation.keyToLesson(that.data.uid, that.data.book_id, that.data.lesson_id, 0, function (res) {
          console.log(res);
        });
        that.gotoNext();
      }
    } else{
    app.Dictation.keyToLesson(that.data.uid, that.data.book_id, that.data.lesson_id, 0, function (res) {
      console.log(res);
    });
      that.gotoNext();
    }
  },
  openThisUnitWithKey: function () {
    let that = this;
    that.setData({ goPayDetail: true, showKey: false });
    
  },

  closePayBox: function () {
    let that = this;
    that.setData({ goPayDetail: false, showKey: false })
  },
  immediatePay: function (event) {
    let that = this;
    if (that.data.goTap) {
      return;
    }
    that.setData({ goTap: true });
    app.Dictation.fastBuySeed(that.data.uid,that.data.book_id, 4226,that.data.lesson_id, function (rts) {
      console.log("当前书的课程回调成功");
      console.log(rts);
      wx.requestPayment
        (
        {
          'timeStamp': rts.weixinpayinfo.timeStamp,
          'nonceStr': rts.weixinpayinfo.nonceStr,
          'package': rts.weixinpayinfo.package,
          'signType': rts.weixinpayinfo.signType,
          'paySign': rts.weixinpayinfo.paySign,
          'success': function (res) {
            //支付成功
            console.log(res);
            console.log("支付成功啦");
            // that.data.canView = true;
          },
          'fail': function (res) {
            //支付失败
            console.log("支付失败");
            // that.setData({ goTap: false });
            that.setData({ goPayDetail: false, showKey: false });
          }
        }
        );
      console.log(rts);
    },
      function (rts) {
        that.data.canView = false;
        that.setData({ goPayDetail: false });
        that.setData({ goTap: false })
      });
  },
  returnToUnit:function(){
    var that=this;
    that.setData({ showKey:false})
  }
})