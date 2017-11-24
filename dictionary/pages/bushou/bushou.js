var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    list: [
      {
        id: '1笔',
        open: true
      },
      {
        id: '2笔',
      },
      {
        id: '3笔',
      },
      { id: '4笔' },
      { id: '5笔' },
      { id: '6笔' },
      { id: '7笔' },
      { id: '8笔' },
      { id: '9笔' },
      { id: '10笔' },
      { id: '11笔' },
      { id: '12笔' },
      { id: '13笔' },
      { id: '14笔' },
      { id: '15笔' }
    ],
    examples:[]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = parseInt(this.data.list[0].id);
    var exs = [];
    app.Dictionary.getBushouByBihua(id, function (res) {
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          var ex = { bushou: '', bihua: '' };
          ex = res.data[i];
          exs.push(ex)
        }
        that.setData({ examples: exs });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  tapToExp: function (e) {
    var that = this;
    var exs = [];
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = true
      } else {
        list[i].open = false
      }
      that.setData({ list: list })
    }
    app.Dictionary.getBushouByBihua(parseInt(id), function (res) {
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          var ex = { bushou: '', bihua:'' };
          ex = res.data[i];
          exs.push(ex)
        }
        that.setData({ examples: exs });
      }
    })
  },

  // toBihua: function (event) {
  //   wx.navigateTo({
  //     url: '../bushou/bihua/bihua',
  //   })
  // }
  
})