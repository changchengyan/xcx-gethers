// pages/word/word.js
var templateJs = require("../../utils/template.js");
var util = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_id: null,
    lesson_id: null,
    browser_id:0,
    dictation_lesson_id: 0,
    words: [],
    words_show: [],//显示的词（标准词删除后再添加要放到标准词汇后面）
    standard_words: [],//标准词
    del_words: [],//删除的词（标准和非标准）
    del_words_show: [],//删除的词（标准）
    share_words: [],
    share_words_show: [],
    // originWord: [],
    words_number: 0,
    user_input: "",
    input_area_display: false,
    button_display: "show",
    navigation_type: "book",
    ifDefaultTouch: "promiseTouch",
    focus: false,
    font: app.globalData.font,
    nodouble: true,
    isEdit: false,
    longTimeOver: false,
    isRepeat: false,
    showKey: false,
    goPayDetail: false,
    Name: null,
    resourceNum: 0,
    goTap: false,
    lesson_name: null,
    book_name: null,
    canPlay: true,
    key_rest_count: 0,
    uid: 0,
    unlock: "loading",
    isFirstShow: true,
    money: '0.00',
    isLoading: false,
    input_count: 0,
    defaultCustomTitle: "",
    input_disabled: false,
    title_input: null,
    placeholder: '',
    caseShow: false,
    title_before: '',
    isShare: false,
    goOther: false,
    noDouble: true,
    book_img:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options")
    var that = this;
    that.setData({options:options})
    //uid是否存在
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })

    } else {
      app.userLogin(function () {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })

      });
    }
    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
    }

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
      title_input: options.lesson_name,
      book_name: options.bookname,
      defaultCustomTitle: options.defaultCustomTitle,
      book_img:options.book_img
    });
    console.log(that.data.book_name);
    if(that.data.book_name){
      if(that.data.book_name.length>20){
        let BookNameArr = that.data.book_name.split(" ");
        console.log(BookNameArr);
        var simplificationName = BookNameArr[0] + " " + BookNameArr[BookNameArr.length - 2] + " " + BookNameArr[BookNameArr.length-1];
        if (simplificationName.length>20){
          let refSimplificationName = simplificationName.split(" ");
          simplificationName = refSimplificationName[0] + " " + refSimplificationName[refSimplificationName.length-1]
        }
      }
      that.setData({ book_name: simplificationName});
    }
    //设置标题名字
    console.log(options.customLessonTitle, options.defaultCustomTitle);
    if (options.navigation_type == "book") {
      wx.setNavigationBarTitle({
        title: that.data.Name + " "
      });
      that.setData({
        input_disabled: true
      })
    }
    if (options.navigation_type == "custom" && options.lessonIndex !== undefined) {
      wx.setNavigationBarTitle({
        title: "自定义听写 " + options.defaultCustomTitle
      });
    }
    // else if (options.navigation_type == "custom" && options.lessonIndex !== undefined && options.customLessonTitle !== ""){
    //   wx.setNavigationBarTitle({
    //     title: "自定义听写 " + options.customLessonTitle
    //   });
    // }
    else if (options.navigation_type == "custom" && options.lessonIndex === undefined) {
      wx.setNavigationBarTitle({
        title: "自定义听写"
      });
    }


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

    if (options.share == 'true') {
      //分享页面过来的
      that.setData({ isShare: true })
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          that.adviserIdFun()
          var preUid=options.preUid;
    	  app.Dictation.AddUserKeyByShared(preUid,function(){})    	

        });
      } else {
        that.adviserIdFun();
        var preUid=options.preUid;
    	  app.Dictation.AddUserKeyByShared(preUid,function(){})    	
      }
      if (this.data.book_id || this.data.book_id == 0) {
        //课本 --已跳首页 

        if (that.data.uid) {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          that.getBookLessonByShare();

        } else {
          app.userLogin(function () {
            var uid = app.globalData.userInfo.weixinUser.uid;
            that.setData({ uid: uid })
            that.getBookLessonByShare();

          })
        }

      } else {
        //我的自定义
        if (that.data.uid) {
          that.getLessonByShare();
        } else {
          app.userLogin(function () {
            var uid = app.globalData.userInfo.weixinUser.uid;
            that.setData({ uid: uid })
            that.getLessonByShare();
          })
        }
      }
    } else {  	
      getLessonWord();
    }



    function getLessonWord() {
      console.log("tianjia")
      if (that.data.navigation_type === "book") {
        app.Dictation.getBookLessonWord(options.lesson_id, function (res) {

          that.setData({
            lesson_id: res.data.id,
            dictation_lesson_id: res.data.lesson_id,
            lesson_name: res.data.lesson_name,
            words: res.data.wordlist,
            // originWord: res.data.wordlist,
            standard_words: res.data.orignalwordlist,
            del_words: res.data.delwordlist,
            navigation_type: options.navigation_type
          })
          that.getShowWords(that.data.words);
          that.getDelShowWords(that.data.del_words);
          that.wordsCount(that.data.words);
          that.KeyInfo();
          that.addBrowser();
        })
      }
      else if ((that.data.navigation_type === "custom") && (options.lesson_id)) {
        app.Dictation.getLessonWord(options.lesson_id, function (res) {
          //console.log(res)
          that.setData({
            lesson_id: res.data.id,
            dictation_lesson_id: res.data.lesson_id,
            lesson_name: res.data.lesson_name,
            title_input: res.data.lesson_name,
            words: res.data.wordlist,
            // originWord: res.data.wordlist,
            navigation_type: options.navigation_type,

          })
          that.getShowWords(that.data.words);
          that.wordsCount(that.data.words);
          that.addBrowser();
        })
      } else {
        that.setData({
          lesson_name: util.formatTime(new Date()),
          title_input: util.formatTime(new Date())
        })
        that.editShow();
        // setTimeout(function () {
        //   that.editShow();
        // }, 1000)
      }
    }
    that.setData({
      isLoading: true
    })

  },
  getBookLessonByShare: function () {
    var that = this;
    app.Dictation.getBookLessonByShare(that.data.options.lesson_id, function (res) {
      console.log("getBookLessonByShare", res)
      that.setData({
        lesson_id: res.data.id,
        lesson_name: res.data.lesson_name,
        words: res.data.wordlist,
        standard_words: res.data.orignalwordlist,
        del_words: res.data.delwordlist,
        share_words: res.data.sharewordlist
      })
      that.getShowWords(that.data.words);
      that.getDelShowWords(that.data.del_words);
      that.getShareShowWords(that.data.share_words);
      that.wordsCount(that.data.words);
      that.KeyInfo()
    });
  },
  getLessonByShare: function () {
    var that = this;
    app.Dictation.getLessonByShare(that.data.options.lesson_id, function (res) {
      that.setData({
        lesson_id: res.data.id,
        lesson_name: res.data.lesson_name,
        words: res.data.wordlist
      })
      that.getShowWords(that.data.words);
      that.wordsCount(that.data.words);
      return false;
    });
  },
  KeyInfo: function () {
    var that = this;
    if (that.data.navigation_type === "book") {
      app.Dictation.ifAssess(that.data.uid, that.data.lesson_id, function (res) {
        console.log(that.data.uid, that.data.lesson_id);
        console.log("ifAssess.res", res)
        that.setData({ unlock: res.data.unlock });
      })
      app.Dictation.ownKeyNum(that.data.uid, function (res) {
        that.setData({ key_rest_count: res.data.key_rest_count });
        console.log("钥匙个数为" + that.data.key_rest_count);
      });
      app.Dictation.getBookPriceById(that.data.book_id, function (res) {
        var price = res.data.price;
        that.setData({ money: price })
      })
    }
  },
  addBrowser: function () {
    var that = this;
    //添加应用实例浏览记录
    app.Dictation.addBrowser
      (
      	that.data.lesson_id,      
      'dictation_lesson',
      that.data.dictation_lesson_id,
      function (rbs) {
        that.data.browser_id = rbs.data.browser_id;
      }
      );
    //刷新书籍最后阅读时间
    app.Dictation.updateBookReadTime(that.data.book_id, function () { });
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
    // if (this.data.user_input !== "") {
    //   this.editShow();
    // }

    //重新进入时，如果之前正在编辑，弹起输入法
    // if (this.data.input_area_display) {
    //   that.setData({
    //     focus: true
    //   })
    //   setTimeout(function () {
    //     that.setData({
    //       placeholder: `
    //       词汇用换行隔开，逗号用于解释或翻译。
    //       例：
    //       花,花朵的花
    //       果,果实的果
    //       apple,苹果
    //       pencil,铅笔
    //        ` }) }, 500)
    // }
    //判断是iphone还是android
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search(/iPhone/) == -1) {
          //不是iPhone
          that.setData({ 'systemInfo.model': "Android" });
        } else {
          //是iPhone
          that.setData({ 'systemInfo.model': "iPhone" });
        }
      }
    })
    if (!that.data.isFirstShow && that.data.navigation_type === "book") {
      app.Dictation.ifAssess(that.data.uid, that.data.lesson_id, function (res) {
        console.log(res);
        if (res.success) {
          console.log(res.data.unlock)
          that.setData({ unlock: res.data.unlock });
        }
      })
      app.Dictation.ownKeyNum(that.data.uid, function (res) {
        that.setData({ key_rest_count: res.data.key_rest_count });
        console.log("钥匙个数为" + that.data.key_rest_count);
      });
      app.Dictation.getBookPriceById(that.data.book_id, function (res) {
        var price = res.data.price;
        that.setData({ money: price })
      })
      if (that.data.systemInfo.model == 'iPhone') {
        return false;
      }
      if (that.data.isShare && !that.data.goOther) {//分享的
        if (this.data.book_id || this.data.book_id == 0) {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          that.getBookLessonByShare();
        } else {
          //我的自定义
          that.getLessonByShare();
        }
      }


    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(this.data.focus)
    this.setData({
      focus: false,
      isFirstShow: false
    })

  },

  /**
   * 返回的时候如果单词有修改，提交更新
   */
  onUnload: function () {
    // var that = this;
    // var wordList = [];
    // that.data.words.forEach(function (value, index, array) {
    //   wordList[index] = value.dictation_word;
    // })
    // wordList = wordList.join(";");

    // if (that.data.id == 0) {
    //   app.Dictation.addLesson(wordList, function (res) {
    //     that.setData({
    //       id: res.data.userLessonId,
    //       originWord: res.data.wordlist
    //     })

    //   })
    //   return false
    // }
    // if (JSON.stringify(that.data.words) !== JSON.stringify(that.data.originWord)) {
    //   app.Dictation.updateLesson(that.data.id, wordList, function (res) {

    //     that.setData({
    //       originWord: that.data.words
    //     })
    //   })

    // }
    //回退不播放
    wx.stopBackgroundAudio();
    wx.pauseBackgroundAudio();
    var that = this
    app.Dictation.UpdateBrowserTime(that.data.browser_id, function () {

    })
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

  adviserIdFun: function () {
    var that = this;
    var adviser_id = wx.getStorageSync('adviser_id');
    console.log("缓存中adviser_id", adviser_id)
    if (!adviser_id) {
      app.Dictation.GetUserSpreadAdviser(function (res) {
        console.log("GetUserSpreadAdviser", res)
        wx.setStorageSync('adviser_id', res.data.data.adviser_id);
        console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
      })
    } else {
      app.Dictation.InsertUserSpreadAdviser(adviser_id, function () {
        console.log("插入res.data.data.adviser_id成功", adviser_id)
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var adviser_id = wx.getStorageSync('adviser_id')
    if (that.data.navigation_type === "custom") {
      if (this.data.lesson_id === 0 || this.data.lesson_id === null) {
        //自定义编辑页--跳首页
        return {
          title: 'Rays听写',
          path: '/pages/desktop/desktop=' + '&adviser_id=' + adviser_id+'&preUid='+that.data.uid
        }
      } else {
        //我的自定义列表的单元页
        return {
          title: this.data.lesson_name,
          path: '/pages/unit/unit?navigation_type=' + this.data.navigation_type + '&lesson_id=' + this.data.lesson_id + '&adviser_id=' + adviser_id + '&share=true'+'&preUid='+that.data.uid
        }
      }

    } else if (that.data.navigation_type === "book") {
      //我的自定义列表的单元页  课本列表的单元页
      // if (this.data.book_id || this.data.book_id == 0) {
      //课本列表的单元页--跳首页
      return {
        title: that.data.lesson_name,
        path: '/pages/unit/unit?navigation_type=' + that.data.navigation_type + '&lesson_id=' + that.data.lesson_id + '&share=true' + '&book_id=' + that.data.book_id + '&bookname=' + that.data.book_name + '&lesson_name=' + that.data.lesson_name + '&adviser_id=' + adviser_id+'&preUid='+that.data.uid
      }

      // } 
    }
  },
  //计算单词总数
  wordsCount: function (words) {
    var length = words.length;
    this.setData({
      words_number: length
    })
  },
  titleInput: function (e) {
    this.setData({
      title_input: e.detail.value,
    })
  },
  inputWord: function (e) {
    this.inputWordsCount();
    this.data.user_input = e.detail.value;
  },
  // inputBlur: function () {
  //   this.setData({
  //     focus: false,
  //   });
  // },
  inputWordsCount: function () {
    var that = this;
    var count;
    setTimeout(function () {
      if ((that.data.user_input.replace(/(^\s*)/g, "") === "") || (that.data.user_input.length === 0)) {
        count = 0;
      }
      else {
        // count = that.data.user_input.replace(/([；]+)/g, ";")
        //                             .replace(/(^[;]+)|([;]+$)/g,"")
        //                             .replace(/([;]+)/g,";")
        //                             .split(";").length;
        count = that.data.user_input.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
          .replace(/[；]+/g, "")
          .replace(/[;]+/g, "")
          .replace(/(^\n*)|(\n*$)/g, "")
          .replace(/\n+/g, "\n")
          .split("\n").length;
      }
      that.setData({
        // input_area_display: false,
        // button_display: "show",
        input_count: count
      });
    }, 100)
  },
  // inputFocus: function () {
  //   this.setData({
  //     focus: true
  //   })
  // },
  sendWords: function (e) {
    var that = this;
    console.log(that.data.user_input == "");
    // if (that.data.user_input == ""){
    //   wx.showToast({
    //     title: '请输入后再发送',
    //     duration: 1000
    //   })
    //   return false;
    // }
    console.log(that.data.words);
    console.log('asdfgg' + that.data.title_input, that.data.lesson_name)
    //确认input输入长度
    console.log(that.data.words.length);
    // if (that.data.words.length== 0 && that.data.user_input.length == 0 && that.data.title_input !== that.data.lesson_name) {
    //   wx.showToast({
    //     title: '不能新建为空',
    //     duration: 1000
    //   })
    //   return false;
    // }
    var input = that.emojiToSpace(that.data.user_input).replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "")
      .replace(/[；]+/g, "")
      .replace(/[;]+/g, "")
      .replace(/(^\s*)|(\s*$)/g, "")
      .replace(/(^\n*)|(\n*$)/g, "")
      .replace(/([，]+)/g, ",")
      .replace(/\n+/g, "\n")
    if (that.data.user_input.length == 0 && that.data.title_input === that.data.lesson_name) {
      wx.showToast({
        title: '内容不能为空',
        duration: 1000
      })
      that.setData({
        user_input: ""
      })
      that.updataTitle();
      return false;
    } else if (that.data.lesson_id ==null&&that.data.words.length == 0 && that.data.user_input.length == 0 && that.data.title_input !== that.data.lesson_name) {
      wx.showToast({
        title: '不能新建为空',
        duration: 1000
      })
      return false;
    } else if (input === "") {
      wx.showToast({
        title: '修改标题成功',
        duration: 1000
      })
  
      that.updataTitle();
      return false;
    }
    else {
      that.setData({ input_area_display: false })
    }


    //去掉首尾空格和首尾分号，把多个分号和中文分号都换成英文分号，并输出数组
    // var input = that.data.user_input.replace(/(^[;]+)/g, "")
    //   .replace(/(^[；]+)/g, "")
    //   .replace(/(^\s*)|(\s*$)|([;]+$)/g, "")
    //   .replace(/([；]+$)/g, "")
    //   .replace(/([，]+)/g, ",")
    //   .replace(/([；]+)/g, ";")
    //   .replace(/([;]+)/g, ";");
    //去掉首尾空格和首尾换行，去掉分号，以\n分隔
    
    input = input.split("\n");
    var input_norepeat = [];
    input.forEach(function (value, index, input) {
      if (input.indexOf(value) === index ) {
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
        duration: 1000
      })
      that.setData({
        isRepeat: false,
        input_area_display: false,
        button_display: "show",
        user_input: "",
        input_count: 0
      })
    }
    //点击添加后，更新单词表，获取mp3Url
    if (this.data.lesson_id !== null) {
      // var wordList = [];
      // that.data.words.forEach(function (value, index, array) {
      //   wordList[index] = value.dictation_word;
      // })
      // wordList = wordList.join(";");
      let wordlist = [];
      finalInput.forEach(function (value, index) {
        wordlist.push(value.dictation_word);
      })
      that.updataTitle();
      wordlist = wordlist.join(";");
      if (wordlist === "") {
        return false;
      }
      app.Dictation.AddUserLessonWord(that.data.lesson_id, wordlist, function (res) {
        // that.setData({
        //   originWord: that.data.words
        // })
      });
      setTimeout(function () {
        app.Dictation.getLessonWord(that.data.lesson_id, function (res) {
          that.setData({
            words: res.data.wordlist
          })
          that.getShowWords(that.data.words);
        })
      }, 1500)
    }
    else {
      var wordList = [];
      that.data.words.forEach(function (value, index, array) {
        wordList[index] = value.dictation_word;
      })
      wordList = wordList.join(";");
      app.Dictation.addLesson(wordList, that.data.title_input, function (res) {
        that.setData({
          lesson_id: res.data.userLessonId,
          // originWord: res.data.wordlist
        })
      })
      setTimeout(function () {
        app.Dictation.getLessonWord(that.data.lesson_id, function (res) {
          that.setData({
            words: res.data.wordlist
          })
          that.getShowWords(that.data.words);
        })
      }, 1500)
    }
    //console.log(that.data.words)
    that.getShowWords(that.data.words);
    //清空输入
    that.setData({
      user_input: "",
      isRepeat: false,
      input_area_display: false,
      button_display: "show",
      focus: false,
      input_count: 0,
    });
  },
  //二次过滤imoji图标
  emojiToSpace: function ($text) {
    return $text.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '');
  },
  updataTitle: function () {
    var that = this;
    if (!that.data.input_disabled) {
      if (that.data.title_input !== that.data.lesson_name) {
        app.Dictation.UpdateCustomLessonTitle(that.data.title_input, that.data.lesson_id, function (res) {
          wx.setNavigationBarTitle({
            title: '自定义听写 ' + that.data.title_input,
          })
          that.setData({
            lesson_name: that.data.title_input
          })
          that.editHide();
        })
      }
    }
  },
  //输入框的隐藏和显示
  editShow: function () {
    var that = this;
    this.setData({
      input_area_display: true,
      button_display: "hide",
      focus: true,
      caseShow: false
    });
    setTimeout(function () {
      that.setData({
        placeholder: `
          词汇用换行隔开，逗号用于解释或翻译。
          例：
          花,花朵的花
          果,果实的果
          apple,苹果
          pencil,铅笔
           ` })
    }, 500)
  },
  editHide: function (e) {
    var that = this;
    this.setData({
      input_area_display: false,
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
      // var wordList = [];
      // that.data.words.forEach(function (value, index, array) {
      //   wordList[index] = value.dictation_word;
      // })
      // wordList = wordList.join(";");
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
        // if (JSON.stringify(that.data.words) == JSON.stringify(that.data.originWord)) {
        wx.stopBackgroundAudio();
        that.setData({ goOther: true })
        templateJs.goPlay(that.data.lesson_id, that.data.lesson_name, that.data.navigation_type, that.data.book_id, that.data.book_name);
        console.log(that.data.lesson_id, that.data.lesson_name, that.data.navigation_type, that.data.book_id, that.data.book_name);
        return true;
        // }
        // app.Dictation.updateLesson(that.data.id, wordList, function (res) {
        //   that.setData({
        //     originWord: that.data.words
        //   })
        //   console.log("update success");
        //   templateJs.goPlay(that.data.id, that.data.lesson_name, that.data.navigation_type, that.data.book_id, that.data.book_name);
        // })
      }
      //从自定义跳转过来
      if (that.data.navigation_type === "custom") {
        if (that.data.lesson_id === null) {
          app.Dictation.addLesson(wordList, function (res) {
            that.setData({
              lesson_id: res.data.userLessonId,
              // originWord: res.data.wordlist
            })
            console.log("custom success");
            wx.stopBackgroundAudio();
            that.setData({ goOther: true })
            templateJs.goPlay(res.data.userLessonId);
          })
        }
        else {
          // var originWordString = [];
          // that.data.originWord.forEach(function (value, index, array) {
          //   originWordString[index] = value.dictation_word;
          // })
          // originWordString = originWordString.join(";");
          // if (wordList == originWordString) {
          wx.stopBackgroundAudio();
          that.setData({ goOther: true })
          templateJs.goPlay(that.data.lesson_id, that.data.lesson_name, that.data.navigation_type, that.data.book_id, that.data.book_name);
          return true;
          // }
          // app.Dictation.updateLesson(that.data.id, wordList, function (res) {
          //   console.log("update success");
          //   that.setData({
          //     originWord: that.data.words
          //   })
          //   templateJs.goPlay(that.data.id, that.data.lesson_name, that.data.navigation_type, that.data.book_id, that.data.book_name);
          // })
        }
      }
    }
  },
  getShowWords: function (words) {
    var standard = [];
    var custom = [];
    var wordStandard = [];
    var wordCustom = [];
    words.forEach(function (value, index, array) {
      var o = {
        dictation_word: words[index].dictation_word.replace(/[，]+/g, ",").split(",")[0],
        is_standard: words[index].is_standard
      }
      if (words[index].is_standard == 1) {//标准词
        standard.push(o);
        wordStandard.push(words[index])
      } else {//非标准词
        custom.push(o);
        wordCustom.push(words[index])
      }
    })
    var showWords = standard.concat(custom);
    var words = wordStandard.concat(wordCustom);
    this.setData({
      words_show: showWords,
      words: words
    })
  },
  getDelShowWords: function (words) {
    var showWords = [];
    words.forEach(function (value, index, array) {
      var o = {
        dictation_word: words[index].dictation_word.replace(/[，]+/g, ",").split(",")[0],
        is_standard: words[index].is_standard
      }
      showWords.push(o);
    })
    this.setData({
      del_words_show: showWords
    })
  },
  getShareShowWords: function (words) {
    var showWords = [];
    words.forEach(function (value, index, array) {
      var o = {
        dictation_word: words[index].dictation_word.replace(/[，]+/g, ",").split(",")[0],
        is_standard: words[index].is_standard
      }
      showWords.push(o);
    })
    this.setData({
      share_words_show: showWords
    })
    if (this.data.share_words_show.length != 0) {
      this.setData({ caseShow: true })
    } else {
      this.setData({ caseShow: false })
    }
  },
  //标准词的恢复或者添加分享的词语 都需要 重新获取 getLessonWord 单词列表，因为添加词之后id都会变
  //点击删除的词语恢复
  recover: function (e) {
    var that = this;
    let wordLength = that.data.words.length;
    let index = e.currentTarget.dataset.index;
    if (!that.data.noDouble || !that.data.del_words[index]) {
      return
    }
    that.setData({ noDouble: false })
    //发出请求添加词语
    app.Dictation.AddUserLessonWord(that.data.lesson_id, that.data.del_words[index].dictation_word, function (res) {
      console.log("恢复");
      //del_words_show
      that.data.del_words_show.splice(index, 1);
      that.setData({ del_words_show: that.data.del_words_show })
      //del_words
      that.data.del_words.splice(index, 1);
      that.setData({ del_words: that.data.del_words })
      //words
      app.Dictation.getLessonWord(that.data.lesson_id, function (res) {
        that.setData({ words: res.data.wordlist })
        //words_show
        if (that.data.words.length !== 0) {
          that.getShowWords(that.data.words);
        }
        that.wordsCount(that.data.words);
        console.log("恢复");
        console.log(res.data.wordlist);
        that.setData({ noDouble: true })
      })
      if (that.data.del_words.length == 0 && that.data.share_words.length == 0) {
        that.setData({ caseShow: false })
      }
    });
  },
  //点击添加分享的词语
  addShare: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var shareWordShow = that.data.share_words_show[index];
    if (!that.data.noDouble || !that.data.share_words_show[index]) {
      return false;
    }
    that.setData({ noDouble: false })
    app.Dictation.AddUserLessonWord(that.data.lesson_id, that.data.share_words[index].dictation_word, function (res) {
      //share_words_show
      that.data.share_words_show.splice(index, 1);
      that.setData({ share_words_show: that.data.share_words_show });
      //words_show 
      that.data.words_show.push(shareWordShow)
      that.setData({ words_show: that.data.words_show });
      //share_words
      that.data.share_words.splice(index, 1);
      that.setData({ share_words: that.data.share_words });
      //words 
      that.wordsCount(that.data.words);
      app.Dictation.getLessonWord(that.data.lesson_id, function (res) {
        that.setData({ words: res.data.wordlist })
        that.setData({ noDouble: true })

      })
      if (that.data.del_words.length == 0 && that.data.share_words.length == 0) {
        that.setData({ caseShow: false })
      }


    })
  },
  //点击叉删除词语
  deleteWord: function (e) {
    var that = this;
    var wordindex = e.currentTarget.dataset.index;
    if (!that.data.noDouble || !that.data.words[wordindex]) {
      return false;
    }
    console.log("删除", that.data.words[wordindex].dictation_word)
    that.setData({ noDouble: false })
    var wordtype = that.data.words[wordindex].is_standard;
    //发出请求删除词语
    app.Dictation.delWordById(that.data.words[wordindex].id, that.data.lesson_id, function (res) {
      //words_show
      var delWord = that.data.words_show.splice(wordindex, 1);
      that.setData({
        words_show: that.data.words_show
      });
      //del_words_show
      if (wordtype == 1) {//是标准词 放到删除词里
        that.data.del_words_show.push(delWord[0]);
        that.setData({ del_words_show: that.data.del_words_show })
        //del_words
        var newDelWords = that.data.del_words;
        newDelWords.push(that.data.words[wordindex]);
        that.setData({ del_words: newDelWords })
      }
      //words
      that.data.words.splice(wordindex, 1);
      that.setData({
        words: that.data.words
      });
      that.wordsCount(that.data.words);
      if (that.data.words == 0) {
        that.setData({ isEdit: false, longTimeOver: false })
      }
      that.setData({ noDouble: true })


    });

    //第一次进入，有遮罩
    if (wordtype == 1) {
      that.setData({ caseShow: true })
    }

  },
  //单击单词后播放单个单词
  play: function (e) {
    if (this.data.canPlay) {
      var that = this;
      // console.log(e)
      var index = e.currentTarget.dataset.index;
      var lessonId = that.data.lesson_id;
      if (index > that.data.words.length - 1) {
        return false;
      }
      var whichMp3 = that.data.words[index].word_mp3_url;

      if (whichMp3) {
        wx.playBackgroundAudio({
          dataUrl: that.data.words[index].word_mp3_url,
        })

      } else {
        wx.showToast({
          title: '音频生成中',
          icon: 'success',
          duration: 1000
        })
        if (that.data.words[index].id) {
          app.Dictation.getWordMp3Url(lessonId, that.data.words[index].dictation_word, that.data.words[index].id, 1, function (res) {
            var mp3 = res.mp3Url;

            wx.playBackgroundAudio({
              dataUrl: res.mp3Url,
            });
            that.data.words[index].word_mp3_url = mp3;
            that.setData({ words: that.data.words })
          })
        } else {
          app.Dictation.getLessonWord(that.data.lesson_id, function (res) {

            that.setData({
              words: res.data.wordlist
            })
            that.play(e)
          })
        }

      }
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
    }, 1000);
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
    if (that.data.navigation_type == "custom") {
      that.gotoNext();
      return

    }
    console.log(that.data.unlock)
    if (that.data.unlock == "loading") {
      app.Dictation.ifAssess(that.data.uid, that.data.lesson_id, function (res) {
        console.log(res);
        that.setData({ unlock: res.data.unlock });
      })
    } else {
      if (!that.data.unlock) {
        that.setData({ showKey: true, ifDefaultTouch: "defaultTouch" });
      } else {
        that.setData({ showKey: false });
        that.gotoNext();
      }
    }

    if (that.data.goTap === true) {
      that.setData({ goTap: false });
    }
  },
  openThisUnitWithKey: function () {
    let that = this;
    if (that.data.key_rest_count > 0) {
      app.Dictation.keyToLesson(that.data.uid, that.data.book_id, that.data.lesson_id, 0, function (res) {
        if (res.success) {
          that.gotoNext();
          that.setData({ showKey: false });
        }
      });
    } else if (that.data.key_rest_count == 0) {
      wx.showToast({
        title: '您的钥匙不足',
        icon: 'success',
        duration: 2000
      })
    }
  },
  openAllBook: function () {
    var that = this;
    // that.setData({ goPayDetail: true,  });
    var adviser_id = wx.getStorageSync('adviser_id');
    console.log("openAllBook", adviser_id)
    if (adviser_id == 0) {
      app.Dictation.GetUserSpreadAdviser(function (res) {

        if (res.data.success) {

          that.setData({ adviser_id: res.data.data.adviser_id });
          console.log(adviser_id, "调取adviser_id成功");
          fastBuySeed()
        }
        // } else {
        //   that.openAllBook()

        // }

      })
    } else {
      fastBuySeed()
    }

    function fastBuySeed() {
      console.log(that.data.uid, adviser_id)
      app.Dictation.fastBuySeed(that.data.uid, that.data.book_id, adviser_id, function (rts) {
        // console.log("当前书的课程回调成功");
        // console.log(rts);
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
              that.gotoNext();
              that.setData({ showKey: false });
            },
            'fail': function (res) {
              //支付失败
              // console.log("支付失败");
              // that.setData({ goTap: false });
              that.setData({ showKey: true });
            }
          }
          );
        // console.log(rts);
      });
    }

  },
  returnToUnit: function () {
    var that = this;
    that.setData({ showKey: false, ifDefaultTouch: "promiseTouch" })
  },
  //打开caseshow
  openCase: function () {
    var that = this;
    if (that.data.del_words != 0 || that.data.share_words != 0) {
      that.setData({ caseShow: !that.data.caseShow })
    }
  },
  imageOnLoad:function(e){
    console.log(e);
  },
  //分享按钮的分享
  toShare: function () {
    // this.setData({ isClick: true })
    app.Dictation.SetUserBookIsClick(this.data.book_id, function () {

    })
    this.onShareAppMessage();
  }

  // closePayBox: function () {
  //   let that = this;

  //   that.setData({ goPayDetail: false, showKey: false })
  // },
  // immediatePay: function (event) {
  //   let that = this;
  //   if (that.data.goTap) {
  //     return;
  //   }
  //   that.setData({ goTap: true });
  //   app.Dictation.fastBuySeed(that.data.uid, that.data.book_id, 0, function (rts) {
  //     // console.log("当前书的课程回调成功");
  //     // console.log(rts);
  //     wx.requestPayment
  //       (
  //       {
  //         'timeStamp': rts.data.timeStamp,
  //         'nonceStr': rts.data.nonceStr,
  //         'package': rts.data.package,
  //         'signType': rts.data.signType,
  //         'paySign': rts.data.paySign,
  //         'success': function (res) {
  //           //支付成功
  //           // console.log(res);
  //           // console.log("支付成功啦");
  //           // that.data.canView = true;
  //           that.gotoNext();
  //           that.setData({ goPayDetail: false, goTap: false });
  //         },
  //         'fail': function (res) {
  //           //支付失败
  //           // console.log("支付失败");
  //           // that.setData({ goTap: false });
  //           that.setData({ goPayDetail: false, showKey: false });
  //         }
  //       }
  //       );
  //     // console.log(rts);
  //   });
  // },

})