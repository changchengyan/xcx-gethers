//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    info: [],
    banner: [
      {
        sentence: 'I happen to believe you make your own destiny.You have to do the best with what God gave you',
        translation: '我相信命运在你自己手里。上天赐给你的，你要尽量发挥',
        sentence_pic: ' http://image.chubanyun.net/images/Word100/01.jpg ',
        theme_name: '美文欣赏',
      },
      {
        sentence: 'I happen to believe you make your own destiny.You have to do the best with what God gave you',
        translation: '我相信命运在你自己手里。上天赐给你的，你要尽量发挥',
        sentence_pic: 'http://image.chubanyun.net/images/Word100/02.png ',
        theme_name: '美文欣赏',
      },
      {
        sentence: 'I happen to believe you make your own destiny.You have to do the best with what God gave you',
        translation: '我相信命运在你自己手里。上天赐给你的，你要尽量发挥',
        sentence_pic: 'http://image.chubanyun.net/images/Word100/03.jpg ',
        theme_name: '美文欣赏',
      },

    ],
    pageIndex: 1,
    pageSize: 10,
    loadingState: false,
    loadMore: true,
    cur_year: 0,
    cur_month: 0,
    cur_day: 0,
    userInfo: null,
    ranking: [],
    isClick: true
  },
  onLoad: function () {
    let that = this;

    app.getUserInfo
      (
      function (userInfo) {
        if (userInfo.avatarUrl == "") {
          userInfo.avatarUrl = "../images/user_default.png"
        }
        //更新数据
        that.setData
          (
          {
            userInfo: userInfo
          }
          )
      }
      );

    let date = new Date();
    let cur_year = date.getFullYear();
    let cur_month = date.getMonth() + 1;
    let cur_day = date.getDate();
    if (cur_month < 10) {
      cur_month = '0' + cur_month
    }
    that.setData({
      cur_year, cur_month, cur_day
    })

  },

  gotoDetail: function (event) {
    var id = event.currentTarget.dataset.id
    var sentence_type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&sentence_type=' + sentence_type
    })
  },
  loadItemInfo: function () {
   
    var that = this;
    if (!that.data.loadingState && that.data.loadMore) {
      that.setData({ loadingState: true });
      app.word.getWordBookToDay(function (res) {
        console.log(res);
        that.setData({ info: res.data, loadingState: false  });

        // that.setData({ info: that.data.info.concat(res.data.data) });
        // if (that.data.pageIndex == res.data.pageTotal) {
        //   that.setData({ loadMore: false });
        // }
        // that.setData({ loadingState: false, pageIndex: that.data.pageIndex + 1 });
      }
      );
    }
  },
  gotoBookshelf: function (event) {
    var grade = event.currentTarget.dataset.grade
    wx.navigateTo({
      url: '/pages/book/bookshelf/bookshelf?grade=' + grade,
    })
  },

  gotoItem: function (event) {
    let that = this;
    if(that.data.isClick){
      let { id, title } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/item/item?id=${id}&title=${title}`,
      })
      that.setData({ isClick: false })
    }
    // setTimeout(function () { that.setData({ isClick: true }) },5000)

  },
  // loadBanner: function () {
  //   var that = this;
  //   app.speechEvalution.getBannerSentence(
  //     1,
  //     3,
  //     function (res) {
  //       //console.log(res);
  //       that.setData({ banner: res.data.data });
  //     }
  //   );
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
    // that.data.info = [];
    // that.data.pageIndex = 1;
    // that.data.pageSize = 10;
    // that.data.loadingState = false;
    // that.data.loadMore = true;
    that.loadItemInfo();
    // that.loadBanner();
    //排行榜
    that.GetRankings();
    //狂人
    that.GetManiacPK()
    that.setData({ isClick: true })
  },
  GetRankings:function(){
    let that = this;
    let {ranking} = that.data;
    app.word.GetRankings(3).then(function(res){
      ranking = res.data;
      console.log(res)
      that.setData({ ranking})
    })
  },
  GetManiacPK: function () {
    let that = this;
    let { rankingMan } = that.data
    app.word.GetManiacPK(5).then(function (res) {
      rankingMan = res.data;
      that.setData({ rankingMan })
    })
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
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, path, 0, "index", "小程序单词100分享");
  },
  getFormID: function (event) {
    app.getFormID(event);
  }
})
