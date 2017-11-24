// user.js 
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    cur_year: 0,
    cur_month: 0,
    weeks_ch: null,
    cur_day: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 11,
    allCurrent: 10,
    now_month: 0,
    now_year: 0,
    isDisplay: false,
    n_days: [],
    n_empty: [],
    activeYear: 0,
    activeMonth: 0,
    activeDay: 0,
    count: 0,
    arr_activeDay: [],
    evaluationCount: 0,
    pk_count: 0,
    studyDays: 0,
    star_num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    if (app.globalData.weixinUserInfo) {
      //调用应用实例的方法获取全局数据
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

      let weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      let date = new Date();
      let cur_year = date.getFullYear();
      let cur_month = date.getMonth() + 1;
      let cur_day = date.getDate();
      let now_month = cur_month;
      let now_year = cur_year
      let time
      if (cur_month < 10) {
        time = cur_year + '-0' + cur_month
      } else {
        time = cur_year + '-' + cur_month
      }
      console.log(time)
      that.getActiveDay(time)

      let { arr, n_empty, n_days, days, empty } = that.data
      for (let i = 0; i <= 11; i++) {
        that.getNum(cur_year, cur_month - i)
        that.getMon(cur_year, cur_month - i)
        n_days.push(that.data.days);
        n_empty.push(that.data.empty)
      }
      that.setData({
        n_days: n_days,
        n_empty: n_empty,
        cur_year: cur_year,
        cur_month: cur_month,
        weeks_ch: weeks_ch,
        cur_day: cur_day,
        now_month: now_month,
        now_year: now_year
      });
    } else {
      app.uidCallback = function () {
        //调用应用实例的方法获取全局数据
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

        let weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        let date = new Date();
        let cur_year = date.getFullYear();
        let cur_month = date.getMonth() + 1;
        let cur_day = date.getDate();
        let now_month = cur_month;
        let now_year = cur_year
        let time
        if (cur_month < 10) {
          time = cur_year + '-0' + cur_month
        } else {
          time = cur_year + '-' + cur_month
        }
        console.log(time)
        that.getActiveDay(time)

        let { arr, n_empty, n_days, days, empty } = that.data
        for (let i = 0; i <= 11; i++) {
          that.getNum(cur_year, cur_month - i)
          that.getMon(cur_year, cur_month - i)
          n_days.push(that.data.days);
          n_empty.push(that.data.empty)
        }
        that.setData({
          n_days: n_days,
          n_empty: n_empty,
          cur_year: cur_year,
          cur_month: cur_month,
          weeks_ch: weeks_ch,
          cur_day: cur_day,
          now_month: now_month,
          now_year: now_year
        });
      }
    }


  },
  //获取每个月里的特殊天数
  getActiveDay: function (time) {
    var that = this;
    app.speechEvalution.getTimeByUid(time, function (res) {
      if (res.success && res.data.length !== 0) {
        console.log(time)
        console.log(res.data)
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          let newTime = res.data[i].date;
          let n_activeYear = newTime.split("").splice(0, 4).join('');
          n_activeYear = parseInt(n_activeYear);
          let n_activeMonth = newTime.split("").splice(5, 2).join('');
          n_activeMonth = parseInt(n_activeMonth);
          let n_activeDay = newTime.split("").splice(8, 2).join('');
          n_activeDay = parseInt(n_activeDay)

          // var idx = that.data.cur_month-that.data.now_month;
          var idx = that.data.star_num
          var days = that.data.n_days[idx];
          for (var j = 0; j < days.length; j++) {
            days[j].isGet = true
            if (days[j].day == n_activeDay) {
              if (data[i].count < 11) {//小于等于10条
                days[j].active = "active1"
              } else if (data[i].count > 10 && data[i].count < 51) {//大于10条 小于等于50条
                days[j].active = "active2"
              } else if (data[i].count > 50) {//大于50条
                days[j].active = "active3"
              }
            }
          }
        }
        that.setData({ n_days: that.data.n_days })
        console.log("天")
        console.log(that.data.n_days)
      } else if (res.success && res.data.length == 0) {
        var idx = that.data.star_num
        var days = that.data.n_days[idx];
        for (var j = 0; j < days.length; j++) {
          days[j].isGet = true
        }
        that.setData({ n_days: that.data.n_days })
      }
    })
  },
  //获取某月总共有多少天
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate();
  },
  //获取某月的第一天是星期几
  getThisMonthWeek: function (year, month) {
    return new Date(year, month - 1, 1).getDay();
  },
  //某月1号前空几个
  getNum: function (year, month) {
    let that = this;
    let firstDay = that.getThisMonthWeek(year, month);
    let empty = [];
    if (firstDay > 0) {
      for (let i = 0; i < firstDay; i++) {
        empty.push(i)
        that.setData({
          empty: empty
        })
      }
    } else {
      that.setData({
        empty: empty
      })
    }
  },

  //某月所占位置
  getMon: function (year, month) {
    let that = this;
    let days = []
    let thisDays = that.getThisMonthDays(year, month);
    for (let i = 0; i < thisDays; i++) {
      days[i] = {};
      days[i].active = '';
      days[i].isGet = false
      days[i].day = i + 1;
    };
    that.setData({
      days: days
    })
  },

  //swiper
  changePic: function (event) {
    let that = this;
    let current = event.detail.current
    let { cur_year, star_num } = that.data
    let reduce = Math.abs(current - that.data.current);
    if (current > that.data.current) {
      let month = that.data.now_month + reduce
      star_num = star_num - reduce
      if (month >= 13) {
        month = month - 12;
        cur_year = cur_year + 1
      }
      that.setData({ now_month: month, cur_year, now_year: cur_year, current: current, star_num, isNext: false })
      let time
      if (that.data.now_month < 10) {
        time = that.data.cur_year + '-0' + that.data.now_month
      } else {
        time = that.data.cur_year + '-' + that.data.now_month
      }
      // that.setData({ current: current })
      console.log(time)
      var idx = that.data.star_num
      var days = that.data.n_days[idx];
      if (!days[0].isGet) {//如果没有取过
        that.getActiveDay(time);
      }

    }
    else {
      let month = that.data.now_month - reduce
      star_num = star_num + reduce
      if (month <= 0) {
        month = month + 12;
        cur_year = cur_year - 1
      }
      that.setData({ now_month: month, cur_year, now_year: cur_year, current: current, star_num, isNext: false })

      let time
      if (that.data.now_month < 10) {
        time = that.data.cur_year + '-0' + that.data.now_month
      } else {
        time = that.data.cur_year + '-' + that.data.now_month
      }
      // that.setData({ current: current })
      console.log(time)
      var idx = that.data.star_num
      var days = that.data.n_days[idx];
      if (!days[0].isGet) {//如果没有取过
        that.getActiveDay(time);
      }
    }

  },
  //sure
  bindSrue: function () {
    let that = this;
    that.setData({ isDisplay: false })
  },

  //
  bindImg: function () {
    let that = this;
    that.setData({ isDisplay: true })
  },
  gotoItem: function (event) {
    wx.navigateTo({
      url: '/pages/user/item/item?id=0&title=历史测评&type=evaluation',
    })
  },

  goDeatil: function () {
    wx.navigateTo({
      url: '/pages/ranking/ranking',
    })
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
    if (app.globalData.weixinUserInfo) {
      app.speechEvalution.getStatistics(function (res) {
        that.setData({ evaluationCount: res.data.data.evaluationCount, pk_count: res.data.data.pk_count, studyDays: res.data.data.studyDays });
      });
    } else {
      app.uidCallback2 = function () {
        app.speechEvalution.getStatistics(function (res) {
          that.setData({ evaluationCount: res.data.data.evaluationCount, pk_count: res.data.data.pk_count, studyDays: res.data.data.studyDays });
        });
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
    var path = "/pages/index/index";
    var imageUrl = "";
    return app.onShareAppMessage(title, path, 0, "evaluation", imageUrl, "小程序口语评测分享");
  },

})