// book.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {
      isPay: "",
      bookName: "",
      lessonList: []
    },
    money: 0,
    browser_id: 0,
    lesson_pic: "../../images/book/book.png",
    font: app.globalData.font,
    loadding: false,
    moreLoadding: false,
    loadMore: true,
    loadingText: '正在加载中',
    curPage: 1,
    totalPage: null,
    key_rest_count: 0,
    fistShow: true,
    sortName: [],
    sortJson: {},
    isLoading: false,
    returnload: false,
    currLessonId: 0,
    star: 0,
    navigation_type: null,
    lesson_name: null,
    book_id: null,
    submitData: {},
    uid: 0,
    submitShow: true,
    ISBN: 0,
    book_img: "",
    ISBN: 0,
    noDouble: true,
    topay: false, //支付弹框
    isClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    if (app.globalData.userInfo) {
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
    }
    that.setData({ book_id: options.book_id, book_img: options.book_img })
    console.log(options)
    if (options && options.adviser_id) {
      wx.setStorageSync('adviser_id', options.adviser_id);
    }

    //from码书
    if (options && options.isbn) {
      console.log("options", options)
      var isbn = options.isbn
      app.Dictation.GetBookByISBN(isbn, function (res) {
        console.log("res.data.success", res.data.success)
        if (res.data.success) {
          console.log('resresres=' + res.data.data[0].id)
          that.setData({ book_id: res.data.data[0].id });
          that.fromCodeBook()
        } else {
          that.setData({ isLoading: true })
          wx.showToast
            (
            {
              title: "课程维护中",
              icon: 'success',
              duration: 2000
            }
            )
        }

      })

      return false
      // console.log("that.data.uid0", that.data.uid)
    }

    //如果是分享进入，则要将书籍添加到书架
    if (options.share == "true") {
      if (that.data.uid == 0) {//重新登陆
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          getShareData();
          that.adviserIdFun();
          that.addBrowser();
          var preUid = options.preUid;
          app.Dictation.AddUserKeyByShared(preUid, function () { })
        });
      } else {
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        getShareData();
        that.adviserIdFun();
        that.addBrowser();
        var preUid = options.preUid;
        app.Dictation.AddUserKeyByShared(preUid, function () { })
      }

      function getShareData() {
        app.Dictation.ownKeyNum(that.data.uid, function (res) {
          that.setData({ key_rest_count: res.data.key_rest_count });
          console.log("钥匙个数为" + that.data.key_rest_count);
        });
        app.Dictation.getBookByShare(that.data.book_id, function () {
          //添加分享书籍
          that.getLessonListData();
        });
      }
      return false;
    }
    if (options.isSubMit) {//unit页面分享出去听完后返回book
      that.setData({
        isSubMit: options.isSubMit,
        star: options.star,
        currLessonId: options.currLessonId,
        navigation_type: options.navigation_type,
        book_id: options.book_id,
        lesson_name: options.lesson_name
      })
    }

    
    that.addBrowser();
    app.Dictation.ownKeyNum(that.data.uid, function (res) {
      that.setData({ key_rest_count: res.data.key_rest_count });
      console.log("钥匙个数为" + that.data.key_rest_count);
    });




    //加载课程列表
    that.getLessonListData();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  getLessonListData: function (cb) {
    console.log('ss')
    var that = this;
    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });
      console.log(that.data.uid, that.data.book_id)
      app.Dictation.getLessonList(that.data.uid, that.data.book_id, that.data.curPage, 12, function (res) {
        console.log(res);
        var list = res.data.lessonList;
        that.data.book.bookName = res.data.bookName;
        that.data.book.isPay = res.data.isPay;
        that.data.book.lessonList = that.data.book.lessonList.concat(list);
        for (var i = 0; i < list.length; i++) {
          if (list[i].lesson_category == null || list[i].lesson_category == "undefined" || list[i].lesson_category == " ") {
            var sortName = '课文';
          } else {
            var sortName = list[i].lesson_category;
          }

          var isSame = that.findArr(sortName, that.data.sortName);//有为真 没有为假
          if (isSame) {
            that.data.sortJson[sortName].push(list[i]);
          } else {
            that.data.sortName.push(sortName);
            that.data.sortJson[sortName] = [];
            that.data.sortJson[sortName].push(list[i]);
          }
        }
        //如果不够12条，标记不用再加载更多
        if (that.data.book.lessonList.length == res.totalCount) {
          that.setData({ loadMore: false });
        }
        that.setData({
          book: that.data.book,
          curPage: res.pageIndex + 1,
          totalPage: res.pageTotal,
          sortName: that.data.sortName,
          sortJson: that.data.sortJson,
          isLoading: true,
          loadding: false
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
    app.Dictation.addBrowser
      (
      that.data.book_id,
      'dictation_book',
      0,
      function (rbs) {
        console.log("addBrowser.rbs", rbs)
        that.data.browser_id = rbs.data.browser_id;
      }
      );
    //刷新书籍最后阅读时间
    if (that.data.book_id) {
      app.Dictation.updateBookReadTime(that.data.book_id, function () { });
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    console.log(options);
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
    console.log("show", that.data.fistShow, that.data.isSubMit)
    if (!that.data.fistShow) {
      app.Dictation.ownKeyNum(that.data.uid, function (res) {
        that.setData({ key_rest_count: res.data.key_rest_count });
        console.log("钥匙个数为" + that.data.key_rest_count);
      });
    }
    app.Dictation.GetUserBookIsClick(that.data.book_id, function (res) {
      that.setData({ isClick: res.data.isClick })
    })
    if (that.data.isSubMit && that.data.submitShow) {
      var currLessonId = that.data.currLessonId;
      var list = that.data.book.lessonList;
      var currLessonName = '';
      for (var i = 0; i < list.length; i++) {
        if (currLessonId == list[i].id) {
          if (list[i].lesson_category == null || list[i].lesson_category == "undefined" || list[i].lesson_category == " ") {
            currLessonName = "课文";
          } else {
            currLessonName = list[i].lesson_category;
          }
          break;
        }
      }
      if (that.data.sortJson[currLessonName]) {
        for (var i = 0; i < that.data.sortJson[currLessonName].length; i++) {
          if (that.data.sortJson[currLessonName][i].id == currLessonId && that.data.sortJson[currLessonName][i].star < that.data.star) {
            that.data.sortJson[currLessonName][i].star = that.data.star;
            break;
          }
        }
        that.setData({ sortJson: that.data.sortJson });
      }
      //听写完毕后的返回
      var dataUrl = "";
      switch (this.data.star) {
        case 0:
          dataUrl = "http://image.chubanyun.net/sound/Dictation/WinStar1.mp3"
          break;
        case 1:
          dataUrl = "http://image.chubanyun.net/sound/Dictation/good.mp3"
          break;
        case 2:
          dataUrl = "http://image.chubanyun.net/sound/Dictation/great.mp3"
          break;
        case 3:
          dataUrl = "http://image.chubanyun.net/sound/Dictation/perfect.mp3"
          break;
        default: break;
      }
      wx.playBackgroundAudio({
        dataUrl: dataUrl,
        title: '',
      })
      that.setData({ returnload: true })
      that.setData({ submitShow: false })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ fistShow: false })
  },
  catchTouchstart: function () {
    return false;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    app.Dictation.UpdateBrowserTime(that.data.browser_id, function () {

    })
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
    var that = this;
    if (that.data.uid != 0) {
      this.setData({ moreLoadding: true })
      this.loadMore();
    }

  },
  //上拉加载
  loadMore: function () {
    var that = this;
    that.getLessonListData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var adviser_id = wx.getStorageSync('adviser_id')
    return {
      title: that.data.book.bookName,
      path: '/pages/book/book?book_id=' + that.data.book_id + '&adviser_id=' + adviser_id + '&share=true' + '&book_img=' + that.data.book_img + '&preUid=' + that.data.uid
    }
    console.log('/pages/book / book ? book_id = ' + that.data.book_id + ' & adviser_id=' + adviser_id + '&share=true' + "&book_img=" + that.data.book_img)
  },
  //点击后跳转到单元内听写页面
  toUnitPage: function (event) {
    var that = this;
    if (that.data.noDouble) {
      that.setData({
        noDouble: false
      })
      var lesson_id = event.currentTarget.dataset.lesson_id;
      let lesson_name = event.currentTarget.dataset.name;
      console.log(lesson_name);
      wx.navigateTo({
        url: '/pages/unit/unit?navigation_type=book&lesson_id=' + lesson_id + '&book_id=' + this.data.book_id + "&bookname=" + this.data.book.bookName + '&lesson_name=' + lesson_name + "&book_img=" + that.data.book_img
      })
      setTimeout(function () {
        that.setData({
          noDouble: true
        })
      }, 500)
    } else {
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
  //重新听写
  playAgain: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/play/play?navigation_type=${that.data.navigation_type}&lessonId=${that.data.currLessonId}&book_id=${that.data.book_id}&bookname=${that.data.book.bookName}&lessonName=${that.data.lesson_name}&book_img${that.data.book_img}`
    })
    that.setData({ returnload: false })
    that.setData({ isSubMit: false })
    that.setData({ submitShow: true })
    // console.log(that.data.currLessonId)
  },
  //进入下一听写
  nextPlay: function () {
    let that = this;
    let { currLessonId } = this.data;
    // console.log(currLessonId)
    app.Dictation.returnNext(currLessonId, function (res) {
      var lesson_id = res.data.lastId;
      if (lesson_id != 0) {
        var lessonName = res.data.lessonName;
      }

      if (that.data.navigation_type == 'book' && lesson_id != 0) {
        wx.navigateTo({
          url: `/pages/unit/unit?navigation_type=${that.data.navigation_type}&lesson_id=${lesson_id}&book_id=${that.data.book_id}&bookname=${that.data.book.bookName}&lesson_name=${lessonName}`,
        })
        // console.log("book")
      } if (that.data.navigation_type == 'custom' && lesson_id != 0) {
        wx.navigateTo({
          url: `/pages/unit/unit?navigation_type=${that.data.navigation_type}&lesson_id=${lesson_id}`
        })
        //console.log('cc')
      }
      if (lesson_id == 0) {
        wx.showToast({
          title: '已经是最后一课听写',
        })
        return false;
      }
      that.setData({ returnload: false })
      that.setData({ isSubMit: false })
      that.setData({ submitShow: true })
      console.log(currLessonId)

    })
  },
  //去码书资源列表页
  bindToCodeBook: function () {
    //获取码书对应的bookId 
    var book_id = this.data.book_id;
    app.Dictation.GetPlatformBookId(book_id, function (res) {
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
  //分享按钮的分享
  toShare: function () {
    this.setData({ isClick: true })
    app.Dictation.SetUserBookIsClick(this.data.book_id, function () {

    })
    this.onShareAppMessage()
  },
  //支付
  topay: function () {
    var that = this;
    app.Dictation.getBookPriceById(that.data.book_id, function (res) {
      var price = res.data.price;
      if (!that.data.topay) {
        that.setData({ "topay": !that.data.topay, money: price })
      }
    })
  },
  returnToUnit: function () {
    var that = this;
    that.setData({
      "topay": !that.data.topay,
    })
  },
  //立即购买
  openAllBook: function () {
    var that = this;
    // that.setData({ goPayDetail: true,  });
    var adviser_id = wx.getStorageSync('adviser_id');
    console.log("openAllBook", adviser_id)
    if (adviser_id == 0) {
      app.Dictation.GetUserSpreadAdviser(function (res) {

        if (res.data.success) {

          that.setData({ adviser_id: res.data.data.adviser_id });
          console.log(adviser_id, "调取adviser_id成功");
          fastBuySeed()
        }

      })
    } else {
      fastBuySeed()
    }

    function fastBuySeed() {
      console.log(that.data.uid, adviser_id)
      app.Dictation.fastBuySeed(that.data.uid, that.data.book_id, adviser_id, function (rts) {
        // console.log("当前书的课程回调成功");
        // console.log(rts);
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
              that.gotoNext();
              that.setData({ showKey: false });
            },
            'fail': function (res) {
              //支付失败
              // console.log("支付失败");
              // that.setData({ goTap: false });
              that.setData({ showKey: true });
            }
          }
          );
        // console.log(rts);
      });
    }

  },
  //toContinue
  toContinue: function () {
    var that = this;
    var lesson_id = "";
    var lessonName = "";
    var newBook = true
    var value = wx.getStorageSync('lastLesson')
    if (value) {
      for (var i = 0; i < value.length; i++) {
        if (value[i].book_id == that.data.book_id) {
          var lastLessonId = value[i].lesson_id;
          console.log("lastLessonId", lastLessonId)
          newBook = false
        }
      }
      if (!newBook) {
        // app.Dictation.returnNext(lastLessonId, function (res) {
        //   lesson_id = res.data.lastId;
        //   lessonName = res.data.lessonName;
        //   if (res.data.lastId == 0) {
        //     lesson_id = that.data.book.lessonList[0].id;
        //     lessonName = that.data.book.lessonList[0].lesson_name;
        //   }
        //   wx.navigateTo({
        //     url: '/pages/unit/unit?navigation_type=book&lesson_id=' + lesson_id + '&book_id=' + that.data.book_id + "&bookname=" + that.data.book.bookName + '&lesson_name=' + lessonName + "&book_img=" + that.data.book_img
        //   })

        // })
        for(var i=0;i<that.data.book.lessonList.length;i++) {
          if (that.data.book.lessonList[i].id == lastLessonId) {
            lessonName = that.data.book.lessonList[i].lesson_name;
            wx.navigateTo({
              url: '/pages/unit/unit?navigation_type=book&lesson_id=' + lastLessonId + '&book_id=' + that.data.book_id + "&bookname=" + that.data.book.bookName + '&lesson_name=' + lessonName + "&book_img=" + that.data.book_img
            })
          }
        }
        
      }else {
        lesson_id = that.data.book.lessonList[0].id;
        lessonName = that.data.book.lessonList[0].lesson_name;
        wx.navigateTo({
          url: '/pages/unit/unit?navigation_type=book&lesson_id=' + lesson_id + '&book_id=' + that.data.book_id + "&bookname=" + that.data.book.bookName + '&lesson_name=' + lessonName + "&book_img=" + that.data.book_img
        })
      }
      
      
     
    } else {
      lesson_id = that.data.book.lessonList[0].id;
      lessonName = that.data.book.lessonList[0].lesson_name;
      wx.navigateTo({
        url: '/pages/unit/unit?navigation_type=book&lesson_id=' + lesson_id + '&book_id=' + that.data.book_id + "&bookname=" + that.data.book.bookName + '&lesson_name=' + lessonName + "&book_img=" + that.data.book_img
      })
    }



  },
  fromCodeBook: function () {
    let that = this
    if (that.data.uid == 0) {//重新登陆
      app.userLogin(function () {
        console.log("that.data.uid1", that.data.uid)
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        console.log('res', that.data.uid)
        console.log('000')
        app.Dictation.getBookByShare(that.data.book_id, function () {
          //添加分享书籍
          that.getLessonListData();
          that.addBrowser();
          app.Dictation.ownKeyNum(that.data.uid, function (res) {
            that.setData({ key_rest_count: res.data.key_rest_count });
            console.log("钥匙个数为" + that.data.key_rest_count);
          });
        });
      })
    } else {
      console.log("that.data.uid2", that.data.uid)
      var uid = app.globalData.userInfo.weixinUser.uid;
      that.setData({ uid: uid })
      app.Dictation.getBookByShare(that.data.book_id, function () {
        //添加分享书籍
        that.getLessonListData();
        that.addBrowser();
        app.Dictation.ownKeyNum(that.data.uid, function (res) {
          that.setData({ key_rest_count: res.data.key_rest_count });
          console.log("钥匙个数为" + that.data.key_rest_count);
        });
      });

    }
  }
})