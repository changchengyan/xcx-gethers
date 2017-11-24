// pages/sound/sound.js
var template = require("../../utils/template.js");
var app = getApp();
Page({
  data: {
    bookInfo:{},//书籍名称等信息
    platform_book_id:"",
    showSelf: [{ name: "目录", ifshow: 'yes' }, { name: "详情", ifshow: 'no' }, { name: "字幕", ifshow: 'no' },],
    clickThisNav: 1, // 当前导航单元的索引
    bookId: 0,
    sound: {
      total_count: -1,
      count: 0,
      list: [],//获取到的列表（显示 播放）
      playList: []//排序后的列表
    },
    lessonIndex: 0,//获取当前单元列表的索引(list要播放的索引)
    audioIndex: 0,//获取当前单元下的某一个资源索引  （list资源要播放的索引）
    playLessonIndex: 0,//获取当前单元列表的索引（playList）
    playIndex: 0,//获取当前单元下的某一个资源索引（playList）
    playOrder: 1, //顺序播放为1，乱序播放为2，单曲播放为3，循环播放为4
    noPre:true,//不能上一首
    noNext:false,//不能下一首
    loadding: false,
    loadMore: true,
    timeBeginText: "00:00",
    timeEndText: "00:00",
    playPauseStyle: "play-out",//播放/暂停按钮
    singInfo: { noDrag: true ,duration:0,currentPosition:0},//歌曲信息
    isShare: false,
    isFirst: false, //是不是第一次弹出提示框并且点了true  您正在使用手机流量收听，是否继续收听 --是 true 否 false
    dbClick: true,
    dbClick2: true,
    firstShow: true,
    direction: "up",    
    randomMusicTangle: [],    
    lrc: [],//字幕数组
    lrc_distance: 0,//字幕滚动距离
    pageIndex: 1,//加载课程资源的分页
    pageSize: 12,//每页的资源数
    desc: '',//显示指定课本详情里的的简介,
    topay:1,//是否支付的索引
    showPayModel: false,//显示支付窗口
    isDragged:false,// 判断歌词区滚动时歌词自己不滚动
    noneCount:0,//status==2时的计数  
    setTime:300,
    beSlider:false,
    money:0,
    disabled:false
  },
  onShareAppMessage: function () {
    var that = this;
    var title = "随书听 " + that.data.bookInfo.book_name
    var path = "/pages/sound/sound?book_id=" + that.data.bookId;
    return app.followBook.onShareAppMessage(title, path, that.data.bookId, "followbook_book");
  },
  onShow: function () {
    var that = this;
    this.setData({ hide: false })
  },
  onHide: function () {
    // 页面隐藏
    this.setData({ firstShow: false });
  },
  audioTime: null,
  onLoad: function (options) {
    /*
     * 本页面仅调用音频暂停、播放、控制音乐播放进度
     * 停止播放在退出书籍主页时调用，所以不要监听停止播放做业务操作
     */
    let that = this;
    that.setData(getApp().globalData);
    // 页面初始化 options为页面跳转所带来的参数
    that.data.bookId = options.book_id;
    that.setData({ bookId: options.book_id })
    //暂时屏蔽掉支付的标识位
    // that.setData({topay: options.book_isPay })
    console.log(that.data.topay);
    //获取书籍信息
    app.followBook.getBookInfo(that.data.bookId, function (res) {
      if(res.success){
      	that.setData({ bookInfo:res.data.book})
        that.setData({ platform_book_id: res.data.platform_book_id})
      }
      
    });
    //获取书籍资源信息
    that.getThisBook_course(function(){
    	//获取字幕
    	that.asyncShowLynic();
    });
    //更新用户的某本书的最后阅读时间
    app.followBook.updateBookReadingTime(that.data.bookId, function (res) { });
    //记录用户浏览的该本课的记录
    // app.followBook.getBookScanCount(that.data.bookId, function () { });
    if (options.share == "true") {
    	//如果是分享进入，则要将书籍添加到书架
      app.userLogin(function () { app.followBook.addBooks(that.data.bookId, function () { }); });
      that.setData({ isShare: true });
    }

    //初始化监听
    that.listenInit();
    //获取网络消息
    wx.getNetworkType({
      success: function (res) {
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == "none") {
          wx.showToast({
            title: '网络异常',
            duration: 2000
          });

        }
      }
    });
    
    that.getBehaviorRecord(that.data.bookId, "followbook_book", 6)
  },
  //获取更多数据
  loadMoreList: function () {
    var that = this;
    let { pageIndex } = that.data;
    pageIndex++;
    that.setData({ pageIndex: pageIndex })
    console.log("获取更多数据")
    that.getThisBook_course();
  },
  //获取指定课本中的各课程的资源列表
  getThisBook_course: function (cb) {
    let that = this;
    let { bookId, pageIndex, pageSize } = that.data

    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });
      app.followBook.getBookMatchList
        (
        function (res) {
          var list = res.data;
          let data = {};
          if (res.success&&list.length > 0) {
	      		data.count = list.length + that.data.sound.count * 1
	      		data.total_count = res.totalCount * 1;
            
            //把课程下的时间"00:02:35" 转化为 "02:35"
            for (let i = 0; i < list.length; i++) {
              list[i].show_flag = false
              for (let j = 0; j < list[i].lesson_source.length; j++) {
                list[i].lesson_source[j].sound_timelen = app.simplifyFormate(list[i].lesson_source[j].sound_timelen)
              }
            }
            //下拉刷新追加数据
            data.list = that.data.sound.list.concat(list);
            data.playList = that.data.sound.playList.concat(list);

            //初始化时间和显示项
            let initTime =list[0].lesson_source[0].sound_timelen;
            list[0].show_flag = true;
            that.setData({
              sound: data, timeEndText: initTime
            })
            //初始化singInfo.duration
            if(that.data.singInfo.duration==0){
            	var time=list[0].lesson_source[0].sound_timelen;           	
            	that.setData({'singInfo.duration':app.reFormateTime(time)})
            }
            wx.setNavigationBarTitle({
              title: "随书听",
            })
            if(cb){
           		cb();
            }
          }
          // 如果加载完所有数据，标记不用再加载更多
          if (that.data.sound.total_count == res.totalCount) {
            that.setData({ loadMore: false });
          }
          that.setData({ loadding: false });
          wx.stopPullDownRefresh();
        },
        that.data.bookId,
        that.data.pageIndex,
        that.data.pageSize
        );
    }
  },
  //获取某一课程的描述性信息
  getlesson_sourceSelf: function () {  	
    let that = this;
    let { audioIndex, lessonIndex } = that.data;
    that.setData({
      desc: that.data.sound.list[lessonIndex].followbook_lesson.lesson_desc
    })
  },
  //动态获取该节课的课文歌词
  asyncShowLynic: function () {
    let that = this;
    let { lessonIndex, audioIndex } = that.data;
    if (that.data.sound.total_count>0){
      wx.request({
        url: that.data.sound.list[lessonIndex].lesson_source[audioIndex].sound_subtitle_url,
        success: function (res) {
          that.setData({
            lrc: that.parseLyric(res.data)
          })
        },
      })
    }
  },
  //歌曲页面向上平移并且高亮显示指定行歌词
  lrcScrollAndTinting: function () {
    var that = this;
    var currentPosition=that.data.singInfo.currentPosition;
    var lrc = that.data.lrc;
    var cur = []; //改变当前歌词样式
    cur.length = lrc.length;
    var index = 0;
    for (var key in lrc) {
      if (lrc[key][0] > currentPosition) {
        index=key-1;
        if(index<0){
        	index=0;
        }
        break;
      }else if(key==lrc.length-1){
      	index=key;
      }
    }
    cur[index] = "cur";
    //console.log("歌词高亮")
    //console.log(cur)
    that.setData({
      cur_lrc: cur
    });
    if (!that.data.isDragged) {
      that.setData({
        lrc_distance: (index-2) * 30
      })
    }
  },
  listenInit: function () {
    //初始化监听
    var that = this;
    //音频播放完毕    
    wx.onBackgroundAudioStop(
      function () {
        console.log("播放停止,从头播放", that.data.singInfo.duration)
        if (that.audioTime) {
		      clearInterval(that.audioTime)
		    }
		    if(!that.data.noNext){
	    		that.audioNext();     	
	    	}        
      }

    );

    //音乐播放时
    wx.onBackgroundAudioPlay(
      function () {
        //启用监听定时器        
        that.setData({ playPauseStyle: "play-in" });
        // console.log("开始播放")
      }
    );
    //音乐暂停时
    wx.onBackgroundAudioPause(
      function () {
        //清除监听定时器            
        that.setData({ playPauseStyle: "play-out" });
        // console.log("暂停播放")
      }
    );
  },
  listenAuido: function () {
    var that = this;
    let { timeEndText, audioIndex, lessonIndex } = that.data;
    var node = that.data.sound.list[lessonIndex].lesson_source[audioIndex];
    //播放时监听音乐
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
      	console.log("播放中")
      	console.log(res)
        var status = res.status;
        let matchTime = app.formatTime(res.duration);
        
        if (status == 1) {
          //播放中
          that.setData({timeBeginText: that.getTimeText(res.currentPosition) });
          that.setData({ timeEndText: matchTime});
          that.setData({ 'singInfo.duration': res.duration });
        	that.setData({ 'singInfo.currentPosition': res.currentPosition })
          that.downloadTime = Math.floor(res.downloadPercent / 100 * res.duration);//下载进度
          that.lrcScrollAndTinting();//字幕         
        } else if (status == 2) {
          //没有音乐在播放   尤其是跳转到下一首时 ，状态会变成2  且参数大部分都为零  在定时器循10次后约为两秒钟，且不是第一次从后台唤醒播放 会进入下一首播放
          that.data.noneCount++;
          if(that.data.noneCount>=10){
          	if (!that.data.hide) {
	          	console.log(status,'无音乐播')
	          	that.data.noneCount=0;
	            that.audioToPlay();
	          }
          }
        } else if (status == 0) {
          //暂停中
        }
        
      },
      fail: function (res) {
        //播放失败--播放下一首
      }
    });
  },
  onReady: function () { },
  onUnload: function () {
    var that = this;
    // 页面关闭
    if (this.audioTime) {
      //清除监听定时器     
      clearInterval(this.audioTime);
    }
    //暂停播放音频
    wx.pauseBackgroundAudio();
  },
  dragStart: function (event) {
  	var that=this;
  	if (that.audioTime) {
    	clearInterval(that.audioTime);
   	}
  },
  sliderChange: function (event) {
    var that = this;
    var newValue = event.detail.value;
    console.log(newValue);
    var data = this.data.sound;
    let { lessonIndex, audioIndex,playLessonIndex,playIndex,playOrder} = that.data;
    var muchPlayed = that.getTimeText(newValue);
    //if (that.data.singInfo.duration == "NaN") {
    //  return;
    //}
    that.setData({ timeBeginText: muchPlayed ,'singInfo.currentPosition': newValue,beSlider:true});
    if (newValue == 0) {
    	that.setData({noNext:true})
      wx.stopBackgroundAudio();
      setTimeout(function(){
      	that.audioToPlay();
      },500)
      
    } else if (newValue == that.data.singInfo.duration) {
    	if(playOrder==1&&playLessonIndex==(data.playList.length-1)&&playIndex==(data.playList[playLessonIndex].lesson_source.length-1)){//顺序的最后一个
    		//顺序的最后一个 --不往下播了
    		that.setData({ playPauseStyle: "play-out",noNext:true });
    		wx.stopBackgroundAudio();
        that.setData({timeBeginText:that.data.timeEndText,'singInfo.currentPosition':that.data.singInfo.duration})
    	}else if(playOrder==3){
    		console.log("单曲循环拖到最后")
    		that.setData({noNext:true})
    		wx.stopBackgroundAudio();    		
		    setTimeout(function(){
	      	that.audioToPlay();
	      },500)
        return false; 
    	}else{
    		that.audioNext();
    	}
    } else {
    	//暂停中   seek之后要播放，播放的时候还要加seek
				if (that.data.playPauseStyle == "play-out") {
          //暂停
          wx.seekBackgroundAudio({
            position: newValue
          })
          that.audioToPlay();         
        } else {
          wx.seekBackgroundAudio({
            position: newValue,
            success:function(){
            	that.audioTime = setInterval(that.listenAuido, that.data.setTime);
            }
          })
        }

    }
  },
  //点击选择播放
  selectPlay: function (event) {
    var that = this;
    let {audioIndex, lessonIndex, topay } = that.data;
    var tmp_sourceIndex = event.currentTarget.dataset.index;//资源index
    let tmp_lessonIndex = event.currentTarget.dataset.bookindex;//单元index
    let tmpList = that.data.sound.list;
    tmpList[tmp_lessonIndex].show_flag = true   
    let playLessonIndex=0;
    let playIndex=0;
    for(var i=0;i<that.data.sound.playList.length;i++){
    	if((that.data.sound.playList[i].followbook_lesson.topsize-1)==tmp_lessonIndex){
    		playLessonIndex=i;
    		for(var j=0;j<that.data.sound.playList[i].lesson_source.length;j++){
		    	if((that.data.sound.playList[i].lesson_source[j].topsize-1)==tmp_sourceIndex){
		    		playIndex=j;
		    		break;
		    	}
		    }
    		break;
    	}
    }
//  console.log("点击："+ tmp_lessonIndex + tmp_sourceIndex)
//  console.log("playList:"+playLessonIndex + playIndex )  
//  console.log(that.data.sound.list)
//  console.log(that.data.sound.playList)
    that.setData({ 'singInfo.currentPosition': 0,timeBeginText: "00:00", playIndex:playIndex,audioIndex: tmp_sourceIndex,playLessonIndex:playLessonIndex, lessonIndex: tmp_lessonIndex,  'sound.list': tmpList })            
    //设置导航标题
    wx.setNavigationBarTitle({
      title:that.data.sound.list[lessonIndex].lesson_source[tmp_sourceIndex].sound_name,
    })
    if (topay == 1) {
      console.log("筛选")
      //播放歌词
      that.asyncShowLynic();
      //显示当前选择的列表，隐藏其它列表
      that.showSelf()
      that.audioToPlay();
      that.getlesson_sourceSelf()
    } else {
      that.setData({ showPayModel: true })
    }
  },
  audioPrev: function () {
    //转到上一首
    var that = this;
    let { audioIndex, lessonIndex,playLessonIndex:playLessonIndex,playIndex:playIndex, playOrder, showPayModel, topay } = that.data;
    that.setData({ 'singInfo.currentPosition': 0, timeBeginText: "00:00" })   
    if (topay == 1) {      
      if (!that.data.dbClick) {
        return;
      }
      //解决多次点击的问题
      that.setData({ dbClick: false })
      console.log("上一首");
      if (playOrder != 3) {//非单曲循环
        playIndex--;
        if (playIndex < 0) {
          playIndex = 0
          playLessonIndex--;
          if (playLessonIndex < 0) {
		        playLessonIndex = that.data.sound.list.length - 1;
		      }
        }
      }
      lessonIndex=that.data.sound.playList[playLessonIndex].followbook_lesson.topsize-1;
      audioIndex=that.data.sound.playList[playLessonIndex].lesson_source[playIndex].topsize-1;
      that.setData({ lessonIndex: lessonIndex, audioIndex: audioIndex,playLessonIndex:playLessonIndex,playIndex:playIndex});
      console.log('是否多次点击'+that.data.dbClick)
      that.audioPause();
      that.setData({noNext:true})
      wx.stopBackgroundAudio();
      setTimeout(function(){
      	that.audioToPlay();
      },500)            
      //播放歌词
      that.asyncShowLynic();      
      //高亮呈现
      that.setListLight();
      that.showSelf();
      //设置导航标题
      wx.setNavigationBarTitle({
        title: this.data.sound.list[lessonIndex].lesson_source[audioIndex].sound_name,
      });
      that.getlesson_sourceSelf()
      setTimeout(function () {
        that.setData({ dbClick: true })
      }, 500)
    } else {
      that.setData({ showPayModel: true })
    }
  },
  audioNext: function () {
    //转到下一首
    var that = this;
    let { playOrder, audioIndex, lessonIndex,playLessonIndex:playLessonIndex,playIndex:playIndex, showPayModel, topay } = that.data;
    that.setData({ 'singInfo.currentPosition': 0,  timeBeginText: "00:00" })
    console.log("下首：" + that.data.dbClick)
    
    if (topay == 1) {    	
      if (!that.data.dbClick) {
        return;
      }
      //解决多次点击的问题
      that.setData({ dbClick: false })
      if (playOrder != 3) {//非循环
        playIndex++;
        if (playIndex > that.data.sound.playList[playLessonIndex].lesson_source.length-1) {
        	playIndex = 0;
          playLessonIndex++;
          if(playLessonIndex>that.data.sound.playList.length-1){
          	playLessonIndex=0;
          }
          
        }
      }
      lessonIndex=that.data.sound.playList[playLessonIndex].followbook_lesson.topsize-1;
      audioIndex=that.data.sound.playList[playLessonIndex].lesson_source[playIndex].topsize-1;
      that.setData({ lessonIndex: lessonIndex, audioIndex: audioIndex,playLessonIndex:playLessonIndex,playIndex:playIndex});
      //设置导航标题
      wx.setNavigationBarTitle({
        title: this.data.sound.list[lessonIndex].lesson_source[audioIndex].sound_name,
      });
      console.log('是否多次点击'+that.data.dbClick)
      that.audioPause();
      that.setData({noNext:true})
      wx.stopBackgroundAudio();
      setTimeout(function(){
      	that.audioToPlay();
      },500)
      //高亮呈现
    that.setListLight();
      //播放歌词
      that.asyncShowLynic();
      
      that.showSelf();
      that.getlesson_sourceSelf()
      setTimeout(function () {
        that.setData({ dbClick: true })
      }, 500)
    } else {
      that.setData({ showPayModel: true })
    }
  },
  //三种播放方式 1.检查是4g wifi none网络格式---4g网下的播放 第一次点击播放按钮时
  //2.只检查none和有网络格式 ----- wifi下的播放 以及 4g网下一曲播放完自动播放下一曲
  //3.不检查网络直接播放  -------  点击播放按钮时触发（非第一次）
  audioToPlay: function () {
    //找到某个音频数据
    var that = this;
    console.log(that.data.audioIndex)
    let { showPayModel, topay } = that.data;
		console.log("准备播放",that.data.dbClick,that.data.lessonIndex,that.data.audioIndex)
		console.log("dataUrl",that.data.sound.list[that.data.lessonIndex].lesson_source[that.data.audioIndex].sound_url)
    if (topay == 1) {
      let { lessonIndex, audioIndex } = that.data
      var node = that.data.sound.list[lessonIndex].lesson_source[audioIndex];	  
      //解决多次点击的问题
      if (!that.data.dbClick2) {
        return;
      }
      that.setData({ dbClick2: false })
      //that.getlesson_sourceSelf()
      //播放歌词
      //that.asyncShowLynic();
      that.setListLight();
      that.setData({ playPauseStyle: "play-in" });
      if (!that.data.isFirst) {
        wx.getNetworkType({
          success: function (res) {
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;
            if (networkType == "none" || networkType == "wifi") {
              //指定播放背景音乐
              wx.playBackgroundAudio({
                dataUrl: node.sound_url,
                title: node.file_name,
                coverImgUrl: that.data.bookInfo.book_pic,
                success: function () {
                	if(that.data.beSlider){//拖拽播放
                		wx.seekBackgroundAudio({
					            position: that.data.singInfo.currentPosition
					          })
                		that.setData({beSlider:false})
                	}
                  //播放中                 
                  if (that.audioTime) {
                    //清除监听定时器     
                    clearInterval(that.audioTime);
                    console.log("立刻播")
                  }
                  that.audioTime = setInterval(that.listenAuido, that.data.setTime);
                }
              });
            } else {
              that.setData({ playPauseStyle: "play-in" });
              wx.pauseBackgroundAudio();
              that.setData({ timeBeginText: '00:00' });
              that.setData({ 'singInfo.currentPosition': 0 });
              wx.showModal({
                title: '温馨提示',
                content: '您正在使用手机流量收听，是否继续收听',
                showCancel: true,
                cancelText: '取消收听',
                cancelColor: '#06c1ae',
                confirmText: '继续收听',
                confirmColor: '#06c1ae',
                success: function (res) {
                  if (res.confirm) {
                    //用户点击继续观看
                    //指定播放背景音乐
                    console.log("继续观看")
                    that.setData({ isFirst: true })
                    that.setData({ playPauseStyle: "play-in" });
                    wx.playBackgroundAudio({
                      dataUrl: node.sound_url,
                      title: node.file_name,
                      coverImgUrl: that.data.bookInfo.book_pic,
                      success: function () {
                      	if(that.data.beSlider){//拖拽播放
			                		wx.seekBackgroundAudio({
								            position: that.data.singInfo.currentPosition
								          })
			                		that.setData({beSlider:false})
			                	}
                        //播放中                 
                        if (that.audioTime) {
                          //清除监听定时器     
                          clearInterval(that.audioTime);
                        }
                        that.listenAuido();
                        that.audioTime = setInterval(that.listenAuido, that.data.setTime);
                      }
                    });
                    // that.keep();
                  } else if (res.cancel) {
                    //用户点击取消观看--不操作	
                    console.log("取消观看")
                    that.setData({ playPauseStyle: "play-out"});
                    wx.pauseBackgroundAudio()
                  }
                }
              })
            }
          }
        });
      } else {
        //指定播放背景音乐
        console.log("不是第一次播放")
        wx.playBackgroundAudio({
          dataUrl: node.sound_url,
          title: node.sound_name,
          coverImgUrl: that.data.bookInfo.book_pic,
          success: function () {
          	if(that.data.beSlider){//拖拽播放
	        		wx.seekBackgroundAudio({
				            position: that.data.singInfo.currentPosition
				          })
	        		that.setData({beSlider:false})
	        	}
            //播放中                 
            if (that.audioTime) {
              //清除监听定时器     
              clearInterval(that.audioTime);
            }
            that.listenAuido();
            that.audioTime = setInterval(that.listenAuido,that.data.setTime);
          }
        });
        // that.keep();

      }      
      setTimeout(function () {
        that.setData({ dbClick2: true })
      }, 500)
      //设置导航标题
      wx.setNavigationBarTitle({
        title: node.sound_name
      });
    } else {
      that.setData({ showPayModel: true })
    }

  },
  //音乐暂停
  audioPause: function () {
    var that = this;
    let { randomMusicTangle } = that.data; 
    if (!this.data.dbClick) {
      return;
    }
    this.setData({ dbClick: false })
    if (that.audioTime) {
      //清除监听定时器     
      clearInterval(that.audioTime);
    }
    for (let i = 0; i < 5; i++) {
      randomMusicTangle[i] = (parseInt(Math.random() * 100) + 5) + "%";
    }
    wx.pauseBackgroundAudio();
    this.setData({ playPauseStyle: "play-out",randomMusicTangle: randomMusicTangle });  
    setTimeout(function () {
      that.setData({ dbClick: true })
    }, 500)
  },
  setListLight: function () {
    //设置列表中元素高亮    
    var that = this;
    var data = this.data.sound;
    let { lessonIndex, audioIndex,playLessonIndex,playIndex,playOrder} = that.data;
    for (var i = 0; i < data.list.length; i++) {
      for (let j = 0; j < data.list[i].lesson_source.length; j++) {
        data.list[i].lesson_source[j]["class"] = "sound-item";
      }
    }
    data.list[lessonIndex].lesson_source[audioIndex]["class"] = "sound-item-over";
    that.setData({"sound.list": data.list })	
    if(data.playList.length==1&&data.playList[0].lesson_source.length==1){
    	that.setData({noNext: true ,noPre: true})
    }else if(playOrder==1&&playLessonIndex==(data.playList.length-1)&&playIndex==(data.playList[playLessonIndex].lesson_source.length-1)){
			//顺序播最后一单元的最后一首时不能下一首
			that.setData({noNext: true,noPre: false })
		}else if(playOrder==1&&playLessonIndex==0&&playIndex==0){
			//顺序播第一单元的第一首时不能上一首
			that.setData({noPre: true,noNext: false, })
		}else if(playOrder==3){
		//单曲循环时不能上一首也不能下一首
		that.setData({noNext: true ,noPre: true})
    }else{
    	that.setData({noNext: false,noPre: false })
    }
//  console.log(that.data.lessonIndex)
//  console.log(that.data.audioIndex)
  },
  disOrder: function () {
    let that = this;
    let { playOrder, audioIndex, lessonIndex,playLessonIndex, playIndex} = that.data;
    var sound=that.data.sound;
    var playList=that.data.sound.playList;
    var lessonSource=that.data.sound.playList[that.data.playLessonIndex].lesson_source;
    that.setData({ "sound.list": that.data.sound.list })
    let lists = that.data.sound.list;  
    playOrder++;    
    if (playOrder > 4) {
      playOrder = 1
    }    
    that.setData({playOrder:playOrder})
    if (playOrder == 2) {//乱序
      //指定某一节课后的课程列表进行随机
			let lesson_prv = playList.splice(that.data.playLessonIndex,1);
      //指定某一节课的下属资源列表进行随机
      let prvtmp = lessonSource.splice(playIndex,1);      
      let next_lesson = shuffle(playList);
      let tmp_lesson = lesson_prv.concat(next_lesson)
      let afterArr = shuffle(lessonSource);
      let tmpArr = prvtmp.concat(afterArr); 
      tmp_lesson[0].lesson_source = tmpArr;
      //其余单元下的资源的循环
      for(var i=1;i<tmp_lesson.length;i++){
	  		let arr =shuffle(tmp_lesson[i].lesson_source)
	  		tmp_lesson[i].lesson_source=arr;
      }      
      that.data.sound.playList=tmp_lesson;     
      that.setData({  "sound.playList": that.data.sound.playList });
      function shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len - 1; i++) {
          var index = parseInt(Math.random() * (len - i));
          var temp = a[index];
          a[index] = a[len - i - 1];
          a[len - i - 1] = temp;

        }
        return a;
      }       
    } else{//顺序 、单曲循环、循环全部  
    	that.data.playLessonIndex=that.data.lessonIndex;
    	that.data.playIndex=that.data.audioIndex;
    	that.setData({  "sound.playList": that.data.sound.list,playLessonIndex:that.data.playLessonIndex,playIndex:that.data.playIndex });
    }
    if(playOrder==1&&playLessonIndex==(sound.playList.length-1)&&playIndex==(sound.playList[playLessonIndex].lesson_source.length-1)){
			//顺序播最后一单元的最后一首时不能下一首
			that.setData({noNext: true })
		}else if(playOrder==1&&playLessonIndex==0&&playIndex==0){
			//顺序播第一单元的第一首时不能上一首
			that.setData({noPre: true })
		}else if(playOrder==3){
		//单曲循环时不能上一首也不能下一首
		that.setData({noNext: true ,noPre: true})
    }else{
    	that.setData({noNext: false,noPre: false })
    }
    console.log(playOrder)
  },
  // 页面滚动触发事件的处理函数
  onPageScroll: function (e) {
    let that = this;
    //console.log('页面滚动')
    //console.log(e)
    if (e.scrollTop < 150) {
      this.setData({ direction: "up" })
    } else {
      this.setData({ direction: "down" })
    }
  },
  //字幕页面滚动时，暂时禁止字幕自己滚动
  stop_goUp:function(){
    let that=this;
    let scrollTimeout;
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    if (!that.data.isDragged) {
      that.setData({
        isDragged: true
      })
    }
    scrollTimeout = setTimeout(function () {
      that.setData({
        isDragged: false
      })
    }, 3000);
  },
  //点击切换
  goNext: function () {
    let that = this;
    let navIdx = that.data.clickThisNav + 1;
    if (navIdx > 3) {
      navIdx = 1
    }
    console.log(navIdx);    
    let tmp = that.data.showSelf;
    tmp.map((value, key) => {
      value.ifshow = "no";
      if (key === (navIdx - 1)) {
        value.ifshow = "yes";
      }
    })
    that.setData({ showSelf: tmp, clickThisNav: navIdx})   
  },
  lore: function () {
    let that = this;
    wx.navigateTo({
      url: '../konwledge/konwledge?platform_book_id=' + that.data.platform_book_id + "&book_name=" + that.data.bookInfo.book_name+"&book_id="+that.data.bookId,
    })
  },
  //暂时报错，以后改接口再说
  share: function () {
    this.onShareAppMessage();
  },
  //点击展开特定课程的内容
  toggleShow: function (event) {
    let that = this;
    let tmpList = that.data.sound.list;
    let idx = event.currentTarget.dataset.index;
    console.log(tmpList[idx].show_flag)
    if (tmpList[idx].show_flag == false) {
      for (let i = 0; i < tmpList.length; i++) {
        tmpList[i].show_flag = false
      }
      tmpList[idx].show_flag = true;
    } else {
      tmpList[idx].show_flag = false;
    }
    that.setData({ 'sound.list': tmpList })
  },
  //显示课本资源页的某一资源显示列表，其他隐藏
  showSelf: function () {
    let that = this;
    let tmpList = that.data.sound.list;
    let { lessonIndex } = that.data;
    for (let i = 0; i < tmpList.length; i++) {
      tmpList[i].show_flag = false
    }
    tmpList[lessonIndex].show_flag = true;
    that.setData({ 'sound.list': tmpList })
  },
  //点击导航条
  toShowThis: function (e) {
    var that = this;
    let idx = e.currentTarget.dataset.index;
    that.setData({ clickThisNav: idx});
    let tmp = that.data.showSelf;
    tmp.map((value, key) => {
      value.ifshow = "no";
      if (key === (idx - 1)) {
        value.ifshow = "yes";
      }
    })
    that.setData({ showSelf: tmp})
  },
  //swiper 滑动  更改 item 索引值
  exchangeNext: function (even) {
    let that = this;
    let { clickThisNav } = that.data;
    let idx = even.detail.current;
    let tmp = that.data.showSelf;
    tmp.map((value, key) => {
      value.ifshow = "no";
      if (key === (idx)) {
        value.ifshow = "yes";
      }
    })
    that.data.clickThisNav = idx + 1;
    that.setData({ showSelf: tmp})
  },
  // 121----02:01
  getTimeText: function (time) {
    var formart = function (s, count) {
      for (var i = s.length; i < count; i++) {
        s = "0" + s;
      }
      return s;
    }
    var text = "00:00";
    if (time > 60 * 60) {
      text = formart(parseInt((time - (time % (60 * 60))) / 60).toString(), 2) + ":" + formart(parseInt((time - (time % 60)) / 60).toString(), 2) + ":" + formart(parseInt(time % 60).toString(), 2);
    } else if (time >= 60) {
      text = formart(parseInt((time - (time % 60)) / 60).toString(), 2) + ":" + formart(parseInt(time % 60).toString(), 2);

    } else {
      text = "00:" + formart(parseInt(time % 60).toString(), 2);
    }
    return text;
  },  
  //分割歌词
  parseLyric: function (text) {
    //将文本分隔成一行一行，存入数组
    var lines = text.split('\r\n'),
      //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
      //保存最终结果的数组
      result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    //去掉歌词列表中的空行
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern);
      //提取歌词
      var value = v.replace(pattern, '');
      //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔

      //一行里有多个时间时只取第一个，用循环时字幕里会出现重复的歌词
      try {
        // time.forEach(function (v1, i1, a1) {
        //   //去掉时间里的中括号得到xx:xx.xx
        //   var t = v1.slice(1, -1).split(':');
        //   //将结果压入最终数组
        //   result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        // });
        var t = time[0].slice(1, -1).split(':');
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      } catch (e) {

      }
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //获取用户的各种行为记录;   	
  // uid: 用户ID，sales_id: 浏览的ID(不是platform_book_id) ，sales_name：浏览的书或者商品（followbook_book/followbook_lesson），source_sales_id：默认0,课程时候传课程id,behavior:行为动态 6,client_name:0：浏览器、1：微信、2：QQ、3：微博、4：小程序、5：Android应用、6：iOS应用
  getBehaviorRecord: function (id, bookOrLesson, behavior) {
    let that = this;
    app.followBook.addBrowserNew(id, bookOrLesson, behavior, 4, function (res) {
      console.log(res)
    });
  },
  // that.getBehaviorRecord(that.data.bookId, "followbook_book", 6)
  //取消支付弹窗
  returnTo_thisBook: function () {
    let that = this;
    that.setData({ showPayModel: false })
  },
  //支付购买这本书
  buy_thisBook:function(){
    console.log("<><><><><><><><><><><")
  }
})