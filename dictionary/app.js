var Config =
  {
    services: "https://rayscloud.chubanyun.net/api/Dictionary/",
    // services: "http://deveapi.chubanyun.net/api/Dictionary/",
    uid: 0
  };
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  Dictionary: {
    //根据笔画数获取汉字部首列表
    getBushouByBihua: function (bihua, callback) {
      wx.request({
        url: Config.services + 'Word/GetBushouByBihua?bihua=' + bihua,
        success: function (res) {
          callback(res.data);
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    //根据字母获取汉字拼音列表
    getPinyinByLetter: function (letter, callback) {
      wx.request({
        url: Config.services + 'Word/GetPinyinByLetter?letter=' + letter,
        success: function (res) {
          if (res.data.success) {
            callback(res.data);

          }
          else {
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
        fail: function (error) {
          console.log(error)
        }
      })
    },
    //根据汉字获取详情信息
    getInfoByWord: function (word, callback) {
      wx.request({
        url: Config.services + 'Word/GetInfoByWord?word=' + word,
        success: function (res) {
          callback(res.data);
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    //根据汉字的拼音，查询相关的汉字信息
    getWordByPinyin: function (pinyin, callback) {
      wx.request({
        url: Config.services + 'Word/GetWordByPinyin?pinyin=' + pinyin + '&pageIndex=' + 1 + '&pageSize=' + 500,
        success: function (res) {
          callback(res.data);
          console.log(res.data)
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    //根据汉字部首，查询符合条件的汉字详细信息
    getWordByBushou: function (bushou, callback) {
      wx.request({
        url: Config.services + 'Word/GetWordByBushou?bushou=' + bushou + '&pageIndex=' + 1 + '&pageSize=' + 1000,
        success: function (res) {
          callback(res.data);
          console.log(res.data);
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    // 语音查询
    getWordByVoice(voice,cb) {
      wx.uploadFile({
        url: `${Config.services}Word/GetPinyinByMp3`,
        filePath: voice,
        name: 'char',
        success(res) {
          cb(res.data);
        },
        fail(res){
          cb(res.data);
        }
      });
    }
  },
  globalData: {
    userInfo: null
  },

})