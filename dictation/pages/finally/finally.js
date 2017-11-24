
var app = getApp();
Page({
  data: {
    star: 0,
    currLessonId: 0,
    navigation_type: null,
    book_name: null,
    book_id: 0,
    lesson_name: null
  },


  //回到列表
  returnList: function () {
    let pages = getCurrentPages(),
      delta;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == 'pages/book/book' || pages[i].route == 'pages/word/word') {
        delta = pages.length - i - 1;
        break;
      }
      if (pages[i].route == 'pages/unit/unit') {
        wx.navigateBack({
          url: '../word',
        })
      }
    }
    wx.navigateBack({ delta })

  },
  //重新听写
  playAgain: function () {
    let pages = getCurrentPages(),
      delta;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].route == 'pages/unit/unit') {
        delta = pages.length - i - 1;
        break;
      }
    }
    wx.navigateBack({ delta })
  },
  //进入下一听写
  nextPlay: function () {
    let { currLessonId } = this.data;
    console.log(currLessonId)
    app.Dictation.returnNext(currLessonId, function (res) {
      var id=res.data;
      wx.navigateBack({
        url: `/pages/unit/unit?navigation_type=${that.data.navigation_type}lessonId=${id}&book_id=${that.data.book_id}&bookname=${that.data.book_name}&lesson_name=${that.data.lessonName}`,
      })
      console.log(currLessonId)
      console.log("success")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      star: options.star,
      currLessonId: options.lessonId,
      navigation_type: options.navigation_type,
      book_name: options.book_name,
      book_id: options.book_id,
      lesson_name: options.lesson_name
    })
    console.log( options.navigation_type, options.book_name,options.book_id,options.lesson_name)
    //console.log(that.data.star)
    // console.log(that.data.currLessonId)
  }
})