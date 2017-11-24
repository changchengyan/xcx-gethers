// pages/user/item/item.js
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
    type: "",
    title: "",
    id: 0,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    });
    var that = this;
    if (app.globalData.weixinUserInfo) {
      that.setData({ type: options.type, id: options.id, title: options.title });
      that.loadItemInfo();
      //将当前书籍添加到用户
      app.speechEvalution.addBookFollow(
        that.data.id,
        function (res) {
          //console.log(res);      
        }
      );
      //end    
    } else {
      app.uidCallback = function () {
        that.setData({ type: options.type, id: options.id, title: options.title });
        that.loadItemInfo();
        //将当前书籍添加到用户
        app.speechEvalution.addBookFollow(
          that.data.id,
          function (res) {
            //console.log(res);      
          }
        );
        //end    
      }
    }


  },
  gotoDetail: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    console.log(event.currentTarget.dataset.index);
    that.setData({ index: event.currentTarget.dataset.index });
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id + "&sentence_type=" + that.data.type
    })
  },
  loadItemInfo: function () {
    var that = this;
    if (!that.data.loadingState && that.data.loadMore) {
      that.setData({ loadingState: true });
      if (that.data.type == 'book') {
        app.speechEvalution.getBookSentences(
          that.data.id,
          that.data.pageIndex,
          that.data.pageSize,
          function (res) {
            //console.log(res);
            that.setData({ info: that.data.info.concat(res.data.data) });
            if (that.data.pageIndex == res.data.pageTotal) {
              that.setData({ loadMore: false });
            }
            that.setData({ loadingState: false, pageIndex: that.data.pageIndex + 1 });
          }
        );
      }
      else if (that.data.type == 'evaluation') {
        app.speechEvalution.getSentenceEvaluationed(
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
  onShow: function (options) {
    var that = this;
    // that.data.info = [];
    // that.data.pageIndex = 1;
    // that.data.pageSize = 10;
    // that.data.loadingState = false;
    // that.data.loadMore = true;
    // that.loadItemInfo();
    // //将当前书籍添加到用户
    // app.speechEvalution.addBookFollow(
    //   that.data.id,
    //   function (res) {
    //     //console.log(res);      
    //   }
    // );
    // //end     
    if (app.globalData.weixinUserInfo) {
      if (that.data.info && that.data.info[that.data.index]) {
        app.speechEvalution.reloadSentenceById(
          that.data.info[that.data.index].id,
          function (res) {
            that.data.info[that.data.index].evaluation_count = res.data.data.current.evaluation_count;
            that.data.info[that.data.index].score = res.data.data.current.score;
            that.setData({ info: that.data.info });
          }
        );
      }
    } else {
      app.uidCallback2 = function () {
        if (that.data.info && that.data.info[that.data.index]) {
          app.speechEvalution.reloadSentenceById(
            that.data.info[that.data.index].id,
            function (res) {
              that.data.info[that.data.index].evaluation_count = res.data.data.current.evaluation_count;
              that.data.info[that.data.index].score = res.data.data.current.score;
              that.setData({ info: that.data.info });
            }
          );
        }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var title = "";
    var path = "/pages/user/item/item?type=" + that.data.type + "&id=" + that.data.id + "&title=" + that.data.title;
    var imageUrl = "";
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl,"小程序口语测评分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  }
})