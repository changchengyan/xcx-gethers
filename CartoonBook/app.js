//app.js
var Config =
  {
    //services: "https://dmservices.chubanyun.net/",
    services: "https://rayscloud.chubanyun.net/api/PictureBook/",
    // services: "http://deveapi.chubanyun.net/api/PictureBook/",
    // services: "http://192.168.89.248:2020/api/PictureBook/",
    uid: 0
  };
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var that = this;
    try {
      var value = wx.getStorageSync('weixinUserInfo')

      if (value) {
        that.globalData.userInfo = value;

        Config.uid = value.weixinUser.uid;
        console.log("Config.uid ", Config.uid)
      } else {
        that.userLogin();
      }
    } catch (e) {
      that.userLogin();
    }

  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },

  userLogin: function (cb) {
    var that = this;
    //用户登录
    wx.login
      (
      {
        success: function (res) {
          wx.setStorageSync('firstLogin', "1");
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (userinfo_res) {
                wx.request(
                  {
                    url: Config.services + 'PictureCommon/PictureBookLogin',
                    method: "POST",
                    header: { 'content-type': 'application/json' },
                    data: { code: res.code, userinfo: userinfo_res.userInfo, encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv, appcode: 'PICTUREBOOK' },
                    success: function (res) {
                      //保存到全局
                      that.globalData.userInfo = res.data.data;
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
                );
              },
              fail: function () {
                wx.openSetting({
                  success: (res) => {
                    that.userLogin(cb)
                  }
                });
              }
            });
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
  },

  pictureBook: {
    //获取分类
    getClassify: function (cb) {
      wx.request({
        url: `${Config.services}PictureBook/GetClassify`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取分类失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //获取热门
    getHot: function (cb) {
      wx.request({
        url: `${Config.services}PictureBook/GetPictureBookHot`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取热门失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //查询分类下内容
    getInstance: function (second_classify_id, pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}PictureBook/GetSeriesInstance?uid=${Config.uid}&second_classify_id=${second_classify_id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "查询失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //添加浏览记录
    addBrowser: function (vid, cb) {
      wx.request({
        url: 'https://rayscloud.chubanyun.net/api/platform/AppletBrowser/AddBrowser',
        method: "POST",
        data: { uid: Config.uid, behavior: 6, sales_id: vid, sales_name: "picturebook_instance", source_sales_id: 0, source_sales_name: "picturebook", appcode: "PICTUREBOOK", client_name: 4 },
        success: function (res) {
          cb(res);
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
      })
    },
    //添加历史记录
    addHistory: function (vid, cb) {
      wx.request({
        url: `${Config.services}PictureBook/AddUserHistory`,
        method: "POST",
        data: { uid: Config.uid, behavior: 6, sales_id: vid, sales_name: "picturebook_instance", source_sales_id: 0, source_sales_name: "picturebook", appcode: "PICTUREBOOK", client_name: 4 },
        success: function (res) {
          cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "添加历史记录异常！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //更新浏览时间
    updateBrowserTime: function (browser_id) {
      wx.request({
        url: `https://rayscloud.chubanyun.net/api/platform/AppletBrowser/UpdateBrowserTime?browser_id=${browser_id}`,
        success: function (res) {
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "更新失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //更新播放时长
    updateTimelength: function (history_id, seen_time, cb) {
      wx.request({
        url: `${Config.services}PictureBook/UpdateTimelength?history_id=${history_id}&seen_time=${seen_time}`,
        success: function (res) {
          if(cb){
            cb(res);
          }
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "更新失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //获取看单
    getUserInstanceList: function (pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}PictureBook/GetUserInstanceList?uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取看单失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //加入或删除看单
    addUserInstanceList: function (series_id, series_instance_id) {
      wx.request({
        url: `${Config.services}PictureBook/AddUserInstanceList?uid=${Config.uid}&series_id=${series_id}&series_instance_id=${series_instance_id}`,
        method: "POST",
        success: function (res) {
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "操作失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //获取历史记录
    getUserHistory: function (pageIndex, pageSize, cb) {
      wx.request({
        url: `${Config.services}PictureBook/GetUserHistory?uid=${Config.uid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        success: function (res) {
          cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取历史记录失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //删除历史记录
    deleteUserHistory: function (history_ids) {
      wx.request({
        url: `${Config.services}PictureBook/DeleteUserHistory?history_ids=${history_ids}`,
        method: "POST",
        success: function (res) {
          // cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取记录失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    },
    //删除看单
    deleteUserInstanceList: function (series_ids, series_instance_ids){
      wx.request({
        url: `${Config.services}PictureBook/DeleteUserInstanceList?uid=${Config.uid}&series_ids=${series_ids}&series_instance_ids=${series_instance_ids}                                        `,
        method: "POST",
        success: function (res) {
          // cb(res);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "删除失败！",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    }




  }

})
