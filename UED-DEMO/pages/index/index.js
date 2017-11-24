//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
   
  },
  //事件处理函数
  bindViewTap: function() {
  
  },
  onLoad: function () {
    
  },
  toSales: function (event) {
    var sales = event.currentTarget.dataset.sales;
    console.log(sales)
    var toPage = "";
    switch (sales) {
      case "word":
        toPage = "../word/word?color=1";
        break;  
      case "word-join":
        toPage = "../word/default/default";
        break;    

      case "follow-sound":
        toPage = "../follow/sound/sound";
        break;
      case "chinese-uncle":
        toPage = "../chinese/uncle/uncle";
        break;
      case "evaluate":
        toPage = "../evaluate/evaluate";
        break;
      case "codebook":
        toPage = "../codebook/codebook";
        break;  
      case "live":
        toPage = "../live/live";
        break;   
      case "discover":
        toPage = "../discover/discover";
        break;  
      case "english-words":
        toPage = "../english/words";
        break;  
          
         
        
      default:
        break;
    }
    wx.navigateTo({ url: toPage });

  }
})
