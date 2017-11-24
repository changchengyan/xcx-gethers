// book.js
var template = require("../../utils/template.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {
      isPay: "",
      isGift: "",
      bookName: "",
      lessonList: {},
      allList: []
    },
    showLessonByCategory:{},
    lesson_pic: "../../images/book/book.png",
    font: app.globalData.font,
    loadding: false,
    moreLoadding: false,
    loadMore: true,
    loadingText: '正在加载中',
    curPage: 1,
    totalPage: null,
    fistShow: true,
    sortName: [],
    sortJson: {},
    isLoading: false,
    returnload: false,
    currLessonId: 0,
    navigation_type: null,
    lesson_name: null,
    book_id: 0,
    book_name: "",
    book_pic: "",
    submitData: {},
    uid: 0,
    submitShow: true,
    ISBN: 0,
    noDouble: true,
    currentIndex: 0,
    // 支付
    isPay: 0,
    key_rest_count: 0,
    lastTop: 0,//上下滑动
    direction: "up",
    browser_id: 0,
    categoryList: [],
    ifLoad: [],
    currentIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
    }
    that.setData({
      book_id: options.book_id,
      book_name: options.book_name,
      book_pic: options.book_pic,
      // isPay: Number(options.isPay)
    });
    console.log(options.book_id)
    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
    }

    //获取书籍分类
    app.Writing.getCategoryByBookId(that.data.book_id, function (res) {
      //console.log("获取书籍分类")
      //console.log(res)

      if (res.success) {
        var categoryList = that.data.categoryList.concat(res.data.categoryList);

        that.setData({ categoryList: categoryList, });
        var arr = [];
        for (var i = 0; i < res.data.categoryList.length; i++) {
          arr[i] = {
            loadMore: true,
            loadding: false,
            curPage: 1
          };
          that.data.book.lessonList[res.data.categoryList[i]] = [];
        }
        var lessonList = that.data.book.lessonList;
        that.setData({ ifLoad: arr, "book.lessonList": lessonList })
        that.getUserLessonsAndWords(that.data.currentIndex, function () {
          if (that.data.currentIndex < that.data.categoryList.length - 1) {
            that.getUserLessonsAndWords(that.data.currentIndex + 1, function () {
              if (that.data.currentIndex < that.data.categoryList.length - 2) {
                that.getUserLessonsAndWords(that.data.currentIndex + 2)
              }
            })
          }

        });
      }
    })

    //from码书
    if (options && options.isbn) {
      console.log("options", options)
      var isbn = options.isbn
      /* app.Writing.GetBookByISBN(isbn, function (res) {
        console.log("res.data.success", res.data.success)
        if (res.data.success) {
          console.log('resresres=' + res.data.data[0].id)
          that.setData({ book_id: res.data.data[0].id });
          that.fromCodeBook()
        }else {
          that.setData({ isLoading:true})
          wx.showToast
            (
            {
              title: "课程维护中",
              icon: 'success',
              duration: 2000
            }
            )
        }
        
      }) */

      return false
      // console.log("that.data.uid0", that.data.uid)
    }

    //如果是分享进入，则要将书籍添加到书架
    if (options.share == "true") {
      that.loadMore();
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          // that.getUserKeyCount(that.data.uid);
          that.adviserIdFun();
          that.addBrowser();
          let share_uid = options.share_uid;
          app.Writing.getPenByShare(share_uid, function (res) {
            console.log("增加钥匙", res);
            app.Writing.addBookById(that.data.book_id);
            // app.Writing.bindUserAndAdviser(options.adviser_id);
          });
        });
      } else {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        // that.getUserKeyCount(that.data.uid);
        that.adviserIdFun();
        that.addBrowser();
        let share_uid = options.share_uid;
        app.Writing.getPenByShare(share_uid, function (res) {
          console.log("增加钥匙", res);
          app.Writing.addBookById(that.data.book_id);
          // app.Writing.bindUserAndAdviser(options.adviser_id);
        });
      }

      return false;
    }
    if (options.isSubMit) {//unit页面分享出去听完后返回book
      that.setData({
        isSubMit: options.isSubMit,
        currLessonId: options.currLessonId,
        navigation_type: options.navigation_type,
        book_id: options.book_id,
        lesson_name: options.lesson_name
      })
    }
    console.log("非分享")
    that.addBrowser();

    that.getUserKeyCount(that.data.uid);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  //加载数据
  getUserLessonsAndWords(idx, cb) {
    var that = this;
    if (idx) {
      var category = that.data.categoryList[idx];
      var index = idx;
      var loadMore = that.data.ifLoad[idx].loadMore;
      //var loadding=that.data.ifLoad[that.data.currentIndex].loadding;
      var curPage = that.data.ifLoad[idx].curPage;
    } else {
      var category = that.data.categoryList[that.data.currentIndex];
      var index = that.data.currentIndex;
      console.log("that.data.currentIndex", that.data.currentIndex)
      var loadMore = that.data.ifLoad[that.data.currentIndex].loadMore;
      //var loadding=that.data.ifLoad[that.data.currentIndex].loadding;
      var curPage = that.data.ifLoad[that.data.currentIndex].curPage;
    }
    //console.log("执行取数据",that.data.loadding)
    if (loadMore && !that.data.loadding) {
      //console.log("可以取数据")

      that.setData({ loadding: true })
      app.Writing.getUserLessonsAndWords(that.data.book_id, category, curPage, 10, function (res) {
        var list = res.data.lessonList;
        var bookName = res.data.bookName;
        //console.log("list",list)
        if (bookName !== "") {
          if (bookName.length > 20) {
            let BookNameArr = bookName.split(" ");
            console.log(BookNameArr);
            var simplificationName = BookNameArr[0] + " " + BookNameArr[BookNameArr.length - 2] + " " + BookNameArr[BookNameArr.length - 1];
            if (simplificationName.length > 20) {
              let refSimplificationName = simplificationName.split(" ");
              simplificationName = refSimplificationName[0] + " " + refSimplificationName[refSimplificationName.length - 1]
            }
            that.setData({ "book.bookName": simplificationName })
          } else {
            that.setData({ "book.bookName": bookName });
          }
        }
        wx.setNavigationBarTitle({
          title: bookName
        })
        that.data.book.isPay = res.data.isPay;
        that.data.book.allList = that.data.book.allList.concat(list);
        that.data.book.lessonList[category] = that.data.book.lessonList[category].concat(list);
        //如果不够12条，标记不用再加载更多
        if (that.data.book.lessonList[category].length == res.totalCount) {
          that.data.ifLoad[index].loadMore = false;
        }


        // console.log("that.data.book.lessonList[category].length", that.data.book.lessonList[category].length)
        that.data.ifLoad[index].curPage = res.pageIndex + 1;
        that.setData({
          book: that.data.book,
          ifLoad: that.data.ifLoad,
          isLoading: true,
          loadding: false,
        })
        if (cb) {
          cb();
        }

      });
    }
  },

  addBrowser: function () {
    var that = this;
    //添加应用实例浏览记录
    app.Writing.addBrowser
      (
      that.data.book_id,
      'dictation_writing',
      0,
      function (rbs) {
        that.data.browser_id = rbs.data.data.browser_id;
      }
      );
    //刷新书籍最后阅读时间
    if (that.data.book_id) {
      app.Writing.updateBookReadTime(that.data.book_id, function () { });
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // console.log("页面显示")
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
    // if (that.data.isSubMit && that.data.submitShow) {
    //   var currLessonId = that.data.currLessonId;
    //   var list = that.data.book.lessonList;
    //   var currLessonName = '';
    //   for (var i = 0; i < list.length; i++) {
    //     if (currLessonId == list[i].id) {
    //       if (list[i].lesson_category == null || list[i].lesson_category == "undefined" || list[i].lesson_category == " ") {
    //         currLessonName = "课文";
    //       } else {
    //         currLessonName = list[i].lesson_category;
    //       }
    //       break;
    //     }
    //   }
    //   if (that.data.sortJson[currLessonName]) {
    //     for (var i = 0; i < that.data.sortJson[currLessonName].length; i++) {
    //       if (that.data.sortJson[currLessonName][i].id == currLessonId && that.data.sortJson[currLessonName][i].star < that.data.star) {
    //         that.data.sortJson[currLessonName][i].star = that.data.star;
    //         break;
    //       }
    //     }
    //     that.setData({ sortJson: that.data.sortJson });
    //   }

    // }
    app.Writing.isUnlockBook(that.data.book_id, function (res) {
      console.log(res.data.unlock);
      that.setData({
        isPay: res.data.unlock
      })
    })
    this.getUserKeyCount(that.data.uid);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ fistShow: false });
    app.Writing.UpdateBrowserTime(this.data.browser_id);
  },
  catchTouchstart: function () {
    return false;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.Writing.UpdateBrowserTime(this.data.browser_id);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  addMore: function () {
    var that = this;
    if (that.data.uid != 0) {
      this.setData({ moreLoadding: true })
      this.loadMore();
    }

  },
  //上拉加载
  loadMore: function () {
    var that = this;
    that.getUserLessonsAndWords();
  },

  share: function () {
    console.log("分享");
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var adviser_id = wx.getStorageSync('adviser_id');
    let uid = this.data.uid;
    return {
      title: that.data.book_name,
      path: '/pages/book/book?book_id=' + that.data.book_id + '&adviser_id=' + adviser_id + '&share=true' + '&share_uid=' + uid
    }
    console.log("分享");
  },
  //点击后跳转到单元内听写页面
  toUnitPage: function (event) {
    var that = this;
    console.log(event);
    if (this.data.noDouble) {
      let lesson_id = event.currentTarget.dataset.lesson_id;
      let lesson_name = event.currentTarget.dataset.name;
      let isWrote = event.currentTarget.dataset.isWrote;
      let book_name = that.data.book_name;
      let book_pic = that.data.book_pic;
      let uid = that.data.uid;
      let access = "false";
      that.setData({
        noDouble: false
      })
      var lastClass = {
        lesson_id: lesson_id,
        book_id: that.data.book_id,
        name: lesson_name,
        isWrote: isWrote
      }
      wx.setStorageSync("lastClass", lastClass);
      // 查看课程是否已经解锁
      app.Writing.ifAssess(uid, lesson_id, function (res) {
        access = res.data.unlock;
        app.Writing.getLessonById(lesson_id, function (char) {
          let word = [];
          let word_mp3 = [];
          for (let index = 0; index < char.length; index++) {
            char[index].word_name = char[index].word_name.replace(/[，]+/g, ",");
            word.push(char[index].word_name.split(",")[0]);
            word_mp3.push(char[index].word_mp3_url);
          }
          console.log("已付款", access);
          wx.navigateTo({
            url: `/pages/write/write?word=${word}&mp3=${word_mp3}&isWrote=${isWrote}&lesson_id=${lesson_id}&lesson_name=${lesson_name}&bookId=${that.data.book_id}&book_name=${book_name}&book_pic=${book_pic}`
          })
        });
      });
      // 获取词语信息

      setTimeout(function () {
        that.setData({
          noDouble: true
        })
      }, 1000)
    }
    else {
      return false
    }

  },
  findArr: function (item, arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (item == arr[i]) {
        return true;
      }
    }
    return false;
  },
  //回到列表
  returnList: function () {
    let that = this;
    that.setData({ returnload: false })
    that.setData({ isSubMit: false })
    that.setData({ submitShow: true })

  },

  //去码书资源列表页
  bindToCodeBook: function () {
    //获取码书对应的bookId 
    var book_id = this.data.book_id;
    app.Writing.GetPlatformBookId(book_id, function (res) {
      // console.log("res.data.book_id", res.data.platformbook_Id)
      var path = `pages/book/book?book_id=${res.data.platformbook_Id}&fromDictation=${true}`
      wx.navigateToMiniProgram({
        appId: 'wx21293b1ab5fac316',
        path: path,
        envVersion: 'trial',
        success: function () {
          console.log("成功")
        }
      })
    })


  },
  toShare: function () {

    this.onShareAppMessage()
  },
  //from码书
  // getIDByIsbn: function (isbn) {
  //   let that = this
  //   // let isbn = 9787107161346
  //   app.Dictation.GetBookByISBN(isbn, function (res) {
  //     console.log('resresres=' + res.data.data[0].id)
  //     that.setData({ book_id: res.data.data[0].id })
  //   })
  // }

  fromCodeBook: function () {
    let that = this
    if (that.data.uid == 0) {//重新登陆
      app.userLogin(function () {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
      })
    }
  },
  // 获取用户钥匙
  getUserKeyCount(uid) {
    const that = this;
    app.Writing.ownKeyNum(uid, function (res) {
      let rest_key = res.data[0].key_rest_count;
      that.setData({ key_rest_count: rest_key });
    });
  },
  //继续上一次的练习
  lastLesson: function () {
    var that = this;
    var lastClass = wx.getStorageSync("lastClass");
    if (lastClass.book_id == that.data.book_id) {
      that.toUnitPage({
        currentTarget: {
          dataset: {
            lesson_id: lastClass.lesson_id,
            name: lastClass.name,
            isWrote: lastClass.isWrote
          }
        }
      })
    } else {
      that.toUnitPage({
        currentTarget: {
          dataset: {
            lesson_id: that.data.book.lessonList[0].id,
            name: that.data.book.lessonList[0].lesson_name,
            isWrote: lastClass.isWrote
          }
        }
      })
    }
  },

  // 花钱解锁全部课程
  openAllBook() {
    if (this.data.isPay == 1) {
      return false;
    }
    const that = this;
    let uid = this.data.uid;
    var adviserId = wx.getStorageSync("adviser_id");
    let bookId = this.data.book_id;
    // this.setData({topay:1});
    app.Writing.fastBuySeed(uid, bookId, adviserId, function (rts) {
      wx.requestPayment
        (
        {
          'timeStamp': rts.data.timeStamp,
          'nonceStr': rts.data.nonceStr,
          'package': rts.data.package,
          'signType': rts.data.signType,
          'paySign': rts.data.paySign,
          'success': function (res) {
            //支付成功
            // console.log(res);
            // console.log("支付成功啦");
            // that.data.canView = true;
            // that.setData({ isPay: 1, topay: 0 });
            wx.showToast({
              title: '支付成功啦',
            })
          },
          'fail': function (res) {
            //支付失败
            // console.log("支付失败");
            // that.setData({ goTap: false });
            wx.showToast({
              title: '支付失败',
            })
          }
        }
        );
    });
  },
  scroll: function (e) {
    var direction;
    if (e.detail.scrollTop <= 0) {
      direction = "up";
      if (this.data.direction != direction) {
        this.setData({ direction: direction })
      }
      return;
    }
    if (e.detail.scrollTop - this.data.lastTop < -10 && !this.data.loadding) {//向下
      direction = "up"
    } else if (e.detail.scrollTop - this.data.lastTop >= 0 && !this.data.loadding) {
      direction = "down"
    }
    this.data.lastTop = e.detail.scrollTop
    if (this.data.direction != direction) {
      this.setData({ direction: direction })
    }
  },

  //滑动切换
  changeCurrent: function (e) {
    var that = this;
    that.data.currentIndex = e.detail.current;
    var nowcategory = that.data.categoryList[e.detail.current];
    var nowbookList = that.data.book.lessonList[nowcategory];
    console.log("currentIndex", that.data.currentIndex)
    if (nowbookList) {
      that.getUserLessonsAndWords(that.data.currentIndex)
    }
    that.setData({ currentIndex: e.detail.current })

  },
  //点击切换
  changeIndex: function (e) {
    var that = this;
    var currentIndex = e.currentTarget.dataset.index;
    that.setData({ current: currentIndex });

  },
  //模板消息
  formSubmit: function (event) {
    var that = this;
    console.log("课文跳转")
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
    console.log(app.globalData.formids)

  }
})