//app.js
var Config =
  {
    services: "https://rayscloud.chubanyun.net/api/Writing/",
    // services: "http://deveapi.chubanyun.net/api/Writing/",
    uid: 0
  };
App({
  globalData: {
    userInfo: null,
    font: "default",
    dataCode: null,
    formids: [],
    toMiniData: 0
  },

  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var that = this;
    wx.getStorage
      (
      {
        key: 'weixinUserInfo',
        success: function (res) {
          that.globalData.userInfo = res.data;
          //判断是否为第一次启动程序
          if (that.globalData.userInfo.first_login) {
            that.userLogin();

          }
          // that.globalData.userInfo.first_login = true;
          Config.uid = res.data.weixinUser.uid;
        },
        fail: function () {
          that.userLogin();
        }
      }
      );
  },
  onHide: function () {
    var that = this;
    that.Writing.saveUserFormIds(that.globalData.formids, function (res) {
      if (res.success) {
        console.log("清空了")
        that.globalData.formids = [];
      }
    });
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
                    url: `${Config.services}WritingCommon/WritingLogin`,
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, userinfo: userinfo_res.userInfo, appcode: 'WRITING100', encryptedData: userinfo_res.encryptedData, iv:userinfo_res.iv },
                    success: function (res) {
                      //保存到全局
                      that.globalData.userInfo = res.data.data;
                      // that.globalData.userInfo.first_login = true;
                      Config.uid = res.data.data.weixinUser.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if (cb) {
                        cb(userinfo_res);
                      }
                      that.Writing.GetUserSpreadAdviser(function (res) {
                        wx.setStorageSync("adviserId", res.data.data.adviser_id);
                      });

                    }
                  }
                )
              },
              fail: function () {
                console.log("获取授权失败");
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

  write: {
    //获取笔顺信息
    getBishun: function (word, cb) {
      wx.request({
        url: `${Config.services}WritingCommon/writingBiShunByWords?word=${word}`,
        method: "POST",
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取汉字信息失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    }
  },


  Writing: {

    //删除用户的书籍
    deleteBook: function (book_id, callback) {
      wx.request
        (
        {
          url: Config.services + 'WritingBook/DelUserWritingBook?uid=' + Config.uid + '&bookId=' + book_id,
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
      // lastid = lastid * 1 + 1;
      console.log(Config.uid);
      wx.request
        (
        {
          url: Config.services + 'WritingBook/GetWritingBookByUID?uid=' + Config.uid,
          // data: { uid: Config.uid, client_name: 4, count: count, last_id: lastid },
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
        url: `${Config.services}WritingBook/GetWordByLessonId?lessonId=${id}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          console.log('获取课程内容失败')
        }
      })
    },
    //根据uid和bookId获取课程列表
    getLessonList: function (bookId, index, pageSize, callback) {
      var that = this;
      wx.request({
        url: `${Config.services}WritingBook/GetLessonByBookId`,
        data:{
          uid: Config.uid,
          bookId: bookId,
          pageIndex: index,
          pageSize: pageSize
        },
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
        url: Config.services + 'WritingBook/GetWordByLessonId?lessonId=' + lesson_id,
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

    //使用钥匙解锁课程
    keyToLesson: function (uid, bookId, lesson_id, cb) {
      wx.request({
        url: `${Config.services}WritingCommon/UnlockLessonByUserKey?uid=${Config.uid}&bookId=${bookId}&lessonId=${lesson_id}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log('已用钥匙解锁该课程');
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
        url: `${Config.services}WritingBook/IsUnlock?uid=${uid}&lessonId=${lesson_id}`,
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
        url: `${Config.services}WritingBook/GetUserKeys?uid=${Config.uid}`,
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
    fastBuySeed: function (uid, writingBookId, adviserId, callback, failCallback) {
      //快速购买商品
      wx.request
        (
        {
          url: `${Config.services}WritingCommon/WritingFastBuy?uid=${uid}&writingBookId=${writingBookId}&adviserId=${adviserId}`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            if (res.data.success) {
              console.log("成功调取支付接口");
              callback(res.data);
            } else {
              console.log("失败", res);
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
      console.log(bookId);
      wx.request({
        url: `${Config.services}WritingBook/GetBookPriceById?bookId=${bookId}`,
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

    // 分享获得钢笔
    getPenByShare(share_uid, cb) {
      wx.request({
        url: `${Config.services}WritingBook/AddUserKeyByShared?uid=${share_uid}&share_uid=${Config.uid}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "分享失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //获取在线用户数
    /* getOnlineUserNum: function (callback) {
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
    }, */
    //更新图书的最后阅读时间
    updateBookReadTime: function (bookId, cb) {
      wx.request({
        url: `${Config.services}WritingBook/UpdateBookReadTime?uid=${Config.uid}&bookId=${bookId}`,
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

    /*根据bookId添加书籍*/
    addBookById: function (bookId) {
      console.log(bookId)
      wx.request({
        url: `${Config.services}WritingBook/AddUserWithBook?uid=${Config.uid}&bookId=${bookId}`,
        success: function (res) {
          if (res.data.success) {
            if (res.data.status == 0) {//新添加的书籍有提示
              wx.showToast
                (
                {
                  title: "添加成功",
                  icon: 'success',
                  duration: 1000
                }
                )

            }
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
    /* getBookLessonByShare: function (userLessonId, cb) {
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
    }, */

    //根据用户UID和当前课程返回下一课程ID
    /* returnNext: function (currLessonId, cb) {
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
    }, */
    addBrowser: function (book_id, book_name, dictation_lesson_id, callback, behavior) {

      if (!behavior) { behavior = 6; }
      //添加浏览记录
      wx.request
        (
        {
          url: `${Config.services}WritingCommon/AddBrowser`,
          data: { uid: Config.uid, sales_id: book_id, sales_name: book_name, source_sales_id: dictation_lesson_id, behavior: behavior, client_name: 4 },
          method: 'POST',
          success: function (res) {
            callback(res);
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
    //  选择年级
    searchBook: function (grade, index, size, callback) {
      wx.request({
        url: `${Config.services}WritingBook/GetWritingBookByPage?uid=${Config.uid}&grade=${grade}&pageIndex=${index}&pageSize=${size}`,
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
    //添加课程学习记录
    AddLessonRecord: function (bookId, lessonId, callback) {
      wx.request({
        url: `${Config.services}WritingBook/AddLessonRecord?uid=${Config.uid}&bookId=${bookId}&lessonId=${lessonId}`,
        success: function (res) {
          callback(res.data);
        },
        fail: function () {
          wx.showToast({
            title: '添加课程学习记录失败',
            icon: success,
            duration: 2000
          })
        }
      })
    },

    //获取用户adviserid
    GetUserSpreadAdviser: function (cb) {
      console.log("adviseruid", Config.uid);
      wx.request
        (
        {
          url: `${Config.services}WritingCommon/GetUserSpreadAdviser?uid=${Config.uid}`,
          success: function (res) {
            cb(res);
          },
          fail: function (res) {
            /* wx.showToast
              (
              {
                title: "GetUserSpreadAdviser失败",
                icon: 'success',
                duration: 2000
              }
              ) */
          }
        }
        );
    },
    // 绑定用户与推广人
    bindUserAndAdviser(adviserId, cb) {
      var that = this;
      wx.request({
        url: `${Config.services}WritingBook/addUserAndAdviser?uid=${Config.uid}&adviser_id=${adviserId}`,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
          // console.log("1",res);
          // that.Writing.GetUserSpreadAdviser(function(res){
          //   console.log("2",res);
          //   wx.setStorageSync("adviser_id", res.data.data.adviser_id);
          // });
          cb(res);
        },
        fail: function () {
          // fail
        },
      })
    },
    // //记录用户adviserid
    // InsertUserSpreadAdviser: function (adviser_id, cb) {
    //   wx.request
    //     (
    //     {
    //       url: `${Config.services}/DictationCommon/InsertUserSpreadAdviser?uid=${Config.uid}&adviser_id=${adviser_id}`,
    //       success: function (res) {
    //         cb(res);
    //       }
    //     }
    //     );
    // },

    //获取书籍是否解锁
    isUnlockBook: function (bookId, cb) {
      wx.request({
        url: `${Config.services}writingbook/IsUnlockBook?uid=${Config.uid}&bookId=${bookId}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function () {
          wx.showToast({
            title: '获取失败',
            icon: success,
            duration: 2000
          })
        }
      })
    },
    //更新浏览时间
    UpdateBrowserTime: function (browser_id) {
      wx.request({
        url: `${Config.services}/WritingCommon/UpdateBrowserTime?browser_id=${browser_id}`,
        success: function (res) {

        },
        fail: function () {
          wx.showToast({
            title: '更新失败',
            icon: success,
            duration: 2000
          })
        }
      })
    },
    //电视deviceid与用户id绑定
    BindAppDevice: function (scene, cb) {
      if (!scene) {
        return
      }
      wx.request
        (
        {
            url: `https://rayscloud.chubanyun.net/api/platform/AppCommon/BindAppDevice?uid=${Config.uid}&deviceid=${scene}&appcode=WRITING100`,
          success: function (res) {
            console.log("deviceid", scene, res);
            wx.removeStorageSync('scene');
            if (!res.data.success && res.data.status == 3001) {
              cb();
            }
          },
          fail: function (res) {
            wx.showToast
              (
              {
                title: "电视deviceid与用户id绑定失败",
                icon: 'success',
                duration: 2000
              }
              )
          }
        }
        );
    },
    //通过uid返回deviceid
    GetAppDeviceIdByUid: function (cb) {
      wx.request
        (
        {
            url: `https://rayscloud.chubanyun.net/api/Platform/AppCommon/GetDeviceByUid?uid=${Config.uid}&appcode=WRITING100`,
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
    //解除deviceid和用户的绑定
    DeleteBindingDevice: function (deviceid, cb) {
      wx.request
        ({
          url: `https://rayscloud.chubanyun.net/api/Platform/AppCommon/DeleteBindingDevice?uid=${Config.uid}&deviceid=${deviceid}&appcode=WRITING100`,
          success: function (res) {
            cb(res.data);

          },
          fail: function (res) {
            wx.showToast
              ({
                title: res.message,
                icon: 'success',
                duration: 2000
              })
          }
        });
    },
    //保存用户的formIds
    saveUserFormIds: function (formids, cb) {
      wx.request({
        url: `https://rayscloud.chubanyun.net/api/Platform/AppletTemplate/SaveUserFormIds`,
        method: 'POST',
        data: { uid: Config.uid, appcode: 'WRITING100', formids: formids },
        success: function (res) {
          console.log("成功保存用户formIds")
          console.log(res)
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
          console.log("失败拉啊")
        }
      })
    },
    //获取书籍分类
    getCategoryByBookId: function (bookId, cb) {
      wx.request
        ({
          url: `${Config.services}/WritingBook/GetCategoryByBookId?bookId=${bookId}`,
          success: function (res) {
            if (cb) {
              cb(res.data);
            }
          },
          fail: function (res) {
            wx.showToast
              ({
                title: res.message,
                icon: 'success',
                duration: 2000
              })
          }
        });
    },
    //根据分类获取书籍课程列表
    getUserLessonsAndWords: function (bookId, lessonCategory, pageIndex, pageSize, cb) {
      wx.request
        ({
          url: `${Config.services}/WritingBook/GetLessonAndWordsByBookId?uid=${Config.uid}&bookId=${bookId}&lessonCategory=${lessonCategory}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
          // data: {
          //   uid: Config.uid,
          //   bookId: bookId,
          //   category: category,
          //   pageIndex: pageIndex,
          //   pageSize: pageSize
          // },
          success: function (res) {
            if (cb) {
              cb(res.data);
            }
          },
          fail: function (res) {
            wx.showToast
              ({
                title: res.message,
                icon: 'success',
                duration: 2000
              })
          }
        });
    },
  
    //从听写返回码书
    /* GetPlatformBookId: function (book_id, cb) {
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
    } */

  }

})
