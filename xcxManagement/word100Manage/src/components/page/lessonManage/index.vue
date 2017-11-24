<template>
<!-- @click="gotoEditer" -->
  <div class="lessonCard" >
      <div class="lessonCard-top">
          <el-input
            placeholder="请输入内容"
            v-model="searchContent">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button class="btn" @click="filterLesson">确认</el-button>
          <template v-for="(sort,idx) in sorts">
            <div :class="{'commen-style':commenStyle,'highLight':sort.ifHeighLight}" :key="idx" @click="toggleHighLight(idx,sort.name)">{{sort.name}}<i class="el-icon-d-caret"></i></div>
          </template>
          <div class="allBook"><el-dropdown>
            <span class="el-dropdown-link">
                全部课程<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <template v-for="(book,idx) in books">
                    <el-dropdown-item :key="idx">{{book}}</el-dropdown-item>
                </template>
            </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="min">
            <el-checkbox v-model="lessonCard.checkMid" >期中限时优惠</el-checkbox>
          </div>
          <div class="end">
             <el-checkbox v-model="lessonCard.checkEnd">期末限时优惠</el-checkbox>
          </div>
      </div>
      <div class="lessonCard-content">
          <div class="card-item" @click="gotoEditer">
              <div class="wrap-border">
                    <div class="card-adsFlag"></div>
                    <div class="postal-card">
                           <div class="card-left">
                               <!-- <img :src="card.img" alt=""> -->
                               <div class="book-bg" style="background:#eee;"></div>
                           </div>
                           <div class="card-right" style="width:100%;">
                               <div class="cardRight-top" style="background:#eee;width:100%;height:15px;margin-bottom:20px;"></div>
                               <div class="cardRight-middle" style="background:#eee;width:80%;height:15px;margin-bottom:20px;"></div>
                               <div class="cardRight-bottom" style="background:#eee;width:50%;height:15px;margin-bottom:20px;"></div>
                               <div class="cardRight-bottom" style="background:#eee;width:45%;height:30px;"></div>
                           </div>
                       </div>
                       <div class="card-tottom">
                            <div class="just-border">
                                <i class="el-icon-plus"></i><span style="display:inline-block;padding-left:10px;color:#319bd7">新增课程</span>
                            </div>
                       </div>
              </div>
          </div>
          <template v-if="lessonInfo.cards.length>0">
            <template  v-for="(card,idx) in lessonInfo.cards">
                <div class="card-item" :key="idx" @click="gotoDatabaseEditer(card.id)">
                    <div class="wrap-border">
                        <div class="card-adsFlag">
                                <template v-if="card.examine==-1">
                                    <img src="../../../assets/publishing.png" alt="">
                                </template>
                                <template v-else-if="card.examine==1">
                                    <img src="../../../assets/published.png" alt="">
                                </template>
                                <template v-else>
                                    <img src="../../../assets/unPublish.png" alt="">
                                </template>
                        </div>
                        <div class="postal-card">
                            <div class="card-left">
                                <!-- <img :src="card.img" alt=""> -->
                                <div class="book-bg" :style="{backgroundImage:`url(${card.app_pic})`}"></div>
                            </div>
                            <div class="card-right">
                                <div class="cardRight-top">
                                    {{card.app_desc}}
                                </div>
                                <div class="cardRight-middle">
                                    {{card.app_content_name}}
                                </div>
                                <div class="cardRight-bottom">
                                    <div class="price">价格：{{card.price}}</div>
                                    <div class="tip" v-if="card.activitys">
                                      <div v-for='(activity,idx) in card.activitys' :key="idx" class="tip-item">
                                        {{activity.activity_desc}}
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="wrapCard-tottom">
                            <div class="caseNum">
                                <div class="borders rightSide-border">
                                        <span>  关卡数</span>
                                        <span class="num"> {{card.level_count}}</span>
                                </div>
                            </div>
                            <div class="wordsNum">
                                    <div class="borders">
                                        <span> 单词数</span>
                                        <span class="num"> {{card.word_count}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
          </template>
      </div>
      <infinite-loading @infinite="infiniteHandler">
          <span slot="no-more">
            There is no more lesson cards :(
          </span>
      </infinite-loading>
  </div>
</template>

<script>
import { getWordAppContent } from "static/js/toAjax";
import InfiniteLoading from 'vue-infinite-loading';
export default {
  components: {
    InfiniteLoading
  },
  //data中放入属性，就像小程序中的data一样
  data() {
    return {
      lessonCard: {
        checkMid: "",
        checkEnd: ""
      },
      searchContent: "",
      books: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
      sorts: [
        { name: "时间", ifHeighLight: false },
        { name: "销量", ifHeighLight: false },
        { name: "价格", ifHeighLight: false },
        { name: "浏览", ifHeighLight: false }
      ],
      commenStyle: true,
      adviser_id: 1,
      lessonInfo: {
        cards: []
      },
      list: [],
      downFlag:true,
      originCardList:[]
    };
  },
  // 所有的方法放在methods
//   methods: {
//     gotoEditer() {
//       this.$router.push("/manage/lessonBriefEdit");
//     },
    // 所有的方法放在methods
    methods: {
        gotoEditer(){
            this.$router.push('/manage/lessonBriefEdit')
        },
        gotoDatabaseEditer(index){
            this.$router.push({name:'wordsManage',params: {id: index}})
        },
        toggleHighLight(index,name){
          let that=this;
            console.log(that.sorts[index].ifHeighLight)
            if(name=="时间"&&that.sorts[index].ifHeighLight==false){
               that.sorts[index].ifHeighLight=true; 
               that.lessonInfo.cards= that.PositiveSequence(that.lessonInfo.cards,'createTime')                    
            }else
            if(name=='时间' &&that.sorts[index].ifHeighLight==true){
               that.sorts[index].ifHeighLight=false;                            
                that.lessonInfo.cards= that.ReverseSequence(that.lessonInfo.cards,'createTime')                            
            }else
            // else if(name=='销量' &&that.sorts[index].ifHeighLight==false){
            //    that.sorts[index].ifHeighLight=!this.sorts[index].ifHeighLight; 
            // }
            // else if(name=='销量' &&that.sorts[index].ifHeighLight==true){
            //    that.sorts[index].ifHeighLight=!this.sorts[index].ifHeighLight;                            
            // }


             if(name=='价格' &&that.sorts[index].ifHeighLight==false){
               that.sorts[index].ifHeighLight=!this.sorts[index].ifHeighLight; 
               that.lessonInfo.cards= that.PositiveSequence(that.lessonInfo.cards,'price')                    
                 

            }else
             if(name=='价格' &&that.sorts[index].ifHeighLight==true){
               that.sorts[index].ifHeighLight=!this.sorts[index].ifHeighLight;                            
               that.lessonInfo.cards= that.ReverseSequence(that.lessonInfo.cards,'price')                                        
            }


            // else if(name=='浏览' &&that.sorts[index].ifHeighLight==false){
            //    that.sorts[index].ifHeighLight=!this.sorts[index].ifHeighLight; 
            // }
            // else if(name=='浏览' &&that.sorts[index].ifHeighLight==true){
            //    that.sorts[index].ifHeighLight=!this.sorts[index].ifHeighLight;                            
            // }
            
        },
        filterLesson:function(){

        },
        infiniteHandler($state) {
          let that = this;
          getWordAppContent(that.lessonInfo.cards,1,'').then(({ data }) => {
            console.log(data)
            if (data.length&&that.downFlag) {
              that.lessonInfo.cards = that.lessonInfo.cards.concat(data);
              that.originCardList=that.originCardList.concat(data)
              $state.loaded();
              if (that.lessonInfo.cards.length / 20 === 10) {
                $state.complete();
              }
              if(data.length<12){
                that.downFlag=false
              }
            } else {
              $state.complete();
            }
          })
        },
      // 正序排列
      PositiveSequence(arr,sortName){
          return _.sortBy(arr,item=>{
            return  -item.sortName;
        })
      },
      //倒叙排列
      ReverseSequence(arr,sortName){
          return _.sortBy(arr,item=>{
            return  item.sortName;
        })
        
      },

      //过滤出符合要求的数组
      filterArr(arr,filterName){
        let tmpArr=[];
        for(let i=0;i<arr.length;i++){
          for(let j=0;j<arr[i].activitys.length;j++){
            if(arr[i].activitys[j].activity_desc==filterName){
              tmpArr.push(arr[i]);
            }
          }
        }
        return   tmpArr;
      },
  },
    

 
  // 所有的过滤器放在filters
  filters: {},
  //所有的data中的属性都可以二次格式化处理
  computed: {},
  // DOM创建时,调用的钩子函数
  created: function() {
      let that = this;
      // that.toFindeLessonInfo()
  },
  watch: {
    lessonCard:{
      handler(val,oldval){  
        console.log(val.checkMid)
        if(val.checkMid==true){
          this.lessonInfo.cards=this.filterArr(this.lessonInfo.cards,'双十二，过这村，没这店') 
        }else if(val.checkMid==false){
          this.lessonInfo.cards=this.originCardList
        } 
      },  
      deep:true//对象内部的属性监听，也叫深度监听 
    }
  },
  //页面加载完成时进行的回调
  mounted() {},
  //页面销毁时进行的回调
  destroyed() {}
};
</script>

<style scoped>
.lessonCard {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 80px;
}

/* 顶部通栏 */
.lessonCard .lessonCard-top {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 20px;
}
.el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 258px;
}
.lessonCard-top .btn {
  margin-left: 10px;
  cursor: pointer;
}
.lessonCard-top .commen-style,
.lessonCard-top .allBook {
  margin-left: 20px;
  cursor: pointer;
}
.lessonCard-top .highLight {
  color: #319bd7;
}
.lessonCard-top .min,
.lessonCard-top .end {
  margin-left: 40px;
  cursor: pointer;
}

/* 卡片展示区 */
.lessonCard-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding-right: 180px;
  background-color: #fff;
}
.lessonCard-content .card-item {
  width: 50%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
.lessonCard-content .card-item .wrap-border {
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}
.lessonCard-content .card-item .wrap-border .card-adsFlag {
  position: absolute;
  top: 5px;
  left: -5px;
}
img {
  display: block;
}
.lessonCard-content .card-item .wrap-border .postal-card {
  padding: 0 20px;
  padding-top: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  box-sizing: border-box;
  margin-bottom: 50px;
  cursor: pointer;
}
.lessonCard-content .card-item .wrap-border .postal-card .card-left {
  width: 40%;
  padding: 0 20px;
  border: 1px solid #eee;
  margin-right: 20px;
}
.lessonCard-content .card-item .wrap-border .postal-card .card-left .book-bg {
  /* width: 100%;
  height: 100%; */
  min-width: 112px;
  min-height: 150px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.lessonCard-content .card-item .wrap-border .postal-card .card-right {
  font-size: 13px;
  color: #333;
  text-align: left;
  line-height: 25px;
  width:55%;
}
.lessonCard-content
  .card-item
  .wrap-border
  .postal-card
  .card-right
  .cardRight-middle {
  /* line-height: 60px; */
  font-size: 12px;
  color: #666;
  margin: 10px 0;
  line-height: 12px;
}

.lessonCard-content
  .card-item
  .wrap-border
  .postal-card
  .card-right
  .cardRight-bottom {
  /* line-height: 60px; */
  font-size: 16px;
  color: #333;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.lessonCard-content
  .card-item
  .wrap-border
  .postal-card
  .card-right
  .cardRight-bottom
  .tip {
    width:70%;
    font-size: 10px;
    margin-left: 20px;
    /* flex: 40%; */
    color: #e88c12;
    text-align: left;

}

.lessonCard-content
  .card-item
  .wrap-border
  .postal-card
  .card-right
  .cardRight-bottom
  .tip .tip-item{
    border: 1px solid #ff880a;
    border-radius: 4px;
    line-height: 18px;
    padding: 0 2px;
    display:inline-block;
    margin-right: 10px;
    text-align: center;
}
.lessonCard-content .card-item .wrap-border .wrapCard-tottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #f4fafd;
}
.lessonCard-content .card-item .wrap-border .wrapCard-tottom > div {
  width: 50%;
}
.lessonCard-content .card-item .wrap-border .wrapCard-tottom div.caseNum {
  width: 50%;
}
.rightSide-border {
  border-right: 1px solid #ddd;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.lessonCard-content .card-item .wrap-border .wrapCard-tottom .borders span {
  display: block;
  font-size: 12px;
  color: #999;
  line-height: 18px;
}
.lessonCard-content .card-item .wrap-border .wrapCard-tottom .borders span.num {
  display: block;
  font-size: 18px;
  color: #333;
  line-height: 25px;
}
.lessonCard-content .card-item .wrap-border .card-tottom {
  width: 100%;
  border: none;
  line-height: 50px;
  font-size: 16px;
  color: #319bd7;
  padding: 10px 0;
  background-color: #f4fafd;
  cursor: pointer;
}
.just-border {
  height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: center;
  justify-content: center;
  align-items: center;
}
</style>
