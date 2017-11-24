// pages/ranking/ranking.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    pageIndex: 1,
    pageSize: 10,
    loadingState: false,
    loadMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    if (app.globalData.weixinUserInfo){
      that.loadItemInfo();
    }else{
      app.uidCallback = function(){
        that.loadItemInfo();
      }
    }
 
  },
  loadItemInfo: function () {
    var that = this;
    if (!that.data.loadingState && that.data.loadMore) {
      that.setData({ loadingState: true });
      app.speechEvalution.getPKListForChallenger(        
        that.data.pageIndex,
        that.data.pageSize,
        function (res) {
          console.log(res);
          that.setData({ info: that.data.info.concat(res.data.data) });
          if (that.data.pageIndex == res.data.pageTotal) {
            that.setData({ loadMore: false });
          }
          that.setData({ loadingState: false, pageIndex: that.data.pageIndex + 1 });
        }
      );      
    }
  },
  gotoPKDetail:function(event){    
    var that = this;
    console.log(event);
    var id = event.currentTarget.dataset.id
    var organiser_uid = event.currentTarget.dataset.organiserUid;
    var challenger_uid = event.currentTarget.dataset.challengerUid;
    wx.navigateTo({
      url: '/pages/ranking/detail/detail?id=' + id + "&organiser_uid=" + organiser_uid + "&challenger_uid="+challenger_uid,
    })
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
    var that = this;
    var title = "";
    var path = "/pages/ranking/ranking";
    var imageUrl = "";
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl,"小程序口语测评分享");
  }
})