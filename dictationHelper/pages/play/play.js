//获取应用实例
var app = getApp()
Page({
  data: {
    repeatOnce: false,
    playSep: 5,
    showWord: true,
    playSequence: false,
    showToast: false,
    playing: false,
    currentWord: '',
    currentIndex: 0,
    wordCount: 0,
    progress: 0,
    playTime: 0,
    playTimeDes: '',
    wordList: null,
    playList: null,
    bookId: null,
    whichEnter: null,
    navigation_type: null,
    book_name: null,
    book_id: 0,
    lessonName: null,
    star: 0,
    isLoading: false,
    isInplayAudio: true,
    playFlag: 1,
    inTwiceCenter: 0,// 1在第一次的间隔 2第二次的间隔
    nextLast: false,
    next: false,
    hideStop: false,
    starArr_empty: ["starOfEmpty", "starOfEmpty", "starOfEmpty"],
    starArr_oneStar: ["starOfFull", "starOfEmpty", "starOfEmpty"],
    starArr_twoStar: ["starOfFull", "starOfFull", "starOfEmpty"],
    starArr_threeStar: ["starOfFull", "starOfFull", "starOfFull"],
    isFirst: true,
    beTrue: true,
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
      // ifShow:!that.data.ifShow
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
    if (that.data.beTrue) {
      that.data.beTrue = false;
    }
    setTimeout(function () {
      that.data.beTrue = true;
    }, 1000)
    let { action } = e.target.dataset
    let { currentIndex, wordCount, playing, nextLast } = this.data;
    //振动
    wx.vibrateShort(function (res) {
      console.log(res)
    })
    that.setData({ nextLast: true })
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
    that.data.currentIndex = currentIndex;
    that.data.playFlag = 1;
    that.setData({ playFlag: 1 });
    that.setData({ next: true })
    if (playing) {
      console.log("播放中下一曲", currentIndex, that.data.hasPlaying)
      that.setData({ playing: true })
      that.setData({ playingPauseNext: false })
      clearTimeout(that.timerOne)
      clearTimeout(that.timerTwo)
      clearTimeout(that.timerThree)
      this.updatePlayProgress(currentIndex, function () {
        that.playHack(2);
      })

    }
    else {
      console.log("暂停中下一曲")
      if (that.data.hasPlaying) {
        that.setData({ playingPauseNext: true })//播放中先暂停再下一曲
        wx.stopBackgroundAudio();
      } else {
        that.setData({ playingPauseNext: false });
      }

      that.setData({ playing: false })
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
    let { currentIndex } = that.data;
    console.log('playFlag:' + that.data.playFlag)
    that.setData({ playing: true })
    //开始播放
    if (that.data.playFlag == 1) {
      that.playHack(2)	//播女声
    } else {//播男声
      if (that.data.inTwiceCenter == 2) {//第二次间隔里 播放下一首
        if (that.data.currentIndex >= that.data.wordCount) {//最后一个了
          clearInterval(that.tSec)
          clearTimeout(that.timerOne)
          clearTimeout(that.timerTwo)
          clearTimeout(that.timerThree)
          that.setData({ playing: false })
          that.setData({ hideStop: true })
          that.endListen = true;
          wx.redirectTo({
            url: `/pages/word/details/details?lessonId=${that.lessonId}&lessonName=${that.data.lessonName}&testTime=${that.data.playTime}&navigation_type=${that.data.navigation_type}&book_id=${that.data.book_id}&book_name=${that.data.book_name}`,
          })
          wx.stopBackgroundAudio()
          return false;
        }
        that.data.playFlag == 1;
        that.data.currentIndex = that.data.currentIndex + 1;
        that.updatePlayProgress(that.data.currentIndex);
        that.playHack(2)//播女声
      } else {
        that.data.playFlag == 2;
        that.playHack(1)//播男声
      }
    }
  },
  //暂停播放
  pause: function () {
    this.setData({ playing: false })
    wx.pauseBackgroundAudio();
    clearInterval(this.timer44);
  },
  //步进播放
  getCurrentPlayStatus: function (curIndex) {
    let that = this;
    let {
    		repeatOnce,
      playSep,
      wordCount,
      playList,
      playing,
      playTime
    	} = that.data
    that.data.playFlag = 1
    that.setData({
      playFlag: 1
    })
    if (that.data.playing == false) return false;
    that.updatePlayProgress(that.data.currentIndex);
    that.tSec = setInterval(function () {
      playTime += 1
      that.setData({
        playTime,
        playTimeDes: that.formatTime(playTime)
      })
    }, 1000)
    //第一次播放声音
    that.playHack(2)
    wx.onBackgroundAudioStop(function () {
      console.log("监听音乐停止播放", that.data.repeatOnce, that.data.playingPauseNext, that.data.playFlag, that.data.hasPlaying, that.data.playing)
      that.setData({ hasPlaying: false })
      clearInterval(that.timer44);
      if (that.data.hideStop) {//关闭页面会执行一次stop
        clearTimeout(that.timerOne)
        clearTimeout(that.timerTwo)
        clearTimeout(that.timerThree)
        return false;
      }
      if (that.data.repeatOnce == false) {
        if (that.data.playingPauseNext) { //播放中暂停后下一曲再播放会继续上一次的播放
          that.setData({ playingPauseNext: false });
          return false;
        }
        if (that.data.playFlag == 2) {
          that.data.inTwiceCenter = 2;

          clearTimeout(that.timerOne)
          clearTimeout(that.timerTwo)
          clearTimeout(that.timerThree)
          that.timerOne = setTimeout(function () {
            if (that.data.hasPlaying || !that.data.playing) {
              return false;
            }
            that.data.playFlag = 1;
            if (that.data.currentIndex >= that.data.wordCount) {//最后一个了
              clearInterval(that.tSec)
              clearTimeout(that.timerOne)
              clearTimeout(that.timerTwo)
              clearTimeout(that.timerThree)
              that.setData({ playing: false })
              that.setData({ hideStop: true })
              that.endListen = true;
              wx.redirectTo({
                url: `/pages/word/details/details?lessonId=${that.lessonId}&lessonName=${that.data.lessonName}&testTime=${that.data.playTime}&navigation_type=${that.data.navigation_type}&book_id=${that.data.book_id}&book_name=${that.data.book_name}`,
              })
              wx.stopBackgroundAudio()
              return false;
            }

            that.data.currentIndex = that.data.currentIndex + 1;
            that.updatePlayProgress(that.data.currentIndex)
            that.playHack(2)
          }, that.data.playSep * 1000)
        } else {
          that.data.inTwiceCenter = 1;
          that.data.playFlag = 2;
          that.setData({ playFlag: 2 })
          clearTimeout(that.timerTwo);
          that.timerTwo = setTimeout(function () {
            if (that.data.playing == false) return false;
            that.playHack(1)
          }, 1000)
        }
      } else {
        that.setData({ hasPlaying: false })
        clearTimeout(that.timerOne)
        clearTimeout(that.timerTwo)
        clearTimeout(that.timerThree)
        console.log("最后一个吗", that.data.currentIndex, that.data.wordCount)
        that.timerThree = setTimeout(function () {

          if (that.data.currentIndex >= that.data.wordCount) {//最后一个了
            clearInterval(that.tSec);
            clearTimeout(that.timerOne)
            clearTimeout(that.timerTwo)
            clearTimeout(that.timerThree)
            that.setData({ playing: false })
            that.setData({ hideStop: true })
            that.endListen = true;
            wx.redirectTo({
              url: `/pages/word/details/details?lessonId=${that.lessonId}&lessonName=${that.data.lessonName}&testTime=${that.data.playTime}&navigation_type=${that.data.navigation_type}&book_id=${that.data.book_id}&book_name=${that.data.book_name}`,
            })
            wx.stopBackgroundAudio();
            return false;
          }
          if (that.data.hasPlaying || !that.data.playing) {
            return false;
          }
          that.data.currentIndex = that.data.currentIndex + 1;
          that.updatePlayProgress(that.data.currentIndex);
          that.playHack(2)
          that.setData({ nowTimeSep: that.data.playSep })
        }, that.data.playSep * 1000)
      }
    })

  },
  //播放控制zz
  playHack: function (soundType) {
    var that = this;
    console.log(that.data.currentWord)
    that.data.inTwiceCenter = 0;
    if (soundType == 2) {//女声
      that.data.playFlag = 1;
    } else {
      that.data.playFlag = 2;
    }
    let { currentWord } = that.data;
    if (currentWord['word_mp3_url'].length == 0) {
      that.getWordMp3(curIndex, soundType);
    }
    else {
      var url = that.getPlayUrl(currentWord['word_mp3_url'], soundType);
      console.log("播放：" + url + '，soundType：' + soundType)
      wx.playBackgroundAudio({
        dataUrl: url,
        title: 'rays100',
        success: function () {
          that.setData({ hasPlaying: true })
          that.setData({ togglePlay: false })
          clearInterval(that.timer44);
          var i = 0;
          console.log("播放成功")
          that.timer44 = setInterval(function () {
            wx.getBackgroundAudioPlayerState({
              success: function (res) {
                var status = res.status
                var dataUrl = res.dataUrl
                var currentPosition = res.currentPosition
                var duration = res.duration;
                that.setData({ next: false });
                if (!duration) {
                  i++;
                }

                console.log(soundType, '男1女2', dataUrl, status, duration, currentPosition)
                if ((status == 2 && i > 2) || (status == 1 && i > 3 && duration == 0) || (status == 1 && i > 3 && duration != 0 && currentPosition == 0)) {
                  that.setData({ hasPlaying: false })
                  wx.playBackgroundAudio({
                    dataUrl: url,
                    title: 'rays100',
                    success: function () {
                      that.setData({ hasPlaying: true })
                      that.setData({ togglePlay: false })
                      i = 0;
                    }
                  })
                }
              }
            })
          }, 1000)
        },
        fail: function (err) {
          console.log(err)
          console.log('播放失败:' + that.data.playFlag);
          that.setData({ playing: false });
        }
      })
    }
  },
  // 或者单个mp3 
  getWordMp3: function (curIndex, soundType) {
    let that = this;
    let { repeatOnce, playSep, wordCount, playList, playing, currentWord } = that.data
    app.Dictation.getWordMp3Url(that.lessonId, currentWord['dictation_word'], currentWord['id'], soundType, function (res) {
      wx.playBackgroundAudio({
        title: 'rays100',
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
          });
          wx.playBackgroundAudio({
            title: 'rays100',
            dataUrl: that.getPlayUrl(currentWord['word_mp3_url'], soundType),
            fail: function (err) {
              // console.log(err)
            }
          })
          that.updatePlayProgress(curIndex)
        })
      }
      else {
        that.getWordMp3();

      }
    })
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
    let subfixArr = ['_nan', '_nv']
    let o_url = url.slice(0, -4);
    let o_url_type = url.slice(-4)

    if (soundType == 1) {
      return o_url + subfixArr[0] + o_url_type;
    }
    else {
      return o_url + subfixArr[1] + o_url_type;
    }
  },
  //数组随机排序
  randomArr: function (arr, index) {
    let res = [],
      arrClone = arr.concat();
    for (let i = 0; i <= arr.length - 1; i++) {
      let j;
      if (i < index - 1) {
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
  updatePlayProgress: function (curIndex, cb) {
    let { playList, wordCount } = this.data
    let currentWord = curIndex == 0 ? playList[0] : playList[curIndex - 1]
    currentWord.display_word = currentWord.dictation_word.split(',')[0]
    this.setData({
      currentIndex: curIndex,
      currentWord,
      progress: curIndex / wordCount * 100,
    })
    //  if (wordCount == 1) {
    //    this.setData({ progress: 100 });
    //  }
    if (cb) {
      cb();
    }
  },

  onLoad: function (options) {
    let that = this;
    //console.log(options)
    // let lessonName = options.lessonName;
    // console.log(lessonName);
    // wx.setNavigationBarTitle({
    //   title: lessonName
    // })
    // 保持屏幕常亮
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
    }
    that.setData({
      lessonName: options.lessonName,
      navigation_type: options.navigation_type,
      book_name: options.bookname,
      book_id: options.book_id,
      lesson_id: options.lessonId
    })
    that.lessonId = options.lessonId;
    //设置标题名字
    wx.setNavigationBarTitle({
      title: that.data.lessonName
    });
    //  wx.getStorage({
    //    key: 'bookId',
    //    success: function (res) {
    //      that.setData({ bookId: res.data });
    //    },
    //  });
    wx.getStorage({
      key: 'ReturnBook',
      success: function (res) {
        // console.log(res.data);
        that.setData({ whichEnter: res.data });
      },
    });
    let playSetting = wx.getStorageSync('playSetting') || {};
    // that.lessonId = options.lessonId;

    that.playStepList = [3, 5, 8]
    //初始化播放设置
    that.setData(playSetting)
    //初始化播放时间
    that.setData({ playTimeDes: that.formatTime(0) })
    //获取课程内容
    app.Dictation.getLessonById(options.lessonId, function (res) {
      let { wordlist, lesson_name, star } = res.data;
      console.log(star);
      if (wordlist[0].word_mp3_url) {
        that.setData({ isLoading: true })

      } else if (!wordlist[0].word_mp3_url) {
        setTimeout(function () {
          that.setData({ isLoading: true });
        }, 2000);
        if (that.data.isLoading) {
          wx.showToast({
            title: '网络龟速中...',
            duration: 2000
          });
        }
      }
      that.setData({
        wordList: wordlist,
        wordCount: wordlist.length,
        lessonName: lesson_name,
        star: star
      });
      //更新播放列表
      that.updatePlayList();
      //加载完成后开始播放
      if (that.data.isLoading) {
        //that.play();
        that.setData({ playing: true })
        that.data.currentIndex = 1;
        that.updatePlayProgress(1);
        that.getCurrentPlayStatus(that.data.currentIndex);
      }
    })

    //监听音乐暂停时
    wx.onBackgroundAudioPause
      (
      function () {
        that.data.isInplayAudio = true;
        console.log("监听音乐暂停")
      }

      )
    //监听音乐播放
    wx.onBackgroundAudioPlay(
      function () {
        that.data.isInplayAudio = false;
        console.log("监听音乐播放")
      }
    )
  },




  onUnload: function () {
    this.pause();
    this.setData({ hideStop: true })
    //wx.stopBackgroundAudio()
    clearTimeout(this.timerOne)
    clearTimeout(this.timerTwo)
    clearTimeout(this.timerThree)

  },
  onHide: function () {
    // let that = this;
    // this.pause();
    // wx.stopBackgroundAudio()
    this.setData({ isFirst: false });
  },
  onShow: function () {
    var that = this;
    // 保持屏幕常亮
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
    }
    //判断网络
    wx.getNetworkType
      ({
        success: function (res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType == "none") {
            that.setData({ isLoading: true });
            wx.showToast({
              title: '网络异常',
              duration: 2000
            });
            // setTimeout(function () {
            //   that.setData({ isLoading: false });
            // }, 2000);
          }
        }
      });
    //that.setData({ playing: false }) 
    if (that.endListen) {//最后一个了   			
      wx.redirectTo({
        url: `/pages/word/details/details?lessonId=${that.lessonId}&lessonName=${that.data.lessonName}&testTime=${that.data.playTime}&navigation_type=${that.data.navigation_type}&book_id=${that.data.book_id}&book_name=${that.data.book_name}`,
      })
      wx.stopBackgroundAudio()
    }

    //记录听写课程
    if (that.data.navigation_type === "book") {
      var lastLesson = [];
      var isHas = true;
      try {
        var value = wx.getStorageSync('lastLesson')
        if (value && value.length) {
          value.forEach(function (item, index, array) {
            if (array[index].book_id == that.data.book_id) {
              isHas = false;
              array[index].lesson_id = that.data.lesson_id;
            }
          })
          if (isHas){
            value.push({ book_id: that.data.book_id, lesson_id: that.data.lesson_id })
          }
          wx.setStorageSync("lastLesson", value);
         
        }else {
          lastLesson.push({ book_id: that.data.book_id, lesson_id: that.data.lesson_id })
          wx.setStorageSync("lastLesson", lastLesson);
        }
      } catch (e) {
        lastLesson = {}
      }

      console.log(lastLesson)
     
    }
  }




})