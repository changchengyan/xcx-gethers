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
    lesson_id: 73,
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
    dis_false: false,
    question_id: null,
    ind: 0,
    line_num: 0,
    star_time: 0,
    time: 0,
    isGetStar: false,
    isKeyWord: false,
    word_list: [],
    isBiao: false,
    isDisFail: false,
    isDisSuccess: false,
    word_num: 0,
    prev_word: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let { str, time, word_list } = that.data;
    that.setData({ book_id: options.book_id, title: options.title, })
    console.log(that.data.book_id)
    if (app.globalData.weixinUserInfo) {
      that.showGetUidcb();
    } else {
      app.uidCallback = () => {
        that.showGetUidcb();
      }
      }
    ti = 0
    timeout = setInterval(function () {
      ti++;
      // console.log(ti)
    }, 1000);
  },
  showGetUidcb:function(){
    let that = this;
    //获取开始复习的word_id列表
    app.word.getUserWrongWordList(that.data.book_id, function (res) {
      if (res.success) {
        console.log(res.data)
        that.setData({ word_list: res.data.idlist, question_id: res.data.question_id, hp: res.data.idlist.length, word_num: res.data.idlist.length })
        that.getRandomQuestions(that.data.word_list[0].word_id)
      }
    })
  },
  //根据单词ID随机获取一种题型
  getRandomQuestions: function (word_id) {
    let that = this;
    let { currentindex, str, prev_word} = that.data;
    app.word.getRandomQuestions(word_id, function (res) {
      if (res.success) {
        console.log(res.data);
        str = res.data.data.question.word_name;
        str.split('');
        prev_word.push(res.data.data.question.word_name);
        that.setData({ question: res.data.data, str, _type: res.data.data.question.question_type, line_num: res.data.data.question.word_name.length, prev_word });
        if (res.data.data.question.question_type == 4) {
          that.all_num(str)
        }
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
    let { right, id, index } = e.currentTarget.dataset;
    let { currentindex, question, hp, errWord, star, isSubmit, isClick, str, displayWord, all_word, word_list } = that.data;
    console.log(hp)
    question.answers[index].checked = true;
    that.setData({ question, aright: 1,  })
    if (isClick) {
      if (right == 1 && currentindex <= word_list.length - 1) {
        console.log(currentindex)
        //答对移除
        app.word.delWordReview(word_list[currentindex].word_id, function (res) {
          if (res.success) {
            console.log('答对移除')
          }
        });
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: question.answers[index].word_id, word_answer_id: question.answers[index].id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 1, answer_duration: ti });
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          if (currentindex == word_list.length - 1 && res.success) {
            console.log('curr=' + currentindex, word_list.length - 1)
            console.log('最后一题')
            //结束
            that.setData({ isSubmit: true })
          }
          hp--;
          if (currentindex == word_list.length) {
            hp = hp - 1;
            errWord = errWord + 1;
          }
          if (currentindex < word_list.length - 2) {
            currentindex++;
          } else if (currentindex == word_list.length - 2) {
            currentindex = currentindex + 1;
          }
          displayWord = [];
          all_word = [];
          that.setData({ user_answer_list, much: index, question: question, isClick: true, hp })
          setTimeout(function () {
            that.setData({ currentindex, displayWord, all_word, });
            that.getRandomQuestions(word_list[currentindex].word_id);
            ti = 0
            timeout = setInterval(function () {
              ti++;
            }, 500);
          }, 500);
        });
      } else if (right == 0 && currentindex <= word_list.length - 1) {
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: question.answers[index].word_id, word_answer_id: question.answers[index].id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 1, answer_duration: ti });

        // currentindex++
        // errWord++;
        // hp--;
        // if (currentindex == word_list.length) {
        //   hp = hp - 1;
        //   errWord = errWord + 1;
        // }
        // setTimeout(function () { that.setData({isClick: true }) }, 1000);
        that.setData({ errWord, aright: 0, much: index, question: question, isClick: false, });
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          if (currentindex == word_list.length - 1 && res.success) {
            that.setData({ isSubmit: true })
            //结束

          };
          setTimeout(function () { that.setData({ displayX: true }), 1000 })
          // that.setData({ currentindex })
        })

      };
    }
  },

  //播放音频
  audio: function () {
    let that = this;
    that.audioCtx = wx.createAudioContext('myAudio');
    that.audioCtx.setSrc(that.data.question.question.word_mp3_url);
    that.audioCtx.play();
  },


  //下一题
  nextWord: function () {
    let that = this;
    let { currentindex, displayWord, all_word, question, word_list, hp } = that.data;
    displayWord = [];
    all_word = [];
    if (currentindex < word_list.length - 2) {
      currentindex++;
    } else if (currentindex == word_list.length - 2) {
      currentindex = currentindex + 1;
    }
    hp--;
    if (currentindex == word_list.length) {
      hp = hp - 1;
      errWord = errWord + 1;
    }
    that.setData({ currentindex, isClick: true, aright: null, displayX: false, displayWord, all_word, dis_false: false, isKeyWord: false, hp })
    that.getRandomQuestions(word_list[currentindex].word_id)
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
    let { displayWord, currentindex, hp, question, all_word, str, line_num, word_list } = that.data;

    console.log(all_word[index])
    if (wordidx !== "确定" && currentindex <= word_list.length - 1 && that.data.isClick && !all_word[index].checked) {     //点击字母
      if (displayWord.length < str.length) {
        displayWord.push({ one_word: wordidx, cuo: false });
        all_word[index].checked = true;
        that.setData({ all_word })
      }
      if (line_num > 0) {
        line_num--;
      }
      that.setData({ displayWord, line_num, });
    } else if (wordidx == "确定" && currentindex <= word_list.length - 1 && that.data.isClick) {    //点击确定
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
        //答对移除
        app.word.delWordReview(word_list[currentindex].word_id, function (res) {
          if (res.success) {
            console.log('答对移除')
          }
        });
        //传正确答案
        for (let i = 0; i < question.answers.length; i++) {
          if (question.answers[i].is_right == 1) {
            var word_id = question.answers[i].word_id;
            var word_answer_id = question.answers[i].id;
          }
        }
        hp--;
        if (currentindex == word_list.length) {
          hp = hp - 1;
          errWord = errWord + 1; 
        }
        console.log(word_id, word_answer_id)
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: word_id, word_answer_id: word_answer_id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 1, answer_duration: ti });
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          // console.log(res.success)
          if (currentindex == word_list.length - 1 && res.success) {
            that.setData({ isSubmit: true })
            //结束
          }
          displayWord = [];
          all_word = [];
          if (currentindex < word_list.length - 2) {
            currentindex++;
          } else if (currentindex == word_list.length - 2) {
            currentindex = currentindex + 1;
          }
          that.setData({ isClick: true, str: question.question.word_name, _type: question.question.question_type,  })
          // that.all_num(that.data.str)
          setTimeout(function () {
            that.setData({ currentindex, displayWord, all_word, line_num: question.question.word_name.length, hp })
            that.getRandomQuestions(word_list[currentindex].word_id)
            ti = 0
            timeout = setInterval(function () {
              ti++;
            }, 500);
          }, 500);
          console.log("拼写正确")
        });

      } else {           //拼写错误
        str.split("")
        var str_dui = [];
        for (let z in str) {
          str_dui.push(str[z])
        }
        console.log(str_dui)
        //错误单词变red
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
        //答错  传错误的答案 
        for (let j = 0; j < question.answers.length; j++) {
          if (question.answers[j].is_right == 0) {
            var word_id = question.answers[j].word_id;
            var word_answer_id = question.answers[j].id;
          }
        }
        console.log(word_id, word_answer_id)
        let user_answer_list = [];
        clearTimeout(timeout);
        // console.log(ti)
        user_answer_list.push({ question_id: that.data.question_id, word_id: word_id, word_answer_id: word_answer_id, uid: app.globalData.weixinUserInfo.weixinUser.uid, answer_mode: 1, answer_duration: ti });

        console.log('拼写错误')
        that.setData({ dis_false: true, isClick: false, isKeyWord: true });
        setTimeout(function () {
          that.setData({ displayX: true })
        }, 500)
        // hp--;
        // if (currentindex + 1 == word_list.length) {
        //   hp = hp - 1;
        // }
        app.word.saveUserAnswerRecord(user_answer_list, function (res) {
          if (currentindex == word_list.length - 1 && res.success) {
            that.setData({ isSubmit: true })
            // that.setData({ isGetStar: true })
            // that.starnumber();
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


  //移除复习单词，标为认识
  know: function () {
    let that = this;
    let { question } = that.data;
    let word_id = question.question.id;
    app.word.delWordReview(word_id, function (res) {
      console.log(res)
      if (res.success) {

        that.setData({ isBiao: true, isDisSuccess: true });
        setTimeout(function () {
          that.setData({ isDisSuccess: false })
        }, 1000);
        if (that.data.isDisFail) {
          that.setData({ isDisSuccess: false })
        }
      }
    })
  },

  //找回复习单词
  findDelWordReview: function () {
    let that = this;
    let { question } = that.data;
    let word_id = question.question.id;
    app.word.findDelWordReview(word_id, function (res) {
      if (res.success) {
        that.setData({ isBiao: false, isDisFail: true })
        setTimeout(function () {
          that.setData({ isDisFail: false })
        }, 1000);
        if (that.data.isDisSuccess) {
          that.setData({ isDisFail: false })
        }
      }
    })
  },

  //重新复习
  againReview: function () {
    let that = this;
    let pages = getCurrentPages(),
      delta;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == 'pages/review/review') {
        delta = pages.length - i - 1;
        break;
      }
    }
    wx.navigateBack({ delta })
  },

  //去PK
  goPK: function () {
    let that = this;
    wx.redirectTo({
      url: `/pages/PK/PK?book_id=${that.data.book_id}`,
    })
  },

  delReviewWord: function () {
    let that = this;
    clearTimeout(timeout);
    let { currentindex, displayWord, all_word, question, word_list, hp, } = that.data;
    let word_id = question.question.id;
    app.word.delWordReview(word_id, function (res) {
      if (res.success) {
        console.log('移除成功')
        if (currentindex == word_list.length - 1 ){
          that.setData({ isSubmit: true })
        }

      }
    })

    displayWord = [];
    all_word = [];
    if (currentindex < word_list.length - 2) {
      currentindex++;
    } else if (currentindex == word_list.length - 2) {
      currentindex = currentindex + 1;
    }
    hp--;
    if (currentindex == word_list.length) {
      hp = hp - 1;
      errWord = errWord + 1;
    }
    that.setData({ currentindex, isClick: true, aright: null, displayX: false, displayWord, all_word, dis_false: false, isKeyWord: false, hp })
    that.getRandomQuestions(word_list[currentindex].word_id)
    ti = 0
    timeout = setInterval(function () {
      ti++;
      // console.log(ti)
    }, 1000);

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
    // var path = `/pages/review/review?id=${that.data.book_id}&title=${that.data.title}`;
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, path, 0, "myreview", "小程序单词100分享");
  }
})