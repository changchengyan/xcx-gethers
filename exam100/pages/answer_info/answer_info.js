
//index.js
//获取应用实例
var app = getApp();
var timer=null;
var urls=[];//预览图片的链接
Page({
  data: {
  	videoShow:true,
  	isError:false,//是错题解析 用于切换错题解析与全题解析时 有没有点题卡里的选项
  	errorCount:0,//解析时计算错题量
  	paper_name:'',//本套试卷名称
  	isLoadding:false,//加载数据
  	currentPlayId:'',
  	isPlaying:false,
  	book_id:0,//课程id 
  	timelong:0,
  	isOver:false,//答题时间是否结束
  	question_id:1,//仅仅是链接里带过来的question_id值
  	answer_id:0,
  	currentIndex:0,//当前是第几题
    showTip: '',//显示解析类型：'' 不显示解析 'errorTip'错题解析 'allTip' 全部解析
    tip:0,//0 表示普通答题 1表示限时答题
    noPre:false,//是否上一道
    noNext:false,//是否下一道
    submitInfo:{
      showSubmitBox:false,
      count:0,//多少题未答
    },
    showCard:false,//是否显示答题卡
    optionTips:["A","B","C","D","E","F","G","H","I","J","K"],
    answerCard:[],//answerStatus: 'none',//这道题答题状态  done doing success error none
    currentQuestion:[],//表示从接口获取到的试题（有可能不是当前的）
    allList: [],  
    //media_type 4为试题里的音频 视频 图片 纯文本
    //选项里的status: '',//error success active ''
    //选项里的isChecked:true,//有没有选这一项
    //选项里的type1表示纯文本 2表示有图片 3表示有视频 4表示有音频
  },
  onLoad:function(options) {
  	var that=this;
    if (options.showTip){
      that.setData({ showTip: options.showTip})
      if(options.showTip=='errorTip'){
      	that.setData({isError:true})
      }
    }
    if(options.type){
    	that.setData({ type: options.type})
    }
    that.setData({paper_id:options.paper_id,answer_id:options.answer_id,question_id:options.question_id})
    let {showTip,type}=that.data;
    if(showTip=='errorTip'){//错题解析时
    	that.getErrorQuestion(0);
    }else if(showTip=='allTip'){//全题解析时
    	that.getAllQuestion(0);
    }else{//答题时
    	if(type==0){//普通答题
    		that.getQuestion(that.data.question_id)
    	}else{//限时答题
    		//获取试题
		    that.getQuestion(that.data.question_id,function(){
		    	//第一次获取试题后开始计时
		    	var time=that.data.timelong;//秒
		    	var hour = Math.floor(time / 3600);
		      var min = Math.floor((time - hour * 3600) / 60);
		      var sec = time % 60;
		      var mockAnswerTime = that.fill_zero(hour) + ":" + that.fill_zero(min) + ":" + that.fill_zero(sec);
		      that.setData({ mockAnswerTime: mockAnswerTime })
		    	if(that.timer){
			    	clearInterval(that.timer);
			    }
			    that.timer = setInterval(function () {
			      time--;
			      hour = Math.floor(time / 3600);
			      min = Math.floor((time - hour * 3600) / 60);
			      sec = time % 60;
			      var mockAnswerTime = that.fill_zero(hour) + ":" + that.fill_zero(min) + ":" + that.fill_zero(sec);
			      that.setData({ mockAnswerTime: mockAnswerTime })
			      if (time <= 0) {
			      	that.setData({ isOver: true });	          
		      		clearInterval(that.timer);
		      		var mockAnswerTime = '00' + ":" + '00' + ":" + '00';
		      		that.setData({ mockAnswerTime: mockAnswerTime })
			      	//判断网络
			      	that.hasNetWork(function(){
			      		//答题时间已结束，请去交卷
				          wx.showToast({
								  title: '答题时间已结束',
								  icon: 'success',
								  duration: 2000,
								  success:function(){
								  		//时间到提交试卷
								  		that.submitExam();							  			  									  								  	
									  }
									})				          
			      	})									      
			    	}      
			    }, 1000)
		    	
		    });
    	}
    }        
    //获取答题卡
    let {submitInfo,errorCount}=that.data;
    app.exam.getAnswerSheet(that.data.answer_id,function(res){
    	console.log("获取答题卡")
    	if(res.success){
    		var answerCard=res.data;
    		if(that.data.showTip){//显示解析
    			for(let i=0;i<answerCard.length;i++){
	    			if(answerCard[i].answer_detail.user_content&&answerCard[i].answer_detail.user_content!='null'){
	    				if(answerCard[i].answer_detail.mark_right){//0表示错误 1表示正确
	    					answerCard[i].answerStatus="success"
	    					
	    				}else{
	    					answerCard[i].answerStatus="error"
	    					errorCount++;
	    				}	    				
	    			}else{
	    				errorCount++;
	    				answerCard[i].answerStatus="none"
	    			}
	    		}
    			that.setData({answerCard:answerCard,errorCount})
    		}else{//不显示解析
    			for(let i=0;i<answerCard.length;i++){
	    			if(answerCard[i].answer_detail.user_content&&answerCard[i].answer_detail.user_content!='null'){	    				
	    				answerCard[i].answerStatus="done"			
	    			}else{
	    				answerCard[i].answerStatus="none"	
	    				submitInfo.count++;
	    			}
	    		}
    			that.setData({answerCard:answerCard,submitInfo:submitInfo})
    		}    		
    	}
    })    
    
  },
  //获取试题
  getQuestion:function(question_id,cb){
  	var that=this;
  	let{allList,currentIndex,answer_id,paper_name}=that.data;
  	that.setData({isLoadding:true})
  	app.exam.getQuestions(answer_id,question_id,function(res){    	
    	if(res.success){
    		console.log("获取试题")
    		console.log(res)
    		that.setData({isLoadding:false})
    		var num=res.data.question_num;
    		currentIndex=num-1;
    		that.setData({currentIndex,currentQuestion:res.data})
    		//设置导航条标题
    		if(!paper_name){
    			var title=res.data.paper_name;
						wx.setNavigationBarTitle({
						  title: title
						})
				}
    		//设置book_id
    		if(!book_id){
    			var book_id=res.data.course_id;
					that.setData({book_id:book_id})
				}
    		if(!allList[currentIndex]){//新的数据
    			allList[currentIndex]=res.data;
    			//选项里的ABCD处理
    			that.changeOptions(allList[currentIndex])
    			//解析 音频时间处理
					that.parseQuestion(allList[currentIndex]) 					
    			//获取数据后的处理  --有可能之前做过
		      if (that.data.showTip){//显示解析
		      	if(allList[currentIndex].question.resolution.imglist.length>0){
		      		urls.push(allList[currentIndex].question.resolution.imglist[0])
		    			wx.previewImage({
							  current: '', // 当前显示图片的http链接
							  urls: urls // 需要预览的图片http链接列表
							})
		      	}
		        that.whichSelectAnalysis(allList[currentIndex]);
		      }else{//不显示解析
		        that.whichSelect(allList[currentIndex]);
		      }
		      var timelong=res.data.total_time-res.data.cost_time;
		      that.setData({ allList: that.data.allList,timelong:timelong,currentIndex:currentIndex})
    		}
		    if(cb){
		    	cb();
		    }
    	}    	
    })
  },
  //获取错题
  getErrorQuestion:function(question_id,cb){
  	var that=this;
  	let{allList,currentIndex,answer_id,paper_name}=that.data;
  	that.setData({isLoadding:true})
  	app.exam.getResolution(answer_id,question_id,1,function(res){
  		that.setData({isLoadding:false})
  		var currentQuestion=res.data;
    	var num=res.data.question_num;
    		currentIndex=num-1;   		
    		var last_question_id=currentQuestion.last_question_id;//上一题的question_id
    		var next_question_id=currentQuestion.next_question_id;//下一题的question_id
    		var id=currentQuestion.question.question_id;//新获取题目的 question_id
		    if (last_question_id == id) {
		    	that.setData({noPre:true})
		    }else{
		    	that.setData({noPre:false})
		    }
		    if (next_question_id == id) {
		    	that.setData({noNext:true})
		    }else{
		    	that.setData({noNext:false})
		    }
		    that.setData({currentIndex,currentQuestion})
		    //设置导航条标题
    		if(!paper_name){
    			var title=res.data.paper_name;
						wx.setNavigationBarTitle({
						  title: title
						})
				}
    		//设置book_id
    		if(!book_id){
    			var book_id=res.data.course_id;
					that.setData({book_id:book_id})
				}
    		if(!allList[currentIndex]){//新的数据
    			allList[currentIndex]=res.data;
    			//选项里的ABCD处理
    			that.changeOptions(allList[currentIndex])
    			//解析 音频时间处理
					that.parseQuestion(allList[currentIndex])
    			//获取数据后的处理  --有可能之前做过
		      if (that.data.showTip){//显示解析
		        that.whichSelectAnalysis(allList[currentIndex]);
		      }else{//不显示解析
		        that.whichSelect(allList[currentIndex]);
		      }
		      var timelong=res.data.total_time-res.data.cost_time;
		      that.setData({ allList: that.data.allList,timelong:timelong,currentIndex:currentIndex})
    		}
		    if(cb){
		    	cb();
		    }
    })
  },
  //获取全题解析
  getAllQuestion:function(question_id,cb){
  	var that=this;
  	let{allList,currentIndex,answer_id,paper_name}=that.data;
  	that.setData({isLoadding:true})
  	app.exam.getResolution(answer_id,question_id,0,function(res){
  		that.setData({isLoadding:false})
  		var currentQuestion=res.data;
			var num=res.data.question_num;
			currentIndex=num-1;
			var last_question_id=currentQuestion.last_question_id;//上一题的question_id
			var next_question_id=currentQuestion.next_question_id;//下一题的question_id
			var id=currentQuestion.question.question_id;//新获取题目的 question_id
		    if (last_question_id == id) {
		    	that.setData({noPre:true})
		    }else{
		    	that.setData({noPre:false})
		    }
		    if (next_question_id == id) {
		    	that.setData({noNext:true})
		    }else{
		    	that.setData({noNext:false})
		    }
			that.setData({currentIndex,currentQuestion})
			//设置导航条标题
			if(!paper_name){
				var title=res.data.paper_name;
						wx.setNavigationBarTitle({
						  title: title
						})
				}
			//设置book_id
			if(!book_id){
				var book_id=res.data.course_id;
					that.setData({book_id:book_id})
				}
			if(!allList[currentIndex]){//新的数据
				allList[currentIndex]=res.data;
				//选项里的ABCD处理
				that.changeOptions(allList[currentIndex])
				//解析 音频时间处理
				that.parseQuestion(allList[currentIndex])
				
				//获取数据后的处理  --有可能之前做过
		      if (that.data.showTip){//显示解析
		        that.whichSelectAnalysis(allList[currentIndex]);
		      }else{//不显示解析
		        that.whichSelect(allList[currentIndex]);
		      }
		      var timelong=res.data.total_time-res.data.cost_time;
		      that.setData({ allList: that.data.allList,timelong:timelong,currentIndex:currentIndex})
			}
		    if(cb){
		    	cb();
		    }
    })
  },
  //解析富文本 标题解析里音频时间处理
  parseQuestion:function(answerList){
  	var that=this;
  	//富文本
  	var question_title=answerList.question.question_title;
		var resolution=answerList.question.resolution;
		answerList.question.question_title=JSON.parse(question_title)
		answerList.question.resolution=JSON.parse(resolution)
		answerList.question.question_title.nodeList=[];
		answerList.question.resolution.nodeList=[];
		var infolist=answerList.question.question_title.infolist;
		var resolution=answerList.question.resolution.infolist;
		for(let i=0;i<infolist.length;i++){
			answerList.question.question_title.nodeList[i]=[];
			answerList.question.question_title.nodeList[i][0]={};
			var attrStyle={style:''};
			attrStyle.style=infolist[i].style;
			answerList.question.question_title.nodeList[i][0].name='span';
			answerList.question.question_title.nodeList[i][0].attrs=attrStyle;
			answerList.question.question_title.nodeList[i][0].children=[];
			answerList.question.question_title.nodeList[i][0].children[0]={};
			answerList.question.question_title.nodeList[i][0].children[0].type='text';
			answerList.question.question_title.nodeList[i][0].children[0].text=infolist[i].value;			
		}
		for(let i=0;i<resolution.length;i++){
			answerList.question.resolution.nodeList[i]=[];
			answerList.question.resolution.nodeList[i][0]={};
			var attrStyle={style:''};
			attrStyle.style=resolution[i].style;
			answerList.question.resolution.nodeList[i][0].name='span';
			answerList.question.resolution.nodeList[i][0].attrs=attrStyle;
			answerList.question.resolution.nodeList[i][0].children=[];
			answerList.question.resolution.nodeList[i][0].children[0]={};
			answerList.question.resolution.nodeList[i][0].children[0].type='text';
			answerList.question.resolution.nodeList[i][0].children[0].text=resolution[i].value;			
		}
		
		//音频时间
		if(answerList.question.question_title.audiolist.length>0){//标题里只算分钟秒			
			answerList.audioImg[0]="/pages/images/audioIcon.png";
			var time=answerList.question.question_title.audiolist[0].timelength;
      var min = Math.floor(time / 60);
      var sec = time % 60;
	  	if(min!=0){
	  		var mockAnswerTime = that.fill_zero(min) + "'" + that.fill_zero(sec)+'"';
	  	}else{
	  		var mockAnswerTime = that.fill_zero(sec)+'"';		      				      				      		
	  	}		      	
	  	answerList.question.question_title.audiolist[0].timelength=mockAnswerTime;			
		}
		if(answerList.question.resolution.audiolist.length>0){//解析里只算分钟秒
			answerList.audioImg[answerList.audioImg.length]="/pages/images/audioIcon.png";
			var time=answerList.question.resolution.audiolist[0].timelength;
      var min = Math.floor(time / 60);
      var sec = time % 60;
	  	if(min!=0){
	  		var mockAnswerTime = that.fill_zero(min) + "'" + that.fill_zero(sec)+'"';
	  	}else{
	  		var mockAnswerTime = that.fill_zero(sec)+'"';		      				      				      		
	  	}		      	
	  	answerList.question.resolution.audiolist[0].timelength=mockAnswerTime;					
		}
		
  },
  //选项里的ABCD处理 以及选项里音频时间的处理
  changeOptions:function(answerList){
  	var that=this;
  	var options = answerList.question.list_item;
  	answerList.audioImg=[];
  	var items=["item1","item2","item3","item4","item5","item6","item7","item8"];
  	var optionTips=that.data.optionTips;
  	for(let i = 0; i < options.length;i++){
  		if(options[i].sound_path&&options[i].sound_path!='null'){//有音频	
				answerList.audioImg[i+1]="/pages/images/audioIcon.png";
				var time=options[i].sound_timelen;
	  		var min = Math.floor(time / 60);
	      var sec = time % 60;
	      if(min!=0){
		  		var mockAnswerTime = that.fill_zero(min) + "'" + that.fill_zero(sec)+'"';
		  	}else{
		  		var mockAnswerTime = that.fill_zero(sec)+'"';		      				      				      		
		  	}		      	
		  	options[i].sound_timelen=mockAnswerTime;
	  	}
  		
  		for(let j=0;j<items.length;j++){
  			if(options[i].item==items[j]){
  				options[i].tip=optionTips[j]
  			}
  		}  		
  	}
  },
  //不显示解析情况下：取到数据要 判断用户是否答过，选过哪一项
  whichSelect:function(answerList){
    var that=this;
    var user_content = answerList.user_content;
    var options = answerList.question.list_item;
    if (user_content&&user_content!="null") {//用户做过的题
      //answerList.answerStatus = 'done' 
      //匹配用户的选项
      user_content = user_content.split(",");
      for (let i = 0; i < options.length;i++){
        options[i].isChecked = false;
        options[i].status = "";
        for (let j = 0; j < user_content.length; j++){
          if (user_content[j] == options[i].item){
            options[i].isChecked=true;
            options[i].status="active";
          }
        }
      }
      console.log(user_content)
    } else {
    	answerList.user_content="";
      //answerList.answerStatus = 'none';      
      for (let i = 0; i < options.length; i++) {
        options[i].isChecked = false;
        options[i].status = "";
      }
    }
    
  },
  //显示解析情况下：取到数据要 判断用户是否答过，选过哪一项
  whichSelectAnalysis:function(answerList){
    var that = this;
    var user_content = answerList.user_content;
    var options = answerList.question.list_item;
    if (user_content&&user_content!="null") {//用户做过的题     
      //answerList.answerStatus = 'success'
      //匹配用户的选项
      user_content = user_content.split(",");
      for (let i = 0; i < options.length; i++) {
        options[i].isChecked = false;
        options[i].status = "";
        for (let j = 0; j < user_content.length; j++) {
          if (user_content[j] == options[i].item) {
            options[i].isChecked = true;
            if (options[i].correct=='false'){//错误答案
              options[i].status = "error";
              //answerList.answerStatus = 'error'
            } else if (options[i].correct=='true') {//正确答案
              options[i].status = "success";
            }
          }else{
          	if(options[i].correct=='true'){
          		options[i].status = "success";
          	}
          }
        }
      }
      console.log(user_content)
    } else {
      //answerList.answerStatus = 'none'
      for (let i = 0; i < options.length; i++) {
        options[i].isChecked = false;
        options[i].status = "";
        if (options[i].correct=='true') {//正确答案
          options[i].status = "success";
        }
      }      
    }
  },
  //点击选项
  selectOpt:function(event){
    var that=this;
    if (that.data.showTip||that.data.isOver){//要显示解析
      return false;
    }
    var answerList = that.data.allList[that.data.currentIndex];
    var index=event.currentTarget.dataset.index;//选了第几个
    if (answerList.question.question_type=="单选题"||answerList.question.question_type=="判断题"){
      that.tapRadio(index);
    } else if (answerList.question.question_type == "多选题"){
      that.tapCheckbox(index);
    }
    console.log(event)
  },
  //单选逻辑
  tapRadio:function(index){
    var that=this;
    let {submitInfo,currentIndex,answerCard}=that.data;
    var answerList=that.data.allList[currentIndex];
    var options = that.data.allList[currentIndex].question.list_item;    
    if (options[index].isChecked){//选过了
      //answerList.answerStatus = 'none'
      answerCard[currentIndex].answerStatus = 'none'
      options[index].isChecked=false; 
      options[index].status = '';     
      answerList.user_content="";
      submitInfo.count++;
    }else{
      //answerList.answerStatus = 'done'
      if(answerCard[currentIndex].answerStatus == 'done'){
      	
      }else{
      	answerCard[currentIndex].answerStatus = 'done'
      	submitInfo.count--;
      }           
      for (var i = 0; i < options.length;i++){
        options[i].isChecked = false; 
        options[i].status = '';
      }
      options[index].isChecked = true; 
      options[index].status = 'active';
      answerList.user_content=options[index].item;
    }
    that.setData({ allList: that.data.allList,answerCard:answerCard,submitInfo:submitInfo})
  },
  //多选逻辑
  tapCheckbox:function(index){
    var that=this;
    let {submitInfo,currentIndex,answerCard}=that.data;
    var answerList = that.data.allList[currentIndex];
    var options = that.data.allList[currentIndex].question.list_item;
    if (options[index].isChecked) {//选过了
      options[index].isChecked = false;
      options[index].status = '';
      //answerList.answerStatus = 'none'
      answerCard[currentIndex].answerStatus = 'none'
      submitInfo.count++;
      answerList.user_content=""
      for(let i = 0; i < options.length; i++){
      	if (options[i].isChecked){
      		answerCard[currentIndex].answerStatus = 'done'
          submitInfo.count--;
          break;
      	}
      }
      for (let i = 0; i < options.length; i++){
        if (options[i].isChecked){
          answerList.user_content+=options[i].item;
        }
      }
    } else {
      options[index].isChecked = true;
      options[index].status = 'active';
      //answerList.answerStatus = 'done'
      if(answerCard[currentIndex].answerStatus == 'done'){
      	
      }else{
      	submitInfo.count--;
      	answerCard[currentIndex].answerStatus = 'done'
      }
           
      answerList.user_content=""
      for (var i = 0; i < options.length; i++){
        if (options[i].isChecked){
          answerList.user_content+=options[i].item;
        }
      }
    }
    that.setData({ allList: that.data.allList,answerCard:answerCard,submitInfo:submitInfo })
  },
  //上一道题
  preAnswer:function(){
    var that = this;
    let {answerCard,showTip,currentIndex,allList,currentQuestion,noPre}=that.data;
    var last_question_id=currentQuestion.last_question_id;//上一题的question_id 第一题的last_question_id 也为1
    var id=currentQuestion.question.question_id;//当前题目的 question_id
    if (currentIndex==0||noPre) {
    	that.setData({noPre:true})
      wx.showToast({
        title: '已经是第一题了',
        duration: 2000
      })
      return;
    } else{
    	that.setData({noPre:false})
    	that.setData({noNext:false})
    	for(let i=0;i<allList[currentIndex].audioImg.length;i++){
	  		allList[currentIndex].audioImg[i]="/pages/images/audioIcon.png"
	  	}
    	that.setData({allList})
    	//获取试题
			if(showTip=='errorTip'){//错题解析时 --必须要去取数据
				that.getErrorQuestion(last_question_id);  	
	    }else if(showTip=='allTip'){//全题解析时  --如果由错题解析切换过来last_question_id不是上一题的question_id	  
	    	currentIndex--;    
	      if (allList[currentIndex]){//有数据
	        that.setData({ currentIndex: currentIndex });
	      }else{//没有数据 去取数据
	      	that.setData({ currentIndex: currentIndex });	
	      	for(let i=0;i<answerCard.length;i++){
	    			if(answerCard[i].answer_detail.questions_id==id){
	    				last_question_id=answerCard[i].last_question_id;
	    				that.getAllQuestion(last_question_id);
	    				break;
	    			}
	    		}
	      }	    	
	    }else{//答题时
	    	that.answerQuestion(function(){	    		
	    		currentIndex--;
		      if (allList[currentIndex]) {//有数据
		        that.setData({ currentIndex: currentIndex });
		      } else {//没有数据 去取数据
						that.setData({ currentIndex: currentIndex });
						that.getQuestion(last_question_id);
	    			
		      }
	    	});
	    }    	      
    }
  },
  //下一道题
  nextAnswer:function(){
    var that=this;
    let {showTip,currentIndex,allList,answerCard,currentQuestion}=that.data;
    var next_question_id=currentQuestion.next_question_id;  
    var id=currentQuestion.question.question_id;//当前题目的 question_id
    if (currentIndex==(answerCard.length-1)){
    	that.setData({noNext:true})
      wx.showToast({
        title: '已经是最后一题了',
        duration: 2000
      })
      return;
    }else{ 
    	that.setData({noNext:false})
    	that.setData({noPre:false})
    	for(let i=0;i<allList[currentIndex].audioImg.length;i++){
	  		allList[currentIndex].audioImg[i]="/pages/images/audioIcon.png"
	  	}
    	that.setData({allList})
    	//获取试题
			if(showTip=='errorTip'){//错题解析时 --必须要去取数据
				that.getErrorQuestion(next_question_id);
	    }else if(showTip=='allTip'){//全题解析时  --如果由错题解析切换过来last_question_id不是上一题的question_id	  
	      currentIndex++;    
	      if (allList[currentIndex]){//有数据
	        that.setData({ currentIndex: currentIndex });
	      }else{//没有数据 去取数据
	      	that.setData({ currentIndex: currentIndex });	
	      	for(let i=0;i<answerCard.length;i++){
	    			if(answerCard[i].answer_detail.questions_id==id){
	    				next_question_id=answerCard[i].next_question_id;
	    				that.getAllQuestion(next_question_id);
	    				break;
	    			}
	    		}
	      }
	    }else{//答题时
	    	that.answerQuestion(function(){	 
	    		currentIndex++;    
		      if (allList[currentIndex]){//有数据
		        that.setData({ currentIndex: currentIndex });
		      }else{//没有数据 去取数据
		      	that.setData({ currentIndex: currentIndex });		      	
		      	//获取试题
	    			that.getQuestion(next_question_id);		
		      }
	    	});
	    }
    	
    }
  },
  //图片预览
  preview:function(event){
  	var src=event.currentTarget.dataset.src;
  	urls=[];
  	urls.push(src);
  	wx.previewImage({
		  current: src, // 当前显示图片的http链接
		  urls: urls // 需要预览的图片http链接列表
		})
  },
  //音频播放
  audioClick:function(event){
  	var that=this;
  	let {isPlaying,currentPlayId,allList,currentIndex}=that.data;
  	console.log("点击音频")
  	console.log(event)
  	var id=event.target.id;
  	var type=event.currentTarget.dataset.type;
  	var answerList=allList[currentIndex];
  	if(id==currentPlayId){//点了自己
  		if(!isPlaying){
	  		that.audioCtx.play();
	  		if(type=='title'){
	  			answerList.audioImg[0]='/pages/images/audioIcon.gif';
	  		}else if(type=='analysis'){
	  			answerList.audioImg[answerList.audioImg.length-1]='/pages/images/audioIcon.gif';
	  		}else{//选项里
	  			var arr=type.split("-");
	  			var index=Number(arr[1]);
	  			answerList.audioImg[index+1]='/pages/images/audioIcon.gif';
	  		}
	  		that.setData({allList})
	  	}else{
	  		that.audioCtx.pause()
	  		if(type=='title'){
	  			answerList.audioImg[0]='/pages/images/audioIcon.png';
	  		}else if(type=='analysis'){
	  			answerList.audioImg[answerList.audioImg.length-1]='/pages/images/audioIcon.png';
	  		}else{//选项里
	  			var arr=type.split("-");
	  			var index=Number(arr[1]);
	  			answerList.audioImg[index+1]='/pages/images/audioIcon.png';
	  		}
	  		that.setData({allList})
	  	}
  	}else{//点了另外一个音频
  		that.setData({currentPlayId:id})
  		if(!isPlaying){//没有音频在播放
	  		that.audioCtx = wx.createAudioContext(id);
	  		that.audioCtx.play();
	  		if(type=='title'){
	  			answerList.audioImg[0]='/pages/images/audioIcon.gif';
	  		}else if(type=='analysis'){
	  			answerList.audioImg[answerList.audioImg.length-1]='/pages/images/audioIcon.gif';
	  		}else{//选项里
	  			var arr=type.split("-");
	  			var index=Number(arr[1]);
	  			answerList.audioImg[index+1]='/pages/images/audioIcon.gif';
	  		}
	  		that.setData({allList})
	  	}else{//有音频在播放
	  		that.audioCtx = wx.createAudioContext(currentPlayId);
	  		that.audioCtx.pause()
	  		that.audioCtx = wx.createAudioContext(id);
	  		that.audioCtx.play();
	  		for(let i=0;i<answerList.audioImg.length;i++){
	  			answerList.audioImg[i]="/pages/images/audioIcon.png"
	  			if(type=='title'){
		  			answerList.audioImg[0]='/pages/images/audioIcon.gif';
		  		}else if(type=='analysis'){
		  			answerList.audioImg[answerList.audioImg.length-1]='/pages/images/audioIcon.gif';
		  		}else{//选项里
		  			var arr=type.split("-");
		  			var index=Number(arr[1]);
		  			answerList.audioImg[index+1]='/pages/images/audioIcon.gif';
		  		}
		  		that.setData({allList})
	  		}
	  		
	  	}
  	}  	
  },
  //监听音频播放
  audioPlay:function(){
  	var that=this;
  	console.log("音频播放")
		that.setData({isPlaying:true})  	
  },
  //监听音乐播放进度
  audioTime:function(event){
  	var that=this;
  	console.log("播放进度")
  	console.log(event)
  	var currentTime=event.detail.currentTime;
  },
  //监听暂停播放
  audioPause: function () {
  	var that=this;
  	console.log("音频暂停")
  	that.setData({isPlaying:false})
  },
  //每答完一道题需要保存答案
  answerQuestion:function(cb){
  	var that=this;
  	let {answer_id,allList,currentIndex}=that.data
  	var question_id=allList[currentIndex].question.question_id;
  	var user_content=allList[currentIndex].user_content;
  	app.exam.answerQuestion(answer_id,question_id,user_content,function(res){
  		console.log("保存答案")
  		console.log(res)
  		if(res.success){
  			if(cb){
  				cb();
  			}
  		}
  	})
  },
  //切换全题解析 错题解析
  changeAnalysis:function(event){
    var that=this;
    var id = event.currentTarget.id
    let {currentIndex,noPre,noNext,answerCard}=that.data;
    if (id == "allAnalysis") {//错题解析
      that.setData({showTip:'errorTip'})
      that.setData({ showCard: 'up' })
      that.setData({isError:false})
    } else if (id == "errorAnalysis") {//全题解析
      that.setData({ showTip: 'allTip' })
      that.setData({isError:false})
      if(currentIndex!=0&&noPre){
      	that.setData({noPre:false})    		
      }else if(currentIndex!=(answerCard.length-1)&&noNext){
      	that.setData({noNext:false})
      }
    }  
  },
  //显示答题卡
  showCard:function(){
    var that = this;
    that.setData({ showCard: 'up',videoShow:false })
  },
  //隐藏答题卡
  closeCard:function(){//1.全题解析时正常  2.只看错题时弹出答题卡 如果点击了答题卡选项 显示全题解析 如果没有 显示的是只看错题
    var that=this;
    let{isError,showTip}=that.data;
    if(showTip=="errorTip"){
    	if(isError){//是错题解析
	    	that.setData({showTip:'errorTip'})
	    }else{//还是全题解析
	    	that.setData({showTip:'allTip'})
	    }
    }
    that.setData({showCard:'down',videoShow:true})
  },
  //答题卡里题目跳转
  toQuestion:function(event){
  	var that=this;
  	let{id,index}=event.currentTarget.dataset;
  	let {showTip,currentIndex,allList}=that.data;
  	that.setData({showCard:'down',videoShow:true})
  	if(showTip=='errorTip'){//错题解析时--必须要重新去取数据
  		that.setData({isError:true})
      that.getErrorQuestion(id);   	
	  }else if(showTip=='allTip'){//全题解析时
	  	if(allList[index]){//有
	  		currentIndex=index;
	  		that.setData({currentIndex})
	  	}else{
	  		that.getAllQuestion(id);   
	  	}	    	
	  }else{//答题时  	
	  	if(allList[index]){
	  		currentIndex=index;
	  		that.setData({currentIndex})
	  	}else{
	  		that.getQuestion(id);
	  	}  		
  	}  	
  	console.log(id)
  },
  //交卷--弹出弹框
  showSubmitBox:function(){
    var that=this;
    var submitInfo = that.data.submitInfo;    
    //保存答案 --要先保存答案
    that.answerQuestion(function(){
    	submitInfo.showSubmitBox = true;  
    	that.setData({submitInfo:submitInfo,videoShow:false})
    });
  },
  //关闭交卷弹框
  closeSubmitBox:function(){
    var that = this;
    let {submitInfo}=that.data;
    submitInfo.showSubmitBox = false;     
    that.setData({ submitInfo: submitInfo,videoShow:true })
  },
  //确定交卷
  submitExam:function(){
    var that=this;
    let{answer_id,type,book_id,paper_id}=that.data;
    app.exam.submitAnswer(answer_id,function(res){
    	if(res.success){
    		console.log("交卷");
    		console.log(res);
    		//type 0 表示练习 1 表示试卷
		    var url =`/pages/answer_result/answer_result?book_id=${book_id}&paper_id=${paper_id}&answer_id=${answer_id}&type=${type}`
		    wx.redirectTo({
		      url: url
		    })
    	}   	
    })
    
  },
  fill_zero:function(num) {
  	return num < 10 ? "0" + num : num
	},
	hasNetWork:function(callback,failCallback){
		//判断网络
  	wx.getNetworkType({
	    success: function(res){
	      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
	      var networkType = res.networkType;
	      if(networkType=="none"){      	
	        wx.showToast({
					  title: '网络异常',
					  duration: 2000
					});  
					if(failCallback){
						failCallback();
					}
	      }else{
	      	if(callback){
	      		callback();
	      	}
	      }
	     }
    });
	},
  onUnload(){//页面卸载
		console.log(1)
		var that=this;
		if(that.timer){
			clearInterval(that.timer)
		}
		//保存答案
		that.answerQuestion();
  },
  onHide(){
  	console.log(2)
  	var that=this;
  	//保存答案
		that.answerQuestion();
  },
  onShareAppMessage: function () {
  	var that = this;
    var title ='课程详情';
    var pageImg='';
    let {book_id}=that.data;
    var path = `/pages/item/item?id=${book_id}`;
    return app.onShareAppMessage(title, pageImg,path);
  }
});