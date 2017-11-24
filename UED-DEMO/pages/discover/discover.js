// pages/discover/discover.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [

      { color: "#ff8a01", url: "http://f3.5rs.me/upload/20170911/2017_09_11_164701220.png", state: "观看视频", state: "直播中", cn: "追求永无止境", en: "There is no end to the pursuit.", title: "媒体无边界，出版大融合", desc:"集团创造性研发出了国内一流的媒体融合整体解决方案——RAYS" },
      { color: "#05c8b3", url: "http://f3.5rs.me/upload/20170911/2017_09_11_170533081.png", state: "观看视频", cn: "追求永无止境", en: "There is no end to the pursuit.", title: "做现代纸书，做现代编辑"  },

      { color: "#0285c9", url: "http://f3.5rs.me/upload/20170911/2017_09_11_170626625.png", state: "观看视频", cn: "追求永无止境", en: "There is no end to the pursuit.", title: "做现代纸书，做现代编辑"},
      { color: "#8005ce", url: "http://f3.5rs.me/upload/20170920/2017_09_20_183803634.png", state: "观看视频", cn: "追求永无止境", en: "There is no end to the pursuit.", title: "做现代纸书，做现代编辑"}
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    mainMenu: "evaluate",
    userInfo: null,
    swiperIndex:0,
    bookDemo:"over",
    bookList:"",
    bookSwiperIndex: 0,
    bookCurrent:0
  },
  platformScroll: function (event)
  {

  },
  menuSales: function (event) {
    var menu = event.currentTarget.dataset.menu;
    if (menu =="evaluate")
    {
      this.setBackTitleColor(0);
      wx.setNavigationBarTitle({
        title: 'RAYS探索-发现'
      });
    }
    else
    {
      if(menu=="book")
      {
        wx.setNavigationBarTitle({
          title: 'RAYS探索-书刊'
        });

      }else{
        wx.setNavigationBarTitle({
          title: 'RAYS探索-我的'
        });

      }

      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#fead2a',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })


      this.setData({ bookSwiperIndex: 0 });
      this.setData({ bookCurrent: 0 });
      this.bookMenuShow();
    }

    this.setData({ mainMenu: menu });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ userInfo: app.globalData.userInfo });
    this.setBackTitleColor(this.data.swiperIndex);
  },
  setBackTitleColor:function(index)
  {
    console.log("index="+index);
    if (index < this.data.imgUrls.length)
    {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: this.data.imgUrls[index].color,
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })
    }
    else
    {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: "#005bac",
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })

    }

    
  },
  swiperChange: function (event)
  {
    this.setData({ swiperIndex: event.detail.current });
    this.setBackTitleColor(event.detail.current);
    
  },
  bookSwiperChange: function (event)
  {
    this.setData({ bookSwiperIndex: event.detail.current });
    this.bookMenuShow();
    
  },
  bookMenuShow:function()
  { 
    var index = this.data.bookSwiperIndex;
    
    if (index==0)
    {
      this.setData({ bookDemo:"over",bookList:"" });
    }
    else if(index==1)
    {
      this.setData({ bookDemo: "", bookList: "over" });
    }
  },
  bookMenuClick:function(event)
  {
    var sales = event.currentTarget.dataset.sales;
    this.setData({ bookCurrent: sales});
    this.bookMenuShow();

  },
  toBookPage:function()
  {
    wx.navigateTo({ url: "book/book" });
  },
  toDemoPage: function () {
    wx.navigateTo({ url: "demo/demo" });
  },
  toManagePage: function (event)
  {
    var sales = event.currentTarget.dataset.sales;
    var toPage = "";
    switch (sales) {
      case "ticket":
        toPage = "manage/ticket/ticket";
        break;
      case "source":
        toPage = "manage/source/source";
        break;

      case "application":
        toPage = "manage/application/application";;
        break;
      case "report":
        toPage = "manage/report/report";
        break;
      case "message":
        toPage = "manage/message/message";
        break;
      case "accounts":
        toPage = "manage/accounts/accounts";
        break;
      case "about":
        toPage = "about/about";
        break;
      default:
        break;
    }
    wx.navigateTo({ url: toPage });
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
  
  }
})