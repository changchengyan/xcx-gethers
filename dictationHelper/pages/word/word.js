import Modal from '../../components/modal/modal.js'
var app = getApp();
Page({
  data: {
    list: [],
    curPage: 1,
    totalPage: null,
    loadText: "正在加载中",
    loadding: false,
    ref: false,
    startTime: null,
    isLoading: false,
    returnload: false,
    currLessonId: 0,
    star: 0,
    navigation_type: null,
    book_name: null,
    lesson_name: null,
    book_id: null,
    type_p: '',
    customTargetLessonValue: "",
    showCustomTitle: false,
    Index: null,
    pl: null,
    loadMore: true,
    loadding: false,
    isFirstShow: true

  },
  click: function (e) {
    let that = this
    let { lessonid, index, title } = e.currentTarget.dataset
    console.log(e);
    console.log(index);

    if (Date.now() - this.data.startTime < 200) {
      wx.navigateTo({
        url: `/pages/unit/unit?navigation_type=custom&lesson_id=${lessonid}&lessonIndex=${(index + 1)}&defaultCustomTitle=${that.data.list[index].lesson_name}`,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //上拉加载
  onReachBottom: function () {
    this.loadMore();
  },
  loadMore: function () {
    var curPage = this.data.curPage;
    this.load(curPage)
  },
  load: function (index) {
    var that = this;

    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });
      this.setData({ isLoading: false })
      app.Dictation.getCustomList(index, 12, function (res) {
        var lists = that.formatList(res.data)
        that.data.list = that.data.list.concat(lists);
        //如果不够12条，标记不用再加载更多
        if (that.data.list.length == res.totalCount) {
          that.setData({ loadMore: false });
        }
        that.setData({
          list: that.data.list,
          curPage: res.pageIndex + 1,
          totalPage: res.pageTotal,
          loadding: false,
          isLoading: true
        })
      });
    }
  },
  //格式化列表
  formatList: function (list) {
    // for (var i = 0; i < list.length; i++) {
    //   list[i].lesson_name = list[i].lesson_name.replace(/^\d{4}-/g, "");
    // }
    return list
  },
  onLoad: function (options) {
    let that = this;
    that.load(1);
    that.modal = new Modal();
    console.log(options)
    that.addBrowser()
    
    if(options.isSubMit){//unit页面分享出去听完后返回word
    	that.setData({
    		isSubMit:options.isSubMit,
    		star: options.star, 
    		currLessonId: options.currLessonId,
    		navigation_type: options.navigation_type, 
    		book_id: options.book_id, 
    		lesson_name: options.lesson_name
    	})
    }

    //提交后显示得分页面
    // if (that.data.type_p == 'type_p') {
    //   that.setData({ returnload: true })
    // }

  },
  //判断网络
  onShow: function () {
    let that = this
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
            that.setData({
              loadding: false
            })
          }
        }
      });
    //再次打开页面时刷新数据
    if (!that.data.isFirstShow) {
    	that.data.curPage=1;
    	that.data.loadMore=true;
    	that.data.loadding=false;
    	that.data.list=[];
      that.load(that.data.curPage);
    }

    if (that.data.isSubMit) {
      //听写完毕后的返回
      that.setData({ returnload: true, type_p: 'type_p' })
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
    }
    console.log(that.data.list);
  },
  onHide: function () {
    this.setData({ isFirstShow: false })
  },
  // onUnload:function(){
  //   var that=this;
  //   that.setData({ curPage:1});
  // },
  //bindtouchstart时候触发 
  setTapStartTime: function () {
    this.setData({
      startTime: Date.now()
    })
  },
  //长按删除某条自定义
  onDelete: function (e) {
    let that = this
    //console.log(Date.now() - this.data.startTime)
    //console.log(that.data.startTime)
    let { list } = this.data;
    that.setData({
      type_p: 'type_p'
    });
    let lessonId = e.currentTarget.dataset.lessonid
    //let  index= e.currentTarget.dataset.index;
    //console.log(lessonId)
    if (Date.now() - this.data.startTime > 200) {
      this.modal.show({
        title: '确认要删除该自定义听写吗？',
        cancel: '再想想',
        submit: '确认删除',
        success: function () {
          app.Dictation.delCustomList(lessonId, function (res) {
            if (res.success) {
              var list = that.data.list;
              for (var i = 0; i < list.length; i++) {
                if (lessonId == list[i].id) {
                  list.splice(i, 1);
                  break;
                }
              }
              that.setData({ list: list })
              wx.showToast({
                title: "删除成功！",
                icon: 'success',
                duration: 700
              })
              that.setData({
                type_p: ''
              });
            } else {
              wx.showToast({
                title: "res.message",
                icon: 'success',
                duration: 1000
              })
            }
          })
        },
        fail: function (e) {
          that.setData({
            type_p: ''
          });
        }
      })
    }
  },
  //进入自定义界面
  selfBook: function () {
    this.setData({ add_book_way: " " });
    wx.navigateTo({
      url: '/pages/unit/unit?navigation_type=custom',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //回到列表
  returnList: function () {
    let that = this;
    that.setData({ returnload: false, type_p: '' })
    that.setData({ isSubMit: false })
    // let pages = getCurrentPages(),
    //   delta;
    // for (let i = 0; i < pages.length; i++) {
    //   if (pages[i].route == 'pages/book/book' || pages[i].route == 'pages/word/word') {
    //     delta = pages.length - i - 1;
    //     break;
    //   }
    //   if (pages[i].route == 'pages/unit/unit') {
    //     wx.navigateBack({
    //       url: '../word',
    //     })
    //   }
    // }
    // wx.navigateBack({ delta })

  },
  //重新听写
  playAgain: function () {
    //  let pages = getCurrentPages(),
    //    delta;
    //  for (let i = 0; i < pages.length; i++) {
    //    if (pages[i].route == 'pages/play/play') {
    //      delta = pages.length - i - 1;
    //      break;
    //    }
    //  }
    //  wx.navigateBack({ delta })
    let that = this;
    wx.navigateTo({
      url: `/pages/play/play?navigation_type=${that.data.navigation_type}&lessonId=${that.data.currLessonId}&book_id=${that.data.book_id}&bookname=${that.data.book_name}&lessonName=${that.data.lesson_name}`
    })
    that.setData({ returnload: false, type_p: '' })
    that.setData({ isSubMit: false })
    console.log(that.data.currLessonId)
  },
  //进入下一听写
  nextPlay: function () {
    let that = this;
    let { currLessonId } = this.data;
    console.log(currLessonId)
    app.Dictation.returnNext(currLessonId, function (res) {
      var lesson_id = res.data.lastId;
      if (lesson_id != 0) {
        var lessonName = res.data.lessonName;
      }
      if (that.data.navigation_type == 'book' && lesson_id != 0) {
        wx.navigateTo({
          url: `/pages/unit/unit?navigation_type=${that.data.navigation_type}&lesson_id=${lesson_id}&book_id=${that.data.book_id}&bookname=${that.data.book_name}&lesson_name=${lessonName}`,
        })
        console.log("book")
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
      that.setData({ returnload: false, type_p: '' })
      that.setData({ isSubMit: false })
      console.log(currLessonId)

    })
  },
  newCustomTitle: function (e) {
    var that = this;
    let { list, pl } = that.data;
    const arr2 = list;
    let uid = app.globalData.userInfo.weixinUser.uid;
    let currentValue = e.detail.value;
    let currentLessonId = e.currentTarget.dataset.lessonid;
    let index = e.currentTarget.dataset.index;
    console.log(pl[index].lesson_name);
    if (currentValue == "") {
      currentValue = pl[index].lesson_name;
    }
    console.log(currentValue);

    for (let i = 0; i < arr2.length; i++) {
      if (i == index) {
        arr2[i].lesson_name = currentValue;
      }
    }
    app.Dictation.UpdateCustomLessonTitle(currentValue, currentLessonId, uid, function (res) {
      console.log(res);
    })
    that.setData({ customTargetLessonValue: currentValue, showCustomTitle: false, list: arr2, Index: index + 10000000 });
  },
  toggleShow: function (e) {
    var that = this;
    let { list } = that.data;
    let index = e.currentTarget.dataset.index;
    let arr = list;
    let pl = list;
    that.setData({ pl })
    for (let i = 0; i < arr.length; i++) {
      if (i == index) {
        arr[i].lesson_name = "";
      }
    }
    that.setData({ showCustomTitle: true, list: arr, Index: index });
  },
  //添加浏览记录
  addBrowser: function () {
    var that = this;
    //添加应用实例浏览记录
    app.Dictation.addBrowser
      (
      0,
      'dictation_book',
      0,
      function (rbs) {
        //that.data.browserId = rbs.data.browser_id;
      }
      );
    //刷新书籍最后阅读时间
    app.Dictation.updateBookReadTime(that.data.book_id, function () { });
  },
  catchTouchstart: function () {
    return false;
  },

})

