// pages/word/word.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogMoreOperation:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    }
    
    
    
    
    wx.navigateToMiniProgram({
      appId: 'wx21293b1ab5fac316',
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