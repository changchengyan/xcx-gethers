<template>
  <div class="word-list">
    <div class="table-header-from" >
      <el-form  ref="findWordForm" v-model="findWordForm" label-width="50px" class="demo-ruleForm" :inline="true">
        <el-form-item label="单词" >
          <el-input class="input" v-model="findWordForm.word"  @keyup.enter.native="submitForm()"></el-input>
        </el-form-item>
        <el-form-item  label-width="50px">
          <el-button type="primary" @click="submitForm"  >确认</el-button>
        </el-form-item>
        <el-form-item label="状态："  label-width="60px">
        <el-radio-group v-model="findWordForm.state">
            <el-radio :label="-1">全部</el-radio>
            <el-radio :label="1">已添加</el-radio>
            <el-radio :label="0">未添加</el-radio>
        </el-radio-group>
        </el-form-item>
      </el-form>
      <template v-if="getOnlyShowInCaseManage==''">
        <div class="to-new-word" @click="editeWord()" > + 新增单词 </div>
      </template>
    </div>
      <el-table
        :data="wordList.tableData"
        stripe
        fit
        style="width: 100%" header-row-class-name="head-th">
        <el-table-column
          width="44px"
          prop="id"
          >
          <template slot-scope="scope">
              <el-checkbox label="" @change="handleCheckedRowChange(scope.row.id)" v-model="trchecked[scope.$index]"></el-checkbox>
          </template>
        </el-table-column>
          <!-- <el-table-column
          type="selection"
          width="55">
        </el-table-column> -->
        <el-table-column
          prop="unit_name"
          label="单元"
          width="85px"
          align="left"
          >
        </el-table-column>
        <el-table-column
          prop="index"
          label="序号"
          width="85px"
          align="left"
          >
           <template slot-scope="scope">
            {{10*(pages-1)+scope.$index+1}}
          </template>
          </el-table-column>
          
        <el-table-column
          prop="word_name"
          label="单词"
          align="left"
           width="107px"
          >
        </el-table-column>
        <el-table-column
          prop="ipa"
          label="音标"
          align="left"
          width="107px">
        </el-table-column>
         <el-table-column
          prop="word_mp3_url"
          label="发音"
          align="left" 
          width="177px">
          <template slot-scope="scope">
            <div class="cell-audio">
              <!-- <span class="el-icon-pause"></span>
              <span class="el-icon-play"></span> -->
                <audio class="" :src="scope.row.word_mp3_url"  controls>
                </audio>
            </div>
             
          </template>
        </el-table-column>
          <el-table-column
          prop="translation"
          label="翻译"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="added"
          label="状态"
          align="left"
           width="65px"
        >
        <template slot-scope="scope" >
          <div class="added" v-if="scope.row.added == 0">未添加</div>
          <div class="no-add" v-else-if="1">已添加</div>
        </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="145px"
          align="center"
          :v-if="showOperation"
          >
          <template slot-scope="scope" v-if="getOnlyShowInCaseManage==''">
            <el-button  type="text" size="small" @click="editeWord(scope.row)" >修改</el-button>
            <el-button type="text" size="small"   @click.native.prevent="deleteRow(scope.$index,scope.row.id, wordList.tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页 -->
        <div class="change-page">
          <div class="choose-all">
            <span class="choose-all-input">
              <el-checkbox label="" name=""  @change="handleCheckAllChange" v-model="allChecked"></el-checkbox></span>
              <template v-if="getOnlyShowInCaseManage==''">  
                <span>全部</span>
                <el-button type="primary" @click="delForm">删除</el-button>
              </template>
              <template v-else>
                <span>全部</span>
                <span style="display:inline-block;margin-left:10px;">已勾选{{selectedList.length}}个单词</span>
              </template>
          </div>  
          <div class="page-box">
            <span >共有1条,每页显示：10条</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="10"
              layout=" prev, pager, next, jumper"
              :total="wordList.totalCount">
            </el-pagination>
          </div>
        </div> 
         <!--是否确认-->
        <if-comfirm :selfModelStr="modelStr" :showModel="showModel" @killSelf="deleteSelf"></if-comfirm>
        <template v-if="getOnlyShowInCaseManage=='caseManage'">
            <div class="btns" style="margin-top:20px;">
              <el-button  style="padding:10px 60px; margin-right:30px" @click="tellFatherConfirmSelf">确 认</el-button>
              <el-button  style="padding:10px 60px;" type="primary" @click="tellFatherDelSelf">取 消</el-button>
            </div>
        </template>
  </div>
</template>

<script>
// import addWord from "../../../../../../components/page/bombBox/addWord.vue";
import Axios from "axios";
import IfComfirm from "../../../../../common/models/ifConfirm";
//import {findWord} from '../../../../../../../static/js/toAjax'
export default {
  props: ["wordList",'getOnlyShowInCaseManage','getCardId'],
  data() {
    return {
      showOperation: false,
      currentPage: 1,
      findWordForm: {
        word: "",
        state: -1
      },
      pages: 1,
      trchecked: [],
      allChecked: false,
      // 删除确认
      modelStr: "",
      showModel: { confirm: false, deleteIndex: null },
      selectedList:[]
    };
  },
  components: {
    IfComfirm
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      (this.pages = `${val}`), (this.allChecked = false);
      this.handleCheckAllChange(false);
      this.$emit("changePage", val);
    },
    
    editeWord(info) {
      //console.log(info)
      this.$emit("editWord", info);
    },
    submitForm(findWordForm) {
      var that = this;
      console.log("findWordForm", that.findWordForm);
      this.$emit("formChangeTable", that.findWordForm);
    },
    //全选
    handleCheckAllChange: function(val) {
      let that = this;
      console.log(val)
      that.trchecked = [];
      that.selectedList=[];
      for (var i = 0; i < that.wordList.tableData.length; i++) {
        that.trchecked.push(val);
      }
      if(this.allChecked){
        console.log(this.wordList.tableData)
        this.wordList.tableData.map((item,index)=>{
          that.selectedList.push({'word_id':item.id});          
        })
      }else{
        that.selectedList=[];
      }
    },
    //勾选
    handleCheckedRowChange: function(id) {
      let that = this;
      let idxList = [];
      console.log(this.trchecked);  
      // console.log(id)       
      this.trchecked.forEach(function(item, idx) {
        if (item == true) {
          idxList.push(idx);
        }
      });
      console.log(idxList)
      let tmpArrSeletedList=[];          
      if(that.selectedList.length!=0){
        for(let j=0;j<this.trchecked.length;j++){         
          if(that.selectedList[j].word_id&&that.trchecked[j]==false){
            that.selectedList.splice(j,1);
            break;
          }
          else  if(that.trchecked[j]==true){
            for(let i=0;i<idxList.length;i++){
               tmpArrSeletedList.push({'word_id':that.wordList.tableData[idxList[i]].id})          
            }
            that.selectedList=that.cros(that.selectedList,tmpArrSeletedList);            
            break;
          }
        }
      }
      else{
          this.selectedList.push({'word_id':id})        
      }
      
      if (idxList.length == that.wordList.tableData.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
      console.log(this.trchecked);   
      console.log(that.selectedList.length)
     
    },
    //确定删除执行
    deleteSelf(val) {
      let that = this;
      that.$emit("deleteWord", val.index);
      that.showModel.confirm = false;
      if (that.muchdel) {
        that.allChecked = false;
        that.muchdel = false;
      }
      that.handleCheckAllChange(false);
    },
    //删除行
    deleteRow(index, id, rows) {
      let that = this;
      console.log("id", id);
      that.modelStr = "是否移除单词吗？";
      that.showModel.confirm = true;
      this.showModel.deleteIndex=id;
      //this.$emit("deleteWord", id);
      //rows.splice(index, 1);
    },
    //多选删除
    delForm: function() {
      let idxList = [];
      let idList = [];
      let that = this;
      
      this.trchecked.forEach(function(item, idx) {
        if (item == true) {
          idxList.push(idx);
        }
      });
      idxList.forEach(function(item, idx) {
        idList.push(that.wordList.tableData[item].id);
        //that.wordList.tableData.splice(idx, 1);
      });
      console.log("idList", idList);
      if(idList.length>0){
        that.modelStr = "是否移除这些单词吗？";
        that.showModel.confirm = true;
        this.showModel.deleteIndex=idList;
         // this.$emit("deleteWord", idList);
         // that.handleCheckAllChange(false);
      }else {

      }
    
    },
    tellFatherConfirmSelf(){
      let self=this;
      console.log(this.selectedList)
      this.$emit('commitMe',{postArr:self.selectedList,closeSelf:false,word_level_id:this.getCardId})
    },
    tellFatherDelSelf(){
      this.$emit('commitMe',{postArr:[],closeSelf:false})      
    },
    //取数组的交集
     cros(arr1,arr2){
        var hash={}, result=[];
        for(var i=0;arr1[i]!=null;i++)hash[arr1[i]]=true;
        for(var i=0;arr2[i]!=null;i++){
            if(hash[arr2[i]]){
                result.push(arr2[i])
            }
        }
        return result
    }

    
  },
  created: function() {
    let that = this;
  }
};
</script>

<style scoped>
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
/* 表格*/

.word-list {
  height: calc(100% - 150px);
  padding: 0 10px;
}
.el-table {
  height: calc(100% - 320px);
  overflow: auto;
  min-height: 170px;
  border: 1px solid #eee;
}

.cell-audio {
  text-align: left;
  width: 143px;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 4px;
  height: 32px;
  background: #fafafa;
}
.cell-audio audio {
  transform: scale(0.8) translate(-40px);
  display: inline-block;
  /* height: 25px;
  border: 1px solid #eee;
  border-radius: 4px; */
}
.el-icon-play {
  display: inline-block;
  width: 9px;
  height: 14px;
  border-left: 2px solid #666;
  border-right: 2px solid #666;
}
.el-icon-pause {
  display: inline-block;
  width: 0;
  height: 0;
}
.added {
  font-size: 12px;
  color: #999;
}
.no-add {
  font-size: 12px;
  color: #31d745;
}
/* 分页 */
.change-page {
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-top: 0;
}

.page-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
}
.el-pagination {
  display: inline-block;
}
/* 表格头部 */
.table-header-from {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}
.table-header-from .el-form {
  text-align: left;
}
.table-header-from .input {
  height: 32px;
  width: 242px;
  border-radius: 4px;
}
.el-input__inner {
  height: 32px;
  width: 242px;
}
.table-header-from .el-button--primary {
  background-color: #fff;
  border-color: #fff;
  color: #666;
  border: 1px solid #eee;
  height: 32px;
  width: 50px;
}
.el-button--primary:active {
  background-color: #319bd7;
  color: #fff;
}
.table-header-from .el-form--inline .el-form-item {
  margin: 0;
}
.table-header-from .el-radio__label {
  padding-left: 7px;
}
.table-header-from .to-new-word {
  width: 120px;
  line-height: 30px;
  height: 30px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
}
.table-header-from .to-new-word:hover {
  background: #319bd7;
  color: #fff;
}
/* 分页 */
.choose-all {
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.choose-all-input {
  display: inline-block;
  width: 44px;
  text-align: center;
}
.change-page {
  height: 48px;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
}
.el-pagination {
  margin-left: 12px;
  display: inline-block;
  font-weight: 400;
}
 .ifConfirm .colors{
        color: #319bd7;
        font-size: 16px;
    }
</style>

