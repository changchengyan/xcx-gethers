//app.js
var Config =
  {
    //services: "https://dmservices.chubanyun.net/",
    //services: "https://rayscloud.chubanyun.net/api/Dictation/",
    services: "http://deveapi.chubanyun.net/api/Dictation/",
    uid: 0
  };
App({
  globalData: {
    userInfo: null,
    font: "default",
    dataCode: null,
  },
  // onShow: function (options) {
  //   var that = this;
  //   that.globalData.dataCode = options.referrerInfo
  // },
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var that = this;
    try {
      var value = wx.getStorageSync('weixinUserInfo')
      if (value) {
        that.globalData.userInfo = value;
        if (that.globalData.userInfo.first_login) {
          that.userLogin();
        }
        Config.uid = value.weixinUser.uid;
      } else {
        that.userLogin();
      }
    } catch (e) {
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
                    url: Config.services +'DictationHelper/DictationHelperLogin',
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, userinfo: userinfo_res.userInfo, appcode: 'DICTATIONHELPER' },
                    success: function (res) {
                      //保存到全局
                      that.globalData.userInfo = res.data.data;
                      // that.globalData.userInfo.first_login = true;
                      Config.uid = res.data.data.weixinUser.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if (cb) {
                        cb(userinfo_res);
                      }
                    },
                    fail: function (res) {
                      wx.showToast
                        (
                        {
                          title: "获取用户信息失败",
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
  Dictation: {
    GetBookByScanISBN: function (isbn, callback) {
      //扫条码添加书籍
      wx.request
        (
        {
          url: Config.services + 'DictationBook/GetBookByScanISBN?uid=' + Config.uid + '&isbn=' + isbn,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            callback(res)
            if (res.data.status == 0) {//新添加的书籍有提示
              wx.showToast
                (
                {
                  //title: res.data.data.book_name+"已添加到书架！",
                  title: "添加成功",
                  icon: 'success',
                  duration: 1000
                }
                )

            }

          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "扫条码添加书籍失败！",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //根据ISBN返回图书列表
    GetBookByISBN: function (isbn, callback) {
      console.log("Config.uid", Config.uid)
      wx.request
        (
        {
          url: `${Config.services}DictationBook/GetBookByISBN?uid=${Config.uid}&isbn=${isbn}`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            callback(res)

          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取图书失败",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //删除用户的书籍
    deleteBook: function (book_id, callback) {
      wx.request
        (
        {
          url: Config.services + 'DictationBook/DelUserDictationBook?uid=' + Config.uid + '&bookId=' + book_id,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          // data: { uid: Config.uid, client_name: 4, book_id: book_id },
          success: function (res) {
            callback(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "删除用户的书籍异常！",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    getDeskBookList: function (callback) {
      //获得我的书籍列表
      wx.request
        (
        {
          url: Config.services + 'DictationBook/GetDictationBookByUID?uid=' + Config.uid,
          success: function (res) {
            if (res.data.success) {
              callback(res.data);
            } else {
              wx.showToast
                (
                {
                  title: res.data.message,
                  icon: 'success',
                  duration: 2000
                }
                )
            }
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "获取书架失败！",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //根据lessonId获取课程信息
    getLessonById: function (id, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/GetLessonWordById?lessonId=${id}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.message)
          }
        },
        fail: function (res) {
          console.log('获取课程内容失败')
        }
      })
    },
    //根据uid和bookId获取课程列表
    getLessonList: function (uid, bookId, index, pageSize, callback) {
      var that = this;
      wx.request({
        url: Config.services + 'DictationLesson/GetUserDictationBookLessons?uid=' + uid + '&bookId=' + bookId + '&pageIndex=' + index + '&pageSize=' + pageSize,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (res.data.success) {
            callback(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取课程信息失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //根据lessonId获取课程章节及单词信息
    getLessonWord: function (lesson_id, callback) {
      var that = this;
      console.log(lesson_id)
      wx.request({
        url: Config.services + 'DictationLesson/GetLessonWordById?lessonId=' + lesson_id,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log('获取课程')

          if (res.data.success) {
            callback(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取课程信息失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //根据lessonId获取Book课程章节及单词信息
    getBookLessonWord: function (lesson_id, callback) {
      var that = this;
      console.log(lesson_id)
      wx.request({
        url: Config.services + 'DictationLesson/GetBookLessonWordById?lessonId=' + lesson_id,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log('获取课程')

          if (res.data.success) {
            callback(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取课程信息失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //根据uid分页返回用户的自定义听写列表
    getCustomList: function (pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/GetUserCustomLessons?uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },



    //根据用户Id、课本id、课程id、标准课程id，返回解锁课程
    keyToLesson: function (uid, bookId, lesson_id, UserLesson_id, cb) {
      wx.request({
        url: `${Config.services}/DictationCommon/UnlockLessonByUserKey?uid=${Config.uid}&dictationBookId=${bookId}&dictationUserLessonId=${lesson_id}&dictationLessonId=${UserLesson_id}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log('获取解锁课程');
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取课程信息失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },


    //根据uid、bookId、userLessonId返回是否解锁=>boolen
    ifAssess: function (uid, lesson_id, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/CheckUnlockV1?uid=${uid}&userLessonId=${lesson_id}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "课程未能获取解锁信息",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //根据uid获取用户当前获取的钥匙数=》number
    ownKeyNum: function (uid, cb) {
      wx.request({
        url: `${Config.services}/DictationCommon/getRestKeyCount?uid=${Config.uid}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取钥匙数量失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //支付接口
    fastBuySeed: function (uid, dictationBookId, adviserId, callback, failCallback) {
      //快速购买商品
      wx.request
        (
        {
            url: `${Config.services}/DictationHelper/DictationHelperFastBuy?uid=${uid}&dictationBookId=${dictationBookId}&adviserId=${adviserId}`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data.success) {
              console.log("成功调取");
              callback(res.data);
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
    //获取书的价钱
    getBookPriceById: function (bookId, cb) {
      wx.request({
        url: `${Config.services}DictationBook/GetBookPriceById?bookId=${bookId}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
          } else {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取课程价钱失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //删除用户的自定义课程
    delCustomList: function (lessonId, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/DelUserCustomLesson?uid=${Config.uid}&lessonId=${lessonId}`,
        success: function (res) {
          cb(res.data)
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    //添加听写记录
    addTestRecord: function (lessonId, wordList, wrongWordList, star, time, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/AddUserDictationRecord`,
        method: 'POST',
        data: { uid: Config.uid, userLessonId: lessonId, wordlist: wordList, wrongWordlist: wrongWordList, score: star, timeLength: time },
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    //获取在线用户数
    getOnlineUserNum: function (callback) {
      var that = this;
      wx.request({
        url: Config.services + "DictationCommon/GetUserCount",
        header: { 'content-type': 'application/json' },
        success: function (res) {
          callback(res.data.data.userCount);
        },
        fail: function (res) {
          console.log("获取在线人数失败");
        }
      })
    },
    //更新图书的最后阅读时间
    updateBookReadTime: function (bookId, cb) {
      wx.request({
        url: `${Config.services}DictationBook/UpdateBookReadTime?uid=${Config.uid}&bookId=${bookId}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    //修改课程以及单词
    updateLesson: function (lessonId, wordList, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/UpdateLesson`,
        method: 'POST',
        data: { uid: Config.uid, userLessonId: lessonId, wordlist: wordList },
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    //添加用户自定义听写本
    addLesson: function (wordList, title, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/AddUserCustomLessonAndTitle`,
        method: 'POST',
        data: { uid: Config.uid, title: title, wordlist: wordList },
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    /**
     * 获取词语的mp3路径
     * lessonId 课程id
     * wordString 单词
     * wordId 单词的id
     * soundType 1：男生；2：女生
     */
    getWordMp3Url: function (lessonId, wordString, wordId, soundType, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/GetWordMp3Url?uid=${Config.uid}&userLessonId=${lessonId}&word=${wordString}&userWordId=${wordId}&sound=${soundType}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    /*根据bookId添加书籍*/
    getBookByShare: function (bookId, cb) {
      console.log(bookId)
      wx.request({
        url: `${Config.services}DictationBook/GetBookByShare?uid=${Config.uid}&bookId=${bookId}`,
        success: function (res) {
          console.log("根据bookId添加书籍")
          console.log(res)
          if (res.data.success) {
            if (res.data.status == 0) {//新添加的书籍有提示
              wx.showToast
                (
                {
                  //title: res.data.data.book_name+"已添加到书架！",
                  title: "添加成功",
                  icon: 'success',
                  duration: 1000
                }
                )

            }
            if (cb) { cb(res.data); }
          }
          if (!res.data.success) {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }


        },
        fail: function () {
          wx.showToast
            (
            {
              title: "根据ID添加书籍失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    /*分享书本课程*/
    getBookLessonByShare: function (userLessonId, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/GetBookLessonByShare?uid=${Config.uid}&userLessonId=${userLessonId}`,
        success: function (res) {
          if (res.data.success) {
            if (res.data.status == 0 && res.data.message == 'add') {//新添加的课本
              wx.showToast
                ({
                  title: "已添加到书架！",
                  //  title: "已添加到自定义列表！",
                  icon: 'success',
                  duration: 2000
                })
            }
            if (cb) { cb(res.data); }
          }
          if (!res.data.success) {
            wx.showToast
              ({
                title: res.data.message,
                icon: 'success',
                duration: 2000
              })
          }
        },
        fail: function () {
          wx.showToast
            (
            {
              title: "添加自定义失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    /*分享自定义课程*/
    getLessonByShare: function (userLessonId, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/GetLessonByShare?uid=${Config.uid}&userLessonId=${userLessonId}`,
        success: function (res) {
          if (res.data.success) {
            if (res.data.status == 0) {//新添加的自定义有提示
              wx.showToast
                (
                {
                  //title: res.data.data.book_name+"已添加到书架！",
                  title: "已添加到自定义列表！",
                  icon: 'success',
                  duration: 2000
                }
                )
            }
            if (cb) { cb(res.data); }
          }
          if (!res.data.success) {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }


        },
        fail: function () {
          wx.showToast
            (
            {
              title: "添加自定义失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //根据用户UID和当前课程返回下一课程ID
    returnNext: function (currLessonId, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/GetLastUserLessonId?uid=${Config.uid}&currLessonId=${currLessonId}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          console.log('获取内容失败')
        }
      })
    },
    addBrowser: function (book_id, book_name, dictation_lesson_id, callback, behavior) {

      if (!behavior) { behavior = 6; }
      //添加浏览记录
      wx.request
        (
        {
          url: `${Config.services}DictationCommon/AddBrowser`,
          data: { uid: Config.uid, sales_id: book_id, sales_name: book_name, source_sales_id: dictation_lesson_id, behavior: behavior, client_name: 4 },
          method: 'POST',
          success: function (res) {
            callback(res.data);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "添加浏览记录异常！",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //UpdateBrowserTime
    UpdateBrowserTime: function (browser_id, cd) {
      wx.request({
        url: `${Config.services}DictationCommon/UpdateBrowserTime?browser_id=${browser_id}`,
        success: function (res) {
          // console.log("UpdateBrowserTime",res.data)
          // if (res.data.success){
          //   cd(res.data);
          // }

        },

      })
    },
    //  选择年级
    searchBook: function (grade, index, size, callback) {
      wx.request({
        url: `${Config.services}DictationBook/GetDictationBookByPage?grade=${grade}&uid=${Config.uid}&pageIndex=${index}&pageSize=${size}`,
        success: function (res) {
          callback(res.data);
        },
        fail: function () {
          wx.showToast({
            title: '获取书籍失败',
            icon: success,
            duration: 2000
          })
        }
      })
    },
    //删除单词
    delWordById: function (ids, userLessonId, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/DelWordById?ids=${ids}&userLessonId=${userLessonId}`,
        success: function (res) {
          if (res.data.success) {
            cb(res.data)
          }
          else {
            console.log(res.data.mesage)
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '删除失败',
            icon: success,
            duration: 2000
          })
        }
      })
    },
    //添加单词
    AddUserLessonWord: function (userLessonId, wordlist, cb) {
      wx.request
        (
        {
          url: `${Config.services}DictationLesson/AddUserLessonWord`,
          data: { uid: Config.uid, userLessonId: userLessonId, wordlist: wordlist },
          method: 'POST',
          success: function (res) {
            cb(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "添加单词失败",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //自定义课程title的更改 
    UpdateCustomLessonTitle: function (title, userLessonId, cb) {
      wx.request
        (
        {
          url: `${Config.services}/DictationLesson/UpdateCustomLessonTitle?title=${title}&userLessonId=${userLessonId}&uid=${Config.uid}`,
          success: function (res) {
            cb(res);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "添加题目失败",
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
          url: `${Config.services}/DictationCommon/GetUserSpreadAdviser?uid=${Config.uid}`,
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
          url: `${Config.services}/DictationCommon/InsertUserSpreadAdviser?uid=${Config.uid}&adviser_id=${adviser_id}`,
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
    //电视deviceid与用户id绑定
    BindAppDevice: function (scene) {
      if (!scene) {
        return
      }
      wx.request
        (
        {
          url: `${Config.services}/DictationCommon/BindAppDevice?uid=${Config.uid}&deviceid=${scene}`,
          success: function (res) {
            console.log("deviceid", scene, res)
            wx.removeStorageSync('scene')
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //从听写返回码书
    GetPlatformBookId: function (book_id, cb) {
      wx.request
        (
        {
          url: `${Config.services}/DictationBook/GetPlatformBookId?book_id=${book_id}`,
          success: function (res) {
            cb(res.data);
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: res.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //用户分享增加钥匙
    AddUserKeyByShared: function (preUid, cb) {
      wx.request
        (
        {
          url: `${Config.services}/DictationBook/AddUserKeyByShared?share_uid=${Config.uid}&uid=${preUid}`,
          success: function (res) {
            if (cb) {
              cb(res.data);
            }

          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: res.message,
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    
    //获取用户是否点击字段
    GetUserBookIsClick: function (bookId, cb) {
      wx.request
        (
        {
          url: `${Config.services}/DictationBook/GetUserBookIsClick?uid=${Config.uid}&bookId=${bookId}`,
          success: function (res) {
            if (cb) {
              cb(res.data);
            }

          },

        }
        );
    },
    //更新用户是否点击字段
    SetUserBookIsClick: function (bookId, cb) {
      wx.request
        (
        {
            url: `${Config.services}/DictationBook/SetBookClick?uid=${Config.uid}&bookId=${bookId}`,
           success: function (res) {
            if (cb) {
              cb(res.data);
            }

          },

        }
        );
    },

  }
})