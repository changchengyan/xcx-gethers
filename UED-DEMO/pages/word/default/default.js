// pages/word/default/default.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask:false,
    userBlogList:[
      { username: "one", userimg: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4k1o6eRgzzAfQWkzQa7UCrVrucCtAsyLe4Unj8aiaYiagP75SeMdfickJPkC9sn2SAibrsqxbW8YWsQQ/132", text: "书中加粗的句子是不是考试重点？记一记会读会写就行了？还是需要熟背？有的英文句硬背好了，但是不会举一反三活学活用。希望老师能帮忙制定好的英语学习计划。" },
      { username: "", userimg: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4k1o6eRgzzAfQWkzQa7UCrVrucCtAsyLe4Unj8aiaYiagP75SeMdfickJPkC9sn2SAibrsqxbW8YWsQQ/132", text: "书中加粗的句子记一记会读会写就行了，当然会背肯定更好，英语学习最重要的是背，不要死记硬背，背好了让孩子举一反三，不需要明确的讲语法，会活学活用。制定好英语学习计划，坚持执行下来。", curtype: "1" },
      { username: "two", userimg: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4k1o6eRgzzAfQWkzQa7UCrVrucCtAsyLe4Unj8aiaYiagP75SeMdfickJPkC9sn2SAibrsqxbW8YWsQQ/132", text: "第37页第六可是第一题，第4个选项是不是答案不正确？无法找到同类的单词！", curtype: "2"  },
      { username: "three", userimg: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4k1o6eRgzzAfQWkzQa7UCrVrucCtAsyLe4Unj8aiaYiagP75SeMdfickJPkC9sn2SAibrsqxbW8YWsQQ/132", text: "This is My study. It's not big but clean.Many books are in my study. Look!",curtype:"3" },
      { username: "four", userimg: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4k1o6eRgzzAfQWkzQa7UCrVrucCtAsyLe4Unj8aiaYiagP75SeMdfickJPkC9sn2SAibrsqxbW8YWsQQ/132", text: "那不是我的眼镜？ Those are not my glasses.", curtype: "4"  }
    
    ],
    tearcherList:[
      { name: "王老师", img:"http://f3.5rs.me/upload/20170914/2017_09_14_163148882.jpg"},
      { name: "李老师",img:"http://f3.5rs.me/upload/20170914/2017_09_14_140524651.jpg"},
      { name: "王二老师", img: "http://f3.5rs.me/upload/20170914/2017_09_14_163148882.jpg" },
      { name: "李二老师", img: "http://f3.5rs.me/upload/20170914/2017_09_14_140524651.jpg" }
    ],
    nowCurrent:0,
    hotCurrent:0,
    teacherCurrent:0,
    swiperItemStyle:[],
  }, toWord:function()
  {
    wx.navigateTo({ url: "../word?color=1" });
  },
  setMarsk: function (event)
  {
    var value = event.currentTarget.dataset.value;
    console.log("mask="+value);
    this.setData({ mask: value=="true"});
  },
  //选择老师
  chooseTeacher:function(e){
    var that = this;
    that.setData({
      teacherCurrent: e.currentTarget.dataset.index
 })
  },
  changeCurrent:function(e){
   var that = this;
   that.setData({ nowCurrent:e.detail.current})
  },
  //热评滚动
  hotCurrent:function(e) {
    var that = this;
    that.setData({ hotCurrent: e.detail.current })
  },
  //去资源
  toSource:function(e){
    wx.navigateTo({
      url: '/pages/word/word?color=1',
    })
  },
  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let style = '';
    for (let j = 0; j < that.data.userBlogList.length; j++) {
      style = 'transform: translate(' + (j * 100) + '%, 0%) translateZ(0px); will-change: auto;'
      that.data.swiperItemStyle.push(style)
    }
    that.setData({ swiperItemStyle: that.data.swiperItemStyle })
  },
  changePic: function (event) {//切换主题
    var that = this;
    that.setData({ current: event.detail.current })
    for (let i = 0; i < that.data.swiperItemStyle.length; i++) {
      if (event.detail.current == i) {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px);z-index:101";
      }
      else if (event.detail.current - 1 == i) {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px);z-index:100";
      }
      else if (event.detail.current + 1 == i) {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px);z-index:100";
      }
      else {
        that.data.swiperItemStyle[i] = "transform: translate(" + ((i - event.detail.current) * 100) + "%, 0%) translateZ(0px);z-index:99";
      }
    }
    that.setData({ swiperItemStyle: that.data.swiperItemStyle });
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