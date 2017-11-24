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
      idx: 0,
    },
    // dataCode: app.globalData.dataCode,
    ISBN: 0,
    isFirstShow: true,
    imgHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // that.setData({grade:'',index:1,size:12,bookJson:{}})
    var that = this;
    this.setData({ book_id: options.book_id })
    console.log(options);

    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
    }
    //从二维码到分类列表页
    if (options && options.grade) {
      that.changeData(options.grade);
      that.setData({ book_grade: that.data.grade })
    }

    //分享
    if (options.share == "true") {
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          that.loadBookList()
          that.adviserIdFun();
          var preUid=options.preUid;
    	  app.Dictation.AddUserKeyByShared(preUid,function(){})    	
        });
      } else {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        that.loadBookList()
        that.adviserIdFun();
        var preUid=options.preUid;
    	  app.Dictation.AddUserKeyByShared(preUid,function(){})    	
      }
      return false
    }


    //from码书
    if (options && options.isbn) {
      this.setData({ ISBN: options.isbn })
      console.log("options", options)
      console.log("that.data.uid0", that.data.uid)
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          console.log("that.data.uid1", that.data.uid)
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          if (that.data.ISBN !== 0) {
            that.fromCodeBook(that.data.ISBN)
            that.loadBookList()
          }
        });
      } else {
        console.log("that.data.uid2", that.data.uid)
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        if (that.data.ISBN !== 0) {
          that.fromCodeBook(that.data.ISBN)
          that.loadBookList()
        }
      }
      return false
    }

    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
      console.log("从这启动");  	
      that.loadBookList()

    }
  },


  adviserIdFun: function () {
    var that = this;
    var adviser_id = wx.getStorageSync('adviser_id');
    console.log("缓存中adviser_id", adviser_id)
    if (!adviser_id) {
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
      app.Dictation.searchBook
        (
        that.data.grade,
        that.data.index,
        that.data.size,
        function (res) {
          if (res.data.length > 0) {
            //追加数据
            that.data.book.count = res.data.length * 1 + that.data.book.count * 1;
            that.data.book.list = that.data.book.list.concat(res.data);
            //填充数据                         
            for (var i = 0; i < res.data.length; i++) {

              if (res.data[i].book_pic == "") {
                //res.data[i].book_pic = "../images/no_image.png"
              }
            }

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
    //this.setData({ index: 1, bookJson: {}, loadMore: true, book: { count: 0, list: [] } });
    //this.loadBookList()
    console.log("小程序切换" + options);
    var that = this;
    var screenInfo = wx.getSystemInfoSync();
    var screenWidth = screenInfo.windowWidth;
    var itemWidth = ((screenWidth - 20) / 3 - 20) * 1.3
    this.setData({
      imgHeight: itemWidth
    });

    if (!that.data.isFirstShow) {
      if (!that.data.isbnList.isShow) {
        for (var i = 0; i < that.data.book.list.length; i++) {
          console.log(that.data.book.list[i].id)
          console.log(that.data.book_id);
          if (that.data.book.list[i].id == that.data.book_id) {
            console.log(that.data.book.list[i].id)
            console.log(that.data.book_id);
            if (that.data.book.list[i].isadd == 0) {
              that.data.book.list[i].isadd = 1;
              break;
            }
          }
        }
        that.setData({ book: that.data.book })
        var grade = that.data.book_grade || that.data.isbnList.book_grade;
        console.log("grade", grade)
        for (var i = 0; i < that.data.bookJson[grade].length; i++) {
          if (that.data.bookJson[grade][i].id == that.data.book_id) {
            if (that.data.bookJson[grade][i].isadd == 0) {
              that.data.bookJson[grade][i].isadd = 1;
              break;
            }
          }
        }
        that.setData({ bookJson: that.data.bookJson })
      } else {
        app.Dictation.GetBookByISBN(that.data.isbnList.list[0].isbn, function (res) {
          console.log("res", res.data.data)
          if (res.data.success) {
            that.setData({ "isbnList.list": res.data.data })
          }
        })

      }

    }

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
      path: '/pages/searchlist/searchlist?adviser_id=' + adviser_id + '&share=true'+'&preUid='+that.data.uid
    }
  },

  // 选择年级
  chooseGrade: function (e) {
    const that = this;
    that.setData({ ifDefaultTouch: "show" })
    that.changeData(e.target.id)
    if (!that.data.nodouble) {
      return false;
    } else {
      that.setData({
        index: 1,
        loadding: false,
        size: 12,
        loadMore: true,
        book: { count: 0, list: [] },
        grade_listBox: 'not_show',
        nodouble: false,
        bookJson: {},

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
          grade_bg: ['grade_checked', 'grade', 'grade', 'grade', 'grade', 'grade', 'grade']
        });
        break;
      case "grade2":
        that.setData({
          grade: "二年级",
          grade_bg: ['grade', 'grade_checked', 'grade', 'grade', 'grade', 'grade', 'grade']
        });
        break;
      case "grade3":
        that.setData({
          grade: "三年级",
          grade_bg: ['grade', 'grade', 'grade_checked', 'grade', 'grade', 'grade', 'grade']
        });
        break;
      case "grade4":
        that.setData({
          grade: "四年级",
          grade_bg: ['grade', 'grade', 'grade', 'grade_checked', 'grade', 'grade', 'grade']
        });
        break;
      case "grade5":
        that.setData({
          grade: "五年级",
          grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade_checked', 'grade', 'grade']
        });
        break;
      case "grade6":
        that.setData({
          grade: "六年级",
          grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade', 'grade_checked', 'grade']
        });
        break;
      case "grade7":
        that.setData({
          grade: "",
          grade_bg: ['grade', 'grade', 'grade', 'grade', 'grade', 'grade', 'grade_checked']
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
    console.log(that.data.book)
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

      var that = this;
      console.log(event);
      this.setData({ book_id: book_id, book_grade: book_grade })

      wx.setStorageSync("bookId", book_id);
      wx.setStorageSync("ReturnBook", "deskBook")
      //console.log("index="+book_index);
      that.data.nodouble = false;
      //禁止1s中内连续打开书籍
      setTimeout(function () { that.data.nodouble = true }, 1000)
      if (event.currentTarget.id === "add0") {
        app.Dictation.getBookByShare(book_id);
        //先弹出提示框，在跳转
        setTimeout(function () { wx.navigateTo({ url: '/pages/book/book?book_id=' + book_id }); }, 1000)
      }
      else {
        wx.navigateTo({ url: '/pages/book/book?book_id=' + book_id });
      }

    }
  },

  //扫码添加书籍
  GetBookByScanISBN: function (event) {
    var that = this;
    that.setData({ add_book_way: "not_show", "isbnList.isShow": false });
    wx.scanCode({
      success: (res) => {
        var resISBN = res.result;
        app.Dictation.GetBookByISBN(
          resISBN,
          function (res) {
            console.log("res", res)
            if (res.data.success) {
              if (res.data.data.length > 1) {
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

              } else {
                app.Dictation.GetBookByScanISBN
                  (
                  resISBN,
                  function (resbook) {
                    if (resbook.data.success) {
                      console.log("GetBookByScanISBN", resbook);
                      //扫描的书在已有的数据中，则把返回的数据插入到数组，放在第一个
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

                      wx.redirectTo({ url: '../book/book?book_id=' + resdata.data.id });

                    }
                    // 数据库中没有该书记提示用户自定义听写
                    else {
                      wx.navigateTo({ url: '../nobook/nobook' });
                    }
                  }
                  );
              }
            } else {
              wx.navigateTo({ url: '../nobook/nobook' });
            }



          }
        )
      }
    })


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
    app.Dictation.GetBookByISBN(isbn, function (res) {
      console.log("res", res.data.data)
      if (res.data.success) {
        console.log('success')

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
        // } else {
        //   app.Dictation.GetBookByISBN(isbn, function (resbook) {
        //     if (resbook.data.success) {
        //       console.log("GetBookByScanISBN", resbook.data.data[0].id);
        //       //扫描的书在已有的数据中，则把返回的数据插入到数组，放在第一个
        //       var resdata = resbook.data;
        //       var bookdata = that.data.book;
        //       var booklist = bookdata.list;
        //       var push = true;

        //       that.setData({ book_grade: resdata.data[0].book_grade })
        //       for (var i = 0; i < bookdata.list.length; i++) {
        //         if (bookdata.list[i].id * 1 == resdata.data[0].id * 1) {
        //           push = false;
        //           that.swapArray(booklist, i);
        //           that.setData({ book: bookdata });
        //           break
        //         }

        //       }

        //       if (push) {
        //         var node =
        //           [
        //             {
        //               book_name: resdata.data[0].book_name,
        //               book_pic: resdata.data[0].book_pic,
        //               id: resdata.data[0].id
        //             }
        //           ];

        //         var loadLastId = that.data.loadLastId + 1;
        //         bookdata.count++;
        //         bookdata.total_count++;
        //         bookdata.list = node.concat(booklist);

        //         that.setData({
        //           book: bookdata,
        //           loadMore: true,
        //           loadLastId: loadLastId,

        //         });
        //       }
        //       //that.loadBookList();
        //       app.Dictation.getBookByShare(resdata.data[0].id, function (res) {
        //         if (res.data.status == 0) {
        //           setTimeout(function () { wx.navigateTo({ url: '../book/book?book_id=' + resdata.data[0].id }); }, 1000)
        //         } else {
        //           wx.redirectTo({ url: '../book/book?book_id=' + resdata.data[0].id });
        //         }

        //       });
        //       //先弹出提示框，在跳转





        //     }
        //     // 数据库中没有该书记提示用户自定义听写
        //     else {
        //       wx.redirectTo({ url: '../nobook/nobook' });
        //     }

        //   })
        // }
      }
    })

  }
})