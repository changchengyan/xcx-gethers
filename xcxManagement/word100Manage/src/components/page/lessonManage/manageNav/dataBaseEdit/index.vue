<template>
    <div class="lessonManage">
        <template v-if="ifShowClassOptions">
            <div class="chooseClass">
                <span class="book-str">选择书籍:</span>
                    <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </template>
        <div class="top-abstract">
            <el-row>
                <el-col :span="24" class="wrap-card">
                    <div class="brief-pic">
                        <!-- ||../../../../../assets/template_book.png -->
                        <img :src="lessonInfo.app_pic" alt="">
                    </div>
                    <div class="brief-str">
                        <div class="left-side">
                            <div class="title">
                                {{lessonInfo.app_content_name}}
                                <!-- PEPPrimaryEnglishStudentsis book 义务教育课程实验系列教科 书（新版）老师特别辑 必考单词大 合集撒的的速度速度的速度速度速度的速度桉树 -->
                            </div>
                            <div class="keyWord">
                                <!-- 英语 六年级 期中考试 -->
                                {{subject}}  {{target}}  {{term}}
                            </div>
                            <div class="price">
                                <div class="num">价格：<span class="price-num">{{lessonInfo.price}}</span></div>
                                <div class="ads" v-if="lessonInfo.activitys">{{lessonInfo.activitys[0].activity_desc}}</div>
                            </div>
                            <div class="explaination-content">
                                {{lessonInfo.app_desc}}
                            
                            </div>
                        </div>
                        <div class="right-side">
                            <div  @click="editBriefModel">
                                <img src='../../../../../assets/edit_gray.png' alt="">
                                <span>修改</span>
                            </div>
                            <div  @click="delBriefModel">
                                <img src='../../../../../assets/edit_del.png' alt="">
                                <span>删除</span>
                            </div>
                        </div>
                        
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="middle-content ">
            <div class="routerNav">
                <!-- <el-menu :default-active="activeIndex" class="el-menu-demo nav-card" unique-opened router mode="horizontal" @select="handleSelect">
                    <el-menu-item index="/manage/dataBaseEdit/funcManage">
                        <span class="function-str">单词管理</span>
                        <span class="function-num">0</span>
                    </el-menu-item>
                    <el-menu-item index="/manage/dataBaseEdit/caseManage">
                        <span class="function-str">关卡管理</span>
                        <span class="function-num">0</span>
                    </el-menu-item>
                    <el-menu-item index="/manage/dataBaseEdit/statisticsManage">统计分析</el-menu-item>
                </el-menu> -->

                <div class="Router-link">
                    <!-- <div class="colums">
                        <router-link :to="{name:'wordsManage',params:{id:index}}">单词管理</router-link>
                        <span>{{nums.wordsNum}}</span>
                    </div>
                    <div class="colums">
                        <router-link :to="{name:'caseManage',params:{id:index}}">管卡管理</router-link>
                        <span>{{nums.caseNum}}</span>                        
                    </div>
                    <div class="colums starts">
                        <router-link :to="{name:'statisticsManage',params:{id:index}}">统计分析</router-link>
                    </div>                         -->
                    <template v-for="(navRoute,idx) in navRoutes">
                        <div class="colums" :key="idx" :class="{highLight:navRoute.highLight}" @click="highlightSelf(navRoute.navTo,id,idx)">
                        <!-- <router-link :to="{name:navRoute.navTo,params:{id:index}}">{{navRoute.name}}</router-link> -->
                        <span>{{navRoute.name}}</span>
                        <span>{{navRoute.count}}</span>
                        </div>
                    </template>
                </div>

                <div class="btn-import"  @click="_showImportModel">导入数据</div>
            </div>
            <!-- <el-menu-item index="/manage/dataBaseEdit/importData" class='btn-import'>
            </el-menu-item> -->
            <router-view :handleShowImportDataModel="importDataModel" :word_app_content_id="word_app_content_id"  ref="changData"   @tellLessonManageReduiceOneCaseCard="getWordsReduiceFromCaseManage"  @tellLessonManageReduiceOneWord="getWordsReduiceFromWordManage"></router-view>
        </div>
        <div class="importModel">
            <import-model :showImportModel ="showImportModel" :word_app_content_id="word_app_content_id" @upData="toGetWord" ></import-model>
        </div>
        <!-- 修改课程信息 -->
        <div class="editBrief-model">
            <el-dialog :visible.sync="edit_briefModel">
                <LessonBriefEdit :id="lessonInfo.id" @closeBriefModel = "closeBriefModel" @upDataBrief="toGetLessonContent"></LessonBriefEdit>
            </el-dialog>
        </div>
        <div class="el-footer">
            <div class="greyColor"></div>
            <div class="btns">
                <!-- <div class="save" @click="save">保存</div> -->
                <div class="release" @click="showReleaseModel">发布</div>
            </div>
        </div>
        <!--是否确认-->
        <div class="caseManage">
            <if-confirm :showModel="showConfirmModel" :selfModelStr="releaseSuccess" @killSelf="configRelease"></if-confirm>
        </div>
      
       
    </div>
</template>

<script>
import LessonBriefEdit from "components/common/models/lessonBriefEdit";
import importModel from "components/common/models/importModel";
import ifConfirm from "../../../../common/models/ifConfirm";
import {
  getLessonContent,
  delWordAppContent,
  getDictData,
  getWordAndLevelCount
} from "static/js/toAjax";
export default {
  components: {
    LessonBriefEdit,
    importModel,
    ifConfirm
  },
  data: function() {
    return {
      word_app_content_id: 0,
      id: null,
      navRoutes: [
        { name: "单词管理", count: 0, navTo: "wordsManage", highLight: true },
        { name: "关卡管理", count: 0, navTo: "caseManage", highLight: false },
        { name: "统计分析", count: "", navTo: "statisticsManage", highLight: false }
      ],

      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      ifShowClassOptions: false,
      showImportModel: { showModel: false },
      fileList: [],
      edit_briefModel: false,
      showConfirmModel: {
        confirm: false
      },
      lessonInfo: {},
      subject: "",
      term: "",
      target: "",
      releaseSuccess: "发布成功"
    };
  },
  methods: {
    // handleSelect(key, keyPath) {
    //   let self = this;
    //   console.log(keyPath[0]);
    //   if (keyPath[0] == "/manage/dataBaseEdit/caseManage") {
    //     self.ifShowClassOptions = true;
    //     localStorage.setItem("idx", keyPath[0]);
    //   } else {
    //     self.ifShowClassOptions = false;
    //     localStorage.setItem("idx", keyPath[0]);
    //   }
    // },
    //删除课程
    delBriefModel() {
      let that = this;
      that.releaseSuccess = "是否确认删除";
      this.showConfirmModel.confirm = true;
    },
    _showImportModel() {
      this.showImportModel.showModel = true;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //   submitUpload() {
    //     this.$refs.upload.submit();
    // },

    editBriefModel() {
      this.edit_briefModel = true;
    },
    closeBriefModel() {
      this.edit_briefModel = false;
    },
    importDataModel(val) {
      this.showImportModel.showModel = val;
      console.log(
        "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
      );
    },
    showReleaseModel() {
      this.showConfirmModel.confirm = true;
    },
    configRelease(val) {
      console.log("在这里调接口，确认是否发布到服务器");
      let that = this;
      if (this.releaseSuccess == "是否确认删除") {
        delWordAppContent(that.word_app_content_id).then(function(res) {
          console.log("删除成功", res);
        });
      } else {
      }
      this.$router.push("/manage/lessonManage");
    },
    highlightSelf(route, id, lighLightIndex) {
      console.log("我来了吗？");
      console.log(route, id, lighLightIndex);
      let self = this;
      self.navRoutes.map((item, index) => {
        item.highLight = false;
        // console.log(item)
      });
      self.navRoutes[lighLightIndex].highLight = true;
      localStorage.setItem("navItem",self.navRoutes)
      self.$router.push({
        name: route,
        params: { id: id }
      });
    },
    toGetWord:function(){
        this.$refs.changData.toGetWord();
    },
    toGetLessonContent() {
      let that = this;
      getLessonContent(1, this.word_app_content_id).then(function(res) {
        console.log("课程详细信息", res);
        that.lessonInfo = res.data[0];
        let lessonInfo = that.lessonInfo;
        getDictData(3)
          .then(function(res) {
            // console.log("getDictData1", res);
            for (let i = 0; i < res.data.length; i++) {
              if (lessonInfo.subject_dict_data_id == res.data[i].id) {
                //   console.log("lessonInfo.subject_dict_data_id",lessonInfo.subject_dict_data_id)
                that.subject = res.data[i].name;

              }
            }
          })
          .then(function() {
            getDictData(4).then(function(res) {
            //   console.log("getDictData2", res);
              for (let i = 0; i < res.data.length; i++) {
                if (lessonInfo.term_dict_data_id == res.data[i].id) {

                  that.term = res.data[i].name;
                }
              }
            });
          })
          .then(function() {
            getDictData(5).then(function(res) {
            //   console.log("getDictData3", res);
              for (let i = 0; i < res.data.length; i++) {
                if (lessonInfo.target_dict_data_id == res.data[i].id) {
                  that.target = res.data[i].name;
                }
              }
            });
          });
      });
    },
    //从单词管理中 通知需要减少一个单词
    getWordsReduiceFromWordManage(val){
      if(this.navRoutes[0].count>0){
        this.navRoutes[0].count= this.navRoutes[0].count-1;
      }
    },
    //从安案管理中 通知需要减少一个案例卡片
    getWordsReduiceFromCaseManage(val){
      if(this.navRoutes[1].count>0){      
        this.navRoutes[1].count= this.navRoutes[1].count-1;      
      }
    }
  },
  computed: {},
  beforeCreate: function() {},
  created() {
    let that = this;
    console.log(this.$route.params);
    this.id = this.$route.params.id;
    this.word_app_content_id = this.$route.params.id;
    this.toGetLessonContent();
    // this.navRoutes=localStorage.getItem("navItem")
    console.log(localStorage.getItem('navItem'))
    if(localStorage.getItem('navItem')!=null){
      console.log("_________________________________________________________________")
      // that.navRoutes=localStorage.getItem("navItem")      
    }
    getLessonContent(1,this.word_app_content_id).then(
        function(res){
            console.log("课程详细信息",res)
            that.lessonInfo = res.data[0];
            console.log(res.data[0])
        }
    );
    getWordAndLevelCount( that.id).then(res=>{
      that.navRoutes[0].count=res.data.word_count;
      that.navRoutes[1].count=res.data.word_level_count;
    })

    //在这里调用接口，显示内容
  },
  //页面销毁时进行的回调
  destroyed() {
    // localStorage.setItem("idx", "/manage/dataBaseEdit/funcManage");
    this.ifShowClassOptions = false;
  }
};
</script>

<style scoped>
.lessonManage {
  width: 100%;
  height: 100%;
  /* height: 80.5%; */
  /* display:flex;
        justify-content:flex-start;
        flex-direction:column; */
  box-sizing: border-box;
}

.top-abstract {
  width: 100%;
  height: 171px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.wrap-card {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #fff;
}

.wrap-card .brief-pic {
  width: 150px;
  height: 150px;
  margin-right: 16px;
  overflow: hidden;
  border: 1px solid #eee;
}

.wrap-card .brief-pic img {
  width: 150px;
}

.brief-str {
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: left !important;
}

.brief-str .left-side {
  /* padding-right: 300px; */
  flex-flow: 1;
  width:50%
}

.brief-str .left-side .title {
  font-size: 13px;
  color: #333;
}

.brief-str .left-side .keyWord {
  font-size: 12px;
  color: #666;
  line-height: 28px;
}

.brief-str .left-side .price {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.lessonManage .price .num {
  font-size: 16px;
  color: #333;
}
.lessonManage .ads {
  border: 1px solid #ff880a;
  font-size: 10px;
  padding: 0 5px;
  height: 16px;
  line-height: 16px;
  border-radius: 3px;
  margin-left: 12px;
  color: #ff880a;
}

.brief-str .left-side .explaination-content {
  font-size: 12px;
  color: #999;
}

.price {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.right-side {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  /* align-items: center; */
  font-size: 14px;
  color: #999;
  line-height: 14px;
  height: 20px;
}
.right-side div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-side div:nth-of-type(2) {
  padding-left: 10px;
  border-left: 1px solid #ccc;
  margin-left: 10px;
  
}
.right-side img {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 5px;
  cursor: pointer;
}

.right-side span {
  cursor: pointer;
}

/* 跳转选项卡高亮显示 */

.lessonManage .highLight {
  background-color: #fff !important;
  color: #319bd7 !important;
  font-size: 14px !important;
}

/* 功能选项卡  重置原有样式*/

.middle-content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  /* overflow: hidden; */
  box-sizing: border-box;
  position: relative;
}
.routerNav {
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-between;
  background: #eaf5fb;
  align-items: center;
}
.nav-card {
  width: 100%;
  height: 52px;
}

.middle-content .Router-link {
  width: 70%;
  display: flex;
  justify-content: flex-start;
}

.middle-content .Router-link .colums {
  width: 100px;
  height: 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #999;
  padding: 8px 0;
  box-sizing: border-box;
  cursor: pointer;
}
.middle-content .Router-link .starts {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

/* .el-menu--horizontal {
        border-bottom: 0 !important;
        height: 52px;
        width: 100%;
        background: #eaf5fb;
    }

    .el-menu-item {
        width: 100%;
        border: 0!important;
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #999 !important;
    }

    .el-menu-item span {
        line-height: 20px;
    }

    .el-menu-item:hover {
        height: 52px;
        background-color: transparent
    }

    .el-menu-item:visited {
        height: 52px;
        border: 0!important;
    }

    .el-menu-item.is-active {
        background-color: #fff;
        color: #319bd7!important;
        font-size: 14px !important;
        border: 0;
        height: 52px;
    } */

.btn-import {
  /* margin-top: 10px; */
  width: 120px;
  height: 32px;
  background: #319bd7;
  color: #fff !important;
  border-radius: 5px;
  float: right;
  margin-right: 10px;
  line-height: 32px;
  cursor: pointer;
}

.btn-import:hover {
  height: 32px;
  background-color: #319bd7;
  color: #fff;
}

.btn-import.is-active {
  height: 32px;
  background-color: #319bd7;
  color: #fff !important;
}

/* 管卡管理的样式文件 */
.chooseClass {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
}
.el-select {
  display: inline-block;
  position: relative;
  width: 465px;
}
.chooseClass .book-str {
  display: inline-block;
  margin-right: 10px;
}
.el-input {
  width: inherit !important;
}
</style>
