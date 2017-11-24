//获取应用实例
var app = getApp()
Page({
  data: {
    repeatOnce: true,
    playSep: 5,
    showWord: true,
    playSequence: false,
    showToast: false,
    playing: false,
    currentWord: '',
    currentIndex: 1,
    wordCount: 0,
    progress: 0,
    playTime: 0,
    playTimeDes: '',
    wordList: null,
    playList: null,
    bookId:null,
    whichEnter:null
  },
  // 切换重复次数
  changeRepeatTime: function (e) {
    let that = this;
    that.setData({
      repeatOnce: !that.data.repeatOnce
    })
    that.refreshSetting({ repeatOnce: that.data.repeatOnce })
  },
  //切换间隔
  changePlayStep: function () {
    let that = this
    let { playSep } = that.data
    let curIndex = that.playStepList.indexOf(playSep)
    if (curIndex < that.playStepList.length - 1) {
      curIndex += 1
    }
    else {
      curIndex = 0
    }
    that.setData({ playSep: that.playStepList[curIndex] })
    that.refreshSetting({ playSep: that.data.playSep })
  },
  // 切换显示隐藏单词
  changeShowWord: function (e) {
    let that = this;
    that.setData({
      showWord: !that.data.showWord
    })
    that.refreshSetting({ showWord: that.data.showWord })
  },
  // 切换随机播放
  // changePlayType: function (e) {
  //   let that = this;
  //   let { playSequence, playing, currentIndex } = that.data
  //   //开始播放之前
  //   if (!playing && currentIndex == 0) {
  //     that.setData({
  //       playSequence: !that.data.playSequence
  //     })
  //     if (playSequence) {
  //       that.toast('已切换乱序听写', 2500)
  //     }
  //     else {
  //       that.toast('已切顺序序听写', 2500)
  //     }
  //   }
  //   else {
  //     if (playSequence) {
  //       that.setData({
  //         playSequence: !that.data.playSequence
  //       })
  //       that.toast('已切换乱序听写', 2500)
  //     }
  //     else {
  //       that.toast('若需要再次切换听写模式请重新开始听写', 2500)
  //       return false;
  //     }
  //   }
  //   that.refreshSetting({ playSequence: that.data.playSequence })
  //   that.updatePlayList()
  // },
  //切换播放
  togglePlay: function (e) {
    let that = this;
    let { playing } = that.data;
    if (playing) {
      that.pause()
    }
    else {
      that.play()
    }
  },
  //上一曲和下一曲
  seekPlayProgress: function (e) {
    let that = this;
    let { action } = e.target.dataset
    let { currentIndex, wordCount, playing } = this.data
    if (action == 'prev') {
      if (--currentIndex <= 0) {
        that.toast('当前已经是第一个了', 1000)
        return false;
      }
    }
    else if (action == 'next') {
      if (++currentIndex > wordCount) {
        that.toast('当前已经是最后一个了', 1000)
        return false;
      }
    }
    if (playing) {
      this.getCurrentPlayStatus(currentIndex)
    }
    else {
      this.updatePlayProgress(currentIndex)
    }
  },
  //展示toast
  toast: function (msg, duration) {
    let that = this;
    clearTimeout(that.timer)
    that.setData({
      showToast: true,
      toastContent: msg
    })
    that.timer = setTimeout(function () {
      that.setData({
        showToast: false
      })
    }, duration)
  },
  //播放
  play: function () {
    let that = this;
    let { currentIndex, playTime } = that.data;
    that.setData({ playing: true })
    that.getCurrentPlayStatus(currentIndex)
    that.tSec = setInterval(function () {
      playTime += 1
      that.setData({
        playTime,
        playTimeDes: that.formatTime(playTime)
      })
    }, 1000)
  },
  //暂停播放
  pause: function () {
    this.setData({ playing: false })
    this.stop()
  },
  //停止播放
  stop: function () {
    let that = this
    //clearInterval(that.tSec)
    wx.pauseBackgroundAudio()
  },
  //步进播放
  getCurrentPlayStatus: function (curIndex) {
    let that = this;
    
    clearTimeout(that.timerOne)
    clearTimeout(that.timerTwo)
    clearTimeout(that.timerThree)
    if (curIndex == 0) curIndex = 1;
    let { repeatOnce, playSep, wordCount, playList, playing } = that.data
    let playFlag = 1
    if (curIndex > wordCount && playing) {
      //播放结束
      clearInterval(that.tSec)
      that.setData({ playing: false })
        wx.navigateTo({
          url: `/pages/word/details/details?lessonId=${that.lessonId}&lessonName=${that.data.lessonName}&testTime=${that.data.playTime}`,
        })
        console.log(that.lessonId)
    }
    if (that.data.playing == false) return false;
    that.updatePlayProgress(curIndex)
    //第一次播放声音
    playHack(2)
    if (repeatOnce == false) {
      wx.onBackgroundAudioStop(function () {
        if (playFlag == 2) {
          that.timerOne = setTimeout(function () {
            that.getCurrentPlayStatus(++curIndex)
          }, playSep * 1000)
        }
        else {
          playFlag = 2
          that.timerTwo = setTimeout(function () {
            if (that.data.playing == false) return false;
            playHack(1)
          }, 1000)
        }
      })
    }
    else {
      wx.onBackgroundAudioStop(function () {
        that.timerThree = setTimeout(function () {
          that.getCurrentPlayStatus(++curIndex)
        }, playSep * 1000)
      })
    }
    //播放控制zz
    function playHack(soundType) {
      let { currentWord } = that.data;
      if (currentWord['word_mp3_url'].length == 0) {
        app.Dictation.getWordMp3Url(that.lessonId, currentWord['dictation_word'], currentWord['id'], soundType, function (res) {
          wx.playBackgroundAudio({
            dataUrl: res.mp3Url,
          })
          if (res.mp3IsFinished) {
            app.Dictation.getLessonById(that.lessonId, function (res) {
              let { wordlist } = res.data
              for (let i = 0; i <= wordlist.length - 1; i++) {
                for (let j = 0; j <= wordlist.length - 1; j++) {
                  if (wordlist[i].id == playList[j].id) {
                    playList[j] = wordlist[i]
                  }
                }
              }
              that.setData({
                wordList: wordlist,
                playList
              })
              that.updatePlayProgress(curIndex)
            })
          }
          else {
            console.log('用户mp3列表尚未生成完毕')
          }
        })
      }
      else {
        wx.playBackgroundAudio({
          dataUrl: that.getPlayUrl(currentWord['word_mp3_url'], soundType),
          fail: function (err) {
            console.log(err)
          }
        })
      }
    }
  },
  //时间格式化
  formatTime: function (sec) {
    let minute = parseInt(sec / 60);
    let second = sec % 60
    if (second.toString().length < 2) {
      second = `0${second}`
    }
    return `${minute}΄${second}˝`
  },
  //处理播放单词的url
  getPlayUrl: function (url, soundType) {
    let subfixArr = ['_nan.mp3', '_nv.mp3']
    let o_url = url.slice(0, -4)
    if (soundType == 1) {
      return o_url + subfixArr[0]
    }
    else {
      return o_url + subfixArr[1]
    }
  },
  //数组随机排序
  randomArr: function (arr, index) {
    let res = [],
      arrClone = arr.concat();
    for (let i = 0; i <= arr.length - 1; i++) {
      let j;
      if (i < index-1) {
        j = 0
      }
      else {
        j = Math.floor(Math.random() * arrClone.length);
      }
      res[i] = arrClone[j];
      arrClone.splice(j, 1);
    }
    return res;
  },
  //更新播放设置
  refreshSetting: function (obj) {
    let keys = Object.keys(obj);
    let playSetting = wx.getStorageSync('playSetting') || {};
    for (let i = 0; i < keys.length; i++) {
      playSetting[keys[i]] = obj[keys[i]]
    }
    wx.setStorage({
      key: 'playSetting',
      data: playSetting,
    })
  },
  //更新播放列表
  updatePlayList: function () {
    let { wordList, playList, playSequence, currentIndex } = this.data;
    if (playSequence) {
      this.setData({ playList: wordList })
    }
    else {
      let randomPlayList = this.randomArr(wordList, currentIndex)
      this.setData({ playList: randomPlayList })
    }
    if (currentIndex == 0) {
      this.updatePlayProgress(0)
    }
    let newPlayList = this.data.playList,
      lastPlayList = [];
    for (let i = 0; i <= newPlayList.length - 1; i++) {
      lastPlayList.push({ word: `${newPlayList[i]['dictation_word']}`, error: false })
    }
    wx.setStorage({
      key: 'lastPlayList',
      data: lastPlayList,
    })
  },
  //更新播放进度
  updatePlayProgress: function (curIndex) {
    let { playList, wordCount } = this.data
    let currentWord = curIndex == 0 ? playList[0] : playList[curIndex - 1]
    currentWord.display_word = currentWord.dictation_word.split(',')[0]
    this.setData({
      currentIndex: curIndex,
      currentWord,
      progress: (curIndex-1) / (wordCount-1) * 100,
    })
    if(wordCount==1){
      this.setData({ progress: 100 });
    }
  },
  //进度条走动
  progressGo:function() {
    
  },
  
  onLoad: function (options) {
    let that = this;
    let lessonName=options.lessonName;
    console.log(lessonName);
    // wx.setNavigationBarTitle({
    //   title: lessonName
    // })
    wx.getStorage({
      key: 'bookId',
      success: function (res) {
       console.log(res.data);
       that.setData({bookId:res.data});
      },
    });
    wx.getStorage({
      key: 'ReturnBook',
      success: function (res) {
        console.log(res.data);
        that.setData({ whichEnter: res.data });``
      },
    });
    let playSetting = wx.getStorageSync('playSetting') || {};
    that.lessonId = options.lessonId
    that.playStepList = [3, 5, 8]
    //初始化播放设置
    that.setData(playSetting)
    //初始化播放时间
    that.setData({ playTimeDes: that.formatTime(0) })
    //获取课程内容
    app.Dictation.getLessonById(that.lessonId, function (res) {
      let { wordlist, lesson_name } = res.data
      that.setData({
        wordList: wordlist,
        wordCount: wordlist.length,
        lessonName: lesson_name
      })
      //更新播放列表
      that.updatePlayList()
      that.play();
    })
  },
  onUnload: function () {
    this.pause();
    wx.stopBackgroundAudio()
    
  },
  onHide: function () {
    this.pause();
    wx.stopBackgroundAudio()
  }
})