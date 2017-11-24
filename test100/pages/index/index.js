//index.js
//获取应用实例
const app = getApp()
var wxCharts = require('../../utils/wxcharts.js');

Page({
  data: {
  	windowWidth:320
  },
  onLoad: function () {
  	var that=this;
    try {
        var res = wx.getSystemInfoSync();
        that.data.windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
		var item1=new wxCharts({
			canvasId: 'pieCanvas',
			width: that.data.windowWidth,
	    height: 300,
	    background:'#cccccc',//未生效
	    enableScroll:false,
	    animation: true, //是否有动画
	    //legend:false,
	    type: 'pie',
	    series: [{
	        name: '成交量1',
	        data: 15,
	        color:'#cccccc',
	    }, {
	        name: '成交量2',
	        data: 35,
	        color:'#eeeeee'
	    }, {
	        name: '成交量3',
	        data: 78,
	        color:'#666666'
	    }],
	    
	    dataLabel: true,
	    dataPointShape:true,//??
	    disablePieStroke:true,
	    extra:{
	    	legendTextColor:'red',
	    	pie:{
	    		offsetAngle :0
	    	}
	    }
	 	});
	 	//stopAnimation()  //停止当前正在进行的动画效果，直接展示渲染的最终结果
	 	//addEventListener //添加事件监听
	 	item1.addEventListener('renderComplete', () => {//图表渲染完成
    });
	 	
        setTimeout(function(){
        	var series = [{
				        name: '成交量1',
				        data: 55,
				        color:'#cccccc',
				    }, {
				        name: '成交量2',
				        data: 25,
				        color:'#eeeeee'
				    }, {
				        name: '成交量3',
				        data: 20,
				        color:'#666666'
				    }]
        item1.updateData({
            series: series

				});
        },2000)
        
    var item2=new wxCharts({
			canvasId: 'lineCanvas',
			width: that.data.windowWidth,
	    height: 300,
	    background:'#f5f5f5',//折线图生效
	    enableScroll:false,
	    animation: true, //是否有动画
	    //legend:false,
	    type: 'line',
	    xAxis:{
	    	//gridColor:'#cccccc',
	    	//fontColor:'#666666',
	    	disableGrid:true,
	    	//type:'calibration'
	    },
	    yAxis:{
	    	gridColor:'#cccccc',
	    	fontColor:'#666666',
	    	disabled:false,
	    	//type:'calibration',
	    	min:0,
	    	max:100,
	    	format: function (val) {
          return val.toFixed(2);
        },
	    	title:'哈哈',
	    	titleFontColor:'#333333'
	    },
	    categories:["2015-1","2016-1","2017-1","2017-2","2017-3"],
	    series: [{
	        name: '成交量1',
	        data: [10.00,20.2,40.3,60,40],
	        color:'#cccccc',
	    }, {
	        name: '成交量2',
	        data: [80.1,90.2,60.2,40,60],
	        color:'#eeeeee'
	    }],
	    
	    dataLabel: true,
	    dataPointShape:true,//??
	    disablePieStroke:true,
	    extra:{
	    	legendTextColor:'blue',
	    	lineStyle :'curve',
	    }
	 	});
  },
  touchHandler: function (e) {
	    console.log(pieChart.getCurrentDataIndex(e));//获取图表中点击时的数据序列编号(-1表示未找到对应的数据区域)
	}, 
  gotoPage: function(e) {
        var page = e.currentTarget.dataset.page;
        wx.navigateTo({
            url: '../charts/' + page + '/' + page
        });
    },
})