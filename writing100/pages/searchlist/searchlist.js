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
    currentidx: 0,
    loadMore: true,
    gradeArr: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade', 'grade', 'grade_checked'],
    grade_active: [],
    currentGrade: 'grade7',//显示全部年级列表
    bookJson: {},
    uid: 0,
    isbnList: {
      isShow: false,
      list: {},
      idx: 0,
    },
    ISBN: 0,
    isFirstShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // that.setData({grade:'',index:1,size:12,bookJson:{}})
    var that = this;
    this.setData({ book_id: options.book_id })
    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
    }
    //从二维码到分类列表页
    if (options && options.grade) {
      that.changeData(options.grade);
      that.setData({ book_grade: that.data.grade })
    }
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
      that.loadBookList();

    }

    if (options.share == "true") {
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          that.loadBookList()
          // app.Writing.bindUserAndAdviser(options.adviser_id);
          that.adviserIdFun();
        });
      } else {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        // app.Writing.bindUserAndAdviser(options.adviser_id);
        that.adviserIdFun();
      }
    }


    //from码书
    if (options && options.isbn) {
      this.setData({ ISBN: options.isbn })
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          if (that.data.ISBN !== 0) {
            that.fromCodeBook(that.data.ISBN)
            that.loadBookList()
          }
        });
      } else {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        if (that.data.ISBN !== 0) {
          // that.fromCodeBook(that.data.ISBN)
          that.loadBookList()
        }
      }
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

      if (!adviser_id || adviser_id == "0") {
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
  loadBookList: function () {
    //首次加载
    //上拉加载更多
    //下来全部刷新
    var that = this;
    //有必要加载更多，且没在请求加载中
    if (that.data.loadMore && !that.data.loadding) {
      //if(getApp().globalData.weixinUserInfo.uid>0)
      //{       	
      that.setData({ loadding: true });
      app.Writing.searchBook
        (
        that.data.grade,
        that.data.index,
        that.data.size,
        function (res) {
          if (res.data.length > 0) {
            //追加数据
            that.data.book.count = res.data.length * 1 + that.data.book.count * 1;
            let booklist = res.data;
            for (let i = 0; i < booklist.length; i++) {
              booklist[i].book_pic = booklist[i].book_pic.split(".jpg")[0] + "_c.jpg";
            }
            that.data.book.list = that.data.book.list.concat(booklist);
            //填充数据                         
            /* for (var i = 0; i < res.data.length; i++) {

              if (res.data[i].book_pic == "") {
                res.data[i].book_pic = "../images/no_image.png"
              }
            } */


            that.setData({
              book: that.data.book,
              index: res.pageIndex + 1
            });
            for (var i = 0; i < res.data.length; i++) {
              for (var j = 0; j < that.data.gradeArr.length; j++) {
                if (res.data[i].book_grade == that.data.gradeArr[j]) {
                  if (that.data.bookJson[that.data.gradeArr[j]]) {
                    that.data.bookJson[that.data.gradeArr[j]].push(res.data[i]);
                  } else {
                    that.data.bookJson[that.data.gradeArr[j]] = [];
                    that.data.bookJson[that.data.gradeArr[j]].push(res.data[i]);
                  }

                }
              }
            }
            that.setData({ bookJson: that.data.bookJson })
          }
          //如果不够12条，标记不用再加载更多
          if (that.data.book.count == res.totalCount) {
            that.setData({ loadMore: false });
          }
          that.setData({ loadding: false });
          wx.stopPullDownRefresh();
        }
        );

      //}
      //else
      //{
      //setTimeout(that.loadBookList,100);
      //}
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
    if (!that.data.isFirstShow) {
      if (!that.data.isbnList.isShow) {
        for (var i = 0; i < that.data.book.list.length; i++) {
          if (that.data.book.list[i].id == that.data.book_id) {
            if (that.data.book.list[i].isadd == 0) {
              that.data.book.list[i].isadd = 1;
              break;
            }
          }
        }
        that.setData({ book: that.data.book })
        var grade = that.data.book_grade || that.data.isbnList.book_grade;
        for (var i = 0; i < that.data.bookJson[grade].length; i++) {
          if (that.data.bookJson[grade][i].id == that.data.book_id) {
            if (that.data.bookJson[grade][i].isadd == 0) {
              that.data.bookJson[grade][i].isadd = 1;
              break;
            }
          }
        }
        that.setData({ bookJson: that.data.bookJson })
      }

    }
    that.setData({ "isbnList.isShow": false });
  },

  //
  toArr: function (obj) {
    var arr = [];
    for (var item in obj) {
      arr.push(obj[item]);
    }
    return arr;
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isFirstShow: false })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    var adviser_id = wx.getStorageSync('adviser_id')
    return {
      title: "年级分类",
      path: '/pages/searchlist/searchlist?adviser_id=' + adviser_id + '&share=true'
    }
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
        index: 1,
        loadding: false,
        size: 12,
        loadMore: true,
        book: { count: 0, list: [] },
        grade_listBox: 'not_show',
        nodouble: false,
        bookJson: {},
        currentidx: 0

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

  hideGradeList: function () {
    this.setData({ grade_listBox: "not_show" });
  },

  //点击书籍后跳转到内容页面
  toBookPage: function (event) {
    //允许跳转时才处理
    if (this.data.nodouble) {
      var book_id = event.currentTarget.dataset.bookId;
      var book_grade = event.currentTarget.dataset.bookGrade;
      var book_name = event.currentTarget.dataset.bookName;
      var book_pic = event.currentTarget.dataset.bookPic;
      var that = this;
      this.setData({ book_id: book_id, book_grade: book_grade })

      wx.setStorageSync("bookId", book_id);
      wx.setStorageSync("ReturnBook", "deskBook")
      that.data.nodouble = false;
      //禁止1s中内连续打开书籍
      setTimeout(function () { that.data.nodouble = true }, 1000)
      if (event.currentTarget.id === "add0") {
        app.Writing.addBookById(book_id);
        //先弹出提示框，在跳转
        setTimeout(function () { wx.navigateTo({ url: `/pages/book/book?book_id=${book_id}&book_name=${book_name}&book_pic=${book_pic}` }); }, 1000)
      }
      else {
        wx.navigateTo({ url: `/pages/book/book?book_id=${book_id}&book_name=${book_name}&book_pic=${book_pic}` });
      }

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
  },


  //from码书
  fromCodeBook: function (isbn) {
    let that = this;
    let { isbnList } = that.data
    /* app.Writing.GetBookByISBN(isbn, function (res) {
      if (res.data.success) {
          var isbnListIdx
          switch (res.data.data[0].book_grade) {
            case "一年级":
              isbnListIdx = 0;
              break
            case "二年级":
              isbnListIdx = 1;
              break
            case "三年级":
              isbnListIdx = 2;
              break
            case "四年级":
              isbnListIdx = 3;
              break
            case "五年级":
              isbnListIdx = 4;
              break
            case "六年级":
              isbnListIdx = 5;
              break
          }
          that.setData({ "isbnList.list": res.data.data, "isbnList.isShow": true, "isbnList.idx": isbnListIdx, "isbnList.book_grade": res.data.data[0].book_grade })
        
      }
    }) */

  }
})