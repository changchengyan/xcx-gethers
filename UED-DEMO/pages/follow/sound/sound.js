// pages/view/sound/sound.js
var template = require("../../../utils/template.js");
var app = getApp();
Page({
  data: {
    tops: 0,
    // consultTops:0,
    lesson_name: "第三章",
    positions: 'relations',
    showSelf: [{ name: "目录", ifshow: 'yes' }, { name: "详情", ifshow: 'no' }, { name: "字幕", ifshow: 'no' },],
    clickThisNav: 1,
    ifShow: 1,
    bookMatch: {},
    bookId: 0,
    sound: {
      total_count: -1,
      count: -1,
      list: [],
      playList: []
    },
    audioIndex: 0,
    playIndex: 0,
    loadding: false,
    loadLastId: 0,
    loadMore: true,
    loadMoreCount: 20,
    time_length: 0,
    timeBeginText: "00:00",
    timeEndText: "00:00",
    numTimeEnd: "",
    proLoadWidth: "0%",
    proLightWidth: "0%",
    playPauseStyle: "play-out",
    browserId: 0,
    fileBrowserId: 0,
    singInfo: { noDrag: true },
    proTouch: { isdrag: false },
    myList: {
      count: 0,
      list: []
    },
    systemInfo: {},
    progressValue: 0,
    progressMax: 'NaN',
    isShare: false,
    soundSize: 0,
    isFirst: false, //是不是第一次弹出提示框并且点了true  您正在使用手机流量收听，是否继续收听 --是 true 否 false
    dbClick: true,
    firstShow: true,
    appInstance: {
      currentPosition: "00:00"
    },
    direction: "up",
    loading: false,
    oneCopyOfTime: 0,
    tmp_timeCopy: 0,

    musicFlag: true,
    musicList_goUp: 45,
    tmp_musicList_sum: 0,
    color: {
      colorBlack: "",
      colorGray: "",
      coverImg: ""
    },
    playIndex: 0,
    bookImg: "../../images/demoBook.png",
    bookName: "义务教育课程标准实验教科书 语文六年级下册",
    playMusicFlag: null,
    bookDetail: { adaptivePopulation: "", discription: "", Press: "" },
    paragraphList: [],
    wordColorList: [],
    originColorList: [],
    getStrCount: 0,
    getNowStrTotal: 0,
    timeSlice: null,
    randomMusicTangle: [],
    scrollFlag: 1,
    playOrder:1//乱序播放为1，顺序播放为2，单曲播放为3，循环播放为4
  },
  onShareAppMessage: function () {
    var that = this;
    var title = that.data.bookMatch.instance_name;
    var path = "/pages/view/sound/sound?match_id=" + that.data.bookMatch.id + "&match_sales_id=" + that.data.bookMatch.match_sales_id + "&match_sales_name=" + that.data.bookMatch.match_sales_name + "&book_id=" + that.data.bookId;
    return app.codeBook.onShareAppMessage(title, path, that.data.bookMatch.match_sales_id, that.data.bookMatch.match_sales_name, "小程序码书阅读分享");
  },
  onShow: function () {
    var that = this;
    this.setData({ hide: false })
  },
  onHide: function () {
    // 页面隐藏
    this.setData({ firstShow: false });
  },
  audioTime: null,
  onLoad: function (options) {
    /*
     * 本页面仅调用音频暂停、播放、控制音乐播放进度
     * 停止播放在退出书籍主页时调用，所以不要监听停止播放做业务操作
     */
    let that = this;
    let { wordColorList } = that.data;
    // 页面初始化 options为页面跳转所带来的参数
    var match_id = options.match_id;
    var match_sales_id = options.match_sales_id;
    var match_sales_name = options.match_sales_name;
    that.setData(getApp().globalData);
    that.data.audioIndex = 0;
    that.data.playIndex = 0;
    that.ended = false; //ended表示音频是否播放到末尾
    var color = options.color || "5";
    switch (color) {
      case "1":
        this.setData({ "color.colorBlack": "#2a1347", "color.colorGray": "#594275", "color.coverImg": "http://f3.5rs.me/upload/20170830/2017_08_30_151904673.jpg" });
        break;
      case "2":
        this.setData({ "color.colorBlack": "#565e00", "color.colorGray": "#798803", "color.coverImg": "http://f3.5rs.me/upload/20170831/2017_08_31_113849460.jpg" });
        break;
      case "3":
        this.setData({ "color.colorBlack": "#033a5f", "color.colorGray": "#2a96dd", "color.coverImg": "http://f3.5rs.me/upload/20170831/2017_08_31_114259889.jpg" });
        break;
      case "4":
        this.setData({ "color.colorBlack": "#7d4100", "color.colorGray": "#e18624", "color.coverImg": "http://f3.5rs.me/upload/20170831/2017_08_31_114318078.jpg" });
        break;
      case "5":
        this.setData({ "color.colorBlack": "#412c0e", "color.colorGray": "#fff", "color.coverImg": "http://f3.5rs.me/upload/20170831/2017_08_31_114330689.jpg" });
        break;
      // #c09659
    }
    let adaptivePopulations = "适读人群:语言文字工作才、教育界读者、大众读者。";
    let discriptions = "一部久享盛誉的规范型词典：《现代汉语词典》按照国务院指示编写，以确定词汇规范为目的，" + "以推广普通话、促进汉语规范化为宗旨。";
    let Presses = "一个专业权威的学术机构：中国社会科学院"
    let { adaptivePopulation, discription, Press } = that.data.bookDetail;
    // 字幕数据
    let titles = ["中国加入WTO了!英语作为人们谋生发展的工具越发显得重要起来，甚至有人把文盲的范畴扩大到不懂外语的人，很多人都希望精通英语以为自己的生存和发展创造优势", "然而，缺乏充足的时间和精力，缺少真正高效实用的学习方法和辅助工具，以低效乏味的记忆方式，面对数以万计的英语词汇和惊人的遗忘速度，这是一场多么没有希望的战斗，多少人经过长年累月的争扎，不得不退出了战场。如果您曾大规模记忆英语单词，您一定会发现，有"];
    let tilteparagraph = [];
    for (var i = 0; i < titles.length; i++) {
      tilteparagraph[i] = titles[i].split('');
    }

    let getStrCount = 0;
    for (let j = 0; j < titles.length; j++) {
      getStrCount += titles[j].split('').length;
    }
    for (let k = 0; k < titles.length; k++) {
      let tmpSaveColor = [];
      for (let i = 0; i < titles[k].length; i++) {
        tmpSaveColor[i] = "#333";
        if (i == titles[k].length - 1) {
          wordColorList.push(tmpSaveColor);
        }
      }
    }
    that.setData({ adaptivePopulation: adaptivePopulations, discription: discriptions, Press: Presses, "paragraphList": tilteparagraph, getStrCount: getStrCount, wordColorList: wordColorList, originColorList: wordColorList });
    //如果是分享进入，则要将书籍添加到书架
    that.data.bookId = options.book_id;
    if (options.share == "true") {
      app.userLogin(function () { app.codeBook.addBookById(that.data.bookId, function () { }); });
      that.setData({ isShare: true });
    }

    //初始化监听
    that.listenInit();

    //获取系统消息
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.search(/iPhone/) == -1) {
          //不是iPhone
          that.setData({ 'systemInfo.model': "Android" });
        } else {
          //是iPhone
          that.setData({ 'systemInfo.model': "iPhone" });
        }
      }
    })
    //获取网络消息
    wx.getNetworkType({
      success: function (res) {
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == "none") {
          wx.showToast({
            title: '网络异常',
            duration: 2000
          });

        }
      }
    });
    that.setData({ loadding: true });
    //首次加载文件资源列表  
    let res = {};
    res.list = [{
      file_name: "Track01",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "1",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track02",
      file_size: "1606124",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8090",
      img_height: "0",
      img_width: "0",
      rownumber: "2",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track03",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "3",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track04",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "4",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track05",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "5",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track06",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "6",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track07",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "7",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track08",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "8",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track09",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "9",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track10",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "10",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track11",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "11",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track12",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "12",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track13",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "13",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track14",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "14",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track15",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "15",
      time_length: "05:45",
      topsize: "0"
    },
    {

      file_name: "Track16",
      file_size: "486829",
      file_url: " http://sc1.111ttt.com/2016/1/12/10/205102135140.mp3",
      id: "8089",
      img_height: "0",
      img_width: "0",
      rownumber: "16",
      time_length: "05:45",
      topsize: "0"
    }

    ]
    if (res.list.length !== 0) {
      that.setData({ loadding: false });
    }
    var data = res;
    var list = data.list;
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        that.data.loadLastId = list[i].rownumber;
        list[i]["time_length"] = app.formatTime(list[i]["time_length"]);
      }
      var time = app.formatTime(list[0].time_length);
      that.setData({ timeEndText: time })
      //填充文件列表数据
      that.setData({ "sound.list": list, "sound.playList": list, "sound.total_count": that.data.loadLastId });
    } else if (list.length == 0) {
      that.setData({ sound: data });
    }
    //如果没有取到20条，则不需要滚动加载
    if (list.length != that.data.loadMoreCount) {
      that.setData({ loadMore: false });
    }
    wx.setStorageSync('oneCopyOfTime', 0);
    // that.getSeconds();
    that.matchTimeAndWords();
  },
  matchTimeAndWords: function () {
    let that = this;
    let { timeEndText, getStrCount } = that.data;
    let timeTmp = timeEndText.split(":");
    let hoursTmp = 0, minTmp, secondTmp;
    if (timeTmp.length == 3) {
      hoursTmp = Number(timeTmp[0].replace(/^0/g, ''));
      if (hoursTmp != 0) {
        hoursTmp = hoursTmp * 60;
      }
      minTmp = Number(timeTmp[1].replace(/^0/g, ''));
      if (minTmp != 0) {
        minTmp = minTmp * 60;
      }
      secondTmp = Number(timeTmp[2].replace(/^0/g, ''));
    } else {
      minTmp = Number(timeTmp[0].replace(/^0/g, ''));
      if (minTmp != 0) {
        minTmp = minTmp * 60;
      }
      secondTmp = Number(timeTmp[1].replace(/^0/g, ''));
    }
    let totalSecond = hoursTmp + minTmp + secondTmp;
    let timeSlice = getStrCount / totalSecond;
    that.setData({ timeSlice: Math.ceil(timeSlice * 1000) })
  },
  chameleon: function () {
    let that = this;
    let { wordColorList, getNowStrTotal, getStrCount, timeSlice } = that.data;
    let tmpColorArr = [];
    for (let k = 0; k < wordColorList.length; k++) {
      tmpColorArr = tmpColorArr.concat(wordColorList[k])
    }
    for (let i = 0; i < getStrCount; i += timeSlice / 1000) {
      if (i <= getNowStrTotal) {
        tmpColorArr[Math.ceil(i)] = "#62d8b6";
      }
      if (i > getNowStrTotal) {
        break;
      }
    }
    let tmp_merge = []
    for (let j = 0; j < wordColorList.length; j++) {
      let tmp_len = wordColorList[j].length;
      tmp_merge.push(tmpColorArr.splice(0, tmp_len));
    }
    that.setData({ wordColorList: tmp_merge })
  },
  loadMoreList: function (e) {
    var that = this;
    //有必要加载更多，且没在请求加载中
    if (that.data.loadMore && !that.data.loadding) {
      that.setData({ loadding: true });
      var match_id = that.data.bookMatch.id;
      var match_sales_id = that.data.bookMatch.match_sales_id;
      var match_sales_name = that.data.bookMatch.match_sales_name;
      var last_id = that.data.loadLastId;
      var count = that.data.loadMoreCount;
    }
  },
  listenInit: function () {
    //初始化监听
    var that = this;
    //选定音频的长度（单位：s），只有在当前有音乐播放时返回
    that.duration = 0;
    //选定音频的播放位置（单位：s），只有在当前有音乐播放时返回
    that.currentPosition = 0;
    //音频播放完毕
    wx.onBackgroundAudioStop(
      function () {
        console.log("播放停止,从头播放", that.data.singInfo.duration)
        if (!that.data.beSlider) {
          if (that.data.singInfo.duration != 0 && that.data.singInfo.duration != null && !that.data.hide) {
            that.audioNext();
          } else {
            wx.getNetworkType({
              success: function (res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                var networkType = res.networkType;
                if (networkType == 'none') {
                  that.setData({ playPauseStyle: "play-out" });
                  wx.showToast({
                    title: '网络异常',
                    duration: 2000
                  });
                }
              }
            })

          }

        }
      }

    );

    //音乐播放时
    wx.onBackgroundAudioPlay(
      function () {
        //启用监听定时器        
        that.setData({ playPauseStyle: "play-in" });
        // console.log("开始播放")
      }
    );
    //音乐暂停时
    wx.onBackgroundAudioPause(
      function () {
        //清除监听定时器            
        that.setData({ playPauseStyle: "play-out" });
        // console.log("暂停播放")
      }
    );
  },
  listenAuido: function () {
    var that = this;
    let { tmp_timeCopy, time_length, getNowStrTotal, timeSlice } = that.data;
    // , musicList_goUp, tmp_musicList 
    wx.getStorage({
      key: 'oneCopyOfTime',
      success: function (res) {
        getNowStrTotal = res.data;
      },
    });
    that.chameleon();
    getNowStrTotal += timeSlice / 1000;
    that.setData({ getNowStrTotal: getNowStrTotal })
    wx.setStorageSync("oneCopyOfTime", getNowStrTotal)
    //播放时监听音乐
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status;
        console.log(status);
        if (status == 1) {
          //播放中
          that.setData({ timeBeginText: that.getTimeText(res.currentPosition) });
          that.setData({ timeEndText: that.getTimeText(res.duration), numTimeEnd: res.duration });
          //装载进度
          that.setData({ proLoadWidth: res.downloadPercent + "%" });
          //播放进度
          var plwidth = (res.currentPosition / res.duration * 100);
          that.setData({ proLightWidth: plwidth + "%" });
          that.setData({ 'proTouch.proNowLeft': plwidth });
          that.setData({ progressValue: res.currentPosition })
          that.setData({ progressMax: res.duration });
          that.downloadTime = Math.floor(res.downloadPercent / 100 * res.duration);
          that.currentPosition = res.currentPosition;
        } else if (status == 2) {
          //没有音乐在播放
          setTimeout(function () {
            if (res.duration != 0 && res.currentPosition != 0) {
              if (!that.data.hide) {
                console.log("是不是在这里")
                that.audioNext();
              }
            }
          }, 3000)

          if (that.data.progressMax == "NaN") {
            that.setData({ playPauseStyle: "play-out" });
          }
          that.setData({ timeBeginText: that.getTimeText(0) });
        } else if (status == 0) {
          //暂停中
        }
        that.setData({ 'singInfo.duration': res.duration });
        that.setData({ 'singInfo.currentPosition': res.currentPosition })
      },
      fail: function (res) {
        //播放失败--播放下一首
        console.log('播放失败')
        if (!that.data.hide) {
          that.audioNext();
          console.log("进这里了吗？？？？？？？")
        }
      }
    });
  },
  onReady: function () { },
  onUnload: function () {
    // 页面关闭，更新浏览时长
    var that = this;
   

    // 页面关闭
    if (this.audioTime) {
      //清除监听定时器     
      clearInterval(this.audioTime);
    }

    //暂停播放音频
    wx.pauseBackgroundAudio();

  },
  dragStart: function (event) {
    clearInterval(this.audioTime);
  },
  sliderChange: function (event) {
    var that = this;
    let { timeSlice, progressMax, getNowStrTotal, getStrCount, originColorList, wordColorList } = that.data;

    var newValue = event.detail.value;
    console.log(newValue);
    if (that.audioTime) {
      clearInterval(that.audioTime)
    }
    getNowStrTotal = newValue / progressMax * getStrCount;
    that.setData({ progressValue: newValue, getNowStrTotal: getNowStrTotal, wordColorList: originColorList });
    that.chameleon();
    wx.setStorageSync("oneCopyOfTime", getNowStrTotal);
    that.audioTime = setInterval(that.listenAuido, 1000);
    var muchPlayed = that.getTimeText(newValue);
    that.setData({ timeBeginText: muchPlayed });
    console.log(that.data.progressMax, newValue, that.data.playPauseStyle)
    if (that.data.progressMax == "NaN") {
      return;
    }
    if (newValue == 0) {
      wx.stopBackgroundAudio();
      that.audioToPlay();
    } else if (newValue == that.data.progressMax) {
      that.audioNext();
    } else {
      if (that.data.systemInfo.model == "iPhone") {
        wx.seekBackgroundAudio({
          position: newValue,
          fail: function () {
            wx.getNetworkType({
              success: function (res) {
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                var networkType = res.networkType;
                if (networkType == "none") {
                  wx.showToast({
                    title: '网络异常',
                    duration: 2000
                  });

                }
              }
            });
            console.log("seek失败")
          }
        })
      } else {

        //安卓	有时候不能很好的监听音乐播放，音乐暂停，音乐停止
        //安卓下当音乐暂停后seek不能自动播放
        //安卓下如果seek的时间还没有加载出来就会触发停止播放，有时候newValue<that.downloadTime也会触发停止播放（bug）
        console.log("下载", newValue, that.downloadTime)
        if (newValue > that.downloadTime) {
          //newValue=that.downloadTime-10;//设为下载时间依然触发停止播放
          console.log("大于", newValue);
          return false; //接着之前的播放继续播放
        }
        if (that.data.playPauseStyle == "play-out") {
          //暂停
          wx.seekBackgroundAudio({
            position: newValue
          })
          that.audioToPlay();
        } else {
          wx.seekBackgroundAudio({
            position: newValue
          })
        }
      }

    }
  },
  selectPlay: function (event) {
    var that = this;
    let { originColorList, wordColorList, audioIndex } = that.data;
    var index = event.currentTarget.dataset.index;
   audioIndex = index;
    console.log(audioIndex);
    var node = this.data.sound.list[this.data.audioIndex];
    wx.setStorageSync('oneCopyOfTime', 0);
    that.setData({ progressValue: 0, musicFlag: false, timeBeginText: "00:00", wordColorList: originColorList, audioIndex:audioIndex})
    //从列表中选择播放

    //设置导航标题
    wx.setNavigationBarTitle({
      title: node.file_name
    });
    console.log("筛选")
    //高亮呈现
    this.setListLight();
    this.audioToPlay();
  },
  audioPrev: function () {
    //转到上一首
    var that = this;
    let { originColorList, wordColorList, audioIndex, playOrder } = that.data;
    wx.setStorageSync('oneCopyOfTime', 0)
    that.setData({ progressValue: 0, musicFlag: false, timeBeginText: "00:00", getNowStrTotal: 0, wordColorList: originColorList })
    if (!that.data.dbClick) {
      return;
    }
    console.log("上一首");
    if (playOrder != 3) {
      audioIndex--;
    }
    if (audioIndex < 0) {
      audioIndex = this.data.sound.list.length - 1;
    }
    that.matchTimeAndWords();
    // that.getSeconds();                        
    let tmp_musicList_sum = that.data.musicList_goUp * (that.data.audioIndex);
    that.setData({ tmp_musicList_sum, audioIndex: audioIndex });
    console.log(that.data.tmp_musicList_sum);
    this.audioToPlay();
    //解决多次点击的问题
    that.setData({ dbClick: false })
    setTimeout(function () {
      that.setData({ dbClick: true })
    }, 1000)
  },
  audioNext: function () {
    //转到下一首
    var that = this;
    let { originColorList, wordColorList, playOrder, audioIndex} = that.data;
    wx.setStorageSync('oneCopyOfTime', 0);
    that.setData({ progressValue: 0, musicFlag: false, timeBeginText: "00:00", getNowStrTotal: 0, wordColorList: originColorList })
    console.log("下首：" + that.data.dbClick)
    if (!that.data.dbClick) {
      return;
    }
    console.log(playOrder);
    if (playOrder != 3) {
     audioIndex++;        
    }
    if (audioIndex > that.data.sound.list.length - 1) {
      audioIndex = 0;
    }
    console.log(playOrder);    
    that.matchTimeAndWords();
    // that.getSeconds();                
    let tmp_musicList_sum = that.data.musicList_goUp * (that.data.audioIndex);
    that.setData({ tmp_musicList_sum, audioIndex: audioIndex });
    console.log(that.data.tmp_musicList_sum);
    
    that.audioToPlay();
    //解决多次点击的问题
    that.setData({ dbClick: false })
    setTimeout(function () {
      that.setData({ dbClick: true })
    }, 1000)
  },
  //三种播放方式 1.检查是4g wifi none网络格式---4g网下的播放 第一次点击播放按钮时
  //2.只检查none和有网络格式 ----- wifi下的播放 以及 4g网下一曲播放完自动播放下一曲
  //3.不检查网络直接播放  -------  点击播放按钮时触发（非第一次）
  audioToPlay: function () {
    //找到某个音频数据
    var that = this;
    let { tmp_musicList_sum, totalSecond, timeSlice } = that.data;
    console.log(that.data.audioIndex)
    var node = this.data.sound.playList[that.data.audioIndex];
    that.setData({ playMusicFlag: true });
    var filesize = Math.floor(node.file_size / 1024 / 1024);
    let splitTime_count = 0;
    that.setData({ soundSize: filesize });
    //解决多次点击的问题
    if (!that.data.dbClick) {
      return;
    }
    that.setData({ playPauseStyle: "play-in" });
    if (!that.data.isFirst) {
      wx.getNetworkType({
        success: function (res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType == "none" || networkType == "wifi") {
            //指定播放背景音乐
            wx.playBackgroundAudio({
              dataUrl: node.file_url,
              title: node.file_name,
              coverImgUrl: that.data.bookMatch.pic_root,
              success: function () {
                //播放中                 
                if (that.audioTime) {
                  //清除监听定时器     
                  clearInterval(that.audioTime);
                }
                console.log("wifi播放")
                that.audioTime = setInterval(that.listenAuido, 1000);
              }
            });
            // that.keep();
          } else {
            that.setData({ playPauseStyle: "play-in" });
            wx.pauseBackgroundAudio();
            that.setData({ timeBeginText: '00:00' });
            that.setData({ progressValue: 0 });
            // that.setData({ timeEndText: that.data.sound.list[that.audioIndex].time_length });
            wx.showModal({
              title: '温馨提示',
              content: '您正在使用手机流量收听，是否继续收听',
              showCancel: true,
              cancelText: '取消收听',
              cancelColor: '#06c1ae',
              confirmText: '继续收听',
              confirmColor: '#06c1ae',
              success: function (res) {
                if (res.confirm) {
                  //用户点击继续观看
                  //指定播放背景音乐
                  console.log("继续观看")
                  that.setData({ isFirst: true })
                  that.setData({ playPauseStyle: "play-in" });
                  wx.playBackgroundAudio({
                    dataUrl: node.file_url,
                    title: node.file_name,
                    coverImgUrl: that.data.bookMatch.pic_root,
                    success: function () {
                      //播放中                 
                      if (that.audioTime) {
                        //清除监听定时器     
                        clearInterval(that.audioTime);
                      }
                      that.audioTime = setInterval(that.listenAuido, 1000);
                    }
                  });
                  // that.keep();
                } else if (res.cancel) {
                  //用户点击取消观看--不操作	
                  console.log("取消观看")
                  that.setData({ playPauseStyle: "play-out" });
                  //wx.stopBackgroundAudio();
                  wx.pauseBackgroundAudio()
                }
              }
            })
          }
        }
      });
    } else {
      //指定播放背景音乐
      console.log("不是第一次播放")
      wx.playBackgroundAudio({
        dataUrl: node.file_url,
        title: node.file_name,
        coverImgUrl: that.data.bookMatch.match_pic,
        success: function () {
          //播放中                 
          if (that.audioTime) {
            //清除监听定时器     
            clearInterval(that.audioTime);
          }
          that.audioTime = setInterval(that.listenAuido, 1000);
        }
      });
      // that.keep();

    }
    that.setData({ dbClick: false })
    setTimeout(function () {
      that.setData({ dbClick: true })
    }, 1000)
    //设置导航标题
    wx.setNavigationBarTitle({
      title: node.file_name
    });
    //高亮呈现
    this.setListLight();
  },
  audioPause: function () {
    //解决多次点击的问题
    var that = this;
    let { randomMusicTangle } = that.data;
    console.log("暂停：" + this.data.dbClick);
    console.log(that.audioTime)
    if (that.audioTime) {
      //清除监听定时器     
      clearInterval(that.audioTime);
    }
    if (!this.data.dbClick) {
      return;
    }
    for (let i = 0; i < 5; i++) {
      randomMusicTangle[i] = (parseInt(Math.random() * 100) + 5) + "%";
    }
    wx.pauseBackgroundAudio();
    this.setData({ playPauseStyle: "play-out", playMusicFlag: false, randomMusicTangle: randomMusicTangle });
    console.log(randomMusicTangle)
    this.setData({ dbClick: false })
    setTimeout(function () {
      that.setData({ dbClick: true })
    }, 1000)
  },
  setListLight: function () {
    //设置列表中元素高亮    
    var that = this;
    var data = this.data.sound;
    for (var i = 0; i < data.list.length; i++) {
      data.list[i]["class"] = "sound-item";
    }
    var playIndex = data.playList[that.data.audioIndex].rownumber - 1;
    that.data.playIndex = playIndex;
    data.list[playIndex]["class"] = "sound-item-over";
    this.setData({ sound: data });

  },
  getTimeText: function (time) {
    var formart = function (s, count) {
      for (var i = s.length; i < count; i++) {
        s = "0" + s;
      }
      return s;
    }

    var text = "00:00";
    if (time > 60 * 60) {
      text = formart(parseInt((time - (time % (60 * 60))) / 60).toString(), 2) + ":" + formart(parseInt((time - (time % 60)) / 60).toString(), 2) + ":" + formart(parseInt(time % 60).toString(), 2);
    } else if (time >= 60) {
      text = formart(parseInt((time - (time % 60)) / 60).toString(), 2) + ":" + formart(parseInt(time % 60).toString(), 2);

    } else {
      text = "00:" + formart(parseInt(time % 60).toString(), 2);
    }

    return text;
  },
  toHome: function () {
    app.codeBook.toHome();
  },
  toUser: function () {
    app.codeBook.toUser();
  },
  toShowThis: function (e) {
    var that = this;
    let { scrollFlag } = that.data;    
    let idx = e.currentTarget.dataset.index;
    that.setData({ clickThisNav: idx, scrollFlag: 1 });
    console.log(scrollFlag)
    let tmp = that.data.showSelf;
    tmp.map((value, key) => {
      value.ifshow = "no";
      if (key === (idx - 1)) {
        value.ifshow = "yes";
      }
    })
    that.setData({ showSelf: tmp })
  },
  scroll: function (e) {
    let that = this;
    let { scrollFlag } = that.data;
    let tops ;
    tops= e.detail.scrollTop
    console.log(tops)
    this.setData({ tops: e.detail.scrollTop, scrollFlag: 2 });    
    if (tops <=80) {
      this.setData({ direction: "up" })
      console.log("direction",that.data.direction)
    } else {
      this.setData({ direction: "down" })
      console.log("down", that.data.direction)
    }
  },
  disOrder: function () {
    let that = this;
    let { playOrder}=that.data;
    let playIdx = that.data.audioIndex;
    let playList_index = that.data.playIndex;
    console.log(playList_index);
    console.log(playIdx);
    if (playOrder==1) {
      let tmpWrap = that.data.sound.playList;
      let prvtmp = tmpWrap.slice(0, playIdx + 1);
      let nexttmp = tmpWrap.slice(playIdx + 1);

      function shuffle(a) {
        var len = a.length;
        for (var i = 0; i < len - 1; i++) {
          var index = parseInt(Math.random() * (len - i));
          var temp = a[index];
          a[index] = a[len - i - 1];
          a[len - i - 1] = temp;

        }
        return a;
      }

      let afterArr = shuffle(nexttmp);

      let tmpArr = prvtmp.concat(afterArr);
      that.setData({ "sound.playList": tmpArr });
    } else if (playOrder==2) {
      let lists = that.data.sound.list;
      that.data.audioIndex = playList_index;
      that.setData({ "sound.playList": lists});
    } else if (playOrder == 3){     
    } else if (playOrder == 4){
      let lists = that.data.sound.list;
      that.data.audioIndex = playList_index;
      that.setData({ "sound.playList": lists });         
    }
    playOrder++;
    if (playOrder > 4) {
      playOrder = 1
    }    
    that.setData({ playOrder: playOrder })    
    console.log(playOrder)
  },
  goNext: function () {
    let that = this;
    let navIdx = that.data.clickThisNav + 1;
    if (navIdx > 3) {
      navIdx = 1
    }
    let tmp = that.data.showSelf;
    tmp.map((value, key) => {
      value.ifshow = "no";
      if (key === (navIdx - 1)) {
        value.ifshow = "yes";
      }
    })
    that.setData({ showSelf: tmp, clickThisNav: navIdx, scrollFlag: 1 })
  },
  bookWidthLesson: function () {
    let colors = 1;
    wx.navigateTo({
      url: '../../word/word?color=' + colors
    })
  },
  konwledge: function () {
    wx.navigateTo({
      url: '../../book/book'
    })
  },
  //暂时报错，以后改接口再说
  share: function () {
    this.onShareAppMessage();
  }

})