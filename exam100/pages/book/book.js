// pages/book/book.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    books_count: 0,
    isShowDelete: false,
    current: 0,
    double: false,//防止触发双击
    unAuthorization: false,
    firstLoadding: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },
  gotoBookshelf: function () {
    wx.navigateTo({
      url: '/pages/book/bookshelf/bookshelf',
    })
  },

  gotoItem: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id
    var title = event.currentTarget.dataset.title
    if (that.data.double) {
      console.log("这是双击")
      return
    }
    that.data.double = true;
    if (that.data.isShowDelete) {
      that.setData({ isShowDelete: false, double: false });
    } else {
      wx.navigateTo({
        url:`/pages/dayhot/dayhot?id=${id}&bookname=${title}`,
      })
    }
  },

  showDeletBook: function (event) {
    var that = this;
    that.setData({ isShowDelete: !that.data.isShowDelete });
  },

  deleteBook: function (event) {
    console.log("deleteBook", event)
    var that = this;
    var id = event.currentTarget.dataset.id;
    var idx = event.currentTarget.dataset.index;
    var lastIdx = idx - 1;
    if (that.data.double) {
      console.log("这是双击")
      return
    }
    that.data.double = true;
    app.exam.delCourse(
      id,
      function (res) {
        console.log(res)
        that.setData({ isShowDelete: false });
        app.exam.getUserCourse(
          function (res) {
            console.log(res);
            that.setData({ books: res.data, });
            if (that.data.books.length < 6) {
              if (idx == 0) {
                that.setData({ current: 0 })
              } else if (idx == that.data.books.length) {
                that.setData({ current: lastIdx })
              }
              else {
                that.setData({ current: idx })
              }
            }
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({ double: false })
          }
        );
      }
    );
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  bindchange: function (event) {
    var that = this;
    let cur = event.detail.current;
    console.log(cur);
    that.setData({ current: cur })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (app.globalData.uid) {
      app.exam.getUserCourse(
        function (res) {
          console.log("有uid");
          console.log(res.data)
          that.setData({ books: res.data, double: false });
        }
      );
    } else {
      app.uidCallback = () => {
        app.exam.getUserCourse(
          function (res) {
            console.log("没有uid");
            that.setData({ books: res.data, double: false });
          }
        );
      }
    }
    //加授权
    app.unshouquan=function(){
    	console.log("拒绝授权")
      that.setData({ unAuthorization:true})
    }
    app.shouquanOk = function () {
    	console.log("授权")
      that.setData({ unAuthorization: false })
    }
    wx.getSetting({
      success(res) {
        console.log("getSetting", res)
        if (!res.authSetting['scope.userInfo']) {//没有授权
        	console.log("没有授权啊啊啊")
        	wx.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: '#ffffff',
					})
          that.setData({ unAuthorization:true})
        } else {
          console.log("授权成功")
          that.setData({ unAuthorization: false })
        }
      }
    })
  },
  userInfoHandler: function (res) {
    console.log("res", res)
    let that = this
    if (res.detail.errMsg == "getUserInfo:ok") {
      // console.log("that.data.toPath", that.data.toPath)
      app.userLogin()
    } 
  },

  //添加更多
  toAllclass: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/allclass/allclass`,
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
    var that = this;
    var title ='';
    var pageImg='';
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg,path);
  },
  change: function (event) {
    let that = this;
    let c = event.detail.current;
    let idx = event.detail.index;
    console.log(c);
    that.setData({
      current: c
    })
  },
  outbind: function () {
    var that = this;
    console.log("outbind")
    that.setData({ isShowDelete: false });
  }
})