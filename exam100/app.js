//app.js
var Config =
  {
    //services: "http://114.215.110.243:1001/",
    services: "https://app-examine.codebook.com.cn/",
    uid: 0,
  };
App({
  globalData: {
    uid: 0,
    userInfo: {},
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    //  console.log("onLaunch")
    //  console.log(userInfo)
    if (userInfo) {
      that.globalData.userInfo = userInfo;
      that.globalData.uid = userInfo.weixinUser.uid;
      Config.uid = userInfo.weixinUser.uid;
    } else {
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
              console.log(userinfo_res)
              wx.request({
                url: `${Config.services}api/Examine/ExamineCommon/Login`,
                method: "POST",
                header: { 'content-type': 'application/json' },
                data: {
                  code: res.code,
                  userinfo: userinfo_res.userInfo,
                  appcode: 'EXAM100',
                  encryptedData: userinfo_res.encryptedData,
                  iv: userinfo_res.iv
                },
                success: function (res) {
                  //保存到全局
                  console.log("用户信息2")
                  console.log(res)
                  Config.uid = res.data.data.weixinUser.uid;
                  that.globalData.uid = res.data.data.weixinUser.uid;
                  that.globalData.userInfo = res.data.data;
                  wx.setStorageSync('userInfo', res.data.data);
                  if (that.uidCallback) {
                    that.uidCallback()
                  }
                  if (that.shouquanOk){
                    that.shouquanOk()
                  }
                }
              })
            },
            fail: function () {
              //console.log("获取授权失败");
              if (that.unshouquan){
	              that.unshouquan()
	            }
            }
          })
        } else {
          //console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  upDateUserInfo: function (cb) {
    var that = this;
    //仅仅是获得微信用户资料，没有与码书服务器通信
    wx.getUserInfo
      ({
        success: function (res) {
          console.log(res)
          that.globalData.userInfo.weixinUser.headimgurl = res.userInfo.avatarUrl;
          that.globalData.userInfo.weixinUser.nickname = res.userInfo.nickname;
          typeof cb == "function" && cb(res.userInfo)
        }
      })
  },
  //学习工具 获得所有资源
  getContent: function (lastid, count, cb) {
    lastid = lastid * 1 + 1;
    wx.request({
      url: `${Config.services}api/Platform/AppCommon/GetStudytoolContent?appcode=EXAM100`,
      data: { last_id: lastid, count: count },
      success: function (res) {
        if (cb) {
          cb(res.data)
        }
      },
      fail: function (res) {
        wx.showToast
          ({
            title: "获取失败",
            icon: 'success',
            duration: 2000
          })
      }
    })
  },
  //支持添加各种浏览记录及行为
  addBrowser: function (jsonObj) {
    wx.request
      ({
        url: `${Config.services}api/Listening/ListeningBook/AddBrowser`,
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "POST",
        data: { jsonObj },
        success: function (res) {

        },
        fail: function (res) {
          wx.showToast
            ({
              title: "删除用户的书籍异常！",
              icon: 'success',
              duration: 2000
            })
        }
      });


  },
  //添加浏览记录统一新接口
  // uid: 用户ID，sales_id: 浏览的ID(不是platform_book_id) ，sales_name：浏览的书或者商品（followbook_book/followbook_lesson），source_sales_id：默认0,课程时候传课程id,behavior:行为动态,client_name:0：浏览器、1：微信、2：QQ、3：微博、4：小程序、5：Android应用、6：iOS应用      
  //behavior,adviser_id,sales_id,sales_name,sales_desc,source_sales_id,source_sales_name,source_sales_desc,appcode,callback,client_name
  addBrowserNew: function (dataJson, cb) {
    if (!dataJson.uid && ataJson.adviser_id != 0) {
      behavior.uid = 0;
    }
    if (!dataJson.adviser_id && ataJson.adviser_id != 0) {
      dataJson.adviser_id = 0;
    }
    if (!dataJson.sales_id && ataJson.sales_id != 0) {
      dataJson.sales_id = 0;
    }
    if (!dataJson.source_sales_id && ataJson.source_sales_id != 0) {
      dataJson.source_sales_id = 0;
    }
    if (!client_name) { client_name = 4; }
    //添加浏览记录
    wx.request
      ({
        url: `${Config.services}api/Platform/AppletBrowser/AddBrowser`,
        data: dataJson,
        method: 'POST',
        success: function (res) {
          if (cb) {
            cb(res.data)
          }
        },
        fail: function (res) {
        }
      });
  },
  //分享的公共方法
  onShareAppMessage: function (pageTitle, pageImg, pagePath, cb) {
    //通用分享
    var that = this;
    if (pagePath.indexOf("?") > -1) {
      pagePath += "&share=true"
    }
    else {
      pagePath += "?share=true"
    }
    return {
      title: pageTitle,
      path: pagePath,
      imageUrl: pageImg,
      success: function (res) {
        if (cb) {
          cb();
        }
      },
      fail: function (res) {
        // 分享失败

      }
    }
  },
  exam: {
  	//发现(热门分类一周的数据)
  	getHotDiscover:function(pageIndex,pageSize,cb){
  		wx.request({
        url: `${Config.services}api/Examine/Examine/GetHotDiscover`,
        method: "GET",
        data:{
        	classify_id:1,
        	pageIndex:pageIndex,
        	pageSize:pageSize
        },
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
//查询所有分类
    getAllClassify:function(cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetAllClassify`,
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
    //查询所有课程
    getAllCourse: function (classify_id,pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetAllCourse?uid=${Config.uid}&classify_id=${classify_id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //获取当前用户的课程
    getUserCourse: function (cb) {
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetUserCourse?uid=${Config.uid}`,
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
    //添加课程
    addCourse: function (id, cb) {
      wx.request({
        url: `${Config.services}api/Examine/Examine/AddCourse?uid=${Config.uid}&id=${id}`,
        method: 'POST',
        data: { id: id, uid: Config.uid },
        success: function (res) {
          if (res.data.success) {
          	if(cb){
          		cb(res.data)
          	}           
          }else {
          	if(res.data.status==0){//该课程已添加
          		
          	}else{
          		wx.showToast({
		            title: res.data.message,
		            icon: 'success',
		            duration: 2000
		          })
          	}
						
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
    //删除课程
    delCourse: function (id, cb) {
      wx.request({
        url: `${Config.services}api/Examine/Examine/DelCourse?uid=${Config.uid}&id=${id}`,
        method: 'POST',
        data: { id: id, uid: Config.uid },
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
    //课程详情
    getCourseInfo: function (id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetCourseInfo?uid=${Config.uid}&id=${id}`,
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
    //课程的试卷列表
    getPaperList: function (id, pageIndex, pageSize,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetPaperList?id=${id}&uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //判断是否有答题记录
    getAnswerRecord: function (paper_id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetAnswerRecord?paper_id=${paper_id}&uid=${Config.uid}`,
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
    //保存答题记录
    addAnswerRecord: function (paper_id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/addAnswerRecord?paper_id=${paper_id}&uid=${Config.uid}`,
        method: 'POST',
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
    //获取试题（用answer_id不用paper_id的原因是防止试卷题目后期变更）
    getQuestions: function (answer_id,question_id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetQuestions?answer_id=${answer_id}&question_id=${question_id}`,
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
    //答题--保存答案
    answerQuestion: function (answer_id,question_id,user_content,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/AnswerQuestion?answer_id=${answer_id}&question_id=${question_id}&user_content=${user_content}&uid=${Config.uid}`,
        method: 'POST',
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
    //提交答卷
    submitAnswer: function (answer_id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/SubmitAnswer?answer_id=${answer_id}`,
        method: 'POST',
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
    //答题卡
    getAnswerSheet: function (answer_id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetAnswerSheet?answer_id=${answer_id}`,
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
    //答题报告
    getAnswerReport: function (answer_id,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetAnswerReport?answer_id=${answer_id}`,
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
    //我的试卷列表
    getWrongTopic: function (pageIndex,pageSize,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/getWrongTopic?uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
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
    //错题解析
    getResolution: function (answer_id,question_id,code,cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetResolution?answer_id=${answer_id}&question_id=${question_id}&code=${code}`,
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
    //我的答题总结
    getMyAnswerSummary: function (cb){
      wx.request({
        url: `${Config.services}api/Examine/Examine/GetMyAnswerSummary?uid=${Config.uid}`,
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
  }
})