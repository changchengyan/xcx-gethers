<template>
    <div class="funcManage ">
          <div class="wrap-tip" v-if="wordList.tableData.length<= 0 && findWordInfo.word=='' && findWordInfo.state=='-1'">
              <img src="../../../../../../assets/none_data.png" alt="">
              <div class="tip">
                  <span>您当前还没有单词，快去</span><span class="hightLight" @click="nowEditWord">新增单词 </span>或<span class="hightLight"  @click="_showImportModel">导入数据</span>吧
              </div>
          </div>
          <!-- 单词列表 -->
        <div class="word-table-show" v-else >
          <!-- 表格 -->
          <word-List :wordList="wordList" :getOnlyShowInCaseManage="caseManage"   @editWord="nowEditWord" @formChangeTable="submitForm" @changePage="changePage" @deleteWord="deleteWord"></word-List>
        </div> 
          <!-- 新增单词/修改单词 -->
        <div class="newWords" >
          <add-word :wordInfo="wordInfo" :word_app_content_id="word_app_content_id" @saveWord="toSaveWord"  :ShowAddModel ="isShowAddModel" ref="childMethod"></add-word>
        </div>
        <!-- 一键导入 -->
        <div class="importModel">
          <import-model :showImportModel ="showImportModel" :word_app_content_id="word_app_content_id" @upData="toGetWord"></import-model>
        </div>
  </div>
</template>

<script>
import addWord from "components/common/models/addWord";
import wordList from "./wordList";
import importModel from "components/common/models/importModel";
import { getWord, delWord, saveWord ,IfComfirm} from "static/js/toAjax";
//import {findWord} from '../../../../../../../static/js/toAjax'
export default {
  props:['word_app_content_id'],
  data() {
    return {
      wordList: {
        tableData: [],
        totalCount: 0,
        pageSize: 10,
        pageIndex: 1
      },
      wordInfo: {},
      findWordInfo: {
        word: "",
        state: -1
      },
      caseManage:'',
      title: "",
      isShowAddModel: {
        showModel: false
      },
      showImportModel: { showModel: false }
    };
  },
  components: {
    addWord,
    wordList,
    importModel,
   
  },
  methods: {
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
    //导入数据
    _showImportModel() {
      this.showImportModel.showModel = true;
    },
    //打开修改(新增)单词弹框
    nowEditWord(data) {
      this.title = "修改单词";
      console.log("data", data);
      let that = this;
      if (data) {
        //修改单词
        this.wordInfo = data;
        this.wordInfo.editWord = 1;
        this.isShowAddModel.showModel = true;
        console.log("this.wordInfo", this.wordInfo);
        console.log("去修改单词");
        //  this.$refs.childMethod.changeData()
        that.toGetWord();
      } else {
        //新增单词
        this.wordInfo = {};
        this.wordInfo.editWord = 0;
        console.log("this.wordInfo",this.wordInfo)
        this.isShowAddModel.showModel = true;
      }
    },

    //通过表单查询单词
    submitForm(form) {
      let that = this;
      that.findWordInfo.state = form.state;
      that.findWordInfo.word = form.word;
      that.toGetWord();
    },
    //翻页
    changePage(page) {
      let that = this;
      that.wordList.pageIndex = page;

      that.toGetWord();
    },
    //删除单词
    deleteWord(id) {
      let that = this;
      console.log("id",id)
      delWord(id).then(function(res) {
        if(res.success){
          this.$emit('tellLessonManageReduiceOneWord',val)
        }
        that.toGetWord();
      });
    },
    //保存单词
    toSaveWord(options) {
      let that = this;
      console.log("执行1");
      saveWord(options)
        .then(function(res) {
          console.log("执行3");
          console.log("res", res);
          // that.changeTabaleData(res);
        })
        .then(function() {
          that.toGetWord();
        });
    },
    //取数据
    toGetWord() {
      let that = this;
      getWord(
        that.word_app_content_id,
        that.findWordInfo.word,
        that.findWordInfo.state,
        that.wordList.pageIndex,
        that.wordList.pageSize
      ).then(function(res) {
        console.log("res", res);
        that.changeTabaleData(res);
      });
    },
    //数据填入表格
    changeTabaleData(res) {
      const that = this;
      that.wordList.tableData = res.data;
      that.wordList.totalCount = res.totalCount;
      that.wordList.pageTotal = res.pageTotal;
      that.wordList.pageIndex = res.pageIndex;
      that.wordList.pageSize = res.pageSize;
    }
  },
  // beforeCreate:function(){
  //    this.word_app_content_id = this.$route.params.id;
  //    console.log(" this.word_app_content_id", this.word_app_content_id)
  // },
  created: function() {
    const that = this;
    that.toGetWord();
  }
};
</script>

<style scoped>
.funcManage {
  width: 100%;
  height: 100%;

  flex-basis: auto;
  position: relative;
}

.funcManage:after {
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.word-table-show {
  height: 100%;

}
.wrap-tip {
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -200px;
}
.wrap-tip img {
  display: inline-block;
  width: 193px;
  height: 133px;
  margin-bottom: 45px;
}
.tip {
  font-size: 14px;
  color: #999;
}
.hightLight {
  color: #319bd7;
}
</style>

