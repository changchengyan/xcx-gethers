<template>
  <div class="staticsManage ">
        <div class="top-tips">
            <div class="left-str">
                <i class="el-icon-info colors"></i>
                <span class="tip-str">只统计已发布线上版本使用数据</span>
            </div>
                <div class="right-remove">
                    <i class="el-icon-close"></i>
            </div>
        </div>
        <div class="show-nums">
            <el-row>
                <template v-for="(item,idx) in items">
                    <el-col :span="8" :key="idx"  :class="{'border-middle':item.showBorder}">
                        <div class="money-num">
                            <template v-if="idx==0">
                                <span class="sub_money">￥</span>
                            </template>
                            {{item.num}}
                            <template v-if="idx==1">
                                <span class="sub_people">人</span>
                            </template>
                            <template v-if="idx==2">
                                <span class="sub_count">次</span>
                            </template>
                        </div>
                        <div class="money-str">{{item.name}}</div>
                    </el-col>
                </template>
            </el-row>
        </div>
        <div class="section-yestoday">
            <div class="yestoday-top">
                 <div class="left-yestoday">
                <div class="verticalBar"></div>
                <span class="yestoday-survey">昨日概况</span>
                </div>
                <div class="right-toggleTip">
                    <el-popover
                        ref="popover1"
                        placement="bottom"
                        trigger="click"
                        >
                        <template v-for="(tip,idx) in tips">
                                <div :key="idx" class="wrap-model">
                                    <div  class="leftTip-str">{{tip.name}}</div>
                                    <div  class="rightTip-explain">{{tip.content}}</div>
                                </div>
                        </template>
                    </el-popover>
                    <i class="el-icon-question color-tip" v-popover:popover1></i>
                </div>
            </div>
            <div class="yestoday-panel">
                <el-row>
                    <template v-for="(item,idx) in yestodayPanelDatas">
                        <el-col :span="6" :key="idx"  :class="{'border-right':item.showBorder}">
                            <div class="yestodayPanel-name">
                                {{item.name}}
                            </div>
                            <div class="yestodayPanel-num">
                                {{item.num}}
                            </div>
                            <div class="yestodayPanel-dayData">

                                <span class="day">日</span>
                                <div class="wrap-precent">
                                    <span :class="{'negativeNumber':(item.day.dayUp).substr(0,1)=='-'?true:false}">{{item.day.dayUp}}
                                        <template v-if="item.day.dayDown!=''">
                                            /
                                        </template>
                                    </span>
                                    <span :class="{'negativeNumber':(item.day.dayDown).substr(0,1)=='-'?true:false}">{{item.day.dayDown}}</span>
                                </div>
                            </div>
                            <div class="yestodayPanel-weekData">
                                <span class="week">周</span>
                                <div class="wrap-precent">
                                    <span :class="{'negativeNumber':(item.week.weekUp).substr(0,1)=='-'?true:false}">{{item.week.weekUp}}
                                        <template v-if="item.week.weekDown!=''">
                                            /
                                        </template>
                                    </span>
                                    <span :class="{'negativeNumber':(item.week.weekDown).substr(0,1)=='-'?true:false}">{{item.week.weekDown}}</span>
                                </div>
                            </div>
                            <div class="yestodayPanel-monthData">
                                <span class="month">月</span>
                                <div class="wrap-precent">
                                    <span :class="{'negativeNumber':(item.month.monthUp).substr(0,1)=='-'?true:false}">{{item.month.monthUp}}
                                        <template v-if="item.month.monthDown!=''">
                                            /
                                        </template>
                                    </span>
                                    <span :class="{'negativeNumber':(item.month.monthDown).substr(0,1)=='-'?true:false}">{{item.month.monthDown}}</span>
                                </div>
                            </div>
                        </el-col>
                    </template>
                </el-row>
            </div>
        </div>
        <div class="transaction-trend">
            <div class="transaction-top">
                <div class="verticalBar"></div>
                <span class="transaction-survey">交易趋势</span>
            </div>
            <div class="transaction-main">
                <div class="transaction-time">
                    <span>时间:</span>
                    <el-date-picker
                    v-model="dataValue"
                    type="date"
                    placeholder="选择日期"
                    default-value="2010-10-01">
                    </el-date-picker>
                </div>
                <div class="transaction-canvas">
                </div>
            </div>
        </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            items:[
                {num:9189.50,name:"累计交易",showBorder:false},
                {num:873,name:"累计读者",showBorder:true},
                {num:1587,name:"累计访问",showBorder:false}
            ],
            tips:[
                {name:"打开次数",content:'昨日打开小程序总次数,用户从打开小程序到主动关闭小程序或超时退出计为一次;'},
                {name:"访问次数",content:'昨日访问小程序内所有页面总次数，多个页面之间跳转、同一页面的重复访问计为多次访问;'},
                {name:"访问人数",content:'首次访问小程序页面的用户数，同一用户多次访问不重复计;'},
                {name:"新访问用户数",content:'昨日访问小程序内所有页面的总用户数，同一用户多次访问不重复计;'},
                {name:"分享次数",content:'昨日分享小程序的总次数;'},
                {name:"分享人数",content:'昨日分享小程序的总人数，同一用户多次分;'},
            ],
            yestodayPanelDatas:[
                {name:"打开次数",num:"201",day:{dayUp:"+68.33%",dayDown:""},week:{weekUp:"+29.49%",weekDown:""},month:{"monthUp":"+152.51%","monthDown":""},showBorder:true},
                {name:"访问次数/ 人数",num:"1109/91",day:{dayUp:"+52.48%",dayDown:"+33.82%"},week:{weekUp:"+29.49% ","weekDown":"+15.19%"},month:{"monthUp":"+152.51%","monthDown":"+83.07%"},showBorder:true},
                {name:"新访问读者数",num:"45",day:{dayUp:"+68.33%",dayDown:""},week:{"weekUp":"+29.49%","weekDown":""},month:{"monthUp":"+152.51%","monthDown":""},showBorder:true},
                {name:"分享次数/ 人数 ",num:"15/11",day:{dayUp:"+52.48%",dayDown:"+33.82%"},week:{"weekUp":"-29.49%","weekDown":"+15.19%"},month:{"monthUp":"+152.51%","monthDown":"+83.07%"},showBorder:false},
            ],
            dataValue: '',
        }
    },
    methods: {
    },
    computed: {

    },
     created () {

    }
}
</script>

<style>
    .staticsManage{
        padding:10px;
    }
    .top-tips{
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: space-between;
        background-color: #efefef;
        line-height: 32px;
        padding:0 10px;
        font-size: 12px;
        color: #333;
        box-sizing: border-box;
    }
    .colors{
        color: #319bd7;
    }
    .right-remove{
        text-align: center;
        width:30px;
        cursor: pointer;
    }

    /* 数据展示 */
    .show-nums{
        height: 70px;
        padding: 30px 0;
        text-align: center;
    }
    .border-middle{
        border-left:1px  solid #ccc;
        border-right:1px  solid #ccc;
    }
    .border-right{
        border-right:2px  solid #eee;
        /* height: 100px; */
        /* padding: 20px; */
        padding: 10px 0;
    }
    .money-num{
        color: #319bd7;
        font-size:28px;
    }
    .money-num .sub_money,.money-num .sub_people,.money-num .sub_count{
        font-size: 14px;
    }

    .money-str{
        font-size: 12px;
        color: #999;
        margin-top: 6px;
    }

    /* 昨日简介板块 */
    .section-yestoday{
        width: 100%;
    }
    .section-yestoday .yestoday-top{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
    }
    .left-yestoday{
        width:100px;
        height: 16px;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        align-items: center;
    }

    .left-yestoday .verticalBar,.transaction-trend .verticalBar{
        width:3px;
        height:100%;
        background-color:#319bd7;
        margin-right: 5px;
    }
    .left-yestoday .yestoday-survey{
        font-size: 16px;
        color:#333;
        line-height: 16px;
    }
    .color-tip{
        color: #319bd7;
    }
    .wrap-model{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }
    .el-popover {
        width: 420px!important;
        /* height:357px!important; */
    }
    .wrap-model{
        font-size: 14px;
        line-height: 30px;
    }
    .leftTip-str{
        color:#999;
        width: 100px
    }
    .rightTip-explain{
        color: #333;
        width: 320px;
    }
    .yestoday-panel{
        border: 1px solid #eee;
        margin-top: 10px;
        padding: 20px;
    }
    .negativeNumber{
        color: #ff0000!important;
    }
    .yestodayPanel-name{
        font-size: 14px;
        color: #999;
    }
    .yestodayPanel-num{
        font-size: 30px;
        color:#333;
        font-weight: 500;
        line-height: 45px;
    }
    .yestodayPanel-dayData span,.yestodayPanel-weekData span,.yestodayPanel-monthData span{
        font-size: 14px;
        color:#7cb9e2;
        line-height: 20px;
    }
    /* wrap-precent */
     .yestodayPanel-dayData,.yestodayPanel-weekData,.yestodayPanel-monthData{
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: center;
    }
    .yestodayPanel-dayData span.day,.yestodayPanel-weekData span.week,.yestodayPanel-monthData span.month{
        display: inline-block;
        text-align: center;
        color:#999;
        /* width: 30px; */
    }
    .yestodayPanel-dayData .wrap-precent,.yestodayPanel-weekData .wrap-precent,.yestodayPanel-monthData .wrap-precent{
        /* width: 150px; */
        /* text-align: left */
        padding-left:20px;
    }
    /* 交易趋势 */
    .transaction-trend,.transaction-top{
        width:100%;
    }
    .transaction-trend{
        margin-top: 25px;
    }
    .transaction-top{
        width:100px;
        height: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 16px;
        color:#333;
        margin-bottom:20px;
    }
    .transaction-survey{
        line-height: 16px;
    }
    .transaction-main{
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 10px;
    }
    .transaction-time{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        align-items: center;
    }
    .transaction-time>span{
        display: inline-block;
        padding-right: 10px;
        color: #666;
        font-size: 12px;
    }
    .el-date-editor.el-input{
        width: 250px !important;
    }
    /* canvas */



</style>

