// pages/word/word.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogMoreOperation:false,
    messageShow:true,
    coverImg:"http://f3.5rs.me/upload/20170830/2017_08_30_151904673.jpg",
    colorBlack:"#05071c",
    colorGray:"#03b5a3",
    colorWhite:"",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options)
   {

     var color = options.color;
     switch (color)
     {
       case "1":
         this.setData({ colorBlack: "#2a1347", colorGray: "#594275", coverImg:"http://f3.5rs.me/upload/20170830/2017_08_30_151904673.jpg"});
         break;
       case "2":
         this.setData({ colorBlack: "#565e00", colorGray: "#798803", coverImg:"http://f3.5rs.me/upload/20170831/2017_08_31_113849460.jpg"});
         break;
       case "3":
         this.setData({ colorBlack: "#033a5f", colorGray: "#2a96dd", coverImg: "http://f3.5rs.me/upload/20170831/2017_08_31_114259889.jpg" });
         break;
       case "4":
         this.setData({ colorBlack: "#7d4100", colorGray: "#e18624", coverImg: "http://f3.5rs.me/upload/20170831/2017_08_31_114318078.jpg" });
         break;
       case "5":
         this.setData({ colorBlack: "#412c0e", colorGray: "#c09659", coverImg: "http://f3.5rs.me/upload/20170831/2017_08_31_114330689.jpg" });
         break;
     }
    
    
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.colorBlack,
      animation: {
        duration: 1000,
        timingFunc: 'easeIn'
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
  
  },
  wordToMessage: function (event)
  {
    this.setData({ messageShow:false});
    wx.navigateTo({ url: "message/message" });
  },
  wordToSales: function (event) 
  {
    var page = event.currentTarget.dataset.page;
    var toPage = "";
    switch (page) {
      case "write":
        toPage = "write/write";
        break;
      case "ask":
        toPage = "write/write?ask=yes";
        break;
      case "source":
        toPage = "source/source";
        break;
      case "more":
        toPage = "more/more";
        break;
      case "topic":
        toPage = "topic/topic";
        break;
      case "founder":
        toPage = "../founder/founder";
        break;
      case "leaguer":
        toPage = "../leaguer/leaguer";
        break;
      case "notice":
        toPage = "notice/notice";
        break;
      case "notice-display":
        toPage = "notice/display/display";
        break;
        
      default:
        break;
    }
    wx.navigateTo({ url: toPage });

  },
  onSelectData: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['全部动态', '问答动态', '圈主动态', '知识库动态', '按日期查看'],
      success: function (res) {
        console.log(res.tapIndex);
        


      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  onClickWord: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['查看圈子信息', '查看圈主动态', '分享圈子'],
      success: function (res) {
        console.log(res.tapIndex);    
        var toPage = "";   
        switch (res.tapIndex) {
          //应用
          case 0:
            toPage = "more/more";
            break;
          case 1:
            toPage = "../founder/founder";
            break;
          case 2:
            toPage = "share/share";
            break;
        }
        wx.navigateTo({ url: toPage });


      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  showBlogMoreOperation:function()
  {
    var that = this;      
    that.setData({ blogMoreOperation:true });
  },
  hideBlogMoreOperation: function () {
    var that = this;
    that.setData({ blogMoreOperation: false });
  },
  blogToMiniProgram: function (event) {
    var source = event.currentTarget.dataset.source;
    var toPage = "";
    var appId="wx21293b1ab5fac316";

    console.log("source=" + source);
    switch (source) {
      //应用
      case "video":
        toPage = "pages/view/video/video";
        break;
      case "sound":
        toPage = "pages/view/sound/sound?book_id=29&match_id=1093&match_sales_id=1795&match_sales_name=app_instance";
        break;
      case "album":
        toPage = "pages/view/album/album";
        break;
      case "pdf":
        toPage = "pages/view/pdf/pdf?book_id=1&match_id=1556&match_sales_id=1801&match_sales_name=app_instance";
        break;
      case "article":
        toPage = "pages/view/article/article";
        break;
      case "live":
        toPage = "pages/view/webcast/webcast";
        break;
      //商品
      case "seed_default":
        toPage = "pages/seed/seed";
        break;
      case "seed_ebook":
        toPage = "pages/view/ebook/ebook";
        break;
      case "seed_book":
        toPage = "pages/seed/seed";
        break;
      case "seed_sound":
        toPage = "pages/view/sound/sound";
        break;
      case "seed_video":
        toPage = "pages/view/video/video";
        break;
      case "seed_match":
        toPage = "pages/view/match/match?book_id=50&match_id=1267&match_sales_id=15190&match_sales_name=seed";
        break;
      case "seed_pdf":
        toPage = "pages/view/pdf/pdf";
        break;
      case "seed_album":
        toPage = "pages/view/album/album";
        break;
      case "seed_number":
        toPage = "pages/view/number/number";
        break;
      case "seed_member":
        toPage = "pages/view/member/member";
        break;
      case "seed_pretest":
        toPage = "pages/view/pretest/pretest";
        break;
      case "seed_question":
        toPage = "pages/view/question/question?book_id=12&match_id=1169&match_sales_id=1144&match_sales_name=seed";
        break;  
      case "dictation":
        toPage = "pages/book/book?book_id=9";
        appId ="wxe2a572944d797366";//听写100
        break;  

        
    }
    
    console.log("toPage=" + toPage);
    
    wx.navigateToMiniProgram({
      appId: appId,
      path: toPage,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    });
  }

})