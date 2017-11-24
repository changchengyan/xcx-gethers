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
    grade1Books: [],
    grade2Books: [],
    grade3Books: [],
    grade4Books: [],
    grade5Books: [],
    grade6Books: [],
    height: 0,
    index: 0,
    clickBooks: 0,
    book_id: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (app.globalData.weixinUserInfo) {
      //获取手机信息
      // wx.getSystemInfo({
      //   success: function (res) {
      //     that.data.height = res.windowHeight;
      //   }
      // })
      if (options.grade) {
        that.setData({ grade: options.grade });
      }
      app.speechEvalution.getEvaluationBooks(
        //that.data.grade,
        "",
        function (res) {
          console.log(res);
          that.setData({ books: res.data.data});
          that.setGradeBook();
          // that.setHeight();
          that.setGradeID();

        }
      );
    } else {
      app.uidCallback = function () {
        //获取手机信息
        // wx.getSystemInfo({
        //   success: function (res) {
        //     that.data.height = res.windowHeight;
        //   }
        // })
        if (options.grade) {
          that.setData({ grade: options.grade });
        }
        app.speechEvalution.getEvaluationBooks(
          //that.data.grade,
          "",
          function (res) {
            console.log(res);
            that.setData({ books: res.data.data });
            that.setGradeBook();
            // that.setHeight();
            that.setGradeID();

          }
        );
      }
    }

  },
  gotoItem: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id
    var title = event.currentTarget.dataset.title
    that.setData({
      index: event.currentTarget.dataset.index,
      clickBooks: event.currentTarget.dataset.grade,
      book_id: event.currentTarget.dataset.id
    });
    wx.navigateTo({
      url: '/pages/item/item?id=' + id + '&title=' + title + '&type=book',
    })
  },
  setGradeBook: function () {
    var that = this;
    var books = that.data.books;
    for (var i = 0; i < books.length; i++) {
      if (books[i].book_grade == "一年级") {
        that.data.grade1Books.push(books[i]);
      }
      else if (books[i].book_grade == "二年级") {
        that.data.grade2Books.push(books[i]);
      }
      else if (books[i].book_grade == "三年级") {
        that.data.grade3Books.push(books[i]);
      }
      else if (books[i].book_grade == "四年级") {
        that.data.grade4Books.push(books[i]);
      }
      else if (books[i].book_grade == "五年级") {
        that.data.grade5Books.push(books[i]);
      }
      else if (books[i].book_grade == "六年级") {
        that.data.grade6Books.push(books[i]);
      }
    }
    that.setData({
      grade1Books: that.data.grade1Books,
      grade2Books: that.data.grade2Books,
      grade3Books: that.data.grade3Books,
      grade4Books: that.data.grade4Books,
      grade5Books: that.data.grade5Books,
      grade6Books: that.data.grade6Books,
    });
  },
  setGradeID: function () {
    var that = this;
    var grade = that.data.grade;
    if (grade == "一年级") {
      that.setData({ gradeid: "grade1" });
      if (that.data.grade1Books.length == 0) {
        wx.showToast({
          title: '找不到书籍',
        })
      }
    }
    else if (grade == "二年级") {
      that.setData({ gradeid: "grade2" });
      if (that.data.grade2Books.length == 0) {
        wx.showToast({
          title: '找不到书籍',
        })
      }
    }
    else if (grade == "三年级") {
      that.setData({ gradeid: "grade3" });
      if (that.data.grade3Books.length == 0) {
        wx.showToast({
          title: '找不到书籍',
        })
      }
    }
    else if (grade == "四年级") {
      that.setData({ gradeid: "grade4" });
      if (that.data.grade4Books.length == 0) {
        wx.showToast({
          title: '找不到书籍',
        })
      }
    }
    else if (grade == "五年级") {
      that.setData({ gradeid: "grade5" });
      if (that.data.grade5Books.length == 0) {
        wx.showToast({
          title: '找不到书籍',
        })
      }
    }
    else if (grade == "六年级") {
      that.setData({ gradeid: "grade6" });
      if (that.data.grade6Books.length == 0) {
        wx.showToast({
          title: '找不到书籍',
        })
      }
    }
  },
  gotoBookshelf: function (event) {
    var that = this;
    var grade = event.currentTarget.dataset.grade
    that.setData({ grade: grade });
    that.setGradeID()
  },
  // setHeight: function () {
  //   var that = this;
  //   that.data.height = that.data.height - 135 ;
  //   that.setData({ height: that.data.height });
  // },
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
    if (app.globalData.weixinUserInfo) {
      if (that.data.book_id != 0) {
        app.speechEvalution.getSeedInfoByBookId(
          that.data.book_id,
          function (subRes) {
            console.log(subRes);
            if (that.data.clickBooks == 1) {
              that.data.grade1Books[that.data.index].is_pay = subRes.data.data.is_pay;
              that.data.grade1Books[that.data.index].is_free = subRes.data.data.is_give;
              that.setData({ grade1Books: that.data.grade1Books });
            }
            else if (that.data.clickBooks == 2) {
              that.data.grade2Books[that.data.index].is_pay = subRes.data.data.is_pay;
              that.data.grade2Books[that.data.index].is_free = subRes.data.data.is_give;
              that.setData({ grade2Books: that.data.grade2Books });
            }
            else if (that.data.clickBooks == 3) {
              that.data.grade3Books[that.data.index].is_pay = subRes.data.data.is_pay;
              that.data.grade3Books[that.data.index].is_free = subRes.data.data.is_give;
              that.setData({ grade3Books: that.data.grade3Books });
            }
            else if (that.data.clickBooks == 1) {
              that.data.grade4Books[that.data.index].is_pay = subRes.data.data.is_pay;
              that.data.grade4Books[that.data.index].is_free = subRes.data.data.is_give;
              that.setData({ grade4Books: that.data.grade4Books });
            }
            else if (that.data.clickBooks == 5) {
              that.data.grade5Books[that.data.index].is_pay = subRes.data.data.is_pay;
              that.data.grade5Books[that.data.index].is_free = subRes.data.data.is_give;
              that.setData({ grade5Books: that.data.grade5Books });
            }
            else if (that.data.clickBooks == 6) {
              that.data.grade6Books[that.data.index].is_pay = subRes.data.data.is_pay;
              that.data.grade6Books[that.data.index].is_free = subRes.data.data.is_give;
              that.setData({ grade6Books: that.data.grade6Books });
            }
          }
        );
      }
    } else {
      app.uidCallback2 = function () {
        if (that.data.book_id != 0) {
          app.speechEvalution.getSeedInfoByBookId(
            that.data.book_id,
            function (subRes) {
              console.log(subRes);
              if (that.data.clickBooks == 1) {
                that.data.grade1Books[that.data.index].is_pay = subRes.data.data.is_pay;
                that.data.grade1Books[that.data.index].is_free = subRes.data.data.is_give;
                that.setData({ grade1Books: that.data.grade1Books });
              }
              else if (that.data.clickBooks == 2) {
                that.data.grade2Books[that.data.index].is_pay = subRes.data.data.is_pay;
                that.data.grade2Books[that.data.index].is_free = subRes.data.data.is_give;
                that.setData({ grade2Books: that.data.grade2Books });
              }
              else if (that.data.clickBooks == 3) {
                that.data.grade3Books[that.data.index].is_pay = subRes.data.data.is_pay;
                that.data.grade3Books[that.data.index].is_free = subRes.data.data.is_give;
                that.setData({ grade3Books: that.data.grade3Books });
              }
              else if (that.data.clickBooks == 1) {
                that.data.grade4Books[that.data.index].is_pay = subRes.data.data.is_pay;
                that.data.grade4Books[that.data.index].is_free = subRes.data.data.is_give;
                that.setData({ grade4Books: that.data.grade4Books });
              }
              else if (that.data.clickBooks == 5) {
                that.data.grade5Books[that.data.index].is_pay = subRes.data.data.is_pay;
                that.data.grade5Books[that.data.index].is_free = subRes.data.data.is_give;
                that.setData({ grade5Books: that.data.grade5Books });
              }
              else if (that.data.clickBooks == 6) {
                that.data.grade6Books[that.data.index].is_pay = subRes.data.data.is_pay;
                that.data.grade6Books[that.data.index].is_free = subRes.data.data.is_give;
                that.setData({ grade6Books: that.data.grade6Books });
              }
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
    var path = "/pages/book/bookshelf/bookshelf";
    var imageUrl = "";
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl, "小程序口语测评分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  }
})