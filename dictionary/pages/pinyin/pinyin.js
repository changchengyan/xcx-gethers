var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 'a',
        open: true,
      },
      {
        id: 'b',
      },
      {
        id: 'c',
      },
      {
        id: 'd',
      },
      {
        id: 'e',
      },
      {
        id: 'f',
      },
      {
        id: 'g',
      },
      {
        id: 'h',
      },
      {
        id: 'j',
      },
      {
        id: 'k',
      },
      {
        id: 'l',
      },
      {
        id: 'm',
      },
      {
        id: 'n',
      },
      {
        id: 'o',
      },
      {
        id: 'p',
      },
      {
        id: 'q',
      },
      {
        id: 'r',
      },
      {
        id: 's',
      },
      {
        id: 't',
      },
      {
        id: 'w',
      },
      {
        id: 'x',
      },
      {
        id: 'y',
      },
      {
        id: 'z',
      }
    ],
    examples: []
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
    var that = this;
    var id = that.data.list[0].id;
    var exs = [];
    app.Dictionary.getPinyinByLetter(id, function (res) {
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          exs.push(res.data[i].pinyin)
        }
        that.setData({ examples: exs });
      }
    })
  },

  tapToExp: function (e) {
    var that = this;
    var exs = [];
    var id = e.currentTarget.id, list = that.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = true
      } else {
        list[i].open = false
      }
      that.setData({list:list})
    }
    app.Dictionary.getPinyinByLetter(id, function (res) {
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          exs.push(res.data[i].pinyin)
        }
        that.setData({ examples: exs });
      }
    })
  },

  // toTune: function (e) {
  //   wx.navigateTo({ url: '../pinyin/tune/tune' })
  // }
})