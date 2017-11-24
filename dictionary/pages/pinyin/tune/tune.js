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
      },
      { id: '一声' },
      { id: '二声' },
      { id: '三声' },
      { id: '四声' },
      { id: '轻声' }

    ],
    words: [],
    scroll_top:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var py = options.pinyin;
    py = py.replace(/ü/g,"v");
    var that = this;
    var temp = [];
    // that.data.whole = temp;
    var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr0 = []
    that.data.arr1 = arr1;
    that.data.arr2 = arr2;
    that.data.arr3 = arr3;
    that.data.arr4 = arr4;
    that.data.arr0 = arr0;
    //设置导航条名称
    wx.setNavigationBarTitle({
      title: py || ""
    })

    app.Dictionary.getWordByPinyin(py, function (res) {
      // console.log(res.data);
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          var word = { zi: '', pinyin: '', bihua: ''};
          word = res.data[i];
          temp.push(word);
          
          // //按笔画数排列
          // temp.sort(function (s1, s2) { 
          //   var x1 = s1.bihua;
          //   var x2 = s2.bihua;
          //   if (x1 < x2) {
          //     return -1;
          //   }
          //   if (x1 > x2) {
          //     return 1;
          //   }
          //   return 0;
          // })  
        }
        for (var i = 0, len = temp.length; i < len; ++i) {
          var one = new RegExp("ā").test(temp[i].pinyin) || new RegExp("ē").test(temp[i].pinyin) || new RegExp("ō").test(temp[i].pinyin) || new RegExp("ī").test(temp[i].pinyin) || new RegExp("ū").test(temp[i].pinyin) || new RegExp("ǖ").test(temp[i].pinyin);
          var two = new RegExp("á").test(temp[i].pinyin) || new RegExp("é").test(temp[i].pinyin) || new RegExp("ó").test(temp[i].pinyin) || new RegExp("í").test(temp[i].pinyin) || new RegExp("ú").test(temp[i].pinyin) || new RegExp("ǘ").test(temp[i].pinyin);
          var three = new RegExp("ǎ").test(temp[i].pinyin) || new RegExp("ě").test(temp[i].pinyin) || new RegExp("ǒ").test(temp[i].pinyin) || new RegExp("ǐ").test(temp[i].pinyin) || new RegExp("ǔ").test(temp[i].pinyin) || new RegExp("ǚ").test(temp[i].pinyin);
          var four = new RegExp("à").test(temp[i].pinyin) || new RegExp("è").test(temp[i].pinyin) || new RegExp("ò").test(temp[i].pinyin) || new RegExp("ì").test(temp[i].pinyin) || new RegExp("ù").test(temp[i].pinyin) || new RegExp("ǜ").test(temp[i].pinyin);

          var zero = ["ɑ", "[bpmfdtnkhjqxrzcsyw]o$", "[bpmfdtnkhjqxrzcsyw]e$", "[bpmfdtnkhjqxrzcsyw]i$", "[bpmfdtnkhjqxrzcsyw]u$", "[bpmfdtnkhjqxrzcsyw]ü$", "ɑi", "ei", "ui", "ɑo", "ou", "iu", "ie", "üe", "er", "ɑn", "en", "in", "un", "ün", "yue", "yuɑn", "zhi", "shi", "chi", "zhe", "she", "che", "zhu$", "shu$", "chu$"];
          var a = temp[i].pinyin;

          for (var j in zero) {
            if (new RegExp(zero[j]).test(a)) {
              var word = { zi: '', pinyin: '', bihua: '' };
              word = temp[i];
              arr0.push(word);
            }
          }

          if (one == true) {
            var word = { zi: '', pinyin: '', bihua: '' };
            word = temp[i];
            arr1.push(word);
          }
          if (two == true) {
            var word = { zi: '', pinyin: '', bihua: '' };
            word = temp[i];
            arr2.push(word);
          }
          if (three == true) {
            var word = { zi: '', pinyin: '', bihua: '' };
            word = temp[i];
            arr3.push(word);
          }
          if (four == true) {
            var word = { zi: '', pinyin: '', bihua: '' };
            word = temp[i];
            arr4.push(word);
          }
        }
        temp = [].concat(arr0).concat(arr1).concat(arr2).concat(arr3).concat(arr4);
        temp = temp.filter(function (el, idx, self) {
          return self.indexOf(el) === idx;
        })
        that.data.whole = temp;
        that.setData({
          words: temp,
        });

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //点击左侧
  tapToExp: function (e) {
    var that = this, 
    id = e.currentTarget.id, 
    list = that.data.list, 
    //words = that.data.words, 
    //whole = that.data.whole,
    top = that.data.scroll_top,
    temp = [];
    //var arr1 = [], arr2 = [], arr3 = [], arr4 = [],arr0 = []
    //words = whole;
    // console.log(words)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = true
      } else {
        list[i].open = false
      }
    }



    // //判断一声二声三声四声轻声
    // for (var i = 0, len = words.length; i < len; ++i) {
    //   var one = new RegExp("ā").test(words[i].pinyin) || new RegExp("ē").test(words[i].pinyin) || new RegExp("ō").test(words[i].pinyin) || new RegExp("ī").test(words[i].pinyin) || new RegExp("ū").test(words[i].pinyin) || new RegExp("ǖ").test(words[i].pinyin);
    //   var two = new RegExp("á").test(words[i].pinyin) || new RegExp("é").test(words[i].pinyin) || new RegExp("ó").test(words[i].pinyin) || new RegExp("í").test(words[i].pinyin) || new RegExp("ú").test(words[i].pinyin) || new RegExp("ǘ").test(words[i].pinyin);
    //   var three = new RegExp("ǎ").test(words[i].pinyin) || new RegExp("ě").test(words[i].pinyin) || new RegExp("ǒ").test(words[i].pinyin) || new RegExp("ǐ").test(words[i].pinyin) || new RegExp("ǔ").test(words[i].pinyin) || new RegExp("ǚ").test(words[i].pinyin);
    //   var four = new RegExp("à").test(words[i].pinyin) || new RegExp("è").test(words[i].pinyin) || new RegExp("ò").test(words[i].pinyin) || new RegExp("ì").test(words[i].pinyin) || new RegExp("ù").test(words[i].pinyin) || new RegExp("ǜ").test(words[i].pinyin);
     
    //   var zero = ["ɑ", "[bpmfdtnkhjqxrzcsyw]o$", "[bpmfdtnkhjqxrzcsyw]e$", "[bpmfdtnkhjqxrzcsyw]i$", "[bpmfdtnkhjqxrzcsyw]u$", "[bpmfdtnkhjqxrzcsyw]ü$", "ɑi", "ei", "ui", "ɑo", "ou", "iu", "ie", "üe", "er", "ɑn", "en", "in", "un", "ün", "yue", "yuɑn", "zhi", "shi", "chi", "zhe", "she", "che", "zhu$", "shu$", "chu$"];
    //   var a = words[i].pinyin;
    
    //   for(var j in zero){
    //     if (new RegExp(zero[j]).test(a)){
    //       var word = { zi: '', pinyin: '', bihua: '' };
    //       word = words[i];
    //       arr0.push(word);
    //     }
    //   } 
     
    //   if (one == true) {
    //     var word = { zi: '', pinyin: '', bihua: '' };
    //     word = words[i];
    //     arr1.push(word);
    //   }
    //   if (two == true) {
    //     var word = { zi: '', pinyin: '', bihua: '' };
    //     word = words[i];
    //     arr2.push(word);
    //   }
    //   if (three == true) {
    //     var word = { zi: '', pinyin: '', bihua: '' };
    //     word = words[i];
    //     arr3.push(word);
    //   }
    //   if (four == true) {
    //     var word = { zi: '', pinyin: '', bihua: '' };
    //     word = words[i];
    //     arr4.push(word);
    //   }
    // }

    switch(id){
      case "全部":
        temp = that.data.whole;
        break;
      case "一声":
        temp = that.data.arr1;
        break;
      case "二声":
        temp = that.data.arr2;
        break;
      case "三声":
        temp = that.data.arr3;
        break;
      case "四声":
        temp = that.data.arr4;
        break;
      default:
        temp = that.data.arr0;
        break;
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
      scroll_top: top
    });
  },

  toWordDetail: function (e) {
    var inputValue = e.currentTarget.dataset.word;
    wx.navigateTo({
      url: '../../detail/detail?inputValue=' + inputValue,
    })
  }
})