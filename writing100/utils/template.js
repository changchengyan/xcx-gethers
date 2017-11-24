var app = getApp();
function goPlay(lessonId, lessonName, navigation_type, book_id, book_name) {
  //console.log("template")
  wx.navigateTo({
    url: `/pages/play/play?navigation_type=${navigation_type}&lessonId=${lessonId}&book_id=${book_id}&bookname=${book_name}&lessonName=${lessonName}`,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}
function toDouble(num) {
  if (num >= 10) {//大于10
    return num;
  } else {//0-9
    return '0' + num
  }
}

module.exports = {
  goPlay: goPlay,
  toDouble: toDouble
}