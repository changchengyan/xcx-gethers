// search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList:[],
    cancleBtn: false,
    defaultString: "",

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

  //根据input内容长度判断是否显示取消按钮
  displayCancleBtn(e) {
    // console.log(e.detail);
    if(e.detail.value.length > 0 && !this.data.cancleBtn){
      this.setData({cancleBtn: true});
    }
    else if (e.detail.value.length == 0 && this.data.cancleBtn){
      this.setData({ cancleBtn: false });
    }
  },

  // 清空输入框
  clearInput() {
    this.setData({ defaultString: "", cancleBtn: false});
  },

  //搜索
  searchBookByKeyword(e) {
    let that = this;
    let keyword = e.detail.value;
    if(keyword == ""){
      wx.showToast({
        title: '不能为空',
        duration: 2000
      })
      return false;
    }
    app.read.searchBookByKeyword(keyword,function(res){
      if (res.data.data.length == 0){
        wx.showToast({
          title: '没有找到',
          duration: 2000
        })
      }
      that.setData({
        contentList: res.data.data,        
      })
    });
  },
  //跳转到播放界面
  toPlayPage(e) {
    let bookId = e.currentTarget.dataset.bookId;
    let lesson_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../read/read?lesson_id=${lesson_id}&book_id=${bookId}`,
    })
  }
})