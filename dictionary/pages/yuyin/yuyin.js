var app = getApp();
const recorderManager = wx.getRecorderManager();
Page({
  data: {
    // isSpeaking:true,
    isSpeaking: false,
    start: 0,
    voices: [],
    loading: false,
    touching: "长按说话"
  },

  onLoad: function (options) {

  },

  touchdown: function () {
    var _this = this,
      voices = this.data.voices;
    this.setData({
      isSpeaking: true,
      touching: "正在录音..."
    });
    //开始录音

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    };
    recorderManager.start(options);
  },

  touchup: function () {
    let that = this;
    this.setData({
      touching: "长按录音",
      loading: true,
      isSpeaking: false
    });
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res);
      let tempFilePath = res.tempFilePath;

      /* wx.playVoice({
        filePath: tempFilePath,
        complete() {
          console.log("wanbi");
        }
      }) */
      app.Dictionary.getWordByVoice(tempFilePath, function (res) {
        let backData = JSON.parse(res);

        console.log(backData, backData.success, backData.data);
        if (backData.success) {
          if (backData.data.py){
            wx.navigateTo({
              url: '../pinyin/tune/tune?pinyin=' + backData.data.py
            });
            that.setData({ loading: false });
          }
          else{
            wx.showToast({
              title: "请重新操作"
            });
            console.log('失败');
            that.setData({ loading: false });
          }
        }
        if (!backData.success) {
          wx.showToast({
            title: "请重新操作"
          });
          console.log('失败');
          that.setData({ loading: false });
        }
      });
    });
  },
  // 禁止滑动
  /* stop(){
    return false;
  } */
  //麦克风帧动画
  // speaking: function () {
  //   var _this = this;
  //   var i = 1;
  // }

})