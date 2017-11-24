// pages/dayhot/dayhot.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperList: [],
    id: 0,//课程id
    bookname:'',//课程名称
    unAuthorization: false,
    isShare:false,//是否分享过来的
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(options.share){
    	that.setData({ isShare: true })
    }
    that.setData({ id: options.id ,bookname:options.bookname})
  },

  toTest: function (event) {
    let that = this;
    var paper_id=event.currentTarget.dataset.id;
    var id=that.data.id;
    wx.navigateTo({
      url: `/pages/test/test?book_id=${id}&paper_id=${paper_id}`,
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
		var that=this;
		let {id,isShare}=that.data;
		if (app.globalData.uid) {			
      //课程的试卷列表
      that.setData({ firstLoadding: true })
	    app.exam.getPaperList(id, 1, 999, function (res) {
	      console.log(res);
	      that.setData({ paperList: res.data ,firstLoadding:false})
	    })
	    if(isShare){
	    	//如果是分享进来 把书添加到课程
	      app.exam.addCourse(id)
	    }
	    
    } else {
      app.uidCallback = () => {
        //课程的试卷列表
        that.setData({ firstLoadding: true })
		    app.exam.getPaperList(id, 1, 999, function (res) {
		      console.log(res);
		      that.setData({ paperList: res.data,firstLoadding:false })
		    })
		    if(isShare){
		    	//如果是分享进来 把书添加到课程
		      app.exam.addCourse(id)
		    }
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
    var title ='课程主页';
    var pageImg='';
    let {id,bookname}=that.data;
    var path = `/pages/dayhot/dayhot?id=${id}&bookname=${bookname}`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})