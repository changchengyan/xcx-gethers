// pages/book/bookshelf/bookshelf.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    grade: "",
    gradeid: "",
    gradeArr: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
    bookJson: {},
    height: 0,
    index: 0,
    clickBooks: 0,
    book_id: 0,
    toBook:{},
    firstShow:false,
    isClick: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ firsShow: false })
    //获取手机信息
    wx.getSystemInfo({
      success: function (res) {
        that.data.height = res.windowHeight;
      }
    })
    if (options.grade) {
      that.setData({ grade: options.grade });
    }
    if (app.globalData.weixinUserInfo) {
      app.word.getBooks(
        //that.data.grade,
        "",
        function (res) {
          console.log(res);
          that.setData({ books: res.data.data, height: that.data.height });

          that.setGradeBook();
          that.setHeight();
          that.setGradeID();

        }
      );
    } else {
      app.uidCallback = () => {
        app.word.getBooks(
          //that.data.grade,
          "",
          function (res) {
            console.log(res);
            that.setData({ books: res.data.data, height: that.data.height });

            that.setGradeBook();
            that.setHeight();
            that.setGradeID();

          }
        );
      }
    }
    
  },
  gotoItem: function (event) {
    var that = this;
    if (that.data.isClick) {
    var id = event.currentTarget.dataset.id
    var title = event.currentTarget.dataset.title
    that.setData({
      index: event.currentTarget.dataset.index,
      clickBooks: event.currentTarget.dataset.grade,
      book_id: event.currentTarget.dataset.id,
      isClick: false
    });
    console.log("clickBooks", event.currentTarget.dataset.grade, "index", event.currentTarget.dataset.index)

      wx.navigateTo({
        url: '/pages/item/item?id=' + id + '&title=' + title + '&type=book',
      })
    }
    // setTimeout(function () { that.setData({ isClick: true }) },5000);

  },
  setGradeBook: function () {
    var that = this;
     that.data.bookJson = {};
    var books = that.data.books;
    for (var i = 0; i < books.length; i++) {
      for (var j = 0; j < that.data.gradeArr.length; j++) {
        if (books[i].book_grade == that.data.gradeArr[j]) {
          if (that.data.bookJson[that.data.gradeArr[j]]) {
            that.data.bookJson[that.data.gradeArr[j]].push(books[i]);
          } else {
            that.data.bookJson[that.data.gradeArr[j]] = [];
            that.data.bookJson[that.data.gradeArr[j]].push(books[i]);
          }

        }
      }
    }
    that.setData({ bookJson: that.data.bookJson })
  },
  setGradeID: function () {
    var that = this;
    var grade = that.data.grade;
    if (!grade){
      return
    }
    var gradeArr = that.data.gradeArr;
    var gradeIndex;
    gradeArr.forEach(function (item, i) {
      if (gradeArr[i] == grade) {
        gradeIndex = i
      }
    })
    console.log("that.data.bookJson", grade, that.data.bookJson[grade])
    console.log(gradeIndex)
    if (that.data.bookJson[grade]){
      that.setData({ gradeid: gradeIndex });
    }else{
      wx.showToast({
        title: '找不到书籍',
      })
    }
  },
  gotoBookshelf: function (event) {
    var that = this;
    var grade = event.currentTarget.dataset.grade
    that.setData({ grade: grade });
    that.setGradeID()
  },
  setHeight: function () {
    var that = this;
    that.data.height = that.data.height - 245 / 2;
    that.setData({ height: that.data.height });
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
    that.setData({ isClick: true })
    if (that.data.book_id != 0) {
      // app.speechEvalution.getSeedInfoByBookId(
      //   that.data.book_id,
      //   function (subRes) {
      //     console.log(subRes);
      //     if (that.data.clickBooks == 1) {
      //       that.data.grade1Books[that.data.index].is_pay = subRes.data.data.is_pay;
      //       that.data.grade1Books[that.data.index].is_free = subRes.data.data.is_give;
      //       that.setData({ grade1Books: that.data.grade1Books });
      //     }
      //     else if (that.data.clickBooks == 2) {
      //       that.data.grade2Books[that.data.index].is_pay = subRes.data.data.is_pay;
      //       that.data.grade2Books[that.data.index].is_free = subRes.data.data.is_give;
      //       that.setData({ grade2Books: that.data.grade2Books });
      //     }
      //     else if (that.data.clickBooks == 3) {
      //       that.data.grade3Books[that.data.index].is_pay = subRes.data.data.is_pay;
      //       that.data.grade3Books[that.data.index].is_free = subRes.data.data.is_give;
      //       that.setData({ grade3Books: that.data.grade3Books });
      //     }
      //     else if (that.data.clickBooks == 1) {
      //       that.data.grade4Books[that.data.index].is_pay = subRes.data.data.is_pay;
      //       that.data.grade4Books[that.data.index].is_free = subRes.data.data.is_give;
      //       that.setData({ grade4Books: that.data.grade4Books });
      //     }
      //     else if (that.data.clickBooks == 5) {
      //       that.data.grade5Books[that.data.index].is_pay = subRes.data.data.is_pay;
      //       that.data.grade5Books[that.data.index].is_free = subRes.data.data.is_give;
      //       that.setData({ grade5Books: that.data.grade5Books });
      //     }
      //     else if (that.data.clickBooks == 6) {
      //       that.data.grade6Books[that.data.index].is_pay = subRes.data.data.is_pay;
      //       that.data.grade6Books[that.data.index].is_free = subRes.data.data.is_give;
      //       that.setData({ grade6Books: that.data.grade6Books });
      //     }
      //   }
      // );
    }
    
    
    if (that.data.firstShow){
      console.log("show执行")
      app.word.getBooks("", function (res) {
        console.log(res);
        that.setData({ books: res.data.data });
        that.setGradeBook();
      })
    }else{
      that.data.firstShow = true
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
    var path = `/pages/book/bookshelf/bookshelf?grade=一年级`;
    return app.onShareAppMessage(title, path, 0, "bookshelf", "小程序单词100分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  }
})