// pages/desktop/desktop.js
var app = getApp();
Page({
  data:
  {
    book:
    {
      total_count: 1,
      count: 0,
      list: []
    },
    readbook:
    {
      count: -1,
      list: []
    },
    loadding: false,
    loadLastId: 0,
    loadMore: true,
    loadMoreCount: 12,
    toPage: true,
    longTimeOver: false,
    showDeleteBtn: false,
    ifShowBtn: false,
    imgHeight: 0,
    ifTrueDel: false,
    bookId: "",
    bookIndex: "",
    nodouble: true,
    backFromSearch: false,
    //修改样式用的data
    isLoading: false,
    font: app.globalData.font,
    userInfo: {},
    now_personNum: 129381,
    index_if_show: "not_show",
    desk_if_show: "not_show",
    first_login: "not_show",
    // selfBookData: "selfbook_up",
    slideImg: "/images/desktop/slidedown.png",
    mybook: "not_show",
    add_book_way: "not_show",
    isFirstShow: true,
    last_book_id: 0// 上一次删除的book_id
  },

  //改变引导页状态
  changeDirector: function () {
    this.setData({ first_login: "not_show" });
  },
  //进入自定义界面
  selfBook: function () {
    this.setData({ add_book_way: "not_show" });
    wx.navigateTo({
      url: '/pages/unit/unit?navigation_type=custom'
    })
  },
  //进入我的自定义
  toMyWord: function () {
    this.setData({ add_book_way: "not_show" });
    wx.navigateTo({
      url: '/pages/word/word',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    wx.setStorageSync("ReturnBook", "custom");
  },
  //获取在线人数
  setOnlineUserNum: function () {
    var that = this;
    app.Dictation.getOnlineUserNum(
      function (res) {
        that.setData({ now_personNum: res });
        wx.stopPullDownRefresh();
      }
    )
  },

  //选择添加书籍的方式
  showTheWay: function () {
    if (this.data.add_book_way === "not_show") {
      this.setData({ add_book_way: "add_book_way" });
    }
    else {
      this.setData({ add_book_way: "not_show" });
    }
  },
  // 跳转到搜索书籍页面
  toSearchlist: function () {
    this.setData({ backFromSearch: true });
    this.setData({ add_book_way: "not_show" });
    wx.navigateTo({
      url: '/pages/searchlist/searchlist',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onShow: function () {
    const that = this;
     
    var font = app.globalData.font;
    that.setData({font: font});
    if (!that.data.isFirstShow&&that.data.backFromSearch) {
	    	that.setData({ backFromSearch: false });
	      that.refreshPage();
    }
    that.hiddenDeleteBtn();
    that.noDel();
    that.setOnlineUserNum();
    that.adviserIdFun();
    that.addscene();
    //判断网络
    wx.getNetworkType
      ({
        success: function (res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType == "none") {
            wx.showToast({
              title: '网络异常',
              duration: 2000
            });

          }
        }
      });

  },

  onHide: function () {
    this.setData({ isFirstShow: false })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var adviser_id = wx.getStorageSync('adviser_id')
    return {
      title: "听写100",
      path: '/pages/desktop/desktop?adviser_id=' + adviser_id+'&preUid='+that.data.userInfo.weixinUser.uid + '&share=true'
    }
  },
  onLoad: function (options) {
    var that = this;
    //获取用户信息
    that.getUserInfo(options);
    if (options && options.adviser_id) {//通过链接过来的
      wx.setStorageSync('adviser_id', options.adviser_id);
      console.log("options.adviser_id", options.adviser_id)
    }
    
    if (options && options.scene) {//options.scene 
      wx.setStorageSync('scene', options.scene);
      console.log("options.scene", options.scene)
    }   
    if (options && options.share) {//分享过来的
    	var preUid=options.preUid;
    	app.Dictation.AddUserKeyByShared(preUid,function(){})    	
    }

  },
  refreshPage: function () {
    this.data.book.total_count=1;
    this.data.book.count=0;
    this.data.book.list=[];
    this.data.loadding=false;
    this.data.loadLastId=0;
    this.data.loadMore=true;
    this.data.backFromSearch=true;
    
    //加载
    this.loadBookList();
  },
  onPullDownRefresh: function () {
    var that = this;
    if (this.data.index_if_show == 'index_container') {
      //引导页下拉刷新
      // that.setOnlineUserNum(); 		 		
    } else {
      //正文页下拉刷新
      //清空数据
      var book = { total_count: 1, count: 0, list: [] };
      this.setData({
        book: book,
        loadding: false,
        loadLastId: 0,
        loadMore: true,
      });
      //加载
      this.loadBookList();
    }

  },

  //获取userInfo
  getUserInfo: function (options) {
    let that = this;
    if (!app.globalData.userInfo) {
     setTimeout(that.getUserInfo, 100);
    }else {
      //更新数据
      that.setData({ userInfo: app.globalData.userInfo});     
      if (app.globalData.userInfo.first_login) {
        that.setData({
          index_if_show: "index_container",
          first_login: "first_login"
        });
      }else {
        that.setData({
          desk_if_show: "container"
        });
      }
      that.loadBookList();
    }
  },

  //adviserIdfunction
  adviserIdFun: function () {
    var that = this;
    if (!app.globalData.userInfo) {
      setTimeout(that.adviserIdFun, 100);
    } else {
      var adviser_id = wx.getStorageSync('adviser_id');
      console.log("缓存中adviser_id", adviser_id);

      if (!adviser_id ||  adviser_id == "0") {
        app.Dictation.GetUserSpreadAdviser(function (res) {
          console.log("GetUserSpreadAdviser", res)
          wx.setStorageSync('adviser_id', res.data.data.adviser_id);
          console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
        })
      } else {
        app.Dictation.InsertUserSpreadAdviser(adviser_id, function () {
          console.log("插入res.data.data.adviser_id成功", adviser_id)
        })
      }
    }

  },
  addscene:function(){
    var that = this;
    if (!app.globalData.userInfo) {
      setTimeout(that.addscene, 100);
    } else {
      if (wx.getStorageSync('scene')) {
        var Storagescene = wx.getStorageSync('scene')
        console.log("Storagescene", Storagescene)
        var scene = decodeURIComponent(Storagescene)
        app.Dictation.BindAppDevice(scene)
      }
    }
  },

  toBookPage: function (event) {
    //允许跳转时才处理
    if (this.data.add_book_way === "add_book_way") {
      return false;
    }
    if (this.data.toPage) {
      if (this.data.nodouble) {
        var book_id = event.currentTarget.dataset.bookId;
        var book_index = event.currentTarget.dataset.bookIndex;
        const IMG=event.currentTarget.dataset.bookimg;
        console.log(IMG);
        var that = this;
        wx.setStorageSync("bookId", book_id);
        wx.setStorageSync("ReturnBook", "deskBook")
        var app = function () {
          //数组元素移动，把当前点击的书籍排在第一位
          var new_book = that.data.book;
          var list = new_book.list;
          that.swapArray(list, book_index);

          that.setData({ book: new_book });
        }
        setTimeout(app, 500);

        //console.log("index="+book_index);
        that.data.nodouble = false;
        //禁止1s中内连续打开书籍
        setTimeout(function () { that.data.nodouble = true }, 1000)
        wx.navigateTo({ url: '/pages/book/book?book_id=' + book_id + "&book_img=" + IMG });

      }

    }else if (this.data.longTimeOver) {
      //一般为展示删除按钮后，再点击书籍，则需要隐藏删除按钮，并设置为可以跳转到书籍页的状态
      this.longTapReset();
    }


  },
  longTapReset: function () {
    this.data.toPage = true;
    this.setData({ showDeleteBtn: false });
  },
  longTapBook: function (event) {
    var that = this;
    that.setData({
      longTimeOver: false,
      showDeleteBtn: true
    })
    this.data.toPage = false;

    setTimeout(function () { that.setData({ longTimeOver: true, ifShowBtn: true }) }, 1000);
  },
  hiddenDeleteBtn: function (event) {
    var that = this;
    if (that.data.ifShowBtn) {
      that.setData({ showDeleteBtn: false, ifShowBtn: false, toPage: true });
    }
    if (this.data.add_book_way === "add_book_way") {
      this.setData({ add_book_way: "not_show" });
    }
  },

  deleteBook: function (event) {
    //点击按钮删除图书
    var book_id = event.currentTarget.dataset.bookId;
    if (book_id == this.data.last_book_id) { return }
    this.setData({ last_book_id: book_id })
    console.log(book_id);
    var book_index = event.currentTarget.dataset.bookIndex;
    ;
    this.setData({ ifTrueDel: true, bookId: book_id, bookIndex: book_index });
    this.sureDel();
  },
  noDel: function () {
    this.setData({ ifTrueDel: false });
  },
  sureDel: function () {
    var book_id = this.data.bookId;
    var book_index = this.data.bookIndex;
    var that = this;
    app.Dictation.deleteBook
      (
      book_id,
      function (res) {
        if (res.data.success) {
          var bookdata = that.data.book;
          bookdata.count--;
          bookdata.total_count--;
          bookdata.list.splice(book_index, 1);
          that.setData({ book: bookdata });

          var loadLastId = that.data.loadLastId - 1;
          that.setData({ loadLastId: loadLastId });

          //删除到已经没有书籍时
          console.log(bookdata.total_count)
          if (bookdata.total_count == 0) {
            that.longTapReset();
          }
          /*
          wx.showToast
            (
            {
              title: "删除操作成功！",
              icon: 'success',
              duration: 2000
            }
            )
            */

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
          that.loadBookList();
        }

      }
      );
    this.setData({ ifTrueDel: false });
  },
  loadBookList: function () {
    //首次加载
    //下来全部刷新
    var that = this;
    //有必要加载更多，且没在请求加载中
    if (!app.globalData.userInfo) {
      setTimeout(that.loadBookList, 100);
    }
    else {
      if (that.data.loadMore && !that.data.loadding) {
        if (app.globalData.userInfo.weixinUser.uid > 0) {
          that.setData({ loadding: true });
          app.Dictation.getDeskBookList
            (
            function (res) {
              var data = res.data;
              var total_count = res.data.length * 1;
              that.setData({
                book: {
                  total_count: total_count,
                  count: 0,
                  list: data
                },
                loadding: false,
                isLoading: true
              })
              wx.stopPullDownRefresh();
            },
          );

        }
      }
    }

  },
  swapArray: function (arr, index1) {
    if (index1 > 0) {

      var item = arr[index1];
      arr.splice(index1, 1);
      arr.splice(0, 0, item);
    }
  },
  //禁止确认删除书籍时其他的点击动作
  stopTouch: function () {
    return false;
  }
})