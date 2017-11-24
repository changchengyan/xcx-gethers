//import Modal from '../../../components/modal/modal.js'

var app = getApp()
Page({
  data: {
    name: '',
    src: "../../../images/word/star.png",
    listWords: [],
    errCount: 0,
    star: 3,
    errList: [],
    navigation_type: null,
    book_name: null,
    book_id: 0,
    lesson_name: null,
    bg_p: null,
    type_p: 'type_p',
    real: false,
    byebye: '',
    allWords: [],

  },
  //切换是否为错误单词
  toggleErrWord: function (e) {
    let { index } = e.currentTarget.dataset;
    let { listWords } = this.data;
    let { errList } = this.data;
    let errCount = 0;
    //errList=[];
    //let nerrList = [];
    let star;
    //listWords[index].error = !listWords[index].error             
    //   if (listWords[i].error) {
    //    // errCount += 1;
    //     console.log(listWords[i])
    errList.push(listWords[index]);
    //console.log(listWords.length)
    if (listWords.length - 1 == 0) {
      star = 0
    }
    else if (errList.length == 0) {
      star = 3
    }
    else if (errList.length > 0 && errList.length < 3) {
      star = 2
    }
    else if (errList.length >= 3) {
      star = 1
    }
    listWords.splice(index, 1);
    //   } 
    //   else {
    //   }       
    // }

    //去重
    // for (var i = 0; i < nerrList.length; i++) {
    //   if (errList.indexOf(nerrList[i]) == -1) {
    //     errList.push(nerrList[i]);
    //   }
    // }
    //console.log(listWords[0].display_word)
    console.log(errList);
    this.setData({ listWords, star, errList })
    if (this.data.errList.length == 1) {
      this.setData({ real: true, byebye: '' })
    }
    console.log('star=' + star)
  },

  //恢复错误单词
  delerr: function (e) {
    var { errindex } = e.currentTarget.dataset;
    //console.log(errindex);
    let that = this;
    var { errList, listWords, star } = that.data;
    console.log(errList[errindex])
    listWords.push(errList[errindex]);

    if (errList.length - 1 == 0) {
      star = 3
    }
    else if (errList.length > 0 && errList.length < 3) {
      star = 2
    }
    else if (errList.length >= 3) {
      star = 1
    }
    errList.splice(errindex, 1);

    this.setData({ listWords, errList, star })
    if (that.data.errList.length == 0) {
      that.setData({ real: false, byebye: '' })
    }
    console.log(star)
  },

  //提交
  submitTest: function () {
    let that = this;
    let { star, allWords, errList } = this.data;
    let { lessonId, testTime } = this.testInfo;
    let wordList = '', wrongWordList = '';
    for (let i = 0; i <= allWords.length - 1; i++) {
      wordList += `${allWords[i].word};`
    }
    for (let j = 0; j <= errList.length - 1; j++) {
      wrongWordList += `${errList[j].word};`
    }
    wordList = wordList.replace(/;$/gi, '')
    wrongWordList = wrongWordList.replace(/;$/gi, '');
    // console.log('wordList=' + wordList, 'wrongWordList=' + wrongWordList )
    // console.log(errList)
    app.Dictation.addTestRecord(lessonId, wordList, wrongWordList, star, parseInt(testTime), function (res) {
      console.log('提交测试成功')
      console.log('lessonId=' + lessonId, 'wordList=' + wordList, 'wrongWordList=' + wrongWordList, 'star=' + star, 'testTime=' + parseInt(testTime))
      console.log(that.data.navigation_type)
      var pages = getCurrentPages();
      var toPageIndex = 0;
      var beTrue=false;
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].route == 'pages/book/book' || pages[i].route == 'pages/word/word') {
          toPageIndex = pages.length - i - 1;
          beTrue=true;
          break;
        }
      }
      if (that.data.navigation_type == 'book') {
      	if(beTrue){//有book页
      		pages[pages.length - 1 - toPageIndex].setData({
	          isSubMit: true, star: that.data.star, currLessonId: lessonId, navigation_type: that.data.navigation_type, book_id: that.data.book_id, lesson_name: that.data.lesson_name
	        })
	        wx.navigateBack({
	          delta: toPageIndex
	        })
      	}else{//没有book页
      		var url='/pages/book/book?isSubMit=true&star='+that.data.star+'&currLessonId='+lessonId+'&navigation_type='+that.data.navigation_type+'&book_id='+that.data.book_id+'&lesson_name='+that.data.lesson_name;
      		wx.reLaunch({
					  url: url
					})
      	}
        
      }
      if (that.data.navigation_type == 'custom') {
      	if(beTrue){//有自定义单元列表页word
	        pages[pages.length - 1 - toPageIndex].setData({
	          isSubMit: true, star: that.data.star, currLessonId: lessonId, navigation_type: that.data.navigation_type, lesson_name: that.data.lesson_name
	        })
	        wx.navigateBack({
	          delta: toPageIndex
	        })
        }else{//没有自定义单元列表页word
      		var url='/pages/word/word?isSubMit=true&star='+that.data.star+'&currLessonId='+lessonId+'&navigation_type='+that.data.navigation_type+'&lesson_name='+that.data.lesson_name;
      		wx.reLaunch({
					  url: url
					})
      	}
      }
    })
  },
  /**
   * 页面参数需要lessonId和testTime
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      navigation_type: options.navigation_type,
      book_name: options.book_name,
      book_id: options.book_id,
      lesson_name: options.lessonName
    })
    //设置标题名字
    wx.setNavigationBarTitle({
      title: that.data.lesson_name
    });
    console.log(options.navigation_type, options.book_name, options.book_id, options.lessonName)
    let listWords = wx.getStorageSync('lastPlayList')
    console.log(options);
    for (let i in listWords) {
      //console.log(listWords[i].word.split(',')[0])
      listWords[i].display_word = listWords[i].word.split(',')[0]
    }
    //that.modal = new Modal()
    that.setData({ listWords, name: options.lessonName })
    that.data.allWords = that.data.allWords.concat(that.data.listWords)
    console.log(that.data.allWords)
    console.log(that.data.listWords)
    that.testInfo = options;
    console.log(options.lessonId)
    wx.playBackgroundAudio({
      dataUrl: "http://image.chubanyun.net/sound/Dictation/5371.mp3 ",
    })
  },
  onUnload: function () {
    wx.stopBackgroundAudio()
  },
  //显示错误单词
  displayErrWords: function () {
    let that = this;
    let { errList } = that.data;
    if (errList.length !== 0) {
      that.setData({ real: !that.data.real })
      // that.setData({ real: true, byebye: 'byebye' })
    }

  },
  //点击遮罩弹框消失
  // baby: function () {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //   let that = this;
  //   that.setData({ real: false, byebye: '' })
  // },
  catchTouchstart: function () {
    return false;
  },

})