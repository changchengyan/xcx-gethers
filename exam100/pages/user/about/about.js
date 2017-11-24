// pages/user/setting/about/about.js
var app = getApp();
Page({
  data:
  {
      codeBookConfig:
      {
        about: `“RAYS码书”是一套协助家长辅导小学生，完成课后教育的教辅产品。
帮助家长轻松解决因时间、精力或能力不足，而无法完成课后辅导的问题，帮助小学生培养学习兴趣、掌握学习方法、提高各科成绩。系列包括听写100、笔顺100等20多种产品，针对性解决各单项问题。

        “单词100”是“RAYS码书”系列教辅产品之一，立足课后学习需求，关注英语单词项目，解决家长辅导、学生自学时，背单词枯燥乏味难以坚持的问题。
        本产品提供游戏闯关的方式，帮助学生轻松高效自主背单词；并配有小学各版本各年级英语教材配套素材、及丰富的课外学习资源，供学生针对性学习提升。
        单词一百，一边玩游戏，一边背单词。

        挑战好友
共同学习 比赛闯关
        【点击图标跳转 分享至微信】

        相关推荐
帮家长做辅导 助孩子拿高分
        【听写100/口语测评/朗诵100产品logo 点击跳转】`
      }
  },
  onLoad:function(options)
  {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this; 
    // app.codeBook.getCodeBookAbout
    // (
    //     function(res)
    //     {
    //         that.setData({codeBookConfig:res.data});            
    //     }
    // );
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  	var that = this;
    var title ='';
    var pageImg='';
    let {book_id}=that.data;
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})