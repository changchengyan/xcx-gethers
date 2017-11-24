// pages/learn_tools/learn_tools.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    font: "",
    dataList: [],
    lastid: 0,
    loadding: false,
    loadMore: true,
    loadMoreCount: 10,
    nowNum: 0,
    doubleClick: false,
    appId: "wx21293b1ab5fac316",
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData(getApp().globalData);
    that.getContent();
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

  getContent: function () {
    var that = this
    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });

      //获取资源全家桶
      app.followBook.getContent
        (
        that.data.lastid,
        that.data.loadMoreCount,
        function (res) {
          var list = res.data;
          var loadLastId = res.data[res.data.length - 1].rownumber;
          var dataList = that.data.dataList.concat(list);
          var nowNum = that.data.nowNum * 1 + res.data.count * 1;
          that.setData({ dataList: dataList, lastid: loadLastId, nowNum: nowNum, loadding: false });
          //如果不够10条，标记不用再加载更多
          if (list.length != that.data.loadMoreCount || res.data.total_count == res.data.count) {
            that.setData({ loadMore: false });
          }

        }
        );
    }

  },
  goOther: function (e) {
    var that = this;

    that.setData({ doubleClick: true });
    console.log(e);
    let eType = e.currentTarget.dataset.item.id;
    let path = e.currentTarget.dataset.item.to_path;
    let appid = e.currentTarget.dataset.item.to_appid;
    let isTabbar;
    if (path == `pages/desk/desk` || path == `pages/user/user`) {
      isTabbar = true
    } else {
      isTabbar = false
    }

    if (appid == that.data.appId) {
      that.setData({ isLoading: true })
      if (isTabbar || !path) {
        if (!path) {
          path = "pages/desk/desk"
        }
        wx.switchTab({
          url: `/${path}`,
        })
      } else {

        wx.navigateTo({
          url: `/${path}`,
          success: function () {
            that.setData({ doubleClick: false, isLoading: false });
            console.log("打开过")
          },
          fail: function (res) {
            that.setData({ doubleClick: false });
            console.log("打开失败", res)
          }
        })
      }

    } else {
      if (appid) {
        that.setData({ isLoading: true });
        wx.navigateToMiniProgram({
          appId: appid,
          path: path,
          envVersion: 'trial',
          success(res) {
            that.setData({ doubleClick: false, isLoading: false });
            console.log("打开过")
          }
        })
      }


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
    var that = this;
    console.log("触底触底")
    that.getContent()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})