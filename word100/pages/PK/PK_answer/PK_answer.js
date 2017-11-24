// pages/PK/PK_answer/PK_answer.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    readyOk: true,
    opponent: {

    },
    user: {
      headimgurl:""
    },
    lesson_id: 0,
    book_id: 0,
    question: [],
    currentindex: 0,
    user_answer_list: [],
    challenger_answer_list: [],
    id: 0,
    title: null,
    _type: null,
    aright: null,
    isClick: true,
    question_id: null,
    time: 0,
    time_down: 20,
    userAswerTime:null,
    always_right:false,
    userInfo: {
      uid: 0,
      total_score: 0,
      combo: 0,
      combo_score: 0,
      accuracy_score: 0,
      time_score: 0,
    },
    challengerInfo: {
      uid: 0,
      total_score: 0,
      combo: 0,
      combo_score: 0,
      accuracy_score: 0,
      time_score: 0,
    },
    challengerTime: [],
    rest:true,
    allFinish: 0,
    userWidth: 50,
    challengerWidth: 50,
    PK_saving:false,
    PK_finsh:false,
    PK_result:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options || options.book_id) {
      that.setData({ book_id: options.book_id })
    }
    if (app.globalData.weixinUserInfo) {
      that.getUserInfo()
      that.randomPK();
    } else {
      app.uidCallback = () => {
        that.getUserInfo()
        that.randomPK();
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
    let that = this;
  
    // console.log("onShow")
  },
  getUserInfo: function () {
    let that = this;
    let { user } = that.data;
    wx.getStorage({
      key: 'weixinUserInfo',
      success: function (res) {
        // console.log("res.data", res.data.weixinUser.headimgurl)
        user.headimgurl = res.data.weixinUser.headimgurl;
        if (!user.headimgurl){
          user.headimgurl = '/pages/images/user_img.png'
        }
        user.nickname = res.data.weixinUser.nickname;
        user.uid = res.data.weixinUser.uid;
        that.setData({ user })
      }
    })
  },
  randomPK: function () {
    //随机pk对手选择
    //console.log("随机pk对手选择")
    let that = this;
    let { opponent } = that.data.opponent;
   
    app.word.RandomMatching().then(function (res) {
      opponent = res.data;
      if (!opponent.headimgurl) {
        opponent.headimgurl = "/pages/images/user_img.png"
      }
      that.setData({ opponent })
      //console.log("RandomMatching",res.data)
    }).then(
      that.getQuestionsPK()
      )
  },
  // canvas: function () {
  //   let that = this;
  //   let rightRate = 0.2;
  //   var context = wx.createCanvasContext('isCanvas')
  //   context.setStrokeStyle("#06c1ae")
  //   context.setLineWidth(10)
  //   context.arc(55, 55, 52, 0, rightRate * 2 * Math.PI, false)//圆的x坐标 圆的y坐标 圆的半径 起始弧度 终止弧度  指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针
  //   context.setLineCap('square');

  //     context.stroke()
  //     context.draw(true);
  //     context.fill()
    
  // },
//拿到pk题目
  getQuestionsPK: function () {
    let that = this;
    let { time, challengerTime } = that.data;
    console.log(that.data.book_id)
    app.word.GetQuestionsPK(that.data.book_id).then(
      function (res) {
        that.setData({ question: res.data.data,  question_id: res.data.question_id, _type: res.data.data[0].question.question_type });
        that.data.question.forEach(function (item, index) {
          if (item.challengerAnswer.answer_duration) {
            challengerTime.push(((item.challengerAnswer.answer_duration) % 5) + 1);
          } else {
            challengerTime.push(Math.round(Math.random() * 2+2))
          }

        })
        that.setData({ challengerTime })
      }).then(function(){
        that.star = setTimeout(function(){
          that.setData({ readyOk: false, rest:false })
          that.restTime();
          clearTimeout(that.star)
        },1500)
        
      })


  },

  //答题
  answer: function (e) {
    let that = this;
    let { currentindex, question, isClick, time, time_down } = that.data;
  
    if (isClick) {

      that.setData({ isClick: false });
      console.log(" that.data.question_id", that.data.question_id)
      // console.log(app.globalData.weixinUserInfo.weixinUser.uid)
      let { answer, questionitem, index } = e.currentTarget.dataset;
      console.log("answer", answer)
      console.log("question", questionitem)
      let question_id = questionitem.question_id;
      let word_id = answer.word_id;
      let word_book_id = questionitem.question.word_book_id;
      let word_lesson_id = questionitem.question.word_lesson_id;
      let word_answer_id = answer.id;
      let right = answer.is_right;
      question[currentindex].answers[index].checked = true;
      let user_answer_list = that.data.user_answer_list;
      //对了
      if (right == 1 && currentindex <= question.length - 1) {
        that.setData({ question, aright: 1, always_right:true})

      }//不对 
      else if (right == 0 && currentindex <= question.length - 1) {
        that.setData({ question,aright: 0 });
      }
      user_answer_list.push({ question_id: that.data.question_id, word_id: word_id, word_answer_id: word_answer_id, uid: that.data.user.uid, word_book_id: word_book_id, word_lesson_id: word_lesson_id, answer_mode: 3, answer_duration: time });
      that.setData({ user_answer_list, userAswerTime: time });
      //计算
      that.scoreCalculation(answer, "user");
    }
  },
  //对手答题
  challengerAnswer: function () {
    let that = this;
   // console.log("challengerAnswer", that.data.question)
    let { currentindex, question, time, time_down, challenger_answer_list } = that.data;
    let challengerAnswer = question[currentindex].challengerAnswer;
   
    challenger_answer_list.push({ question_id: that.data.question_id, word_id: challengerAnswer.word_id, word_answer_id: challengerAnswer.word_answer_id, uid: that.data.opponent.uid, word_book_id: challengerAnswer.word_book_id, word_lesson_id: challengerAnswer.word_lesson_id, answer_mode: 3, answer_duration: challengerAnswer.answer_duration });
    that.scoreCalculation(question[currentindex].challengerAnswer, "challenger");
  },
  //未答题
  noAnswer: function () {
    let that = this;
    let { question, currentindex, user_answer_list, challenger_answer_list, time } = that.data;
    //用户
    let word_book_id = question[currentindex].question.word_book_id;
    let word_lesson_id = question[currentindex].question.word_lesson_id;
    let challengerAnswer = question[currentindex].challengerAnswer;
    let answers = question[currentindex].answers;
    let word_id = question[currentindex].question.id;
    user_answer_list.push({ question_id: that.data.question_id, word_id: word_id, word_answer_id: 0, uid: that.data.user.uid, word_book_id: word_book_id, word_lesson_id: word_lesson_id, answer_mode: 3, answer_duration: time });
    that.setData({ user_answer_list, aright: null  });
    that.scoreCalculation(0, "user");

  },

  //保存答案
  saveAnswer: function () {
    console.log("保存答案")
    let that = this;
    let { question, currentindex, user_answer_list, challenger_answer_list, question_id, userInfo, challengerInfo } = that.data;
      var toRecord = {}
      toRecord.question_id = question_id;
      toRecord.organiserItem = userInfo;
      toRecord.organiserItem.data = user_answer_list;
      toRecord.challengerItem = challengerInfo;
      toRecord.challengerItem.data = challenger_answer_list;
     
      if (that.data.challengerInfo.total_score > that.data.userInfo.total_score) {
        that.setData({ PK_result: false })
      }
      console.log("toRecord", toRecord)
      app.word.saveUserAnswerRecordPK(toRecord, function (res) {
        wx.redirectTo({
          url: `/pages/PK/PK_detail/PK_detail?PK_finsh=true&PK_result=${'true'}&question_id=${that.data.question_id}&book_id=${that.data.book_id}`,
        })
      })
   
  },
  //分数计算
  scoreCalculation: function (whichAnswer, whichInfo) {
    let that = this;
    let this_combo_score = 0;
    let { userInfo, challengerInfo, time, allFinish, challengerTime, currentindex, userAswerTime} = that.data;
    userInfo.uid = that.data.user.uid;
    challengerInfo.uid = that.data.opponent.uid;
    if (allFinish == 0 && whichAnswer.is_right == 1){
      console.log("userAswerTime", userAswerTime)
      console.log("challengerTime[currentindex].answer_duration", challengerTime[currentindex])
      if (userAswerTime <= challengerTime[currentindex]) {
        userInfo.time_score = userInfo.time_score + Math.round(Math.random() * 2)
      } else {
        challengerInfo.time_score = challengerInfo.time_score + Math.round(Math.random() * 2)
      }
    }
    if (whichInfo == "user") {
      if (whichAnswer.is_right == 1) {
        userInfo.combo = userInfo.combo + 1;
        if (userInfo.combo > 1) {
          this_combo_score = (userInfo.combo - 1) * 5 > 25 ? 25 : (userInfo.combo - 1) * 5;//连对加分
        }
        userInfo.combo_score = userInfo.combo_score + this_combo_score;
        userInfo.accuracy_score = userInfo.accuracy_score + 125;
        userInfo.total_score = userInfo.accuracy_score + userInfo.combo_score + userInfo.time_score;
      } else {
        userInfo.combo = 0
      }
      that.setData({ userInfo })
    } else {
      if (whichAnswer.is_right == 1) {
        challengerInfo.combo = challengerInfo.combo + 1;
        if (challengerInfo.combo > 1) {
          this_combo_score = (challengerInfo.combo - 1) * 5 > 25 ? 25 : (challengerInfo.combo - 1) * 5;//连对加分
        }
        challengerInfo.combo_score = challengerInfo.combo_score + this_combo_score;
        challengerInfo.accuracy_score = challengerInfo.accuracy_score + 125;
        challengerInfo.total_score = challengerInfo.accuracy_score + challengerInfo.combo_score + challengerInfo.time_score;
      } else {
        challengerInfo.combo = 0
      }
      that.setData({ challengerInfo })
    }
    allFinish++;
    that.setData({ allFinish })
    that.nextItme()

  },

//下一题
  nextItme: function () {
    let that = this;
    clearTimeout(that.timewait);
    let { allFinish, currentindex, question } = that.data
    if (allFinish == 2) {
      clearInterval(that.timeout);  
     that.timewait = setTimeout(function(){
       if (currentindex <= question.length - 2) {
         currentindex++;
         that.setData({ currentindex, rest: true, allFinish: 0,  _type: question[currentindex].question.question_type, aright: null, always_right: false, userAswerTime:null });
         that.restTime();
         that.scoreProgress();
       }else {
         that.saveAnswer();
       }
     
     },1000)
      
    }
  },

  //第几题
  restTime:function(){
    let that = this;
    that.setData({ rest: true, time_down: 20, time: 0, })
    that.waiterest = setTimeout(function(){
      that.setData({ rest: false,  isClick: true, })
      that.showTime();
    },1500)
  },
  //计时器
  showTime: function () {
    let that = this;
    clearTimeout(that.waiterest)
    let { time, time_down, currentindex, challengerTime, question } = that.data;
    if (time == challengerTime[currentindex]) {
      that.challengerAnswer()
    }
 
    that.timeout = setInterval(function () {
     
      time_down = (20 - time);
      if (time == challengerTime[currentindex]) {
        that.challengerAnswer()
      }
      if (time_down == 0) {
        that.setData({isClick:false})
        that.noAnswer();
      }
      time++;
      that.setData({ time_down: time_down, time: time})
    }, 1000);
  },

  //比分进度
  scoreProgress: function () {
    let that = this;
    let { challengerInfo, userInfo, userWidth, challengerWidth } = that.data;
    let alltotal_score = userInfo.total_score + challengerInfo.total_score;
    userWidth = (userInfo.total_score / alltotal_score * 100);
    challengerWidth = (challengerInfo.total_score / alltotal_score * 100)
    console.log("userWidth", userWidth)
    that.setData({ userWidth, challengerWidth })
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
    clearInterval(that.timeout);
    let pages = getCurrentPages(),
      delta;
      console.log(pages)
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == 'pages/PK/PK') {
        delta = pages.length - i - 1;
        break;
      // } else if (pages[i].route == 'pages/item/item') {
      //     delta = pages.length - i - 1;
      //     break;
      }
    }
    // wx.redirectTo({
    //   url: `/pages/item/item?id=${that.data.book_id}&title=${that.data.title}`,
    // })
    wx.navigateBack({ delta })
  },
 
 
  //去详情
  // toDetail: function () {
  //   let that = this;
  //   wx.redirectTo({
  //     url: `/pages/PK/PK_detail/PK_detail?&question_id=${that.data.question_id}`,
  //   })
  // },
  //

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(that.timeout);
    // clearTimeout(that.star);
    // clearTimeout(that.timewait);
    // clearTimeout(that.waiterest)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    console.log("退出")
    clearInterval(that.timeout);
    clearTimeout(that.star);
    clearTimeout(that.timewait);
    clearTimeout(that.waiterest)
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

  }
})