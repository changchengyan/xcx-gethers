var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	paper_list:[],//banner
    hotClassify: [],//热门分类
    latestCourse: {
      totalCount: -1,
      count: 0,
      list: []
    },//一周最新
    pageIndex: 1,
    pageSize: 10,
    loadMore: true,
    isLoadding: false,
    firstLoadding: false,
    dbClick:false,
    isFirstShow:true,
    unAuthorization: false,
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    //获取热门分类
    that.setData({ firstLoadding: true })
    that.loadMore();
  },
  loadMore: function () {
    var that = this;
    let { pageIndex, pageSize, loadMore, isLoadding } = that.data
    if (loadMore && !isLoadding) {
      that.setData({ isLoadding: true })
      app.exam.getHotDiscover(pageIndex, pageSize, function (res) {
        console.log(res)
        let { hotClassify, latestCourse,paper_list } = that.data;
        hotClassify = res.data.classify;
        paper_list=res.data.paper_list;
        latestCourse.list = latestCourse.list.concat(res.data.course_list);
        latestCourse.totalCount = res.totalCount;
        latestCourse.count = latestCourse.count + res.data.course_list.length;
        that.setData({ isLoadding: false, firstLoadding: false, paper_list,hotClassify, latestCourse})
        if (latestCourse.count == latestCourse.totalCount) {//数据已经取完
          that.setData({ loadMore: false })
        } else {
          pageIndex++;
          that.setData({ pageIndex: pageIndex })
        }
      })
    }
  },
  toTest:function(event){
  	let that = this;   
    var paper_id=event.currentTarget.dataset.paperid;
    var book_id=event.currentTarget.dataset.bookid;
    let{dbClick,id}=that.data;
    console.log(event)
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/test/test?book_id=${book_id}&paper_id=${paper_id}`,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.loadMore();
  },
  toAllclass: function () {
    let that = this;
    var dbClick=that.data.dbClick;
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/allclass/allclass`,
    })
  },

  toDayHot: function (event) {
    let that = this;
    var dbClick=that.data.dbClick;
    let { id } = event.currentTarget.dataset;
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/item/item?id=${id}`,
    })
  },

  tohotclass: function (event) {
    let that = this;
    var dbClick=that.data.dbClick;
    let { id, title } = event.currentTarget.dataset;
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/allclass/allclass?classify_id=${id}&title=${title}`,
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
		let{isFirstShow}=that.data;
		if(!isFirstShow){
			that.data.dbClick=false;
			//刷新热门分类 一周最新
			//初始化数据			
			that.data.pageIndex=1;
			that.data.loadMore=true;
			that.setData({isLoadding:false,firstLoadding: false })
			that.loadMore();			
		}
		//加授权
		app.unshouquan=function(){
      that.setData({ unAuthorization:true})
    }
    app.shouquanOk = function () {
      that.setData({ unAuthorization: false })
    }
    wx.getSetting({
      success(res) {
        console.log("getSetting", res)
        if (!res.authSetting['scope.userInfo']) {//没有授权
          that.setData({ unAuthorization:true})
        } else {
          console.log("授权成功")
          that.setData({ unAuthorization: false })
        }
      }
    })
  },
  userInfoHandler: function (res) {
    console.log("res", res)
    let that = this
    if (res.detail.errMsg == "getUserInfo:ok") {
      // console.log("that.data.toPath", that.data.toPath)
      app.userLogin()
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
		var that=this;
		that.setData({isFirstShow:false})
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})