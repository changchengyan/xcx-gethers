// pages/PK/PK_detail/PK_detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question_id:0,
    info:{},
    book_id:0,
    dataArrange:[],
    answers:[],
    isShare:false,
    PK_finsh:"",
    PK_result:false
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let { PK_finsh, PK_result} = that.data;
    console.log("options", options)
    if (options && options.question_id){
      that.setData({ question_id: options.question_id});
    }
    if (options && options.book_id){
      that.setData({book_id:options.book_id})
    }
    if (options && options.isShare){
      that.setData({ isShare: true });
    }
    if (options && options.PK_finsh=="true") {
      that.data.PK_result = options.PK_result
      that.data.PK_finsh = options.PK_finsh
  
      // that.setData({ PK_finsh: options.PK_finsh, PK_result: options.PK_result})
    }else {
      that.data.PK_finsh = 'false'
    }
   
   
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.globalData.weixinUserInfo) {
      that.recordShow()
    } else {
      app.uidCallback = () => {
        that.recordShow()
      }
    }
     
  },
//
  recordShow:function(){
    let that = this;
    let { info, dataArrange, answers} = that.data;
    let orgeniserRight=0;
    let challengerRight=0;
    console.log("question_id", that.data.question_id)
    app.word.GetRecordInfo_PK(that.data.question_id,function(res){
      console.log(res.data);
      info = res.data.info;
      info.organiser_headimgurl = info.organiser_headimgurl ? info.organiser_headimgurl:"/pages/images/unRegister.png";
      info.challenger_headimgurl = info.challenger_headimgurl ? info.challenger_headimgurl : "/pages/images/unRegister.png";
      answers = res.data.answers
      answers.forEach(function(item,index){
        if (item.is_right_orgeniser==1) {
          orgeniserRight = orgeniserRight+1
        }
        if (item.is_right_challenger==1) {
          challengerRight = challengerRight+1
        }
      })
      console.log("orgeniserRight", orgeniserRight)
      info.organiser_correct_rate = (orgeniserRight / answers.length * 100).toFixed(2) ;
      info.challenger_correct_rate = (challengerRight / answers.length * 100).toFixed(2);
      that.setData({ info, answers});
      if (info.organiser_total_score >= info.challenger_total_score){
        that.data.PK_result = true
      }else {
        that.data.PK_result = false
      }
      that.setData({ PK_finsh: that.data.PK_finsh, PK_result: that.data.PK_result })
    })
  },
  changeOther:function(){
    let that = this;
    let delta;
    var pages = getCurrentPages();
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == 'pages/PK/PK') {
        delta = pages.length - i - 1;
        break;
      }
    }
    wx.navigateBack({
      delta: delta
    })
  },
  toDetail:function(){
    let that = this;
    that.setData({ PK_finsh:'false'})
  },
  anginOnce:function(){
    let that = this;
    let book_id = that.data.book_id;
    wx.redirectTo({
      url: `/pages/PK/PK_answer/PK_answer?book_id=${book_id}`,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let path = `/pages/PK/PK_detail/PK_detail?PK_finsh=${that.data.PK_finsh}&PK_result=${that.data.PK_result}&question_id=${that.data.question_id}&book_id=${that.data.book_id}&isShare=true`;
    console.log("path",path)
    return {
      path: path,
    }
  }
})