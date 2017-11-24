var app = getApp();
function goPlay(lessonId, lessonName, navigation_type, book_id, book_name) {
  wx.navigateTo({
    url: `/pages/play/play?navigation_type=${navigation_type}lessonId=${lessonId}&book_id=${book_id}&bookname=${book_name}&lessonName=${lessonName}`,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}

module.exports = {
  goPlay: goPlay
}