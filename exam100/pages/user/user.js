let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirstShow: true,
    testInfo:{},
    count: {
      study_days: "",
      pk_count: "",
      study_word_count: "",
      userPhoto: "/pages/images/unRegister.png",
      userName: "",
      user_img: '',
      user_name: '',
      unAuthorization: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // that.setData({ user_img: app.globalData.userInfo.headimgurl  })
    console.log(app.globalData.userInfo)
    
    if (options && options.share) {
      let shareInfo = {};
      shareInfo.img = options.userPhoto;
      shareInfo.name = options.userName;
      shareInfo.show = true;
      that.setData({ shareInfo })
      console.log(that.data.shareInfo)
    }
  },
  GetUserStatistics: function () {
    let that = this;
    app.word.GetUserStatistics(
      function (res) {
        if (res.success == true) {
          if (!res.data.userPhoto) {
            that.data.count.headimgurl = res.data.headimgurl;
          }
          that.data.count.nickname = res.data.nickname;
          that.data.count.pk_count = res.data.pk_count;
          that.data.count.study_days = res.data.study_days;
          that.data.count.study_word_count = res.data.study_word_count;
          that.setData({ count: that.data.count })
        }
      }
    )
  },	
  toPage: function (event) {
    var page = event.currentTarget.dataset.page;
    var toPage = "";
    switch (page) {
      case "us":
        toPage = "about/about";//关于我们
        break;
      case "studyTools"://学习工具
        toPage = "learn_tools/learn_tools";
        break;
      case "myPaper"://我的试卷
      	toPage = "/pages/analysis/analysis";
        break;
      default:
        break;
    }
    wx.navigateTo({ url: toPage });
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
    let that = this;
    if (app.globalData.uid) {
    	that.getData();
      //that.GetUserStatistics();
      
    } else {
      app.uidCallback = () => {
      	that.getData();
        //that.GetUserStatistics();
      }
    }
		//加授权
    app.unshouquan=function(){
    	console.log("拒绝授权")
      that.setData({ unAuthorization:true})
    }
    app.shouquanOk = function () {
    	console.log("授权")
      that.setData({ unAuthorization: false })
    }
    wx.getSetting({
      success(res) {
        console.log("getSetting", res)
        if (!res.authSetting['scope.userInfo']) {//没有授权
          that.setData({ unAuthorization:true})
        } else {
          that.setData({ unAuthorization: false })
        }
      }
    })
  },
  userInfoHandler: function (res) {
    console.log("res", res)
    let that = this
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.userLogin()
    } 
  },
  getData:function(){
  	var that=this;
  	app.upDateUserInfo(function (res) {
      that.setData({ user_img: res.avatarUrl, user_name: res.nickName })
    })
		//获取正确率
		app.exam.getMyAnswerSummary(function(res){
			if(res.success){
				that.setData({testInfo:res.data})
			}		
		})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isFirstShow: false })
    //关闭分享页面
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
  onShareAppMessage: function (res) {
    let path = "/pages/user/user?userPhoto=" + this.data.userPhoto + "&userName=" + this.data.userName + "&share=true";
    if (res.from === 'button') {
      // 来自页面内转发按钮
      path = `/pages/index/index`
    }
    return {
      title: '',
      path: path,
      imageUrl: '',
      success: function (res) {
        // 转发成功

      },
    }
  }
})