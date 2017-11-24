// pages/detail/detail.js
var app = getApp();
Page({
  data: {
    zi: '',
    bushou: '',
    pinyin: '',
    bihua: '',
    wubi: '',
    scrollHeight: [240, 0],
    meanings: [],
    phrase: []
  },
  /* {
          explainHd: "1.",
          explainDetail: "合适的发动机号防爆电机发布会记得付符合国家"
        },
        {
          explainHd: "2.特指中国的",
          explainDetail: "合适的发动机号防爆电机发布会记得付款及时发布等级下降幅度规划局几点回家符合国家"
        },
        {
          explainHd: "3.姓。",
          explainDetail: "合适的发动机号防爆电机发布会记得付款及时"
        }, */
  onLoad: function (options) {
    var that = this
    var inputValue = options.inputValue
    if (options && options.inputValue) {
      app.Dictionary.getInfoByWord(inputValue, function (res) {
        try{
          let long_desc = JSON.parse(res.data.long_desc);
          let mark = 0;
          let count = 0;
          let short_desc = JSON.parse(res.data.short_desc);

          // 将long_desc拆分为释义和组词
          let meanings = [];
          let phrase = [];
          if (long_desc.length > 1) {
            for (let i = 0; i < long_desc.length; i++) {
              if (mark === 1) {
                if (long_desc[count].length === 1) {
                  meanings = meanings.concat(long_desc.slice(count, i - 1));
                }
                else if (long_desc[count].length > 1) {
                  phrase = phrase.concat(long_desc.slice(count, i - 1));
                }
                mark = 0;
                count = i;
              }
              if (!long_desc[i]) {
                mark += 1;
              }
            }
            if (long_desc[count].length === 1) {
              meanings = meanings.concat(long_desc.slice(count, long_desc.length));
            }
            else if (long_desc[count].length > 1) {
              phrase = phrase.concat(long_desc.slice(count, long_desc.length));
            }
          } else {
            console.log(short_desc);
            meanings = meanings.concat(short_desc.slice(0, short_desc.length - 1));
          }
          // 刷新页面数据
          that.setData({
            zi: res.data.zi,
            bihua: res.data.bihua,
            pinyin: res.data.pinyin,
            bushou: res.data.bushou,
            wubi: res.data.wubi,
            meanings: meanings,
            phrase: phrase
          });
        }catch(e){
          wx.showToast({
            title: '查询失败',
          })
          console.log("发生错误",e);
        }
      })
    }
  },

  //展开收起基本释义
  listToggle: function () {
    var scrollHeight = this.data.scrollHeight;
    if (scrollHeight[0] == 0) {
      this.setData({
        scrollHeight: [240, 0]
      })
    } else {
      this.setData({
        scrollHeight: [0, 0],
      })
    }
  },

  //展开收起组词
  wordsToggle: function () {
    var scrollHeight = this.data.scrollHeight;
    if (scrollHeight[1] == 0) {
      this.setData({
        scrollHeight: [0, 240]
      })
    } else {
      this.setData({
        scrollHeight: [0, 0],
      })
    }
  },

  // gotoPlay: function () {
  //   wx.showToast({
  //     title: '播放结束',
  //     icon: 'success',
  //     duration: 1000
  //   })
  // }
  toMiniProgram:function(event){
    let that = this;
    var source = event.currentTarget.dataset.source;
    var toPage ="";
    var appId = "";
    switch(source){
      case "cultrue":
        toPage = "pages/search/search";
        appId = "wx5e45a73fd5be34f5";//汉字叔叔
        break;
      case "bishun":
        toPage = "pages/search/search";
        appId = "wx38be548c581f8c61";//笔顺100 
        break;
    }
    wx.navigateToMiniProgram({
      appId: appId,
      path: `${toPage}?word=${that.data.zi}`,
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    });
  }

})