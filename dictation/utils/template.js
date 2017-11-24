var app = getApp();
function goPlay(lessonId) {
  wx.navigateTo({
    url: `/pages/play/play?lessonId=${lessonId}`,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

module.exports = {
  goPlay: goPlay
}