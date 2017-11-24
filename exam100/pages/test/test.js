// pages/test/test.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	dbClick:false
  },


//去答题
  goAnswer_info:function(event){
    let that = this;
    let {answerInfo,paper_id,paperInfo,book_id,dbClick}=that.data
    let id=event.currentTarget.dataset.id;
    var answer_id=answerInfo.answer_id;
    var type=paperInfo.paper.answer_mode;
    if(dbClick){
    	return false;
    }
    that.data.dbClick=true;
    if (id == 'beginPaper') {//开始答题
    	//保存答题记录
    	app.exam.addAnswerRecord(paper_id,function(res){
    		if(res.success){
    			console.log("保存答题记录")
    			console.log(res)
    			answer_id=res.data.answer_id;
    			var question_id=res.data.last_submit_question_id;  
    			wx.redirectTo({
			      url: `/pages/answer_info/answer_info?paper_id=${paper_id}&answer_id=${answer_id}&question_id=${question_id}&type=${type}`,
			    })
    		}
    		
    	})
    }else if(id=='prePaper'){//继续上次答题 
    	var question_id=answerInfo.questions.question.question_id; 
    	wx.redirectTo({
	      url: `/pages/answer_info/answer_info?paper_id=${paper_id}&answer_id=${answer_id}&question_id=${question_id}&type=${type}`,
	    })
    }else if(id == 'newPaper' ){//重新答题
    	//先提交后保存答题记录
    	app.exam.submitAnswer(answer_id,function(res){
    		if(res.success){
    			//保存答题记录
		    	app.exam.addAnswerRecord(paper_id,function(res){
		    		if(res.success){
		    			console.log("保存答题记录")
		    			console.log(res)
		    			answer_id=res.data.answer_id;
		    			var question_id=res.data.last_submit_question_id;  
		    			wx.redirectTo({
					      url: `/pages/answer_info/answer_info?paper_id=${paper_id}&answer_id=${answer_id}&question_id=${question_id}&type=${type}`,
					    })
		    		}
		    		
		    	})
    		}
    		
    	})
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	var that=this;
  	var book_id=options.book_id
  	var paper_id=options.paper_id;
  	that.setData({book_id,paper_id})
  //课程的试卷列表
    app.exam.getPaperList(book_id, 1, 999, function (res) {
      console.log(res);
      var data=res.data;
      for(var i=0;i<data.length;i++){
      	if(paper_id==data[i].paper.id){
      		that.setData({ paperInfo: data[i] })
      		var paper_name=data[i].paper.paper_name;
      		wx.setNavigationBarTitle({
					  title: paper_name
					})
      		break;
      	}
      }
      
    })
    
    //判断是否有答题记录
    app.exam.getAnswerRecord(paper_id, function (res) {
    	console.log("是否有答题记录")
    	//answer_status 1 上次答题未完成继续答题 0.上次答题未完成已经超时和没有上次答题未完成情况
    	if(res.success){
    		that.setData({answerInfo:res.data})
    	}
      console.log(res);
      
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
    var title ='课程详情';
    var pageImg='';
    let {book_id}=that.data;
    var path = `/pages/item/item?id=${book_id}`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})