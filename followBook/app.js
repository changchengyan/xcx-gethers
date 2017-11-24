//app.js
var Config =
  {
    // services: "https://deveapi.chubanyun.net/",
    services: "http://deveapi.chubanyun.net/",
    uid: 0
  };
App({
  globalData: {
  	uid:0,
    userInfo:{},
    weixinUserInfo: { uid: 0, code_book_font: "default" },
    LOADDING_ICON: "/pages/images/loading.gif",
    LOADDING_TEXT: "正在加载",
    NODATA_ICON: "/pages/images/nodata.png",
    NODATA_TEXT: "没有加载到任何信息，\n请等待编辑添加..."
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var userInfo=wx.getStorageSync('userInfo');
    console.log("onLaunch")
    console.log(userInfo)
    if(userInfo){
    	that.globalData.userInfo = userInfo;
      that.globalData.uid=userInfo.weixinUser.uid;
      Config.uid = userInfo.weixinUser.uid;	 
    }else{
    	that.userLogin();
    }
  },
  userLogin: function (cb) {
    var that = this;
    //用户登录
    wx.login({
	    success: function (res) {
	      if (res.code) {
	        wx.getUserInfo({
	          withCredentials: true,
	          success: function (userinfo_res) {
	          	console.log("用户信息1")
              //console.log(res)
	            wx.request({
                url: `${Config.services}api/Listening/ListeningCommon/ListeningLogin`,
                method: "POST",
                header: { 'content-type': 'application/json' },
                data: { 
                	code: res.code, 
                	userinfo: userinfo_res.userInfo, 
                	appcode: 'FOLLOWBOOK', 
                	encryptedData: userinfo_res.encryptedData, 
                	iv: userinfo_res.iv 
                },
                success: function (res) {
                  //保存到全局
                  console.log("用户信息2")
                  //console.log(res)
                  Config.uid= res.data.data.weixinUser.uid;
                  that.globalData.uid = res.data.data.weixinUser.uid;  
                  that.globalData.userInfo=res.data.data;
                  wx.setStorageSync('userInfo', res.data.data);
                  if (that.userInfoReadyCallback) {
		                that.userInfoReadyCallback()
		              }
                }
	            })
	          },
	          fail: function () {
	            //console.log("获取授权失败");
	            wx.openSetting({
	              success: (res) => {
	                that.userLogin(cb)
	              }
	            })
	          }
	        })
	      }else {
	        //console.log('获取用户登录态失败！' + res.errMsg)
	      }
	    }
	  });
  },
	upDateUserInfo: function (cb) {
		var that=this;
	  //仅仅是获得微信用户资料，没有与码书服务器通信
    wx.getUserInfo
    ({
      success: function (res) {
      	console.log(res)
        that.globalData.userInfo.weixinUser.headimgurl = res.userInfo.avatarUrl;
        that.globalData.userInfo.weixinUser.nickname = res.userInfo.nickname;
        typeof cb == "function" && cb()
      }
    })
	},
  followBook: {
    //  选择年级（默认添加全部图书）
    GetDictationBookList: function (callback, pageIndex, pageSize, grade) {
      wx.request({
        url: `${Config.services}api/Listening/ListeningBook/GetDictationBookList?uid=${Config.uid}&grade=${grade}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //获取图书列表
    getDeskBookList: function (pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}api/Listening/ListeningBook/GetDeskBookList?uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //更新图书列表(本应用中点击书籍,书籍会排在桌面的第一位)
    updateBookReadingTime: function (book_id,callback){
      wx.request
        (
        {
            url: `${Config.services}api/Listening/ListeningBook/UpdateBookReadingTime?book_id=${book_id}&uid=${Config.uid}`,
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
    //添加书籍的记录
    AddBookScan: function (book_id,cb){
      wx.request({
        url: `${Config.services}api/Listening/ListeningBook/AddBookScan?uid=${Config.uid}&book_id=${book_id}`,
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
    //增加图书
    addBooks: function (book_id, callback) {
      wx.request
        (
        {
            url: `${Config.services}api/Listening/ListeningBook/AddBooks?book_id=${book_id}&uid=${Config.uid}`,
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
    //删掉图书
    delBooks: function (book_id, callback) {
      wx.request
        (
        {
            url: `${Config.services}api/Listening/ListeningBook/DelBooks?book_id=${book_id}&uid=${Config.uid}`,
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
    //获取课本的简要信息
    getBookInfo: function (book_id, cb) {
      wx.request({
        url: `${Config.services}api/Listening/ListeningBook/GetBookInfo?book_id=${book_id}`,
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
    //获取某本书下的所有课本资源(针对本书的所有章节和每个章节的所有资源)
    getBookMatchList: function (cb, book_id, pageIndex, pageSize) {
      wx.request({
        url: `${Config.services}api/Listening/ListeningAppInstance/GetBookMatchList?uid=${Config.uid}&book_id=${book_id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //点击知识中显示的内容
    getBookKnowledgeList: function (cb, book_id, pageIndex, pageSize) {
      wx.request({
        url: `${Config.services}api/Listening/ListeningAppInstance/GetBookKnowledgeList?uid=${Config.uid}&book_id=${book_id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //学习工具 获得所有资源
    getContent: function (lastid,count,cb) {
      lastid = lastid * 1 + 1;
      wx.request({
        url: `${Config.services}api/Platform/AppCommon/GetStudytoolContent?appcode=FOLLOWBOOK`,
        data: { last_id: lastid,count: count },
        success: function (res) {
          if(cb){
          cb(res.data)          
          }
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
      //支持添加各种浏览记录及行为
    addBrowser:function(jsonObj){
      wx.request
        (
        {
            url: `${Config.services}api/Listening/ListeningBook/AddBrowser`,
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "POST",
          data: { jsonObj},
          success: function (res) {
            
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
    // uid: 用户ID，sales_id: 浏览的ID(不是platform_book_id) ，sales_name：浏览的书或者商品（followbook_book/followbook_lesson），source_sales_id：默认0,课程时候传课程id,behavior:行为动态,client_name:0：浏览器、1：微信、2：QQ、3：微博、4：小程序、5：Android应用、6：iOS应用
    addBrowserNew: function ( sales_id,sales_name, behavior, client_name,callback) {
      if (!client_name) { client_name = 4; }
      //添加浏览记录
      wx.request
        ({
          url: `${Config.services}api/Platform/AppletBrowser/AddBrowser`,
          data: {
            uid: Config.uid,
            behavior: behavior,
            sales_name: sales_name,
            sales_id: sales_id,
            source_sales_id: 0,            
            client_name: client_name,
            source_sales_name:"followbook"
          },
          method: 'POST',
          success: function (res) {
            callback(res.data);
          },
          fail: function (res) {
          }
        });
    },
    //支付接口
    listeningFastBuy: function (listeningBookId, adviserId,cb){
      wx.request
        ({
          url: `${Config.services}api/Listening/ListeningCommon/ListeningFastBuy?uid=${Config.uid}&listeningBookId=${listeningBookId}&adviserId=${adviserId}`,
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
        });
    },
  getAppBanner: function (cb) {//首页广告banner
	  wx.request({
	    url: `${Config.services}api/Platform/AppCommon/GetAppBanner`,
	    method: 'GET',
	    data: { appcode: 'FOLLOWBOOK' },
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
    //分享的公共方法
    onShareAppMessage: function (pageTitle, pagePath, sales_id, sales_name) {
      //通用分享
      var that = this;
      if (pagePath.indexOf("?") > -1) {
        pagePath += "&share=true"
      }
      else {
        pagePath += "?share=true"
      }
      console.log("path=" + pagePath);
      return {
        title: pageTitle,
        path: pagePath,
        success: function (res) {

          // 分享成功
          getApp().followBook.addBrowserNew(sales_id, sales_name, sales_id, sales_name ,8, function () { });

        },
        fail: function (res) {
          // 分享失败

        }
      }

    },
    //获取浏览人数总数
    getBookScanCount:function(book_id,cb){
      wx.request
        ({
          url: `${Config.services}api/Listening/ListeningBook/GetBookScanCount?book_id=${book_id}`,
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
        });
    },
    //获取其他小程序的bookid
    getOtherBookID:function(book_id,cb){
      wx.request
        ({
          url: `${Config.services}api/Listening/ListeningBook/GetOtherBookID?book_id=${book_id}`,
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
        });
    }

  },
  //格式化 例如”107“  时间戳  为  “00:12:36”
  formatTime: function (time) {
    if (time) {
      let f = Number(time);
      let hours, mins, seconds;
      if (f > 3600) {
        hours = parseInt(String(f / 60 * 60))
        mins = parseInt(String((f % 60) / 60));
        seconds = (f % 60) % 60;
        if (hours < 10) {
          hours = "0" + hours
        }
        if (mins < 10) {
          mins = "0" + mins
        }
        if (seconds < 10) {
          seconds = "0" + seconds
        }
        f = String(hours + ":" + mins + ":" + seconds)
      } else if (f < 3600 && f > 60) {
        mins = parseInt(String(f / 60));
        seconds = f % 60;
        if (mins < 10) {
          mins = "0" + mins
        }
        if (seconds < 10) {
          seconds = "0" + seconds
        }
        f = String(mins + ":" + seconds)

      } else {
        f = "00:" + f
      }
      return f;
    } else {
      return "00:00";
    }
  },
  // 格式化  例如“12:36:56” 时间戳 为   “79”
  reFormateTime: function (time) {
    let tmpTime = time.split(":");
    let addTime = 0;
    if (tmpTime.length == 3) {
      addTime = parseInt(tmpTime[0], 10) * 60 * 60 + parseInt(tmpTime[1], 10) * 60 + parseInt(tmpTime[2], 10)
    } else if (tmpTime.length == 2) {
      addTime = parseInt(tmpTime[0], 10) * 60 + parseInt(tmpTime[1], 10)
    } else {
      addTime = parseInt(tmpTime[0], 10)
    }
    return addTime
  },
  //格式化  例如 “00:12:36”  时间戳   为   “12:36”
  simplifyFormate:function(time){

    let tmpTime=time.split(":");
    if(tmpTime.length==3&&tmpTime[0]=="00"){
      tmpTime.splice(0,1)
    }
    tmpTime=tmpTime.join(":");

    return  tmpTime
  },


})