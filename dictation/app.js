//app.js
var Config =
  {
     //services: "https://dmservices.chubanyun.net/",
    services: "https://rayscloud.chubanyun.net/api/Dictation/",
    services02: "https://services.chubanyun.net/",
    uid: 0
  };
App({
  globalData: {
    userInfo: null,
    font: "default"
  },
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
          if (that.globalData.userInfo.first_login){
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
                    url: `${Config.services}DictationCommon/DictationLogin`,
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv, appcode: 'DICTATION' },
                    success: function (res) {
                      //保存到全局
                      that.globalData.userInfo = res.data.data;
                      // that.globalData.userInfo.first_login = true;
                      Config.uid = res.data.data.weixinUser.uid;
                      wx.setStorageSync('weixinUserInfo', res.data.data);
                      if (cb) {
                        cb(userinfo_res);
                      }
                    }
                  }
                )
              },
              fail: function () {
                console.log("获取授权失败");
                wx.openSetting({
                  success: (res) => {
                    that.userLogin()
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
    addBookByISBN: function (isbn, callback) {
      //扫条码添加书籍
      wx.request
        (
        {
          url: Config.services + 'DictationBook/GetBookByScanISBN?uid=' + Config.uid + '&isbn=' + isbn,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            callback(res)

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
    getDeskBookList: function (callback, lastid, count) {
      //获得我的书籍列表
      lastid = lastid * 1 + 1;
      console.log(Config.uid);
      wx.request
        (
        {
          url: Config.services + 'DictationBook/GetDictationBookByUID?uid=' + Config.uid,
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
    getLessonList: function (uid, bookId,index,pageSize, callback) {
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
    keyToLesson:function(uid,bookId,lesson_id,UserLesson_id,cb){
        wx.request({
          url: `${Config.services}/DictationCommon/UnlockLessonByUserKey?uid=${Config.uid}&dictationBookId=${bookId}&dictationUserLessonId=${lesson_id}&dictationLessonId=0`,
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
    ifAssess:function(uid,lesson_id,cb){
      wx.request({
        url: `${Config.services}DictationLesson/CheckUnlock?uid=${uid}&userLessonId=${lesson_id}`,
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
    ownKeyNum:function(uid,cb){
      wx.request({
        url: `${Config.services}/DictationCommon/getRestKeyCount?uid=${Config.uid}`,
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log('获取钥匙数量');
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
                title: "获取钥匙数量！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //支付接口
    fastBuySeed: function (uid, dictationBookId, dictationUserLessonId, dictationLessonId, callback, failCallback) {
      //快速购买商品
      wx.request
        (
        {
            url: `${Config.services}/DictationCommon/UnlockLessonByUserKey?uid=${uid}&dictationBookId=${dictationBookId}&dictationUserLessonId=${dictationUserLessonId}&dictationLessonId=${dictationLessonId}`,
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














    //删除用户的自定义课程
    delCustomList: function (lessonId , cb){
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
        success:function(res){
          callback(res.data.data.userCount);
        },
        fail: function(res){
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
    addLesson: function (wordList, cb) {
      wx.request({
        url: `${Config.services}DictationLesson/AddUserCustomLesson`,
        method: 'POST',
        data: { uid: Config.uid, wordlist: wordList },
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
   getBookByShare:function(bookId,cb){
   	console.log(bookId)
   	wx.request({
	    url: `${Config.services}DictationBook/GetBookByShare?uid=${Config.uid}&bookId=${bookId}`,
	    success: function (res) {
	    	console.log("根据bookId添加书籍")
	    	console.log(res)
	      if(res.data.success){
	      	if(res.data.status==0){//新添加的书籍有提示
	      		wx.showToast
            (
               {
                  //title: res.data.data.book_name+"已添加到书架！",
                  title: res.data.message,
                  icon: 'success',
                  duration: 2000
               }
            )
            
	      	}
          if(cb){cb(res.data);}    		
        }
      	if(!res.data.success){
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
   /*分享自定义课程*/
   getLessonByShare:function(userLessonId,cb){
   	wx.request({
	    url: `${Config.services}DictationLesson/GetLessonByShare?uid=${Config.uid}&userLessonId=${userLessonId}`,
	    success: function (res) {
	      if(res.data.success){
	      	if(res.data.status==0){//新添加的自定义有提示
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
              		
        }
      	if(!res.data.success){
      		wx.showToast
            (
               {
                  title: res.data.message,
                  icon: 'success',
                  duration: 2000
               }
            )
      	}
        
         if(cb){cb(res.data);}
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
   addBrowser:function(book_id,book_name,callback,behavior)
    {
     if(!behavior){behavior=6;}
      //添加浏览记录
      wx.request
      (
        {
          url:`${Config.services}DictationCommon/AddBrowser`,
          header: {'content-type': 'application/x-www-form-urlencoded'},
          data:{uid:Config.uid,sales_id:book_id,sales_name:book_name,behavior:behavior},
          method:'POST',
          success: function(res)
          {            
              callback(res);
          },
          fail:function(res)
          {
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
    }
  }
})