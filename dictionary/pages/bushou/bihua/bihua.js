var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: '全部',
        open: true
      }
    ],
    words:[],
    pageIndex: 1,
    scroll_top:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var bs = options.bushou;
    var bh = options.bihua;
    that.data.bh = bh;
    var temp = [];
    that.data.whole = temp;
    var list = that.data.list;
    var a = [], arr = [];
    //设置导航条名称
    wx.setNavigationBarTitle({
      title: bs
    })
    //初始
    app.Dictionary.getWordByBushou(bs, function (res) {
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          var word = { zi: '', pinyin: '', bihua: '' };
          word = res.data[i];
          temp.push(word);

          var li = res.data[i].bihua;
          a.push(li);
        }

        //判断返回数组是否大于100
        if (res.data.length > 100) {
          var r = that.split_array(temp, 100);
          temp = r[0];
        }

        //过滤重复元素
        // for (var i in a) {
        //   if (arr.indexOf(a[i]) == -1) { arr.push(a[i]) }
        // }
        arr = a.filter(function(el,idx,self){
          return self.indexOf(el) === idx;
        })
        for (var i in arr) {
          var li = { id: '' };
          li.id = (arr[i] - bh) + "画";
          list.push(li);
        }

        that.setData({
          words: temp,
          // whole: temp,
          list: list
        });

      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //按笔画数显示字
  tapToExp: function (e) {
    var that = this, 
        id = e.currentTarget.id, 
        list = that.data.list, 
        words = that.data.words, 
        whole = that.data.whole, 
        top = that.data.scroll_top,
        bh = that.data.bh,
        temp = [];
    words = whole;
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i].id == id) {
        list[i].open = true
      } else {
        list[i].open = false
      }
    }
    if (id == "全部") {
      temp = words;
       if (temp.length > 100) {
        var r = that.split_array(temp, 100);
        temp = r[0]
      } 
    } else {
      for (var i = 0, len = words.length; i < len; i++) {
        if ((words[i].bihua-bh) == parseInt(id)) {
          var word = { zi: '', pinyin: '', bihua: '' };
          word = words[i];
          temp.push(word);
        }
      }
    }

    //回到顶部
    if (top == 1) {
      top = 0;
    } else {
      top = 1;
    }

    that.setData({
      list: list,
      words: temp,
      scroll_top:top,
      pageIndex: 1
    });
    
   
  },

  //上滑加载
  onReachBottom: function (e) {
    var that = this, 
    list = that.data.list,
    id = that.data.list.id,
    pageIndex = that.data.pageIndex,
    idx;
    //判断 who's open is true
    for (var i = 0, len = list.length; i < len; i++) {
      if(list[i].open == true){
        idx = list[i].id
      }
    }
    if (idx == "全部") {
    that.processData(pageIndex);
    pageIndex++;
    that.setData({
      pageIndex: pageIndex,
    }) 
    }
  }, 

  //分页
  processData: function (pageIndex) {
    var that = this, 
    list = that.data.list,
     words = that.data.words, 
     whole = that.data.whole, 
     temp = [];
    if(whole.length > 100){
      var max = Math.floor(whole.length / 100);
      if(pageIndex <= max){
      var r = that.split_array(whole, 100);
      temp = words.concat(r[pageIndex]);
      // console.log(temp);
      }else{
        temp = words;
        wx.showToast({
          title: '没有更多啦',
        })
      }
    }else{
      temp = words
    }
    that.setData({
      list: list,
      words: temp
    });
  },

  // 将一个数组切割成小数组
  split_array: function (arr, len) {
    var a_len = arr.length;
    var result = [];
    for (var i = 0; i < a_len; i += len) {
      result.push(arr.slice(i, i + len));
    }
    return result;
  },


  toWordDetail: function (e) {
    var inputValue = e.currentTarget.dataset.word;
    wx.navigateTo({
      url: '../../detail/detail?inputValue=' + inputValue,
    })
  }
})