// pages/analysis/analysis.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	pageIndex:1,
  	pageSize:10,
  	loadMore:true,
  	isLoadding:false,
  	firstLoadding: false,
    dbClick:false,
  	paperList:{
  		totalCount:-1,
  		count:0,
  		list:[]
  	},//试卷列表
    test_list: [
      { src: '../images/dog.jpg', title: '武汉方言一级测验', num: 1280, grade: 98 },
      { src: '../images/dog.jpg', title: '武汉方言一级测验', num: 1280, grade: 98 },
      { src: '../images/dog.jpg', title: '武汉方言一级测验', num: 1280, grade: 98 },
      { src: '../images/dog.jpg', title: '武汉方言一级测验', num: 1280, grade: 98 },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	var that=this;
  	that.setData({ firstLoadding: true })
  	that.loadMore();
  },
	loadMore: function () {
    var that = this;
    let { pageIndex, pageSize, loadMore, isLoadding } = that.data
    if (loadMore && !isLoadding) {
      that.setData({ isLoadding: true })
      app.exam.getWrongTopic(pageIndex, pageSize, function (res) {
      	if(res.success){
	        let { paperList } = that.data
	        paperList.list = paperList.list.concat(res.data);
	        paperList.totalCount = res.totalCount;
	        paperList.count = paperList.count + res.data.length;
	        that.setData({ isLoadding: false, firstLoadding: false, paperList })
	        if (paperList.count == paperList.totalCount) {//数据已经取完
	          that.setData({ loadMore: false })
	        } else {
	          pageIndex++;
	          that.setData({ pageIndex: pageIndex })
	        }
      	}
      })
    }
  },
  toTest: function (event) {
    let that = this;
    let {id,type}=event.currentTarget.dataset;
    let {dbClick}=that.data;
    if(dbClick){
    	return;
    }
    that.data.dbClick=true;
    wx.navigateTo({
      url: `/pages/answer_info/answer_info?showTip=allTip&answer_id=${id}&question_id=0&type=${type}`,
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
  that.data.dbClick=false;
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
    var title ='';
    var pageImg='';
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})