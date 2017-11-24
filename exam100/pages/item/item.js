// pages/item/item.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payBox: false,
    bookDetail: [],
    paperList: [],
    id: 0,
    isAdd:1,//是否加入书架 1 表示已经加过 0 表示没有加
    dbClick:false,
    unAuthorization: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ id: options.id })    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  	var that=this;
  	that.data.dbClick=false;
		//uid判断
    if(app.globalData.uid!=0){//取到了uid
    	that.load();
    }else{//没有取到uid
    	app.uidCallback=function(){
    		that.load();
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
  load:function(){
  	var that=this;
  	var id=that.data.id;
  	//课程详情  需要uid
    app.exam.getCourseInfo(id, function (res) {
    	var bookDetail=res.data.examine;
    	bookDetail.app_info=JSON.parse(bookDetail.app_info)
    	bookDetail.app_info.nodeList=[];
		var infolist=bookDetail.app_info.infolist;
		for(let i=0;i<infolist.length;i++){
			bookDetail.app_info.nodeList[i]=[];
			bookDetail.app_info.nodeList[i][0]={};
			var attrStyle={style:''};
			attrStyle.style=infolist[i].style;
			bookDetail.app_info.nodeList[i][0].name='span';
			bookDetail.app_info.nodeList[i][0].attrs=attrStyle;
			bookDetail.app_info.nodeList[i][0].children=[];
			bookDetail.app_info.nodeList[i][0].children[0]={};
			bookDetail.app_info.nodeList[i][0].children[0].type='text';
			bookDetail.app_info.nodeList[i][0].children[0].text=infolist[i].value;			
		}
      that.setData({ bookDetail})
      that.setData({ isAdd: res.data.isadd })
    });
    //课程的试卷列表 需要uid
    app.exam.getPaperList(id, 1, 999, function (res) {
      console.log(res);
      that.setData({ paperList: res.data })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  toTest: function (event) {
    let that = this;   
    var paper_id=event.currentTarget.dataset.id;
    let{dbClick,id}=that.data;
    if(dbClick){
    	return false;
    }
    console.log(event)
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/test/test?book_id=${id}&paper_id=${paper_id}`,
    })
  },

  //购买页面
  payLesson: function () {
    let that = this;
    that.setData({ payBox: true })
  },

  //关闭购买
  closePayBox: function () {
    let that = this;
    that.setData({ payBox: false })
  },

  //购买课程
  payNow:function(){
  let that = this;
  app.exam.addCourse(that.data.id,function(res){
    console.log(res)
    that.setData({ payBox: false })
  })
  },
  //加入课程
  addCourse:function(){
  	var that=this;
  	var book_id=that.data.id;
  	app.exam.addCourse(book_id,function(res){
  		if(res.success){
  			console.log(res)
  			that.setData({isAdd:true})
		    wx.showToast({
		      title: '课程已加入书架',
		      icon: 'success',
		      duration: 2000
		    })
  		}
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
    var title ='课程详情';
    var pageImg='';
    let {id}=that.data;
    var path = `/pages/item/item?id=${id}`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})