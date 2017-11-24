// pages/book/book.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName: "",
    lessonList: [],
    noDouble: true,
    bookId: 0,
    font: app.globalData.font,
    key_rest_count: 0,
    listen_count: "",
    lastTop: 0,//上下滑动
    direction: "up",
    isload: false,
    isPay: 0,
    uid: 0
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
      bookId: options.book_id
    })
    app.read.getBookScanCount(options.book_id, function (res) {
      that.setData({
        listen_count: res.data.data
      })
    });
    //如果从分享进入
    if (options.share == "true") {
      if (that.data.uid == 0) {//重新登陆
        console.log(1);
        app.userLogin(function () {
          var uid = app.globalData.userInfo.weixinUser.uid;
          that.setData({ uid: uid })
          that.adviserIdFun();
          // that.addBrowser();
          let share_uid = options.share_uid;
          app.read.getCardByShare(share_uid, function (res) {
            console.log("增加钥匙", res);
            app.read.addBookById(that.data.bookId);
            // app.Writing.bindUserAndAdviser(options.adviser_id);
          });
          app.read.getList(options.book_id, function (res) {
            console.log("iskey", res, res.data[0].book_name);
            that.setData({
              bookName: res.data[0].book_name.split(" "),
              lessonList: res.data,
              isload: true,
              isPay: res.data[0].isPay
            });

          })
        });
      } else {
        console.log(2);
        var uid = app.globalData.userInfo.weixinUser.uid;
        that.setData({ uid: uid })
        that.adviserIdFun();
        // that.addBrowser();
        let share_uid = options.share_uid;
        app.read.getCardByShare(share_uid, function (res) {
          console.log("增加钥匙", res);
          app.read.addBookById(that.data.bookId);
          // app.Writing.bindUserAndAdviser(options.adviser_id);
        });
        app.read.getList(options.book_id, function (res) {
          console.log("iskey", res, res.data[0].book_name);
          that.setData({
            bookName: res.data[0].book_name.split(" "),
            lessonList: res.data,
            isload: true,
            isPay: res.data[0].isPay
          });

        })
      }
    } else {
      app.read.getList(options.book_id, function (res) {
        console.log("iskey", res, res.data[0].book_name);
        that.setData({
          bookName: res.data[0].book_name.split(" "),
          lessonList: res.data,
          isload: true,
          isPay: res.data[0].isPay
        });

      })
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
  onShow: function () {
    this.getUserKeyCount();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.read.UpdateBookReadTime(this.data.bookId);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.read.UpdateBookReadTime(this.data.bookId);
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
    // var adviser_id = wx.getStorageSync('adviser_id');
    let uid = this.data.uid;
    return {
      title: that.data.bookName.join(" "),
      path: '/pages/book/book?book_id=' + that.data.bookId + '&share=true' + '&share_uid=' + uid
    }
  },
  //进入朗读页面
  toUnitPage: function (e) {
    var that = this;
    app.read.AddBookScan(that.data.bookId);
    if (that.data.noDouble) {
      that.setData({
        noDouble: false
      })
      var id = e.currentTarget.dataset.id;
      if (e.currentTarget.dataset.time) {
        wx.navigateTo({
          url: `../read/read?lesson_id=${id}&book_id=${that.data.bookId}&time=${e.currentTarget.dataset.time}`,
        })
      } else {
        wx.navigateTo({
          url: `../read/read?lesson_id=${id}&book_id=${that.data.bookId}`,
        })
      }
      setTimeout(function () {
        that.setData({
          noDouble: true
        })
      }, 2000)
    } else {
      return false
    }
  },
  //继续上次的学习
  lastLesson: function () {
    var that = this;
    var lastClass = wx.getStorageSync("lastClass");
    if (lastClass.bookId == that.data.bookId) {
      that.toUnitPage({
        currentTarget: {
          dataset: {
            id: lastClass.lesson_id,
            time: lastClass.time
          }
        }
      })
    } else {
      that.toUnitPage({
        currentTarget: {
          dataset: {
            index: 0
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
    // var adviserId = wx.getStorageSync("adviser_id");
    let bookId = this.data.bookId;
    app.read.fastBuySeed(bookId, 0, function (rts) {
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
            that.setData({ isPay: 1 });
            wx.showToast({
              title: '支付成功啦',
            })
          },
          'fail': function (res) {
            //支付失败
            wx.showToast({
              title: '支付失败',
            })
          }
        }
        );
    });
  },
  // 获取用户钥匙
  getUserKeyCount() {
    const that = this;
    app.read.ownKeyNum(function (res) {
      let rest_key = res.data.key_rest_count;
      that.setData({ key_rest_count: rest_key });
    });
  },
  toDetail: function () {
    if (!this.data.isload) {
      return false;
    }
    var that = this;
    if (that.data.noDouble) {
      that.setData({
        noDouble: false
      })
      wx.navigateTo({
        url: `/pages/detail/detail?book_id=${that.data.bookId}&book_name=${that.data.lessonList[0].book_name}&pic=${that.data.lessonList[0].book_pic}`,
      })
      setTimeout(function () {
        that.setData({
          noDouble: true
        })
      }, 2000)
    } else {
      return false
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
        app.read.GetUserSpreadAdviser(function (res) {
          console.log("GetUserSpreadAdviser", res)
          wx.setStorageSync('adviser_id', res.data.data.adviser_id);
          console.log("获得res.data.data.adviser_id成功", res.data.data.adviser_id)
        })
      } else {
        app.read.bindUserAndAdviser(adviser_id, function () {
          console.log("插入res.data.data.adviser_id成功", adviser_id)
        })
      }
    }
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