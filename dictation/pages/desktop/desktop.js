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
    //修改样式用的data
    font: app.globalData.font,
    userInfo: {},
    now_personNum: 103,
    index_if_show: "not_show",
    desk_if_show: "not_show",
    first_login: "first_login_none",
    selfBookData: "selfbook_up",
    slideImg: "/images/desktop/slidedown.png",
    mybook: "not_show"
  },

  //改变引导页状态
  changeDirector: function () {
    this.setData({ first_login: "first_login_none" });
  },
  //进入自定义界面
  selfBook: function () {
    wx.navigateTo({
      url: '/pages/unit/unit?navigation_type=custom',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
 //进入我的自定义
  toMyWord:function(){
    wx.navigateTo({
      url: '/pages/word/word',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    wx.setStorageSync("ReturnBook", "custom");
  },
  //判断是否显示自定义的书籍
  showMyBook: function () {
    var that = this;
    if(!app.globalData.userInfo){
      setTimeout(that.showMyBook,100);
    }
    else{
      app.Dictation.getCustomList(1, 10, function (res) {
        console.log(res.data);
        console.log(res.data.length);
        if (res.data.length > 0) {
          that.setData({ mybook: "mybook" });
        }
      });
    }
  },
  //收起或者展开自定义菜单
  slideDownUp: function () {
    let that = this;
    if (that.data.selfBookData == "selfbook_up"){
      that.setData({
        selfBookData: "selfbook_down",
        slideImg: "/images/desktop/slideup.png"
      });
    }
    else if (that.data.selfBookData == "selfbook_down"){
      that.setData({ 
        selfBookData: "selfbook_up",
        slideImg: "/images/desktop/slidedown.png"
       });
    }
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

  //扫码添加书籍
  bindStartScan: function (event) {
    var that = this;
    wx.scanCode
      ({
        success: (res) => {
          app.Dictation.addBookByISBN
            (
            res.result,
            function (resbook) {
              if (resbook.data.success) {
                console.log(resbook.data.data);
                //把返回的数据插入到数组，放在第一个
                var resdata = resbook.data;
                var bookdata = that.data.book;
                var booklist = bookdata.list;
                var push = true;
                for (var i = 0; i < bookdata.list.length; i++) {
                  if (bookdata.list[i].id * 1 == resdata.data.id * 1) {
                    push = false;
                    that.swapArray(booklist, i);
                    that.setData({ book: bookdata });

                    break
                  }

                }

                if (push) {
                  var node =
                    [
                      {
                        book_name: resdata.data.book_name,
                        book_pic: resdata.data.book_pic,
                        id: resdata.data.id
                      }
                    ];

                  var loadLastId = that.data.loadLastId + 1;
                  bookdata.count++;
                  bookdata.total_count++;
                  bookdata.list = node.concat(booklist);

                  that.setData({ 
                    book: bookdata,
                    loadMore: true,
                    loadLastId: loadLastId
                   });
                }


                //that.loadBookList();
                wx.navigateTo({ url: '../book/book?book_id=' + resdata.data.id });
              } 
              // 数据库中没有该书记提示用户自定义听写
              else {
                wx.navigateTo({ url: '../nobook/nobook' });
              }

            }
            );
        }
      });
  },
  onShow: function () {
    this.showMyBook();
    this.setOnlineUserNum();
    var font = app.globalData.font;
    var screenInfo = wx.getSystemInfoSync();
    var screenWidth = screenInfo.windowWidth;
    var itemWidth = ((screenWidth - 20) / 3 - 20) * 1.3
    this.setData({ 
      font: font,
      imgHeight: itemWidth
     });
    this.hiddenDeleteBtn()
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
  onLoad: function () {
    var that = this;
    //获取用户信息
    this.getUserInfo();
    //加载书籍
    this.loadBookList();
    // this.showMyBook();
  },

  onPullDownRefresh: function () {
  	var that=this;
    if(this.data.index_if_show=='index_container'){
  		//引导页下拉刷新
      that.setOnlineUserNum(); 		 		
  	}else{
  		//正文页下拉刷新
  		//清空数据
	    var book = { total_count: 1, count: 0, list: [] };
	    this.setData({ 
	      book: book,
	      loadding: false,
	      loadLastId: 0,
	      loadMore: true
	     });
	    //加载
	    this.loadBookList();
  	}

  },

  //获取userInfo
  getUserInfo: function () {
    let that = this;
    if (!app.globalData.userInfo) {
      setTimeout(that.getUserInfo, 100);          
    }
    else {
      //更新数据
      that.setData({userInfo: app.globalData.userInfo,});
      if (app.globalData.userInfo.first_login){
        that.setData({
          index_if_show: "index_container",
          first_login: "first_login"
          });
      }
      else{
        that.setData({
          desk_if_show: "container"
        });
      }
    }
  },
  //跳转
  gotoNext:function () {
    // 用户信息为空时，开始听写按钮不能点击
    if(!app.globalData.userInfo){
      return false;
    }
    this.setData({ 
      index_if_show: "not_show",
      desk_if_show: "container"
      });
},

  toBookPage: function (event) {
    //允许跳转时才处理
    let bookName=event.currentTarget.dataset.bookName;
    console.log(bookName);
    if (this.data.toPage) {

      if (this.data.nodouble) {
        var book_id = event.currentTarget.dataset.bookId;
        var book_index = event.currentTarget.dataset.bookIndex;
        var that = this;
        wx.setStorageSync("bookId",book_id);
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
        wx.navigateTo({ url: `/pages/book/book?book_id=${book_id}&book_name=${bookName}`});

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
  },

  deleteBook: function (event) {
    //点击按钮删除图书
    var book_id = event.currentTarget.dataset.bookId;
    console.log(book_id);
    var book_index = event.currentTarget.dataset.bookIndex;
    this.setData({ ifTrueDel: true, bookId: book_id, bookIndex: book_index });
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

          wx.showToast
            (
            {
              title: "删除操作成功！",
              icon: 'success',
              duration: 2000
            }
            )

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

        }

      }
      );
    this.setData({ ifTrueDel: false });
  },
  loadBookList: function () {
    //首次加载
    //上拉加载更多
    //下来全部刷新
    var that = this;
   
    //有必要加载更多，且没在请求加载中
    if (!app.globalData.userInfo) {
      setTimeout(that.loadBookList, 100);
    }
    else{
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
                loadding: false
              })
              wx.stopPullDownRefresh();

              // if (list.length > 0) {

              //   var loadLastId = data.list[data.list.length - 1].rownumber;

              //   //追加数据
              //   data.count = data.count * 1 + that.data.book.count * 1;
              //   data.list = that.data.book.list.concat(data.list);
              //   //填充数据

              //   for (var i = 0; i < list.length; i++) {

              //     // if (list[i].book_pic == "") {
              //     //   list[i].book_pic = "../images/no_image.png"
              //     // }
              //   }

              //   that.setData({ book: data });
              //   that.setData({ loadding: false });
              //   that.setData({ loadLastId: loadLastId });
              // }
              //console.log("list.length="+list.length+",that.data.loadMoreCount="+that.data.loadMoreCount)
              //如果不够12条，标记不用再加载更多
              // if (list.length != that.data.loadMoreCount) {
              //   that.setData({ loadMore: false });
              // }
              // wx.stopPullDownRefresh();
            },
            // that.data.loadLastId,
            // that.data.loadMoreCount
          );

        }
        // else {
        //   setTimeout(that.loadBookList, 100);
        // }
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
 stopTouch: function() {
   return false;
 }
})