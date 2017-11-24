// searchlist.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book:
    {
      count: 0,
      list: []
    },
    grade: "",
    index: 1,
    font: app.globalData.font,
    nodouble: true,
    // 修改样式的数据
    grade_listBox: "not_show",
    loadding: false,
    size: 12,
    loadMore: true,
    gradeArr: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade', 'grade', 'grade_checked'],
    bookJson: {},
    uid: 0,
    ifDefaultTouch: "show",
    isbnList: {
      isShow: false,
      list: {},
      idx: 0
    },
    pageIndex: 1,
    loadMoreCount: 12,
    book_id: 0,
    opacity: 0,
    isFirstShow: true,
    grade: '',
    isLoading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options && options.grade) {
      that.changeData(options.grade);
      that.setData({ book_grade: that.data.grade })
    }
    if (app.globalData.userInfo) {//已登录
      var uid = app.globalData.weixinUserInfo.uid;
      that.setData({ uid: uid })
      that.loadBookList();

    } else {//未登录
      app.userLogin(function () {
        var uid = app.globalData.weixinUserInfo.uid;
        that.setData({ uid: uid })
        that.loadBookList()
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!that.data.isFirstShow) {
      if (app.globalData.userInfo) {//已登录
        var uid = app.globalData.weixinUserInfo.uid;
        that.setData({ uid: uid })
        that.loadBookList();

      } else {//未登录
        app.userLogin(function () {
          var uid = app.globalData.weixinUserInfo.uid;
          that.setData({ uid: uid })
          that.loadBookList()
        });
      }
    }

  },
  /**
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    this.setData({ isFirstShow: false })
  },
  onPullDownRefresh: function () {
    var that = this;
    //清空数据
    console.log("下拉刷新")
    if (that.data.loadding) {
      return;
    } else {
      that.data.book.count = 0;
      that.data.book.list = [];
      that.data.bookJson = {};
      that.data.index = 1;
      that.data.loadMore = true;
      that.data.loadLastId = 0;
      this.loadBookList();
    }
  },
  onReachBottom: function () {
    var that = this;
    let {pageIndex}=that.data;
    pageIndex++;
    that.setData({ pageIndex:pageIndex})    
    that.loadBookList();
  },
  loadBookList: function () {
    //首次加载
    //上拉加载更多
    //下来全部刷新
    var that = this;
    //有必要加载更多，且没在请求加载中
    console.log(that.data.loadMore && !that.data.loadding);
    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });
      app.followBook.GetDictationBookList
        (
        function (res) {
       console.log(res);
          var list = res.data;
          let data={};
          that.setData({isLoading:true})
          if (res.data.length > 0) {
            // 追加数据
            // var loadLastId = Number(data[data.length - 1].rownumber) + 1;
            data.count = res.pageSize * 1 + that.data.book.count * 1
            //下拉刷新追加数据
            // that.data.book.list = that.data.book.list.concat(res.data.list);
            data.list = that.data.book.list.concat(list);            
            // 填充数据                         
            for (var i = 0; i < list.length; i++) {
              var bookPic = list[i].book_pic;
              list[i].book_pic = bookPic.substring(0, bookPic.length - 4) + "_c" + bookPic.substring(bookPic.length - 4)
              if (list[i].book_pic == "") {
                list[i].book_pic = "../images/no_image.png"
              }
            }

            that.setData({ book: data });
            console.log(that.data.book)
            // that.setData({ loadLastId: loadLastId });
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < that.data.gradeArr.length; j++) {
                if (list[i].book_grade == that.data.gradeArr[j]) {
                  if (that.data.bookJson[that.data.gradeArr[j]]) {
                    that.data.bookJson[that.data.gradeArr[j]].push(list[i]);
                  } else {
                    that.data.bookJson[that.data.gradeArr[j]] = [];
                    that.data.bookJson[that.data.gradeArr[j]].push(list[i]);
                  }
                }
              }
            }
            that.setData({ bookJson: that.data.bookJson })
            console.log(that.data.bookJson)
          }
          // 如果不够12条，标记不用再加载更多
          if (list.length != that.data.loadMoreCount) {
            that.setData({ loadMore: false });
          }
          that.setData({ loadding: false });
          wx.stopPullDownRefresh();
        },
        that.data.pageIndex,
        that.data.loadMoreCount,
        that.data.grade
        );
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let title = "年级分类 ";
    let path = '/pages/searchlist/searchlist?share=true';
    return {
      title: title,
      path: path
    };
  },

  // 选择年级
  chooseGrade: function (e) {
    const that = this;
    var grade = '';
    if (!e.target.dataset.grade) {
      return false;
    }
    if (e.target.dataset.grade == that.data.currentGrade) {
      grade = 'grade7';

    } else {
      grade = e.target.dataset.grade;

    }

    if (!that.data.nodouble) {
      return false;
    } else {

      that.changeData(grade);
      that.setData({
        loadding: false,
        size: 12,
        loadMore: true,
        book: { count: 0, list: [] },
        grade_listBox: 'not_show',
        nodouble: false,
        bookJson: {},
        loadLastId: 0,
        pageIndex:1
      });
      setTimeout(function () {
        that.setData({ nodouble: true })
      }, 500)
      that.loadBookList();
    }

  },

  //对应数据
  changeData: function (data) {
    const that = this;
    switch (data) {
      case "grade1":
        that.setData({
          grade: "一年级",
          grade_bg: ['grade_checked', 'grade', 'grade', 'grade', 'grade', 'grade', 'grade'],
          grade_active: ['active', '', '', '', '', ''],
          currentGrade: "grade1"
        });
        break;
      case "grade2":
        that.setData({
          grade: "二年级",
          grade_bg: ['grade', 'grade_checked', 'grade', 'grade', 'grade', 'grade', 'grade'],
          grade_active: ['', 'active', '', '', '', ''],
          currentGrade: "grade2"
        });
        break;
      case "grade3":
        that.setData({
          grade: "三年级",
          grade_bg: ['grade', 'grade', 'grade_checked', 'grade', 'grade', 'grade', 'grade'],
          grade_active: ['', '', 'active', '', '', ''],
          currentGrade: "grade3"
        });
        break;
      case "grade4":
        that.setData({
          grade: "四年级",
          grade_bg: ['grade', 'grade', 'grade', 'grade_checked', 'grade', 'grade', 'grade'],
          grade_active: ['', '', '', 'active', '', ''],
          currentGrade: "grade4"
        });
        break;
      case "grade5":
        that.setData({
          grade: "五年级",
          grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade_checked', 'grade', 'grade'],
          grade_active: ['', '', '', '', 'active', ''],
          currentGrade: "grade5"
        });
        break;
      case "grade6":
        that.setData({
          grade: "六年级",
          grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade', 'grade_checked', 'grade'],
          grade_active: ['', '', '', '', '', 'active'],
          currentGrade: "grade6"
        });
        break;
      case "grade7":
        that.setData({
          grade: "",
          grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade', 'grade', 'grade_checked'],
          currentGrade: "grade7",
          grade_active: ['', '', '', '', '', ''],
        });
        break;
    }
  },
  // 显示或者隐藏年级列表
  showGradeList: function () {
    const that = this;
    that.setData({ ifDefaultTouch: "hidden" })
    if (that.data.grade_listBox === "not_show") {
      this.setData({ grade_listBox: "grade_listBox" });
    }
    else {
      this.setData({ grade_listBox: "not_show" });
    }
    this.setData({ "isbnList.isShow": false })
  },
  toBookPage: function (event) {
    //允许跳转时才处理
    var that = this;
    console.log("跳转")
    console.log(event)
    var isAdd = event.currentTarget.dataset.isadd;
    var book_id = event.currentTarget.dataset.bookId;
    if (isAdd == 1) {//已添加过
    	wx.redirectTo({ url: '../sound/sound?book_id=' + book_id});
      return false;
    }
    if (this.data.book_id == book_id) {
    	wx.redirectTo({ url: '../sound/sound?book_id=' + book_id});
      return;
    }
    if (this.data.nodouble || this.data.book_id != book_id) {
      console.log(event)
      that.data.nodouble = false;
      var bookID = event.currentTarget.dataset.bookId;
      var book_index = event.currentTarget.dataset.bookIndex;
      var bookId = event.currentTarget.dataset.bookid;
      that.setData({ book_id: bookId });
      console.log(bookId);
      app.followBook.addBooks(bookId, function (res) {
        console.log(res.data)
        if (res.data.success) {
        	wx.redirectTo({ url: '../sound/sound?book_id=' + book_id});
        	
          that.setData({ opacity1: 0 })       
          //禁止1s中内连续打开书籍
          setTimeout(function () { that.data.nodouble = true }, 1000)
          var grade = event.currentTarget.dataset.grade;
          for (var i = 0; i < that.data.bookJson[grade].length; i++) {
            if (that.data.bookJson[grade][i].id == bookID) {
              that.data.bookJson[grade][i].isadd = 1;
              that.data.bookJson[grade][i].clicked = true;
              break;
            }
          }
          that.setData({ bookJson: that.data.bookJson })
          that.setData({ opacity1: 'opacity1' })
          //添加=》增加图书 的记录
          // app.followBook.AddBookScan(bookId, function (res) { });
        }
      });
    }
  },
  stopMove() {
    return false;
  },
  swapArray: function (arr, index1) {
    if (index1 > 0) {
      let item = arr[index1];
      arr.splice(index1, 1);
      arr.splice(0, 0, item);
    }
  },
  pushNewItemBeforeOld: function (arr, indexOld, newItemLikeOld) {
    if (indexOld > 0) {
      let item = arr[indexOld - 1];
      arr.splice(item, 0, newItemLikeOld);
    }
  }

})