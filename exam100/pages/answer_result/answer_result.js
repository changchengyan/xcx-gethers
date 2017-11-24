var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,//试卷类型 0 表示练习 1表示试卷
    more:false,//是否展开题卡
    successCount:0,//正确题数
    errorCount:0,//错误题数
    resultInfo:{},    
    dbClick:false,
    headimgurl:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if (options.type){
      that.setData({ type:options.type}) 
    }
    that.setData({ book_id:options.book_id,paper_id:options.paper_id}) 
    //更新头像
    app.upDateUserInfo(function(){
    	var headimgurl=app.globalData.userInfo.weixinUser.headimgurl;
    	if(headimgurl){
    		that.setData({headimgurl})
    	}else{//默认头像
    		headimgurl="../images/unRegister.png";
    		that.setData({headimgurl})
    	}
    	
    })
    
    if(options.answer_id){
    	that.setData({ answer_id:options.answer_id}) 
    	app.exam.getAnswerReport(options.answer_id,function(res){
    		if(res.success){
    			console.log(res)
    			var resultInfo=res.data;
    			var answer_sheet=res.data.answer_sheet;
    			//题卡
    			let{successCount,errorCount}=that.data;
    			for(let i=0;i<answer_sheet.length;i++){
    				if(answer_sheet[i].mark_right==1){//正确
    					answer_sheet[i].type="success"
    					successCount++;
    				}else{//错误
    					answer_sheet[i].type="error"
    					errorCount++;
    				}
    			}   			
    			that.setData({resultInfo:resultInfo,successCount,errorCount})
    		}
    		
    	})
    }
    //课程的试卷列表
    let {book_id,paper_id}=that.data;
    app.exam.getPaperList(book_id, 1, 999, function (res) {
      console.log(res);
      var paperList=res.data;
      for(let i=0;i<paperList.length;i++){
      	if(paper_id==paperList[i].paper.id){
      		paperList.splice(i,1);
      		break;
      	}
      }
     
      that.setData({ paperList})
    })
    
  },
  //展开更多
  cardMore:function(){
    var that=this;
    var more=that.data.more;
    that.setData({more:!more})
  },
  //挑战其他试卷
  toTest: function (event) {
    let that = this;   
    var paper_id=event.currentTarget.dataset.id;
    let{dbClick,book_id}=that.data;
    if(dbClick){
    	return false;
    }
    console.log(event)
    that.data.dbClick=true;
    wx.redirectTo({
      url: `/pages/test/test?book_id=${book_id}&paper_id=${paper_id}`,
    })
  },
  //跳转解析页面
  toAnalysis:function(event){
    var that = this;
    var id = event.currentTarget.id
    let{dbClick,book_id,paper_id,answer_id,type}=that.data;
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    //showTip: '',//显示解析类型：'' 不显示解析 'errorTip'错题解析 'allTip' 全部解析        
    if (id == "allAnalysis"){
      var url = `/pages/answer_info/answer_info?paper_id=${paper_id}&showTip=allTip&answer_id=${answer_id}&question_id=0&type=${type}`
    } else if (id == "errorAnalysis"){    	
      var url = `/pages/answer_info/answer_info?paper_id=${paper_id}&showTip=errorTip&answer_id=${answer_id}&question_id=0&type=${type}`      
    }  
    wx.redirectTo({
      url: url
    })
    console.log(event)

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
    var title ='课程详情';
    var pageImg='';
    let {book_id}=that.data;
    var path = `/pages/item/item?id=${book_id}`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})