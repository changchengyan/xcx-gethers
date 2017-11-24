let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	updateUserInfo:{
  		avatarUrl:'',
  		nickName:''
  	},
    totalBookNum:0,
    isFirstShow:true,
    count:{
      book:"",
      listen:"",
      word:""
    },
    shareInfo:{}//邀请好友用到
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.setData(getApp().globalData);
    console.log("加载完成")
    let{updateUserInfo}=that.data;
  	if (app.globalData.uid>0){
  		var userInfo=that.data.userInfo.weixinUser;
  		//更新头像昵称
  		app.upDateUserInfo(function(){
	    	updateUserInfo.avatarUrl=userInfo.headimgurl;
	    	updateUserInfo.nickName=userInfo.nickname;
	    	if(!userInfo.headimgurl){
	    		updateUserInfo.avatarUrl="../images/user/unRegister.png";
	    	}
	    	that.setData({updateUserInfo:updateUserInfo})
	    })
      //that.getDesk_bookNum();
    	//that.GetMyInfo();    	
	  }else{
	  	//没有登录过的 uid=0
	  	app.userInfoReadyCallback = ()=> {
	      //头像昵称赋值
      	var userInfo=that.data.userInfo.weixinUser;
      	updateUserInfo.avatarUrl=userInfo.headimgurl;
      	updateUserInfo.nickName=userInfo.nickname;
      	if(!userInfo.avatarUrl){
	    		updateUserInfo.avatarUrl="../images/user/unRegister.png";
	    	}
      	that.setData({updateUserInfo:updateUserInfo})
        //that.getDesk_bookNum();
			//that.GetMyInfo(); 
	      
	   }		
	  }    
    if (options && options.share) {//分享
     
      let shareInfo = {};
      shareInfo.img = options.userPhoto;
      shareInfo.name = options.userName;
  
      that.setData({ shareInfo})
      console.log(that.data.shareInfo)
    }
  },
  //获取书桌的书本数量
  getDesk_bookNum:function(){
    let that = this;
    app.followBook.getDeskBookList
      (
      1,
      10,
      function (res) {
        if (res.success == true) {
          that.setData({ totalBookNum: res.totalCount })
        }
      })
  },
  //获取当前的书籍 数量及其他信息
  GetMyInfo:function(){
    let that = this;
    // app.Dictation.GetMyInfo(
    //   function(res){
    //     if (res.success == true) {
    //       that.data.count.book = res.data.book_count;
    //       that.data.count.listen = res.data.listen_count;
    //       that.data.count.word = res.data.word_count;
    //       that.setData({ count:that.data.count})
    //     }
    //   }
    // )
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
    let that=this;
    if (!that.data.isFirstShow) {    	
      //that.getDesk_bookNum();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isFirstShow: false })
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
   * 用户点击右上角分享--分享到首页
   */
    onShareAppMessage: function (res) {
    	var that=this;
    	let{updateUserInfo}=that.data;
    	var toPath = "/pages/desktop/desktop";//邀请好友调到中间页后跳到首页
	    var imageUrl;
	    var path= "/pages/desktop/desktop";
	    if (res.from === 'button') {
	      // 来自页面内转发按钮（邀请好友）
	      //imageUrl = 'http://image.chubanyun.net/images/Dictation/template/share_img.png';
	      //path = "/pages/user/share_page/share_page?userPhoto=" + updateUserInfo.avatarUrl + "&userName=" + updateUserInfo.nickName + "&share=true" + "&toPath=" + toPath;
	    }
	    return {
	      title: '',
	      path: path ,
	      imageUrl: imageUrl ,
	      success: function (res) {
	        // 转发成功
	      },
	    }
  },
  toPage:function(event) {
    var page = event.currentTarget.dataset.page;
    console.log(page)
    var toPage = "";
    switch (page) {
      case "aboutUs":
        toPage = "aboutUs/aboutUs";
        break;
      case "studyTools":
        toPage = "learn_tools/learn_tools";
        break;
      default:
        break;
    }
    console.log(toPage)
    wx.navigateTo({ url: toPage });
  },
  closeSharePage:function(){
    let that = this;
    that.setData({"shareInfo.show":false})
  }
})