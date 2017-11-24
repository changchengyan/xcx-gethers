//app.js
var Config =
  {
    services: "http://deveapi.chubanyun.net/api/",
    // services: "https://rayscloud.chubanyun.net/api/", 
    // common_services: "http://deveapi.chubanyun.net/api/",
    //common_services: "https://rayscloud.chubanyun.net/api/",

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
    formids: [],
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
          console.log("res.code", res.code)
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (userinfo_res) {
                console.log("getUserInfosuccess")
                wx.request(
                  {
                    url: Config.services + 'SpeechEvaluation/SpeechEvaluationCommon/Login',
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv, appcode: 'WORD100' },
                    success: function (res) {
                      //保存到全局
                      console.log(res);
                      that.globalData.weixinUserInfo = res.data.data;
                      Config.uid = res.data.data.weixinUser.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if(that.uidCallback){
                        that.uidCallback()
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
                console.log("fail")
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
                  that.globalData.userInfo = res.userInfo;
                  console.log("单独调用登录成功")
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
  onShareAppMessage: function (pageTitle, pagePath, sales_id, sales_name, sales_desc, callback) {
    //通用分享
    var that = this;
    if (pagePath.indexOf("?") > -1) {
      pagePath += "&share=true"
    }
    else {
      pagePath += "?share=true"
    }
    if (pageTitle == '') {
      pageTitle = "邀请好友来挑战，共同学习比赛闯关";
    }
    return {
      title: pageTitle,
      path: pagePath,
      success: function (res) {
        callback(res);
        // 分享成功,记录分析行为
        //getApp().codeBook.addBrowser(sales_id, sales_name, sales_desc, function () { }, 8);
      },
      fail: function (res) {
        // 分享失败

      }
    }

  },
  onShow: function (options) {
    // Do something when show.
    // var that = this;
    // wx.getStorage
    //   (
    //   {
    //     key: 'weixinUserInfo',
    //     success: function (res) {          
    //       Config.uid = res.data.weixinUser.uid;
    //       //更新adviser_id                    
    //       var adviser_id_new = options.query.adviser_id;             
    //       if (adviser_id_new && adviser_id_new!=0){            
    //         wx.setStorageSync('adviser_id', adviser_id_new);
    //       }
    //       var adviser_id = wx.getStorageSync('adviser_id');          
    //       if (!adviser_id) {
    //         that.speechEvalution.GetUserSpreadAdviser(function (res) {
    //           //console.log("GetUserSpreadAdviser" + Config.uid, res)
    //           wx.setStorageSync('adviser_id', res.data.data.adviser_id);
    //           //console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
    //         })
    //       } else {
    //         if (adviser_id!=0){
    //           that.speechEvalution.InsertUserSpreadAdviser(adviser_id, function () {
    //             //console.log("插入res.data.data.adviser_id成功", adviser_id)
    //           })
    //         }            
    //       }
    //     },
    //     fail: function () {
    //       that.userLogin();
    //     }
    //   }
    //   )
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
  fastBuySeed: function (book_id, adviser_id, callback, failCallback) {
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
  commonNavigateTo: function (url) {
    if (getCurrentPages().length >= 5) {
      wx.redirectTo({
        url: url,
      })
    }
    else {
      wx.navigateTo({
        url: url,
      })
    }
  },
  word: {
    //获取用户关注的前 N 个书籍相关信息
    getBookTopData: function (cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetBookTopData?uid=${Config.uid}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '获取信息失败，请检查网络',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //删除书籍关注
    delBook: function (book_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/DelBook?uid=${Config.uid}&book_id=${book_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '获取信息失败，请检查网络',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //获取所有的书籍
    getBooks: function (grade, callback) {
      wx.request
        (
        {
          url: Config.services + 'Word/WordBook/GetBooks',
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
    //添加用户对书籍的关注
    addBookFollow: function (book_id, callback) {
      wx.request
        (
        {
          url: Config.services + 'Word/WordBook/AddBookFollow',
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
    //获取课程列表
    getLessons: function (book_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetLessons?book_id=${book_id}&uid=${Config.uid}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //获取关卡单词
    getWord: function (lesson_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetWord?lesson_id=${lesson_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //单词详情
    getWordInfo: function (word_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetWordInfo?word_id=${word_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //随机题目
    getQuestions: function (lesson_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetQuestions?lesson_id=${lesson_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //免费关卡
    addFreeLesson: function (book_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/AddFreeLesson?uid=${Config.uid}&book_id=${book_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //保存答题记录
    saveUserAnswerRecord: function (user_answer_list, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/SaveUserAnswerRecord`,
        method: 'POST',
        data: { user_answer_list: user_answer_list, uid: Config.uid },
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {

          }
        },
        fail: function (res) {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //每日推荐
    getWordBookToDay: function (cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetWordBookToDay`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //移除复习单词
    delWordReview: function (word_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/DelWordReview?uid=${Config.uid}&word_id=${word_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //获取星星数
    GetStar: function (question_id, book_id, lesson_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetStar?uid=${Config.uid}&question_id=${question_id}&book_id=${book_id}&lesson_id=${lesson_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //获取个人中心信息
    GetUserStatistics: function (cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetUserStatistics?uid=${Config.uid}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //获取当前用户每本书需要复习的单词数
    getUserWrongWordCount: function (book_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetUserWrongWordCount?uid=${Config.uid}&book_id=${book_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //根据uid和bookId分页返回用户的错词集
    getUserWrongWordById: function (book_id, pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetUserWrongWordById?uid=${Config.uid}&book_id=${book_id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //获取开始复习的word_id列表
    getUserWrongWordList: function (book_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetUserWrongWordList?uid=${Config.uid}&book_id=${book_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //根据单词ID随机获取一种题型
    getRandomQuestions: function (word_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetRandomQuestions?word_id=${word_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //找回复习单词
    findDelWordReview: function (word_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/FindDelWordReview?uid=${Config.uid}&word_id=${word_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
  
    //PK记录
    GetRecordsPK: function (pageIndex, pageSize,cb) {
    
      wx.request({
        url: `${Config.services}Word/WordBook/GetRecords_PK?uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //PKxiangqing
    GetRecordInfo_PK: function (question_id, cb) {
      wx.request({
        url: `${Config.services}Word/WordBook/GetRecordInfo_PK?question_id=${question_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //随机匹配 PK 人物
    RandomMatching: function(){
      return new  Promise((resolve, reject) => {
        wx.request({
          url: `${Config.services}Word/WordBook/RandomMatching?uid=${Config.uid}`,
          method: 'POST',
          success: function (res) {
            // console.log("res随机人物", res)
            if (res.data.success) {
              resolve(res.data)//在异步操作成功时调用
            } else {
              reject(res.data);//在异步操作失败时调用
            }
          },
          // fail: function (res) {
          //   wx.showToast({
          //     title: "获取信息失败，请检查网络",
          //     icon: 'success',
          //     duration: 2000
          //   })
          // }
        })
      })
    },
    //PKqustionList
    GetQuestionsPK: function (book_id) {
      return new Promise(function (resolve, reject) {
        wx.request({
          url: `${Config.services}Word/WordBook/GetQuestions_PK?top=15&book_id=${book_id}`,
          success: function (res) {
            console.log("GetQuestionsPK",res)
            if (res.data.success) {
              resolve(res.data)//在异步操作成功时调用
            } else {
              reject(res);//在异步操作失败时调用
            }
          }
        })
      })
    },
    //保存答题记录
    saveUserAnswerRecordPK: function (jdata, cb) {
      wx.request({
        url:`${Config.services}Word/WordBook/SaveUserAnswerRecord_PK`,
        method:'POST',
        header:{'content-type':'application/json'},
        data: jdata,
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
           
          }
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //排行榜
    GetRankings: function (top) {
      return new Promise(function (resolve, reject) {
        wx.request({
          url: `${Config.services}Word/WordBook/GetRankings?top=${top}`,
          success: function (res) {
            console.log()
            if (res.data.success) {
              resolve(res.data)//在异步操作成功时调用
            } else {
              reject(res);//在异步操作失败时调用
            }
          }
        })
      })
    },
    //狂人
    GetManiacPK: function (top) {
      return new Promise(function (resolve, reject) {
        wx.request({
          url: `${Config.services}Word/WordBook/GetManiac_PK?top=${top}`,
          success: function (res) {
            console.log()
            if (res.data.success) {
              resolve(res.data)//在异步操作成功时调用
            } else {
              reject(res);//在异步操作失败时调用
            }
          }
        })
      })
    },
    //复习单词详情
    GetReviewWordInfo: function (word_id, book_id, cb){
      wx.request({
        url: `${Config.services}Word/WordBook/GetReviewWordInfo?word_id=${word_id}&uid=${Config.uid}&book_id=${book_id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "获取信息失败，请检查网络",
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    //更新每日推荐
    // updateWordBookToDay:function(cb){
    //   wx.request({
    //     url: `${Config.services}Word/WordBook/UpdateWordBookToDay`,
    //     success: function (res) {
    //       if (res.data.success) {
    //         cb(res.data);
    //       } else {
    //         wx.showToast({
    //           title: res.data.message,
    //           icon: 'success',
    //           duration: 2000
    //         })
    //       }
    //     },
    //     fail: function () {
    //       wx.showToast({
    //         title: "获取信息失败，请检查网络",
    //         icon: 'success',
    //         duration: 2000
    //       })
    //     }
    //   })
    // }
  },
  comment: {
    //学习工具 获得所有资源
    getContent: function (lastid, count, callback) {
      lastid = lastid * 1 + 1;
      wx.request({
        url: `${Config.services}/Platform/AppCommon/GetStudytoolContent?appcode=WORD100`,
        data: { last_id: lastid, count: count },
        success: function (res) {
          if (callback) {
            callback(res.data);
          }

        },
        fail: function () {
          wx.showToast({
            title: '学习工具列表',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
  }
})

