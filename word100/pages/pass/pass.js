// pages/checkpoint/checkpoint.js
var app = getApp();
var ti = 0;
var t
var timeout = setInterval(function () {
  ti++;
}, 1000);
clearTimeout(timeout);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lesson_id: 0,
    book_id: 0,
    question: [],
    currentindex: 0,
    hp: 0,
    user_answer_list: [],
    star: 0,
    errWord: 0,
    isSubmit: false,
    display: false,
    id: 0,
    title: null,
    ind: 0,
    _type: null,
    aright: null,
    much: null,
    isClick: true,
    all_word: [],
    displayWord: [],
    str: null,
    displayX: false,
    isDis: false,
    dis_false: false,
    question_id: null,
    ind: 0,
    line_num: 0,
    star_time: 0,
    time: 0,
    isGetStar: false,
    isKeyWord: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let { str, time } = that.data;
    that.setData({ lesson_id: options.lesson_id, book_id: options.id, title: options.title, ind: parseInt(options.ind * 1 + 1) })
    console.log(that.data.ind);
    if (app.globalData.weixinUserInfo) {
      that.showGetUidcb();
    } else {
      app.uidCallback = () => {
        that.showGetUidcb();
      }
    }
    console.log(ti)
    ti = 0
    timeout = setInterval(function () {
      ti++;
      // console.log(ti)
    }, 1000);
    
  },
  showGetUidcb:function(){
    //随机题目
    let that = this;
    let { str, time } = that.data;
    app.word.getQuestions(that.data.lesson_id, function (res) {
      console.log(res.data)
      str = res.data.data[0].question.word_name;
      str.split('')
      // that.setData({ question: res.data.data, hp: res.data.data.length, str, question_id: res.data.question_id, _type: res.data.data[0].question.question_type, line_num: res.data.data[0].question.word_name.length });
      // that.all_num(str)
      that.setData({ question: res.data.data, hp: res.data.data.length, str, question_id: res.data.question_id, _type: res.data.data[0].question.question_type, line_num: res.data.data[0].question.word_name.length });
      if (res.data.data[0].question.question_type == 4) {
        that.all_num(str)
      }
    })
  },
  //随机单词
  all_num: function (str) {
    let that = this;
    let { _type, all_word, question, currentindex } = that.data;
    console.log("str=" + str)
    str = str.split("");

    // all_word.concat(str);
    for (let o in str) {
      all_word.push({ word: str[o] })
    }
    if (_type == 4) {
      for (let i = 0; i <= 13 - str.length; i++) {
        let word = Math.ceil(Math.random() * 25);
        all_word.push({ word: String.fromCharCode(65 + word).toLowerCase() })
      }
      all_word.sort(function (a, b) {    //function(a, b） 是一个排序指针方法
        return 0.5 - Math.random()   //  a -b 从小到大， b - a 从大到小 ，Math.random()  产生一个随机数，大于0.5 数组从小到大，小于0.5，数组从大到小排。
      });
      all_word.push({ word: "确定" })
      // console.log(all_word)
    }
    that.setData({ all_word })
    console.log(all_word)
  },

  //答题
  answer: function (e) {
    let that = this;
    // console.log(app.globalData.weixinUserInfo.weixinUser.uid)
    let { right, wordid, questiontype, id, index } = e.currentTarget.dataset;
    let word_user_answer_id = id;
    let word_id = wordid;
    let question_type = questiontype;
    let { currentindex, question, hp, errWord, star, isSubmit, isClick, str, displayWord, all_word } = that.data;
    question[currentindex].answers[index].checked = true;
    if (isClick) {
      if (right == 1 && currentindex <= question.length - 1) {
        console.log(currentindex)
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: question[currentindex].answers[index].word_id, word_answer_id: question[currentindex].answers[index].id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 0, answer_duration: ti });
        if (currentindex < question.length - 2) {
          currentindex++;
        } else if (currentindex == question.length - 2) {
          currentindex = currentindex + 1;
        }


        displayWord = [];
        all_word = [];
        setTimeout(function () {
          // that.setData({str: question[currentindex].question.word_name, displayWord, all_word, line_num: question[currentindex].question.word_name.length, })
          // if (question[currentindex].question.question_type == 4) {
          //   that.all_num(question[currentindex].question.word_name)
          //   console.log('asdf=' + question[currentindex].question.word_name)
          // }
          ti = 0
          timeout = setInterval(function () {
            ti++;
            // console.log(ti)
          }, 1000);
        }, 1000);
        that.setData({ user_answer_list, aright: 1, much: index, question: question, isClick: true, })
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          if (currentindex == question.length - 1 && res.success) {
            that.setData({ isGetStar: true })
            that.starnumber();
          }
          that.setData({ currentindex, _type: question[currentindex].question.question_type, str: question[currentindex].question.word_name, displayWord, all_word, line_num: question[currentindex].question.word_name.length })
          if (question[currentindex].question.question_type == 4) {
            that.all_num(question[currentindex].question.word_name)
            console.log('asdf=' + question[currentindex].question.word_name)
          }

        })

      } else if (right == 0 && currentindex <= question.length - 1) {
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: question[currentindex].answers[index].word_id, word_answer_id: question[currentindex].answers[index].id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 0, answer_duration: ti });

        // currentindex++
        errWord++;
        hp--;
        if (currentindex == question.length) {
          hp = hp - 1;
          errWord = errWord + 1;
        }
        // setTimeout(function () { that.setData({isClick: true }) }, 1000);
        that.setData({ hp, errWord, aright: 0, much: index, question: question, isClick: false, isDis: true, });
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          if (currentindex == question.length - 1 && res.success) {
            that.setData({ isGetStar: true })
            that.starnumber();
          }
          // that.setData({ currentindex })
        })
      };
    }
  },

  //星星数
  starnumber: function () {
    let that = this;
    let { currentindex, question, hp, star, isSubmit, question_id, book_id, lesson_id } = that.data;
    if (currentindex == question.length - 1 && that.data.isGetStar) {
      app.word.GetStar(question_id, book_id, lesson_id, function (res) {
        console.log(res)
        that.setData({ star: res.data.star, next_lesson_id: res.data.next_lesson_id, isSubmit: true, isClick: false })
      })
      clearTimeout(timeout);
    }
  },

  //播放音频
  audio: function () {
    let that = this;
    that.audioCtx = wx.createAudioContext('myAudio');
    that.audioCtx.setSrc(that.data.question[that.data.currentindex].question.word_mp3_url);
    that.audioCtx.play();
  },

  //返回关卡列表
  toitem: function () {
    let that = this;
    let pages = getCurrentPages(),
      delta;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == 'pages/item/item') {
        delta = pages.length - i - 1;
        break;
      }
    }
    wx.navigateBack({ delta })
  },

  //重新闯关
  again: function () {
    let that = this;
    wx.redirectTo({
      url: `/pages/word/word?lesson_id=${that.data.lesson_id}&ind=${that.data.ind}&title=${that.data.title}&id=${that.data.id}`,
    })
  },

  //下一关
  next: function () {
    let that = this;
    console.log(that.data.ind)
    if (that.data.next_lesson_id !== 0) {
      wx.redirectTo({
        url: `/pages/word/word?id=${that.data.book_id}&title=${that.data.title}&lesson_id=${that.data.next_lesson_id}&ind=${that.data.ind}`,
      })
    } else {
      wx.showToast({
        title: '已是最后一关',
      })
    }

  },

  //下一题
  nextWord: function () {
    let that = this;
    let { currentindex, displayWord, all_word, question } = that.data;
    displayWord = [];
    all_word = [];
    if (currentindex < question.length - 2) {
      currentindex++;
    } else if (currentindex == question.length - 2) {
      currentindex = currentindex + 1;
    }
    that.setData({ currentindex, isClick: true, isDis: false, aright: null, displayX: false, displayWord, all_word, str: question[currentindex].question.word_name, dis_false: false, _type: question[currentindex].question.question_type, line_num: question[currentindex].question.word_name.length, isKeyWord: false })
    that.all_num(that.data.str)
    ti = 0
    timeout = setInterval(function () {
      ti++;
      // console.log(ti)
    }, 1000);
  },

  //第四种题型   键盘
  wordClick: function (event) {
    let that = this;
    let str_o = '';
    let { wordidx, index } = event.currentTarget.dataset;
    let { displayWord, currentindex, hp, question, all_word, str, line_num } = that.data;

    console.log(all_word[index])
    if (wordidx !== "确定" && currentindex <= question.length - 1 && that.data.isClick && !all_word[index].checked) {     //点击字母

      if (displayWord.length < str.length) {
        displayWord.push({ one_word: wordidx, cuo: false });
        all_word[index].checked = true;
        that.setData({ all_word })
      }
      if (line_num > 0) {
        line_num--;
      }
      that.setData({ displayWord, line_num, });
    } else if (wordidx == "确定" && currentindex <= question.length - 1 && that.data.isClick) {    //点击确定
      all_word[index].checked = true;
      that.setData({ all_word })
      for (let o = 0; o < all_word.length; o++) {
        if (all_word[o].checked == true) {
          all_word[o].opacity = true;
          all_word[o].checked = false;
          that.setData({ all_word })
        }
      }

      for (let j = 0; j < displayWord.length; j++) {
        str_o = str_o + displayWord[j].one_word
      }
      console.log(str_o)
      if (str_o.toLowerCase() + '' == that.data.str.toLowerCase()) {     //拼写正确
        for (let i = 0; i < question[currentindex].answers.length; i++) {
          if (question[currentindex].answers[i].is_right == 1) {
            var word_id = question[currentindex].answers[i].word_id;
            var word_answer_id = question[currentindex].answers[i].id;
          }
        }
        console.log(word_id, word_answer_id)
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: word_id, word_answer_id: word_answer_id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 0, answer_duration: ti });

        displayWord = [];
        all_word = [];
        if (currentindex < question.length - 2) {
          currentindex++;
        } else if (currentindex == question.length - 2) {
          currentindex = currentindex + 1;
        }
        that.setData({ isClick: true, displayWord, all_word, str: question[currentindex].question.word_name, _type: question[currentindex].question.question_type, line_num: question[currentindex].question.word_name.length, })
        that.all_num(that.data.str)
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          // console.log(res.success)
          if (currentindex == question.length - 1 && res.success) {
            that.setData({ isGetStar: true })
            that.starnumber();
          }
          that.setData({ currentindex })
        })

        ti = 0
        timeout = setInterval(function () {
          ti++;
          // console.log(ti)
        }, 1000);
        console.log("拼写正确")
      } else {           //拼写错误
        str.split("")
        var str_dui = [];
        for (let z in str) {
          str_dui.push(str[z])
        }
        console.log(str_dui)
        //答错变red
        if (displayWord.length == str.length) {
          for (let x = 0; x < str_dui.length; x++) {
            // console.log(displayWord[x].one_word+'', str_dui[x]+'' )
            if (displayWord[x].one_word + '' == str_dui[x] + '') {
              displayWord[x].cuo = false;
            } else {
              displayWord[x].cuo = true;
            }
          }
          that.setData({ displayWord })
        } else {
          let cha = str.length - displayWord.length;
          console.log(cha)
          for (let q = 0; q < cha; q++) {
            displayWord.push({ word_one: "" })
          }
          for (let x = 0; x < str_dui.length; x++) {
            // console.log(displayWord[x].one_word+'', str_dui[x]+'' )
            if (displayWord[x].one_word + '' == str_dui[x] + '') {
              displayWord[x].cuo = false;
            } else {
              displayWord[x].cuo = true;
            }
          }
          that.setData({ displayWord })
        }
        //传答案
        for (let j = 0; j < question[currentindex].answers.length; j++) {
          if (question[currentindex].answers[j].is_right == 0) {
            var word_id = question[currentindex].answers[j].word_id;
            var word_answer_id = question[currentindex].answers[j].id;
          }
        }
        console.log(word_id, word_answer_id)
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: word_id, word_answer_id: word_answer_id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 0, answer_duration: ti });

        console.log('拼写错误')
        that.setData({ isDis: true, dis_false: true, isClick: false, isKeyWord: true })
        hp--;
        if (currentindex + 1 == question.length) {
          hp = hp - 1;
        }
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          if (currentindex == question.length - 1 && res.success) {
            that.setData({ isGetStar: true })
            that.starnumber();
          }
        })
      }
      that.setData({ hp, })
    }
  },

  //删除单词
  del: function () {
    let that = this;
    let { displayWord, line_num, str, all_word } = that.data;
    console.log(displayWord[displayWord.length - 1].one_word)
    for (let j = 0; j < all_word.length; j++) {
      if (displayWord[displayWord.length - 1].one_word == all_word[j].word) {
        all_word[j].checked = false;
        that.setData({ all_word })
      }
    }
    if (line_num <= str.length - 1) {
      line_num++;
    }
    displayWord.pop();
    that.setData({ displayWord, line_num, isClick: true })
  },

  //解析
  detail: function () {
    let that = this;
    that.setData({ displayX: true })
  },

  close: function () {
    let that = this;
    that.setData({ displayX: false })
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
    clearTimeout(timeout);
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
    var title = '';
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, path, 0, "pass", "小程序单词100分享");
  }
})