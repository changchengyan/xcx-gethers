// pages/allclass/allclass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask_title: null,//展示课程列表时的类名
    //animationData: {},
    move:'',//noMove 展示不带过渡 moveTop 向上过渡 moveBottom 向下过渡
    allClass: [],//所以分类
    pageIndex: 1,
    pageSize: 10,
    classify_id: 0,//某个分类
    allLesson:{//某个分类下的所有课程列表
    	totalCount:-1,
    	count:0,
    	lessonList:[]
    },
    
    isOpen: false,//是否展示课程列表
    isLoaddingAllClassify:false,
    firstLoadding:false,//某一课程是否是第一屏加载
    isLoadding:false,  
    loadMore:true,
    dbClick:false,
    unAuthorization: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let { pageIndex,isLoaddingAllClassify} = that.data;
    if (options.classify_id) {    	
      that.setData({ classify_id:options.classify_id,move:'noMove', mask_title: options.title});
      wx.setNavigationBarTitle({
			  title: that.data.mask_title
			})
      if(!isLoaddingAllClassify){
      	that.setData({ firstLoadding: true })
      }     
      that.loadMoreCourse()
    }
    if(!that.data.firstLoadding){
    	isLoaddingAllClassify=true;
    }
    //查询所有分类
    app.exam.getAllClassify(function (res) {
      if (res.success) {
        console.log(res.data);
        var hotClass=res.data.hot_classify_list;
        var classify_id=that.data.classify_id;
        isLoaddingAllClassify=false;
        that.setData({ allClass: res.data.all_classify_list,hotClass,isLoaddingAllClassify})
      	for(let i=0;i<hotClass.length;i++){
      		if(i!=(hotClass.length-1)&&hotClass[i].id==classify_id){
      			var currentClass=hotClass.splice(i,1);
      			console.log(hotClass)
      			console.log(currentClass)
      			hotClass.push(currentClass[0]);
      			that.setData({hotClass})  
      			break;
      		}
      	}
      	
      }
    })
  },

  //进入详情
  todetail: function (event) {
    let that = this;
    let { hotClass,classify_id,pageIndex,allLesson,loadMore,isLoadding,firstLoadding } = that.data;
    let { title, id } = event.currentTarget.dataset;
    if(id!=classify_id){
    	//初始化
    	pageIndex=1;
    	allLesson={
    		totalCount:-1,
	    	count:0,
	    	lessonList:[]
    	};
    	loadMore=true;
    	isLoadding=false;
    	firstLoadding=false;
    	that.setData({pageIndex,allLesson,loadMore,isLoadding,firstLoadding})
    }    
    classify_id = id;
    that.setData({ mask_title: title, move:'moveTop', isOpen: true, classify_id: classify_id })
    for(let i=0;i<hotClass.length;i++){
  		if(i!=(hotClass.length-1)&&hotClass[i].id==classify_id){
  			var currentClass=hotClass.splice(i,1);
  			console.log(hotClass)
      	console.log(currentClass)
  			hotClass.push(currentClass[0]);
  			that.setData({hotClass})   
  			break;
  		}
  	}
    wx.setNavigationBarTitle({
		  title: that.data.mask_title
		})
    that.loadMoreCourse()
  },

  //查询所有课程
  loadMoreCourse: function () {
    let that = this;
    let { loadMore,isLoadding,allLesson,classify_id,pageIndex,pageSize } = that.data;
    if (loadMore && !isLoadding) {
    	that.setData({ isLoadding: true })
    	app.exam.getAllCourse(classify_id, pageIndex, pageSize, function (res) {
	    	if(res.success){
	    		console.log(res)	    
			   	allLesson.totalCount=res.totalCount;
			   	allLesson.count=res.data.length+allLesson.count;
			   	allLesson.lessonList=allLesson.lessonList.concat(res.data);
			   	that.setData({isLoadding:false, firstLoadding:false,allLesson: allLesson})
			   	if(allLesson.count==allLesson.totalCount){
			   		that.setData({ loadMore: false })
			   	}else{
			   		pageIndex++;
			   		that.setData({ pageIndex: pageIndex })
			   	}
	    	}else{
	    		that.setData({ firstLoadding:false})
	    	}		    		    
		  })
    }    
  },

  //关闭详情
  moveBack: function () {
    let that = this;    
    that.setData({ isOpen: false,move:'moveBottom' })    
  },

  //进入课程
  toItem: function (event) {
    let that = this;        
    let { id } = event.currentTarget.dataset;
    var dbClick=that.data.dbClick;
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/item/item?id=${id}`,
    })
  },

  //切换热门
  tabClick: function (event) {
    let that = this;
    let { subject } = event.currentTarget.dataset;
    console.log(subject)
    that.setData({ mask_title: subject });
    wx.setNavigationBarTitle({
		  title: that.data.mask_title
		})
  },

  //scrolltolower
  scrolltolower: function () {
    let that = this;
    that.loadMoreCourse()
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
		that.data.dbClick=false;
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
   * 用户点击右上角分享pageTitle, pageImg, pagePath, cb
   */
  onShareAppMessage: function () {
		//classifyId=1&title=各地方言
		var that = this;
    var title ='';
    var pageImg='';
    let {classify_id,mask_title}=that.data;
    if(classify_id){
    	var path = `/pages/allclass/allclass?classify_id=${classify_id}&title=${mask_title}`;
    }else{
    	var path = `/pages/allclass/allclass`;
    }    
    return app.onShareAppMessage(title, pageImg,path);
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

  
})