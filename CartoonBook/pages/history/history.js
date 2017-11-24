// pages/history/history.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: "check",
    check: [],
    selectIndex: [],
    editing: false,
    userHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
      that.loadList();
    }else{
      app.userLogin(function(){
        that.loadList();
      })
    }
    
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
    return {
      title: '历史记录',
      path: 'pages/history/history'
    }
  },
  //点击编辑
  edit: function () {
    var that = this;
    if (this.data.edit == "check") {
      this.setData({
        edit: "checked",
        editing: true
      });
    }
    else {
      for (var i = 0; i < that.data.check.length; i++) {
        that.data.check[i] = "check";
      }
      this.setData({
        edit: "check",
        editing: false
      });
      setTimeout(function () {
        that.setData({
          check: that.data.check,
          selectIndex: []
        })
      }, 500)
    }
  },
  //全选
  selectAll: function () {
    var that = this;
    var check = this.data.check;
    for (var i = 0; i < that.data.check.length; i++) {
      that.data.check[i] = "checked";
      that.data.selectIndex[i] = i;
    }
    this.setData({
      check: that.data.check
    })
  },
  //选择单个
  select: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var check = this.data.check;
    if (check[index] == "check") {
      check[index] = "checked";
      this.data.selectIndex.push(index);
    } else {
      check[index] = "check";
      this.remove(that.data.selectIndex, index);
    }
    this.setData({
      check: check,
      selectIndex: that.data.selectIndex
    })
  },
  //到视频页
  toVideoPage: function (e) {
    var id = e.currentTarget.dataset.id;
    var seriesId = e.currentTarget.dataset.seriesid;
    var vid = e.currentTarget.dataset.vid;
    wx.navigateTo({
      url: `/pages/video/video?id=${id}&seriesId=${seriesId}&vid=${vid}`,
    })
  },
  //加载历史数据
  loadList: function () {
    var that = this;
    var myDate = new Date();
    var month = String(myDate.getMonth() + 1);
    var date = String(myDate.getDate());
    if (date.length < 2) {
      date = "0" + date;
    }
    var today = [month, date];
    app.pictureBook.getUserHistory(1, 99999, function (res) {
      for (let i = 0; i < res.data.length; i++) {
        var date = res.data[i].overtime.split(" ")[0].split("-");
        var newdate = [date[1], date[2]];
        if (today.join("") === newdate.join("")) {
          res.data[i].overtime = "今天"
        }
        else if ((Number(today[1]) - Number(newdate[1])) == 1) {
          res.data[i].overtime = "昨天"
        }
        else {
          res.data[i].overtime = newdate[0] + "月" + newdate[1] + "日"
        }
        //处理观看时间
        var lastTime = res.data[i].seen_time;
        res.data[i].seen_time = Math.floor(lastTime / 60) + "分" + lastTime % 60 + "秒";
        that.data.check[i] = "check";
      }
      that.setData({
        userHistory: res.data,
        check: that.data.check
      })
    })
  },
  //删除历史记录
  deleteHistory: function(){
    var that = this;
    var delstr = [];
    var count = that.data.selectIndex.length;
    for (var i = 0; i < count; i ++) {
      delstr.push(that.data.userHistory[that.data.selectIndex[i]].history_id);
      that.data.userHistory.splice(that.data.selectIndex[i],1);
      i = i - 1;
      count = count - 1; 
    }
    var delstr = delstr.join(",");
    app.pictureBook.deleteUserHistory(delstr);
    for (var i = 0; i < that.data.check.length; i++) {
      that.data.check[i] = "check";
    }
    this.setData({
      edit: "check",
      editing: false,
      check: that.data.check,
    });
    that.setData({
      selectIndex: [],
      userHistory: that.data.userHistory
    })
  },
  //去掉数组某个值
  remove: function (arr, str) {
    var index = null;
    for(var i = 0; i < arr.length; i ++) {
      if(arr[i] == str) {
        index = i;
        break;
      }else{
        index = -1;
      }
    }
    if(index > -1) {
      arr.splice(index, 1);
    }
  }
})