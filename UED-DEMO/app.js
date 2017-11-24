//app.js
App({
  globalData: {
    userInfo: null,
    LOADDING_ICON: "/pages/images/loading.gif",
    LOADDING_TEXT: "正在加载",
    NODATA_ICON: "/pages/images/nodata.png",
    NODATA_TEXT: "没有加载到任何信息，\n请等待编辑添加...",
    aplicationSelectType:"全部应用"
  },
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var that = this;
    wx.getStorage
      (
      {
        key: 'weixinUserInfo',
        success: function (res) {
          that.globalData.weixinUserInfo = res.data;
          Config.uid = res.data.uid;
        },
        fail: function () {
          that.getUserInfo();
        }
      }
      )
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // userLogin: function (cb) {
  //   var that = this;
  //   //用户登录
  //   wx.login
  //     (
  //     {
  //       success: function (res) {
  //         if (res.code) {
  //           wx.getUserInfo({
  //             withCredentials: true,
  //             success: function (userinfo_res) {
  //               wx.request(
  //                 {
  //                   url: Config.services + '?method=CodeBookBO.onLogin',
  //                   method: "POST",
  //                   header: { 'content-type': 'application/x-www-form-urlencoded' },
  //                   data: { code: res.code, encryptedData: userinfo_res.encryptedData, iv: userinfo_res.iv },
  //                   success: function (res) {
  //                     //保存到全局
  //                     that.globalData.userInfo = userinfo_res.userInfo;
  //                     //保存到全局的UID
  //                     Config.uid = res.data.uid;
  //                     //更新微信用户资料到码书
  //                     that.updateWeixinUserInfo(userinfo_res.userInfo, res.data.uid);
  //                     if (cb) {
  //                       cb(userinfo_res);
  //                     }
  //                   }
  //                 }
  //               )
  //             }
  //           })
  //         }
  //         else {
  //           console.log('获取用户登录态失败！' + res.errMsg)
  //         }
  //       }
  //     });
  // },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  formatTime: function (time) {
    if (time) {
      var f = time;
      var arr = time.split(":");
      if (arr.length == 3) {
        if (arr[0] == "00") {
          f = arr[1] + ":" + arr[2]
        }
      }
      return f;
    }
    else {
      return "00:00";
    }

  }
})
