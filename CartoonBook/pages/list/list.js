// pages/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: "check",
    editing: false,
    check: [],
    selectIndex: [],
    instanceList: []
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
      that.load();
    }else{
      app.userLogin(function(){
        that.load();
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
    return{
      title: '我的看单',
      path: 'pages/list/list'
    }
  },
  //加载数据
  load: function () {
    var that = this;
    app.pictureBook.getUserInstanceList(1, 999999, function (res) {
      var instanceList = [];
      for (let i = 0; i < res.data.length; i++) {
        for (let j = 0; j < res.data[i].instances.length; j++) {
          instanceList.push(res.data[i].instances[j]);
          that.data.check.push("check");
        }
      }
      that.setData({
        instanceList: instanceList,
        check: that.data.check
      })
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
  //去掉数组某个值
  remove: function (arr, str) {
    var index = null;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == str) {
        index = i;
        break;
      } else {
        index = -1;
      }
    }
    if (index > -1) {
      arr.splice(index, 1);
    }
  },
  //删除看单
  deleteInstance: function () {
    var that = this;
    var series_ids = [];
    var instance_ids = [];
    var count = that.data.selectIndex.length;
    for (var i = 0; i < count; i++) {
      console.log(that.data.instanceList[that.data.selectIndex[i]])
      series_ids.push(that.data.instanceList[that.data.selectIndex[i]].instance.series_id);
      instance_ids.push(that.data.instanceList[that.data.selectIndex[i]].instance.id);
      that.data.instanceList.splice(that.data.selectIndex[i], 1);
      i = i - 1;
      count = count - 1;
    }
    series_ids = series_ids.join(",");
    instance_ids = instance_ids.join(",");
    console.log(series_ids, instance_ids)
    app.pictureBook.deleteUserInstanceList(series_ids, instance_ids);
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
      instanceList: that.data.instanceList
    })
  },



})