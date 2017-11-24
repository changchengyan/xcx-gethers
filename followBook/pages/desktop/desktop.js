// pages/desktop/desktop.js
var app = getApp();
Page({
  data:
  {
    book:
    {
      total_count: -1,
      count: 0,
      list: []
    },
    loadding: false,
    loadMore: true,
    pageIndex:1,
    loadMoreCount: 12,
    toPage: true,
    longTimeOver: false,
    showDeleteBtn: false,
    ifShowBtn: false,
    font: app.globalData.weixinUserInfo.code_book_font,
    ifTrueDel: false,
    bookId: "",
    bookIndex: "",
    nodouble: true,
    isFirstShow: true,
    currentIndex: 0,
    loadTip: {
      showLoadTip: true,
      text: '正在加载'
    },
    appBanner:[],
  },
  onShow: function () {
    var that = this;
    var font = app.globalData.weixinUserInfo.code_book_font;
    this.setData({ font: font });
    this.hiddenDeleteBtn();
    //清空数据
    console.log(that.data.book_id);
    //重新加载
    if (!that.data.isFirstShow) {
      that.data.book.count = 0;
      that.data.book.list = [];
      that.data.index = 1;
      that.data.loadMore = true;
      that.data.loadTip.showLoadTip=true;
      that.data.loadTip.text="正在加载";
      that.data.pageIndex=1;
      that.setData({loadTip:that.data.loadTip});
      //that.setData({book:that.data.book, loadTip:that.data.loadTip,pageIndex:1})
      that.loadBookList();                        
    }
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
    var that = this;
    that.setData({ isFirstShow: false });
  },
  onLoad: function () {
    var that = this;
    that.setData(getApp().globalData);
    console.log("加载完成")
    if (app.globalData.uid>0){
      that.loadBookList();        
	  }else{
	  	app.userInfoReadyCallback = ()=> {
        that.loadBookList();
     	}
	  }
  },
  onReachBottom: function () {
    if(this.data.loadding){
    	return;
    }else{
    	//加载
	    this.loadBookList();
    }
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "随书听",
      path: '/pages/desktop/desktop?preUid=' + app.globalData.weixinUserInfo.uid + '&share=true'
    }
  },
  toBookPage: function (event) {
    //允许跳转时才处理
    console.log(event)
    if (this.data.toPage) {

      if (this.data.nodouble) {
        var book_id = event.currentTarget.dataset.bookId;
        var book_index = event.currentTarget.dataset.bookIndex;
        let book_isPay = event.currentTarget.dataset.bookIspay;
        var that = this;

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
        wx.navigateTo({ url: '../sound/sound?book_id=' + book_id + "&book_isPay=" + book_isPay});

      }

    }
    else if (this.data.longTimeOver) {
      //一般为展示删除按钮后，再点击书籍，则需要隐藏删除按钮，并设置为可以跳转到书籍页的状态
      this.longTapReset();
    }


  },
  longTapReset: function () {
    if (!this.data.ifTrueDel) {
      this.data.toPage = true;
      this.setData({ showDeleteBtn: false });
    }
  },
  longTapBook: function (event) {
    var that = this;
    that.setData({ longTimeOver: false })
    this.data.toPage = false;
    this.setData({ showDeleteBtn: true });

    setTimeout(function () { that.setData({ longTimeOver: true, ifShowBtn: true }) }, 1000);
    //长按某本书籍
    // console.log("longTapBook");
  },
  hiddenDeleteBtn: function (event) {
    var that = this;
    if (that.data.ifShowBtn) {
      that.setData({ showDeleteBtn: false, ifShowBtn: false, toPage: true });
    }
    if (that.data.ifTrueDel) {
      this.setData({ ifTrueDel: false });
    }
  },

  deleteBook: function (event) {
    //点击按钮删除图书
    var book_id = event.currentTarget.dataset.bookId;
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
    app.followBook.delBooks
      (
      book_id,
      function (res) {
        if (res.data.success) {
          var bookdata = that.data.book;
          bookdata.count--;
          bookdata.total_count--;
          bookdata.list.splice(book_index, 1);
          that.setData({ book: bookdata });
          //删除到已经没有书籍时
          console.log(bookdata.total_count)
          if (bookdata.total_count == 0) {
          	//获取banner广告
						app.followBook.getAppBanner(function(res){
							console.log("广告时间")
							console.log(res)
							if(res.success){
				        console.log("getAppBanner",res)
								that.setData({appBanner:res.data})
							}			
						})
          	
            that.longTapReset();
          }

          wx.showToast
            (
            {
              title: "删除成功！",
              icon: 'success',
              duration: 1000
            }
            )

        }
        else {
          wx.showToast
            (
            {
              title: res.data.message,
              icon: 'success',
              duration: 1000
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
    //  console.log(" that.data.loadMore",that.data.loadMore)
    console.log("下拉刷新");
    if (that.data.loadMore && !that.data.loadding) {
        that.setData({ loadding: true });
        app.followBook.getDeskBookList(
          that.data.pageIndex,
          that.data.loadMoreCount,
          function (res) {          	
            console.log(res)
            var rev_res = res;
            var list = rev_res.data;
            let data={};
            if (res.success&&list.length > 0) {
              for (let i = 0; i < list.length; i++) {
                if (list[i].book_pic == null) {
                  list.splice(i, 1)
                }
              }
              
              //追加数据
              data.count = list.length * 1 + that.data.book.count * 1;
              data.total_count = res.totalCount;
              //下拉刷新，拼接新的数据
              data.list = that.data.book.list.concat(list);
              //填充数据
              console.log(data);
              that.data.pageIndex=that.data.pageIndex+1;
              that.setData({ book: data });
              that.setData({ pageIndex:that.data.pageIndex});
            }else{
            	that.data.book.total_count=0;
            	that.setData({book:that.data.book})
            	//获取banner广告
							app.followBook.getAppBanner(function(res){
								console.log("广告时间")
								console.log(res)
								if(res.success){
					        console.log("getAppBanner",res)
									that.setData({appBanner:res.data})
								}			
							})
            }
            //如果已加载完所有，标记不用再加载更多
              console.log(data.list)             
              if (that.data.book.total_count == res.totalCount) {
                that.setData({ loadMore: false, 'loadTip.showLoadTip': false });
              }
            that.setData({ loadding: false });
            wx.stopPullDownRefresh();
          }
        );
    }


  },
  swapArray: function (arr, index1) {
    if (index1 > 0) {

      var item = arr[index1];
      arr.splice(index1, 1);
      arr.splice(0, 0, item);
    }
  },
  // 跳转到搜索书籍页面
  toSearchlist: function (e) {
  	var that=this;
    this.setData({ backFromSearch: true });
    if(!that.data.nodouble){
    	return false;
    }
    that.data.nodouble = false;
    if(e.target.dataset.grade){
    	wx.navigateTo({
	      url: '/pages/searchlist/searchlist?grade='+e.target.dataset.grade
	    })
    }else{//搜索全部
    	wx.navigateTo({
	      url: '/pages/searchlist/searchlist'
	    })
    }
    setTimeout(function () { that.data.nodouble = true }, 1000)
  },
  //没有书籍时广告的切换
  bindChange:function(e){
  	var current=e.detail.current;
  	this.setData({currentIndex:current})
  },
  //广告跳转
  gotoSearchList: function (e) {
    var that = this;
    const URL = e.currentTarget.dataset.urls;
    wx.navigateTo({
      url: URL
    })
  },
  catchTouchMove: function () {
    return false;
  },

})
