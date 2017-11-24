import Modal from '../../components/modal/modal.js'
var app = getApp();
Page({
  data: {
    list: [],
    curPage: 1,
    totalPage: null,
    loadText: "正在加载中",
    loadding: false,
    ref: false,
    startTime: null,
  },
  click: function (e) {
    let that = this
    let { lessonid } = e.currentTarget.dataset
    console.log(lessonid)
    if (Date.now() - this.data.startTime < 200) {
      wx.navigateTo({
        url: `/pages/unit/unit?navigation_type=custom&lesson_id=${lessonid}`,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //上拉加载
  loadMore: function () {
    this.setData({
      loadding: false,
    })
    let { list, curPage, totalPage } = this.data;
    if (curPage > totalPage - 1) return false;
    this.load(++curPage)
    this.setData({
      loadding: true,
      loadText: "正在加载中"
    })
  },
  load: function (index) {
    let that = this;
    let newList = that.data.list;
    app.Dictation.getCustomList(index, 10, function (res) {
      console.log(res);
      that.setData({
        list: newList.concat(res.data),
        curPage: index,
        totalPage: res.pageTotal,
        loadText: "正在加载中"
      })
      let { list } = that.data;
      that.setData({ list: that.formatList(list) })
    })
  },
  //格式化列表
  formatList: function (list) {
    for (var i = 0; i < list.length; i++) {
      list[i].lesson_name = list[i].lesson_name.replace(/-/g, '/');
    }
    return list
  },
  onLoad: function () {
    let that = this;
    that.load(1);
    that.modal = new Modal()
    console.log(that.data.list)
  },
  //判断网络
  onShow: function () {
    let that = this
    wx.getNetworkType
      ({
        success: function (res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType == "none") {
            wx.showToast({
              title: '网络异常',
              duration: 2000
            });
            that.setData({
              loadding: true
            })
          }
        }
      });
    //再次打开页面时刷新数据
    app.Dictation.getCustomList(1, 10, function (res) {
      that.setData({
        list: res.data
      })
    })
  },
  //bindtouchstart时候触发 
  setTapStartTime: function () {
    this.setData({
      startTime: Date.now()
    })
  },
  //长按删除某条自定义
  onDelete: function (e) {
    let that = this
    //console.log(Date.now() - this.data.startTime)
    //console.log(that.data.startTime)
    let { list } = this.data;
    let lessonId = e.currentTarget.dataset.lessonid
    //let  index= e.currentTarget.dataset.index;
    //console.log(lessonId)
    if (Date.now() - this.data.startTime > 200) {
      this.modal.show({
        title: '是否删除该自定义听写',
        cancel: '否',
        submit: '是',
        success: function () {
          app.Dictation.delCustomList(lessonId, function (res) {
            if (res.success) {
              wx.showToast({
                title: "删除成功！",
                icon: 'success',
                duration: 2000
              })
              app.Dictation.getCustomList(1, 10, function (res) {
                that.setData({
                  list: res.data
                })
              })
            } else {
              wx.showToast({
                title: "res.message",
                icon: 'success',
                duration: 2000
              })
            }
          })

        },
        fail: function (e) {

        }
      })
    }
  }
})

