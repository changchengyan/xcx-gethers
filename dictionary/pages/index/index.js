//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    searchFocus: "搜 索",
    news:[
      {
        newsTitle:'',
        newsBody:'',
        newsTime:''
      }
    ],
    inputValue:""
  },
  //事件处理函数
  onLoad: function () {

  },
  onHide: function () {
    var that = this;
    that.setData({
      inputValue: ""
    })
  },

  searchPinyin: function (e) {
    wx.navigateTo({
      url: '../pinyin/pinyin'
    })
  },

  searchBushou: function (e) {
    wx.navigateTo({
      url: '../bushou/bushou'
    })
  },
  searchYuyin: function (e) {
    wx.navigateTo({
      url: '../yuyin/yuyin'
    })
  },
  bindkeyinput:function(e){
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      inputValue: inputValue
    })
  },
 
  toDetail: function (e) {
    var that = this,
      inputValue = that.data.inputValue;
    let valueCode = inputValue.codePointAt(0); 
    //输入不能为空
    // ...
    if (this.data.searchFocus === "取 消"){
      return false;
    }
    if(inputValue.length !== 1){

      wx.showToast({
        title: '输入单个汉字',
      })
      return false;
    }
    if(valueCode < 19968 || valueCode > 40895){
      wx.showToast({
        title: '仅能输入汉字',
      })
      return false;
    }
    wx.navigateTo({
      url: '../detail/detail?inputValue=' + inputValue
    })
  },

  // 广告页
  toAd() {
    let src = "https://rayscloud.chubanyun.net/temphtml/DICTATIONARY/test.html";
    wx.navigateTo({
      url: `../advertisement/advertisement?src=${src}`,
    })
  }
})
