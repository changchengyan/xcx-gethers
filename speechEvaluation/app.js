//app.js
var Config =
  {
    //services: "http://deveapi.chubanyun.net/api/",    
    services: "https://rayscloud.chubanyun.net/api/",    
    uid: 0
  };
App({
  globalData:
  {
    weixinUserInfo: null,
    userInfo: null,
    LOADDING_ICON: "/pages/images/loading.gif",
    LOADDING_TEXT: "正在加载",
    currentData: {
      enText: "",
      sentence: null
    },
    formids: []
  },
  onLaunch: function (options) {
    // Do something initial when launch.
    //调用API从本地缓存中获取数据
    var that = this;
    //异步获取缓存数据，可能为空或者0
    // wx.getStorage
    //   (
    //   {
    //     key: 'weixinUserInfo',
    //     success: function (res) {
    //       console.log(res)
    //       that.globalData.weixinUserInfo = res.data;
    //       Config.uid = res.data.weixinUser.uid;
    //     },
    //     fail: function () {
    //       that.userLogin();
    //     }
    //   }
    //   )
      //同步获取缓存数据
      try {
          var value = wx.getStorageSync('weixinUserInfo')
          if (value) {
            console.log(value);
              that.globalData.weixinUserInfo = value;
              Config.uid = value.weixinUser.uid;
          }
          else {
              that.userLogin();
          }
      } catch (e) {
          // Do something when catch error
          that.userLogin();
      }
  },
  userLogin: function (cb) {
    var that = this;
    //用户登录
    wx.login
      (
      {
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (userinfo_res) {
                wx.request(
                  {
                    url: Config.services + 'SpeechEvaluation/SpeechEvaluationCommon/Login',
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv, appcode: 'SPEECHEVALUATION' },
                    success: function (res) {
                      //保存到全局
                      console.log(res);
                      that.globalData.weixinUserInfo = res.data.data;
                      Config.uid = res.data.data.weixinUser.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if(that.uidCallback){
                        that.uidCallback();
                      }
                      if (that.uidCallback2) {
                        that.uidCallback2();
                      }
                      if (cb) {
                        cb(userinfo_res);
                      }
                    },
                    fail: function (res) {
                      wx.showToast
                        (
                        {
                          title: "获取用户登录态失败",
                          icon: 'success',
                          duration: 2000
                        }
                        )
                    }
                  }
                )
              },
              fail: function () {
                wx.openSetting({
                  success: (res) => {
                    that.userLogin(cb)
                  }
                })
              }
            })
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
  },
  getUserInfo: function (cb) {
    //仅仅是获得微信用户资料，没有与服务器通信

    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      //调用登录接口
      wx.login
        (
        {
          success: function () {
            wx.getUserInfo
              (
              {
                success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  //console.log(res.encryptedData);
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              }
              )
          }
        }
        );
    }
  },
  onShareAppMessage: function (pageTitle, pagePath, imageUrl, sales_id, sales_name, sales_desc, callback) {
    //通用分享
    var that = this;

    if (pagePath.indexOf("?") > -1) {
      pagePath += "&share=true"
    }
    else {
      pagePath += "?share=true"
    }
    if (pageTitle == '') {
      pageTitle = "每天1分钟，检查口语发音，见证口语进步！";
    }
    if (imageUrl){
      return {
        title: pageTitle,
        path: pagePath,
        imageUrl: imageUrl,
        success: function (res) {
          callback(res);
          console.log(pagePath)
          // 分享成功,记录分析行为
          //getApp().codeBook.addBrowser(sales_id, sales_name, sales_desc, function () { }, 8);
        },
        fail: function (res) {
          // 分享失败

        }
      }
    }else{
      return {
        title: pageTitle,
        path: pagePath,
        success: function (res) {
          callback(res);
          console.log(pagePath)
          // 分享成功,记录分析行为
          //getApp().codeBook.addBrowser(sales_id, sales_name, sales_desc, function () { }, 8);
        },
        fail: function (res) {
          // 分享失败

        }
      }
    }


  },
  onShow: function (options) {
    // Do something when show.
    var that = this;
    wx.getStorage
      (
      {
        key: 'weixinUserInfo',
        success: function (res) {          
          Config.uid = res.data.weixinUser.uid;
          //更新adviser_id                    
          var adviser_id_new = options.query.adviser_id;             
          if (adviser_id_new && adviser_id_new!=0){            
            wx.setStorageSync('adviser_id', adviser_id_new);
          }
          var adviser_id = wx.getStorageSync('adviser_id');          
          if (!adviser_id) {
            that.speechEvalution.GetUserSpreadAdviser(function (res) {
              //console.log("GetUserSpreadAdviser" + Config.uid, res)
              wx.setStorageSync('adviser_id', res.data.data.adviser_id);
              //console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
            })
          } else {
            if (adviser_id!=0){
              that.speechEvalution.InsertUserSpreadAdviser(adviser_id, function () {
                //console.log("插入res.data.data.adviser_id成功", adviser_id)
              })
            }            
          }
        },
        fail: function () {
          that.userLogin();
        }
      }
      )
  },
  onHide: function () {
    // Do something when hide.
    var that = this;
    that.saveUserFormIds(that.globalData.formids, function (res) {
      if (res.success) {
        that.globalData.formids = [];
      }
    });
  },
  onError: function (msg) {
    console.log(msg)
  },
  //模板消息
  getFormID: function (event) {
    var that = this;
    //console.log("课文跳转")
    //console.log(event)
    var formData = {};//{"form_id":"0","expire_time":"2017-09-14 18:24:55.000"}
    var form_id = event.detail.formId;
    formData.form_id = form_id;
    var myDate = new Date();
    myDate.setDate(myDate.getDate() + 7);//设置7天后过期
    var cur_year = myDate.getFullYear();//获取年
    var cur_month = myDate.getMonth() + 1;//获取月
    var cur_day = myDate.getDate();//获取日
    var cur_hour = myDate.getHours();//获取小时
    var cur_min = myDate.getMinutes();//获取分钟
    var cur_sec = myDate.getSeconds();//获取秒
    var time = cur_year + '-' + that.toDouble(cur_month) + '-' + that.toDouble(cur_day) + ' ' + that.toDouble(cur_hour) + ':' + that.toDouble(cur_min) + ":" + that.toDouble(cur_sec);
    //expire_time
    formData.expire_time = time;
    that.globalData.formids.push(formData);
    //console.log(that.globalData.formids)
  },
  toDouble: function (num) {
    if (num >= 10) {//大于10
      return num;
    } else {//0-9
      return '0' + num
    }
  },
  saveUserFormIds: function (formids, cb) {
    var services = Config.services;//services: "http://deveapi.chubanyun.net/api/Dictation/",    
    wx.request({
      url: `${services}Platform/AppletTemplate/SaveUserFormIds`,
      method: 'POST',
      data: { uid: Config.uid, appcode: 'SPEECHEVALUATION', formids: formids },
      success: function (res) {
        if (res.data.success) {
          if (cb) {
            cb(res.data)
          }
        }
        else {
          console.log(res.data.mesage)
        }
      },
      fail: function (res) {
      }
    })
  },
  fastBuySeed: function (book_id, adviser_id, callback,failCallback) {    
    //快速购买商品
    wx.request
      (
      {
          url: `${Config.services}SpeechEvaluation/SpeechEvaluationCommon/FastBuy`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: { uid: Config.uid, book_id: book_id, adviser_id: adviser_id },
        success: function (res) {
          console.log(res);
          if (res.data.success) {
            wx.requestPayment
              (
              {
                'timeStamp': res.data.data.timeStamp,
                'nonceStr': res.data.data.nonceStr,
                'package': res.data.data.package,
                'signType': res.data.data.signType,
                'paySign': res.data.data.paySign,
                'success': function (res_success) {
                  callback(res_success);
                },
                'fail': function (res_fail) {
                  //支付失败
                  console.log("支付失败");
                  failCallback(res_fail);
                  // that.setData({ goTap: false });                  
                }
              }
              );
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000,
                success: function () {
                  if (failCallback) {
                    failCallback();
                  }
                }
              }
              )
          }
        },
        fail: function (res) {
        }
      }
      );
  },
  commonNavigateTo:function(url){    
    if (getCurrentPages().length>=5){
      wx.redirectTo({
        url: url,
      })
    }
    else{
      wx.navigateTo({
        url: url,
      })
    }
  },
  speechEvalution: {
    getTodayInfo: function (callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetSentencesToDay',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            //console.log(res);
            callback(res)
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getBannerSentence: function (pageIndex, pageSize, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetSentenceByPage',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, pageIndex: pageIndex, pageSize: pageSize },
          success: function (res) {
            //console.log(res);
            callback(res)
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getSentenceById: function (id, sentence_type, callback) {
      wx.request
        (
        {
            url: Config.services + '/SpeechEvaluation/SpeechEvaluation/GetSentenceById',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { id: id, sentence_type: sentence_type, uid: Config.uid },
          success: function (res) {
            callback(res)
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    saveEvalaution: function (info, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/SaveEvalaution',
          method: "POST",
          header: { 'content-type': 'application/json' },
          data: {
            uid: Config.uid,
            sentence_id: parseInt(info.sentenceId),
            record_audio_url: info.speechFilePath,
            score: parseInt(info.totalSocre),
            accuracy: parseInt(info.accuracySocre),
            fluency: parseInt(info.fluencySocre),
            integrity: parseInt(info.integritySocre),
            record_sentence_duration: parseInt(info.speechSeconds),
            record_sentence: JSON.stringify(info.sentence)
          },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            console.log("保存评测信息失败");
          }
        }
        );
    },
    getEvaluationById: function (id, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetEvaluationById',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { id: id, uid: Config.uid },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },

    getTimeByUid: function (date, cb) {
      wx.request({
        url: `${Config.services}SpeechEvaluation/SpeechEvaluation/GetCalendarStatistics?uid=${Config.uid}&date=${date}`,
        success: function (res) {
          if (cb) {
            cb(res.data)
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '获取失败',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    getEvaluationBooks: function (grade, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetEvaluationBooks',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, grade: grade, pageIndex: 1, pageSize: 100 },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getBookSentences: function (book_id, lesson_id, pageIndex, pageSize, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetBookSentences',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, book_id: book_id, lesson_id: lesson_id, pageIndex: pageIndex, pageSize: pageSize },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getBookTopData: function (callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetBookTopData',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getSentenceEvaluationed: function (pageIndex, pageSize, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetSentenceEvaluationed',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, pageIndex: pageIndex, pageSize: pageSize },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    addBookFollow: function (book_id, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/AddBookFollow',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, book_id: book_id },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    addEvaluationPK: function (sentence_id, organiser_uid, challenger_uid, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/AddEvaluationPK',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { id: sentence_id, organiser_uid: organiser_uid, challenger_uid: challenger_uid },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getRankings: function (sentence_id, organiser_uid, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetRankings',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { id: sentence_id, organiser_uid: organiser_uid, challenger_uid: Config.uid },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getStatistics: function (callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetStatistics',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    createPoster: function (id, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/createPoster',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { sentence_id: id },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getPKListForChallenger: function (pageIndex, pageSize, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetPKListForChallenger',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { challenger_uid: Config.uid, pageIndex: pageIndex, pageSize: pageSize },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    delBook: function (book_id, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/DelBook',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, book_id: book_id },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getCompositeScoreOfBook: function (book_id, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetCompositeScoreOfBook',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: { uid: Config.uid, book_id: book_id },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getSeedInfoByBookId: function (book_id, callback) {
      wx.request
        (
        {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetSeedInfoByBookId',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {book_id: book_id ,uid: Config.uid},
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取信息失败，请检查网络",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //获取用户adviserid
    GetUserSpreadAdviser: function (cb) {
      wx.request
        (
        {
          url: `${Config.services}Dictation/DictationCommon/GetUserSpreadAdviser`,
          data: { uid: Config.uid},
          success: function (res) {
            cb(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "GetUserSpreadAdviser失败",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //记录用户adviserid
    InsertUserSpreadAdviser: function (adviser_id, cb) {
      wx.request
        (
        {
            url: `${Config.services}Dictation/DictationCommon/InsertUserSpreadAdviser?uid=${Config.uid}&adviser_id=${adviser_id}`,
          success: function (res) {
            cb(res);
          },
          // fail: function (res) {
          //   wx.showToast
          //     (
          //     {
          //       title: "InsertUserSpreadAdviser失败",
          //       icon: 'success',
          //       duration: 2000
          //     }
          //     )
          // }
        }
        );
    },
      getFreeQuota: function (sharer_uid,book_id, callback) {
          wx.request
          (
              {
                  url: Config.services + 'SpeechEvaluation/SpeechEvaluation/GetFreeQuota',
                  header: { 'content-type': 'application/x-www-form-urlencoded' },
                  data: {book_id: book_id ,participant_uid: Config.uid,sharer_uid:sharer_uid},
                  success: function (res) {
                      callback(res);
                  },
                  fail: function (res) {
                      wx.showToast
                      (
                          {
                              title: "获取信息失败，请检查网络",
                              icon: 'success',
                              duration: 2000
                          }
                      )
                  }
              }
          );
      },
      reloadSentenceById:function(id,callback){
        wx.request
          (
          {
            url: Config.services + 'SpeechEvaluation/SpeechEvaluation/ReloadSentenceById',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { id: id, uid: Config.uid},
            success: function (res) {
              callback(res);
            },
            fail: function (res) {
              wx.showToast
                (
                {
                  title: "获取信息失败，请检查网络",
                  icon: 'success',
                  duration: 2000
                }
                )
            }
          }
          );
      }
  }
})

