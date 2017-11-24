// pages/item/item.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    sentences: [],
    bookStatistics: null,
    bookLessons: [],
    pageIndex: 1,
    pageSize: 10,
    loadingState: false,
    loadMore: true,
    type: "",
    title: "",
    id: 0,
    unit: 0,
    avg_score: 0,
    isChangeUnit: false,
    shoppingIcon: '/pages/images/shopping-cart.png',
    // 支付相关参数
    payInfo: {
      isBuy: false,
      name: "",
      price: "",
      pic: "",
      count: 0,
      give_remaining_count: 0, //赠送剩余数量
      isGive: false
    },
    isPaying: false,
    payShow: false,
    // 支付相关参数END
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 0,
    currentindex: 0,
    dir: 'up',
    an: 'before',
    margin_top: 0,
    scroll_left: 0,
    change: 'top',
    top_w: 77,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      //title: options.title
      title: '教材配套'
    });
    var that = this;
    if (app.globalData.weixinUserInfo) {
      that.setData({ type: options.type, id: options.id, title: options.title });
      that.init();
      //将当前书籍添加到用户
      app.speechEvalution.addBookFollow(
        that.data.id,
        function (res) {
          //console.log(res);
        }
      );
      //将当前书籍添加到用户END

      //获取赠送
      var isSend = options.send;
      var sharer_uid = options.sharer_uid;
      if (isSend == 1 && sharer_uid > 0) {
        app.speechEvalution.getFreeQuota(
          sharer_uid,
          that.data.id,
          function (res) {
            that.init();
          }
        );
      }
      //获取赠送END
    } else {
      app.uidCallback = function () {
        that.setData({ type: options.type, id: options.id, title: options.title });
        that.init();
        //将当前书籍添加到用户
        app.speechEvalution.addBookFollow(
          that.data.id,
          function (res) {
            //console.log(res);
          }
        );
        //将当前书籍添加到用户END

        //获取赠送
        var isSend = options.send;
        var sharer_uid = options.sharer_uid;
        if (isSend == 1 && sharer_uid > 0) {
          app.speechEvalution.getFreeQuota(
            sharer_uid,
            that.data.id,
            function (res) {
              that.init();
            }
          );
        }
        //获取赠送END
      }
    }

  },
  gotoDetail: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    that.setData({ index: event.currentTarget.dataset.index });
    var url = '../detail/detail?id=' + id + "&sentence_type=" + that.data.type;
    app.commonNavigateTo(url);
    // wx.navigateTo({
    //   url: '../detail/detail?id=' + id + "&sentence_type=" + that.data.type
    // })
  },
  loadItemInfo: function () {
    var that = this;
    if (that.data.isChangeUnit) {
      that.init();
      return;
    }
    else {
      if (!that.data.loadingState && that.data.loadMore) {
        that.setData({ loadingState: true });
        if (that.data.type == 'book') {
          app.speechEvalution.getBookSentences(
            that.data.id,
            that.data.unit == '' ? 0 : that.data.unit,
            that.data.pageIndex,
            that.data.pageSize,
            function (res) {
              console.log("getBookSentences", res);
              that.setData({
                sentences: that.data.sentences.concat(res.data.data.sentences),
                bookStatistics: res.data.data.bookStatistics.Table[0],
              });
              if (that.data.pageIndex == res.data.pageTotal) {
                that.setData({ loadMore: false, });
              }
              that.setData({ loadingState: false, pageIndex: that.data.pageIndex + 1, });
            }
          );
        }
        else if (that.data.type == 'evaluation') {
          app.speechEvalution.getSentenceEvaluationed(
            that.data.pageIndex,
            that.data.pageSize,
            function (res) {
              //console.log(res);
              that.setData({ info: that.data.info.concat(res.data.data) });
              if (that.data.pageIndex == res.data.pageTotal) {
                that.setData({ loadMore: false });
              }
              that.setData({ loadingState: false, pageIndex: that.data.pageIndex + 1 });
            }
          );
        }
      }
    }
  },
  getCompositeScoreOfBook: function () {
    var that = this;
    app.speechEvalution.getCompositeScoreOfBook(
      that.data.id,
      function (res) {
        //console.log(res);
        // that.data.bookLessons.push();
        that.data.bookLessons = res.data.data.bookLessons.Table
        that.data.bookLessons.unshift({ "id": 0, "lesson_name": "全部" })

        that.setData({
          avg_score: res.data.data.avg_score,
          bookLessons: that.data.bookLessons
        });
      }
    );
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
    //that.init();
    if (app.globalData.weixinUserInfo) {
      that.getCompositeScoreOfBook();
      if (that.data.sentences && that.data.sentences[that.data.index]) {
        app.speechEvalution.reloadSentenceById(
          that.data.sentences[that.data.index].id,
          function (res) {
            console.log(res);
            that.data.sentences[that.data.index].evaluation_count = res.data.data.current.evaluation_count;
            that.data.sentences[that.data.index].score = res.data.data.current.score;
            that.setData({ sentences: that.data.sentences });
          }
        );
      }
    } else {
      app.uidCallback2 = function () {
        that.getCompositeScoreOfBook();
        if (that.data.sentences && that.data.sentences[that.data.index]) {
          app.speechEvalution.reloadSentenceById(
            that.data.sentences[that.data.index].id,
            function (res) {
              console.log(res);
              that.data.sentences[that.data.index].evaluation_count = res.data.data.current.evaluation_count;
              that.data.sentences[that.data.index].score = res.data.data.current.score;
              that.setData({ sentences: that.data.sentences });
            }
          );
        }
      }
    }

  },
  init: function () {
    var that = this;
    that.data.info = [];
    that.data.sentences = [];
    that.data.pageIndex = 1;
    that.data.pageSize = 10;
    that.data.loadingState = false;
    that.data.loadMore = true;
    that.data.isChangeUnit = false;

    that.loadItemInfo();

    //支付相关
    if (that.data.id) {//可能是主题句子
      app.speechEvalution.getSeedInfoByBookId(
        that.data.id,
        function (subRes) {
          console.log("getSeedInfoByBookId", subRes);
          that.setData(
            {
              payInfo:
              {
                isBuy: subRes.data.data.is_pay == 1 ? true : false,
                name: subRes.data.data.book_name,
                pic: subRes.data.data.book_pic,
                price: subRes.data.data.sale_price,
                count: subRes.data.data.sentence_count,
                give_remaining_count: subRes.data.data.give_remaining_count,
                isGive: subRes.data.data.is_give == 1 ? true : false,
              }
            });
          if (that.data.payInfo.give_remaining_count > 0) {
            that.setData({ shoppingIcon: '/pages/images/gift.png' });
          }
          else {
            that.setData({ shoppingIcon: '/pages/images/shopping-cart-over.png' });
          }
        }
      );
    }
    //支付相关END
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
  onShareAppMessage: function (options) {
    console.log(options);
    var that = this;
    if (options.from == 'button' && options.target.dataset.type == 'send') {
      var nickname = '';
      var sharer_uid = 0;
      try {
        var value = wx.getStorageSync('weixinUserInfo')
        if (value) {
          nickname = value.weixinUser.nickname;
          sharer_uid = value.weixinUser.uid;
        }
      } catch (e) {
        // Do something when catch error
      }
      var title = "您的好友" + nickname + "免费送您《" + that.data.title + "》全书评测卡片";
      var path = "/pages/item/item?type=" + that.data.type + "&id=" + that.data.id + "&title=" + that.data.title + "&send=1&sharer_uid=" + sharer_uid;
      var imageUrl = "";
    }
    else {
      var title = "";
      var path = "/pages/item/item?type=" + that.data.type + "&id=" + that.data.id + "&title=" + that.data.title;
      var imageUrl = "";
    }

    return app.onShareAppMessage(title, path, "", 0, "evaluation", imageUrl, "小程序口语测评分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  },
  tab: function (event) {
    let that = this;
    let { unit } = event.currentTarget.dataset;
    let { index } = event.currentTarget.dataset;
    //console.log(unit + that.data.unit);
    console.log(index)

    that.setData({ current: index })
    // if (unit == that.data.unit) {
    //   that.data.isChangeUnit = false;
    // }
    // else {
    //   that.data.isChangeUnit = true;
    //   that.setData({ unit: unit })
    //   that.loadItemInfo();
    // }    
  },

  change: function (event) {
    let that = this
    let c = event.detail.current;
    // let { unit } = event.currentTarget.dataset;
    // console.log('d=' + unit)
    console.log(c)
    if (c > that.data.currentindex) {
      // console.log('you')
      if (c == 3) {
        that.setData({ scroll_left: 150 })
      } else if (c == 5) {
        that.setData({ scroll_left: 280 })
      } else if (c == 7) {
        that.setData({ scroll_left: 480 })
      }

    } else {
      // console.log('zuo')
      if (c == 2) {
        that.setData({ scroll_left: 0 })
      }
      else if (c == 4) {
        that.setData({ scroll_left: 100 })
      }
      else if (c == 5) {
        that.setData({ scroll_left: 300 })
      }
    }



    let { bookLessons, sentences } = that.data;
    // console.log(bookLessons[c].id)
    that.data.isChangeUnit = true;
    that.setData({ unit: bookLessons[c].id, currentindex: c, })
    that.loadItemInfo();
    // if (c > 4) {
    //   that.setData({ scroll_left: 300 })
    //   console.log('a')
    // } else if (c > 6) {
    //   that.setData({ scroll_left: that.data.scroll_left + 150 })
    //   console.log('b')
    // } else {
    //   that.setData({ scroll_left: 0 })
    //   console.log('c')
    // }
    // console.log(that.data.scroll_left)

    that.setData({ loadMore: true, });//导航栏变化时，重新加载，防止为加载完出现“我是有底线的”提示
  },

  bindscroll: function (event) {
    let that = this;
    let top = event.detail.scrollTop;
    if (top > 70) {
      that.setData({ dir: 'down', an: 'after', margin_top: 77, change: 'end' })
    } else if (top < 70) {
      that.setData({ dir: 'up', an: 'before', margin_top: 0, change: 'top' })
    }
  },


  share: function () {
    let that = this;
    that.onShareAppMessage;
  },
  //支付相关函数
  gotoPay: function () {
    var that = this;
    that.setData({ payShow: true });
  },
  fastBuySeed: function () {
    var that = this;
    if (!that.data.isPaying) {
      that.data.isPaying = true;
      if (that.data.id) {
        app.fastBuySeed(
          that.data.id,
          0,
          function (res) {
            that.payClose();
            wx.showToast({
              title: '支付成功',
            });
            that.data.isPaying = false;
            //支付相关
            if (that.data.id) {//可能是主题句子
              app.speechEvalution.getSeedInfoByBookId(
                that.data.id,
                function (subRes) {
                  console.log("getSeedInfoByBookId", subRes);
                  that.setData(
                    {
                      payInfo:
                      {
                        isBuy: subRes.data.data.is_pay == 1 ? true : false,
                        name: subRes.data.data.book_name,
                        pic: subRes.data.data.book_pic,
                        price: subRes.data.data.sale_price,
                        count: subRes.data.data.sentence_count,
                        give_remaining_count: subRes.data.data.give_remaining_count,
                        isGive: subRes.data.data.is_give == 1 ? true : false,
                      }
                    });
                  if (that.data.payInfo.give_remaining_count > 0) {
                    that.setData({ shoppingIcon: '/pages/images/gift.png' });
                  }
                  else {
                    that.setData({ shoppingIcon: '/pages/images/shopping-cart-over.png' });
                  }
                }
              );
            }
            //支付相关END
          },
          function (res) {
            that.data.isPaying = false;
          }
        );
      }
      else {
        wx.showToast({
          title: '找不到书籍信息',
        });
      }
    }
  },
  payClose: function () {
    var that = this;
    that.setData({ payShow: false });
  },
  //支付相关函数END
})