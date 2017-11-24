// pages/desktop/desktop.js
var template = require("../../utils/template.js");
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
    slideImg: "/images/desktop/slidedown.png",
    mybook: "not_show",
    add_book_way: "not_show",
    isFirstShow: true,
    last_book_id: 0,// 上一次删除的book_id
    muchDevice: false,//有多个设备
  },

  //改变引导页状态
  changeDirector: function () {
    this.setData({ first_login: "not_show" });
  },

  //进入我的自定义
  toMyWord: function () {
    this.setData({ add_book_way: "not_show" });
    wx.navigateTo({
      url: '/pages/search/search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    wx.setStorageSync("ReturnBook", "custom");
  },


  // 跳转到搜索书籍页面
  toSearchlist: function (e) {
    var that = this;
    this.setData({ backFromSearch: true });
    if (!that.data.nodouble) {
      return false;
    }
    that.data.nodouble = false;
    if (e.target.dataset.grade) {
      wx.navigateTo({
        url: '/pages/searchlist/searchlist?grade=' + e.target.dataset.grade
      })
    } else {//搜索全部
      wx.navigateTo({
        url: '/pages/searchlist/searchlist'
      })
    }
    setTimeout(function () { that.data.nodouble = true }, 1000)
  },

  onShow: function () {
    const that = this;
    // this.showMyBook();
    // this.setOnlineUserNum();
    

    if (!that.data.isLoading) {
      this.loadBookList();
    }
    this.hiddenDeleteBtn();
    that.noDel();
    that.loadBookList();
    that.adviserIdFun();
    that.addscene();
    //清空数据
    //加载

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
      title: "年级分类",
      path: '/pages/desktop/desktop?adviser_id=' + adviser_id + '&share=true'
    }
  },
  onLoad: function (options) {
    var that = this;
    var font = app.globalData.font;
    var screenInfo = wx.getSystemInfoSync();
    var screenWidth = screenInfo.windowWidth;
    var itemWidth = ((screenWidth - 20) / 3 - 20) * 1.3
    this.setData({
      font: font,
      imgHeight: itemWidth
    });
    //获取用户信息
    this.getUserInfo(options);
    //加载书籍
    this.loadBookList();

    // this.showMyBook();

    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
      console.log("options.adviser_id", options.adviser_id)
      // app.Writing.bindUserAndAdviser(options.adviser_id);
    }
    console.log("scene",options.scene);
    //options.scene
    if (options && options.scene) {
      wx.setStorageSync('scene', options.scene);
      console.log("options.scene", options.scene)
    }

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
    }
    else {
      //更新数据
      that.setData({ userInfo: app.globalData.userInfo, });

      if (app.globalData.userInfo.first_login) {
        that.setData({
          index_if_show: "index_container",
          first_login: "first_login"
        });
      }
      else {
        that.setData({
          desk_if_show: "container"
        });
      }


      this.loadBookList();
      // this.setOnlineUserNum();

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
        app.Writing.GetUserSpreadAdviser(function (res) {
          console.log("GetUserSpreadAdviser", res)
          wx.setStorageSync('adviser_id', res.data.data.adviser_id);
          console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
        })
      } else {
        app.Writing.bindUserAndAdviser(adviser_id, function () {
          console.log("插入res.data.data.adviser_id成功", adviser_id)
        })
      }
    }
  },
  addscene: function () {
    var that = this;
    if (!app.globalData.userInfo) {
      setTimeout(that.addscene, 100);
    } else {
      if (wx.getStorageSync('scene')) {
        var Storagescene = wx.getStorageSync('scene')
        console.log("Storagescene", Storagescene)
        var scene = decodeURIComponent(Storagescene)
        app.Writing.BindAppDevice(scene,function(){
          that.setData({ muchDevice: true });
        })
      }
    }
  },


  //跳转
  gotoNext: function () {
    // 用户信息为空时，开始听写按钮不能点击
    if (!app.globalData.userInfo) {
      return false;
    }
    this.setData({
      index_if_show: "not_show",
      desk_if_show: "container"
    });
  },

  toBookPage: function (event) {
    //允许跳转时才处理
    console.log("to book",event)
    var that = this;
    if (this.data.add_book_way === "add_book_way") {
      return false;
    }
    if (this.data.toPage) {

      if (this.data.nodouble) {
        var book_id = event.currentTarget.dataset.bookId;
        var book_index = event.currentTarget.dataset.bookIndex;
        var book_name = event.currentTarget.dataset.bookName;
        var book_pic = event.currentTarget.dataset.bookPic;
        var isPay = event.currentTarget.dataset.bookIspay;
        var book = {
          book_name: book_name,
          book_pic: book_pic
        }
        wx.setStorageSync("bookId", book_id);
        wx.setStorageSync("book", book);
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
        wx.navigateTo({ url: `/pages/book/book?book_id=${book_id}` });

      }

    }
    else if (this.data.longTimeOver) {
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
    //长按某本书籍
    // console.log("longTapBook");
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
    app.Writing.deleteBook
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
          app.Writing.getDeskBookList
            (
            function (res) {
              var data = res.data;
              for (let i = 0; i < data.length; i++) {
                data[i].book_pic = data[i].book_pic.split(".jpg")[0] + "_b.jpg";
              }
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
  },
  //解除绑定
  toUnbind: function (e) {
    var that = this;
    var id = e.target.id;
    app.Writing.GetAppDeviceIdByUid(function (res) {
      if (res.success) {
        var deviceId = res.data.app_device_id;
        if (id == "unBind") {
          //解绑
          app.Writing.DeleteBindingDevice(deviceId, function () {
            //
            that.setData({ muchDevice: false })
          })
        } else if (id == "quxiao") {
          //取消
          that.setData({ muchDevice: false })
        }
      }
    })
  },
  //调到查询页面 
  toSearchWord: function() {
    var adviser_id = wx.getStorageSync('adviser_id');

    wx.navigateTo({
      url: `/pages/search/search?adviser_id=${adviser_id}&charArray=情&isShare=share`,
    })
  },
  formSubmit: function (event) {
    var that = this;
    if (this.data.toPage) {
      console.log("22跳转")
      console.log(event)
      var formData = {};//{"form_id":"0","expire_time":"2017-09-14 18:24:55.000"}
      var form_id = event.detail.formId;
      formData.form_id = form_id;
      var myDate = new Date();
      myDate.setDate(myDate.getDate() + 7);//设置7天后过期
      var cur_year = myDate.getFullYear();//获取年
      var cur_month = myDate.getMonth() + 1;//获取月
      var cur_day = myDate.getDate();//获取日
      var cur_hour = myDate.getHours();//获取小时
      var cur_min = myDate.getMinutes();//获取分钟
      var cur_sec = myDate.getSeconds();//获取秒
      var time = cur_year + '-' + template.toDouble(cur_month) + '-' + template.toDouble(cur_day) + ' ' + template.toDouble(cur_hour) + ':' + template.toDouble(cur_min) + ":" + template.toDouble(cur_sec);
      //expire_time
      formData.expire_time = time;
      app.globalData.formids.push(formData);
    }

  },


})