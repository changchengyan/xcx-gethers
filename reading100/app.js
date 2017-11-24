//app.js
var service = "http://www.whtlkj.cn/write/"
var Config =
  {
    services: "https://rayscloud.chubanyun.net/api/Reading/",
    // services: "http://deveapi.chubanyun.net/api/Reading/",
    uid: 0
  };
App({
  onLaunch: function () {
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
    that.read.saveUserFormIds(that.globalData.formids, function (res) {
      if (res.success) {
        console.log("清空了")
        that.globalData.formids = [];
      }
    });
  },

  globalData: {
    userInfo: null,
    font: "default"
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
                    url: `${Config.services}ReadingCommon/ReadingLogin`,
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, userinfo: userinfo_res.userInfo, appcode: 'READING100', encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv },
                    success: function (res) {
                      //保存到全局
                      console.log(res);
                      that.globalData.userInfo = res.data.data;
                      // that.globalData.userInfo.first_login = true;
                      Config.uid = res.data.data.weixinUser.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if (cb) {
                        cb(userinfo_res);
                      }
                      // that.Writing.GetUserSpreadAdviser(function (res) {
                      //   wx.setStorageSync("adviserId", res.data.data.adviser_id);
                      // });

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


  read: {
    getDeskBookList: function (callback) {
      //获得我的书籍列表
      // lastid = lastid * 1 + 1;
      console.log(Config.uid);
      wx.request
        (
        {
          url: Config.services + 'ReadingBook/GetDictationBookByUID?uid=' + Config.uid,
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
    //删除用户的书籍
    deleteBook: function (book_id, callback) {
      wx.request
        (
        {
          url: Config.services + 'ReadingBook/DelUserDictationBook?uid=' + Config.uid + '&bookId=' + book_id,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "POST",
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
    //根据id获取音频
    getReadById: function (id, cb) {
      wx.request({
        url: `${service}getReadById?id=${id}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取音频失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    getList: function (bookId, cb) {
      wx.request({
        url: `${Config.services}ReadingLesson/GetReadingLessons?book_id=${bookId}&uid=${Config.uid}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取音频失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    /*根据bookId添加书籍*/
    addBookById: function (bookId) {
      console.log(bookId)
      wx.request({
        url: `${Config.services}ReadingBook/AddBook?uid=${Config.uid}&bookId=${bookId}`,
        method: "POST",
        success: function (res) {
          if (res.data.success) {
            wx.showToast
              (
              {
                title: res.data.message,
                icon: 'success',
                duration: 1000
              }
              )

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
    //  选择年级
    searchBook: function (grade, index, size, callback) {
      wx.request({
        url: `${Config.services}ReadingBook/GetDictationBookByPage?grade=${grade}&uid=${Config.uid}&pageIndex=${index}&pageSize=${size}`,
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
    //获取用户钥匙数量
    ownKeyNum: function (cb) {
      wx.request({
        url: `${Config.services}ReadingLesson/GetUserKeysCount?uid=${Config.uid}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (res.data.success) {
            cb(res.data);
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
    // 分享获得卡片
    getCardByShare(share_uid, cb) {
      wx.request({
        url: `${Config.services}ReadingLesson/AddUserKeyByShared?uid=${share_uid}&share_uid=${Config.uid}`,
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

    //支付接口
    fastBuySeed: function (readingBookId, adviserId, callback, failCallback) {
      //快速购买商品
      wx.request
        (
        {
          url: `${Config.services}ReadingCommon/ReadingFastBuy?uid=${Config.uid}&readingBookId=${readingBookId}&adviserId=${adviserId}`,
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
    //按关键词搜索书籍
    searchBookByKeyword: function (keyword, cb) {
      wx.request({
        url: `${Config.services}ReadingBook/SearchReadingBook?keyword=${keyword}&uid=${Config.uid}`,
        success: function (res) {
          cb(res);
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
    //获取书籍浏览记录数
    getBookScanCount: function (book_id, cb) {
      wx.request({
        url: `${Config.services}ReadingBook/getBookScanCount?book_id=${book_id}`,
        success: function (res) {
          cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取书籍收听次数失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //添加书籍浏览记录数
    AddBookScan: function (book_id) {
      wx.request({
        url: `${Config.services}ReadingBook/AddBookScan?uid=${Config.uid}&book_id=${book_id}`,
        success: function (res) {
          // cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "添加书籍收听次数失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //更新图书的最后阅读时间
    UpdateBookReadTime: function (bookId) {
      wx.request({
        url: `${Config.services}ReadingBook/UpdateBookReadTime?uid=${Config.uid}&bookId=${bookId}`,
        success: function (res) {
          // cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "更新图书的最后阅读时间失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //根据朗读的bookid获取听写和笔顺的bookid
    GetOtherBookID: function (bookId, cb){
      wx.request({
        url: `${Config.services}ReadingBook/GetOtherBookID?book_id=${bookId}`,
        success: function (res) {
          cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //使用钥匙解锁单个课程
    unlockLesson(uid, reading_lesson_id, reading_book_id, cb) {
      wx.request({
        url: `${Config.services}ReadingLesson/UnlockLesson?uid=${uid}&reading_lesson_id=${reading_lesson_id}&reading_book_id=${reading_book_id}`,
        success: function(res){
          cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "解锁失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //获取用户adviserid
    GetUserSpreadAdviser: function (cb) {
      console.log("adviseruid", Config.uid);
      wx.request
        (
        {
            url: `https://rayscloud.chubanyun.net/api/Platform/AppCommon/getAdviserByUid?uid=${Config.uid}&appcode=READING100`,
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
        url: `https://rayscloud.chubanyun.net/api/Platform/AppCommon/BindingUserAdviser?uid=${Config.uid}&adviser_id=${adviserId}&appcode=READING100`,
        success: function (res) {;
          cb(res);
        },
        fail: function () {
          // fail
        },
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
            url: `https://rayscloud.chubanyun.net/api/platform/AppCommon/BindAppDevice?uid=${Config.uid}&deviceid=${scene}&appcode=READING100`,
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
            url: `https://rayscloud.chubanyun.net/api/Platform/AppCommon/GetDeviceByUid?uid=${Config.uid}&appcode=READING100`,
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
          url: `https://rayscloud.chubanyun.net/api/Platform/AppCommon/DeleteBindingDevice?uid=${Config.uid}&deviceid=${deviceid}&appcode=READING100`,
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
          console.log("成功拉啊")
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



  },

})
