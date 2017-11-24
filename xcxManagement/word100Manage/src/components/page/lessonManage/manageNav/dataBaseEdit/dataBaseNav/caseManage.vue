<template>
    <div class="caseManage ">
        <template v-if="caseCards.length!=0">
            <div class="btn-wrap">
                <div class="btn-left">
                    <input v-model="input" placeholder="请输入内容" class="el-input"></input>
                    <el-button class="confirm">确认</el-button>
                </div>
                <div class="btns-right">
                    <el-button class="oneTouch" @click="showOneKeyModel" :disabled="ifBan"><i class="el-icon-plus"></i>一键生成关卡</el-button>
                    <el-button class="customsPass" @click="addNewCard"><i class="el-icon-plus"></i>新增关卡</el-button>
                </div>
            </div>
            <div class="card-wrap">
                <el-row>
                    <draggable v-model="caseCards">
                        <transition-group>
                             <!-- v-if="item.sortId<=100" -->
                            <template v-for="(item,idx) in caseCards" v-if='item.sortId<=cardsLength'>
                                <el-col :span="6" class="box-card" :key="idx" >
                                    <div class="el-card"  >

                                        <div class="card-title">
                                            <div class="card-str">
                                                <template v-if="item.sortId<=noVoidLen">
                                                    关卡{{item.sortId}}({{item.tableData.length}}个单词)                                            
                                                </template>
                                                <template v-if="ifShowAddNewCard==true&&item.sortId==cardsLength">
                                                    关卡{{caseCards.length}}
                                                </template>
                                            </div>
                                            <template v-if="item.sortId<=noVoidLen">
                                                <div class="card-logos">
                                                    <i class="el-icon-rank"></i>
                                                    <i class="el-icon-delete" @click="showCaseModel(idx,'')"></i>
                                                </div>
                                            </template>
                                            <template v-if="ifShowAddNewCard==true&&item.sortId==cardsLength">
                                                <div class="card-logos">
                                                    <i class="el-icon-rank"></i>
                                                    <i class="el-icon-delete" @click="showCaseModel(idx,'void')"></i>
                                                </div>
                                            </template>
                                        </div>
                                        <template v-if="item.sortId<=noVoidLen">
                                            <div class="card-list" >
                                                <!-- <el-table
                                                    :data="caseCards[idx].tableData"
                                                    height="200"
                                                    style="width: 100%;"
                                                    ref="multipleTable"
                                                    tooltip-effect="dark"
                                                    :border= 'false'
                                                    :show-header="false"
                                                    @selection-change="handleSelectionChange"
                                                    >
                                                    <el-table-column
                                                    type="selection"
                                                    width="55">
                                                    </el-table-column>
                                                    <el-table-column
                                                    prop="word_name"
                                                    label="name"
                                                    width="100">
                                                    </el-table-column>
                                                    <el-table-column
                                                    prop="translation"
                                                    label="翻译">
                                                    </el-table-column>
                                                </el-table> -->
                                                <template v-for="(item,index) in caseCards[idx].tableData">
                                                    <div class="row" :key="index">
                                                            <input style="display:inline-block;padding:0 20px;" type="checkbox"  :value="item" v-model="caseCards[idx].delete">
                                                            <span style="display:inline-block;min-width:50px;margin-left:10px">{{item.word_name}}</span>
                                                            <span style="display:inline-block;padding-left:30px">{{item.translation}}</span>
                                                    </div>
                                                </template>
                                            </div>
                                        </template>
                                        <template v-if="ifShowAddNewCard==true&&item.sortId==cardsLength">
                                            <div class="card-list addself" style="height:200px;width:100%">
                                                <div class="addNewWords" @click="gotoAddNewWordsModel(idx)">
                                                    <i class="el-icon-plus"></i>
                                                    <span>添加单词</span>
                                                </div>
                                            </div>
                                        </template>
                                         <template v-if="item.sortId<=noVoidLen">
                                            <div class="fixed-btm">
                                                <div class="left-add" @click="gotoAddNewWordsModel(idx)">
                                                    <i class="el-icon-circle-plus"></i>
                                                    <span>添加单词</span>
                                                </div>
                                                <div class="right-remove">
                                                    <i class="el-icon-remove"></i>
                                                    <span @click="showDeleteWordsModel(idx)">移除({{caseCards[idx].delete.length}})</span>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="ifShowAddNewCard==true&&item.sortId==cardsLength">
                                            <div class="fixed-btm" style="background:#fff"></div>                                        
                                        </template> 
                                    </div>
                                </el-col>
                            </template>
                            
                        </transition-group>
                    </draggable>
                </el-row>
            </div>
        </template>
        <template v-if="caseCards.length==0">
            <div class="no-dataShow">
                <div class="import-img"></div>
                <div class="func-openModel">
                    <span>您当前还没有关卡，快去</span>
                    <span class="highLight" @click="addOneNewCard">新增关卡</span>
                    或
                    <span class="highLight" @click="showImportDataModel">导入数据</span>
                    吧
                </div>
            </div>
            <div class="addCaseCard" v-if="showOneCaseModel==true" style="margin-top:20px;">
                <el-row>
                    <el-col :span="6" class="box-card" >
                        <div class="el-card"  >
                            <div class="card-title">
                                <div class="card-str">新增关卡</div>
                                <div class="card-logos">
                                    <!-- <i class="el-icon-rank" disabled></i> -->
                                    <el-button  icon="el-icon-rank" disabled></el-button>
                                    <i class="el-icon-delete" @click="hiddenOneNewCase"></i>
                                </div>
                            </div>
                            <div class="card-list addself" style="height:200px;width:100%">
                                <div class="addNewWords" @click="gotoAddOneWordsModel">
                                    <i class="el-icon-plus"></i>
                                    <span>添加单词</span>
                                </div>
                            </div>
                            <div class="fixed-btm" style="background:#fff"></div>                                        
                        </div>
                    </el-col>
                </el-row>
            </div>
        </template>
        <!-- 新增关卡模态框 -->
        <div class="wordList">
            <!-- <add-word :ShowAddModel="isShowAddModel" ></add-word> -->
            <el-dialog :visible.sync="ifShowWordList">
                <word-list :wordList="wordList"  @formChangeTable="submitForm" :getOnlyShowInCaseManage="caseManage" @commitMe='postCheckedWords' :getCardId="cardId"></word-list>
            </el-dialog>
        </div>
        <!-- 一键生成关卡 -->
        <div class="oneKeyCase">
            <el-dialog  title="一键生成关卡"   :visible.sync="oneKeyCaseModel">
                <div class="oneKey-tip">根据您的单词，为您一键生成指定关卡数</div>
                <div class="radios">
                    <el-radio v-model="radio" label="1">关卡 5关</el-radio>
                    <el-radio v-model="radio" label="2">关卡 10关</el-radio>
                    <el-radio v-model="radio" label="3">关卡 15关</el-radio>
                    <el-radio v-model="radio" label="4">关卡 20关</el-radio>
                </div>
                <div class="btns">
                    <div class="confirm" @click="confirmSelf">确定</div>
                    <div class="cancel" @click="cancelSelf">取消</div>                    
                </div>
            </el-dialog>
        </div>
        <if-comfirm :selfModelStr="modelStr" :showModel="showModel" @killSelf="deleteSelf"></if-comfirm>
        <div class="importModel">
            <import-model :showImportModel="ifShowImportDataModel" :word_app_content_id="word_app_content_id"></import-model>            
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import  IfComfirm  from  '../../../../../common/models/ifConfirm';
    import  wordList   from '../dataBaseNav/wordList';
    import importModel from '../../../../../common/models/importModel.vue';
    import  {getLevelAndWord,getWord,delLevel,saveLevelWord,delWordOfLevel}  from  'static/js/toAjax'
    export default {
        components: {
          draggable,
          IfComfirm,
          wordList,
          importModel
        },
        props:['word_app_content_id'],
        data() {
            return {
                caseManage:'caseManage',
                input: '',
                // checkList: ['',''],
                ifBan:false,
                modelStr:"",
                ifShowWordList:false,
                 wordList: {
                    tableData: [],
                    totalCount: 0,
                    pageSize: 10,
                    pageIndex: 1
                },
                findWordInfo: {
                    word: "",
                    state: -1
                },
                isShowAddModel:{
                    showModel:false
                },
                showModel:{confirm:false,deleteIndex:null,ifVoid:''},
                cardsLength:0,
                noVoidLen:0,
                caseCards:[],
                // multipleSelection: [],
                ifShowAddNewCard:false,
                oneKeyCaseModel:false,
                radio:"1",
                ifShowImportDataModel:{
                    showModel:false
                },
                showOneCaseModel:false,
                DelArr:[],
                cardId:null  // 获取当前卡片的id
            }
        },
        methods: {
            //  toggleSelection(rows,select) {
            //     if (rows) {
            //     rows.forEach(row => {
            //         this.$refs.multipleTable.toggleRowSelection(row);
            //     });
            //     } else {
            //     this.$refs.multipleTable.clearSelection();
            //     }
            // },
            // handleSelectionChange(val) {
            //     let self=this;
            //     // let tmpMultipleSelection=self.multipleSelection;
            //     let  tmpVal=val  
            //     this.DelArr=this.DelArr.concat(val)
            //     console.log("进来了吗？")
            //     console.log(this.DelArr.length)
            //     let tmpDelArr=this.ArrayWeight(this.DelArr)
            //     console.log(tmpDelArr)
            //     console.log(tmpDelArr.length)
            //     if(tmpDelArr.length==0){
            //         for(let i=0;i<self.caseCards.length;i++){
            //           self.caseCards[i].delete=[];
            //           console.log("这里是空吗？？？？？？？？？？？？？？？？")
            //         }
            //     } else{
            //         for(let i=0;i<self.caseCards.length;i++){
            //             for(let j=0;j<tmpDelArr.length;j++){
            //                 if(self.caseCards[i].id==tmpDelArr[j].parentId){
            //                     self.caseCards[i].delete= self.caseCards[i].delete.concat(tmpDelArr[j]);
            //                     break;
            //                 }
            //             }
            //         }   
            //     }
            // },
            addNewCard(){
                if(this.ifShowAddNewCard==false){
                    this.cardsLength=this.cardsLength+1;                    
                }
                this.ifShowAddNewCard=true;                
            },
            // hiddenself(){
            //     this.ifShowAddNewCard=false
            // },
            //打开新增单词弹框
            gotoAddNewWordsModel(index){
                // this.newWordsModel=true
                // this.isShowAddModel.showModel=true;
                console.log(index)
                this.cardId=this.caseCards[index].id
                this.ifShowWordList=true;
                this.toGetWord();               
            },
            showOneKeyModel(){
                this.oneKeyCaseModel=true
            },
            cancelSelf(){
                this.oneKeyCaseModel=false;
            },
            confirmSelf(){
                console.log("123")
            },
            showCaseModel(index,ifvoid){
                this.showModel.confirm=true;
                this.showModel.deleteIndex=index;  
                this.showModel.ifVoid=ifvoid;             
                this.modelStr="确认删除该关卡吗？"
            },
            showDeleteWordsModel(index){
                if(this.caseCards[index].delete.length==0){
                    console.log("删除的单词为空，么么哒？？？")
                }
                this.showModel.confirm=true;
                this.showModel.deleteIndex=index;
                this.modelStr="确认移除这些单词吗？"
            },
            deleteSelf(val){
                let self=this;
                console.log(val)
                if(val.ifVoid=="void"){
                    self.ifShowAddNewCard=false;  
                    // this.caseCards.splice(val,1);
                     self.cardsLength=this.cardsLength-1;                                       
                }else if(val.delName=="确认删除该关卡吗？"&&val.ifVoid!="void"){
                     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                     self.caseCards.splice(val.index,1);
                     const  DELCARD=self.caseCards[val.index].id;
                    delLevel(DELCARD).then(res=>{
                        console.log(res)
                        if(res.success){
                            self.$emit("tellLessonManageReduiceOneCaseCard",1)
                        }
                    })
                 if(self.caseCards.length==1){
                    self.ifShowAddNewCard=false;
                 }
                    // self.cardsLength=this.cardsLength-1;
                }else if(val.delName=="确认移除这些单词吗？"&&val.ifVoid!="void"){
                    const tmpDelArr= self.caseCards[val.index].delete;
                    var   getWordsIds=[];
                    for(let i=0;i<tmpDelArr.length;i++){
                        getWordsIds.push(tmpDelArr[i].word_id)
                        console.log(tmpDelArr[i].word_id)
                    }
                     console.log(22221)
                        console.log(getWordsIds)
                    console.log(self.caseCards[val.index].tableData.length)
                    if(this.caseCards[val.index].tableData.length==0){
                        this.$message({
                        message: '您删除的为空',
                        type: 'warning'
                        });
                        return  false
                    }else{
                    let  delCardId=self.caseCards[val.index].tableData[0].word_level_id;
                    setTimeout(() => {
                        console.log(1111)
                        console.log(getWordsIds)
                    const  CONTEXT={'word_level_id':delCardId,'word_id':getWordsIds}
                     delWordOfLevel(CONTEXT).then(res=>{ 
                         console.log(res)
                      })
                    self.caseCards[val.index].tableData=this.intersectionArray(self.caseCards[val.index].tableData,self.caseCards[val.index].delete)
                    if(self.caseCards[val.index].tableData==0){
                         self.caseCards.splice(val.index,1);
                        if(self.caseCards.length==1){
                            self.ifShowAddNewCard=false;
                        }
                        self.cardsLength=this.cardsLength-1;
                    }
                    }, 500);
                  } 
                }      
            },
            showImportDataModel(){
                this.ifShowImportDataModel.showModel=true;
            },
            //在空的案例卡片中获取
            gotoAddOneWordsModel(){
               this.ifShowWordList=true;
                this.toGetWord();                
            },
            addOneNewCard(){
                this.showOneCaseModel=true;
            },
            hiddenOneNewCase(){
                this.showOneCaseModel=false;
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
            },
            //从子组件中返回要提交的单词列表，并提交
            postCheckedWords(val){
                console.log(val)
                let tmpCardId=val.selfCardId;
                
                let tmpJson={};
                let tmpArr=[];
                val.postArr.map((item,index)=>{
                    tmpJson={};
                    tmpJson.word_level_id=val.word_level_id;
                    tmpJson.word_id=item.word_id;
                    tmpArr[index]=tmpJson;
                })
                console.log(tmpArr)
                if(val.postArr.length!=0){
                    saveLevelWord(tmpArr).then(res=>{
                        console.log(res);
                    })
                }else{
                    this.$message.error('没有选中单词哦');
                }
                this.ifShowWordList=val.closeSelf;
            },
            //取数组的差集
            intersectionArray(arr1, arr2){
                let diff = [];
                let tmp = arr2;
                arr1.forEach(function(val1, i){
                    if (arr2.indexOf(val1) < 0) {
                    diff.push(val1);
                    } else {
                    tmp.splice(tmp.indexOf(val1), 1);
                    }
                }); 

                return diff.concat(tmp)
            },
            //数组去重
            ArrayWeight(arr){
                // var res = [];
                // res.push(arr[0])
                console.log("数组的长度:"+arr.length)
                // for(var i = 0; i < arr.length; i++){
                //     if(res.length!=0&&res[i].id!=arr[i].id){
                //         res.push(arr[i]);
                //     }
                // }
                var newArr = [arr[0]];
            　　 for(var i=1;i<arr.length;i++){
            　　　　if(newArr.indexOf(arr[i]) == -1){
                    　　 newArr.push(arr[i]);
                　　  }
                }
                return newArr;
            }
            
        },
        computed: {
            // noVoidLen(){
            //     return this.ifShowAddNewCard==true?this.cardsLength-1:this.cardsLength
            // }
        },
        watch: {
            cardsLength(){
                this.noVoidLen=this.ifShowAddNewCard==true?this.cardsLength-1:this.cardsLength
            }
        },
        created () {
            let self=this;
            console.log(this.word_app_content_id);
            if(this.word_app_content_id!=0){
                getLevelAndWord(self.word_app_content_id,'',1,12).then(
                function (res) {
                    if(res.success&&res.data.length!=0){
                        let tmpArr=res.data;
                        console.log( tmpArr)
                        let jsonArr=[];
                        let json={};
                        let tmpWords=[];
                        for(let i=0;i<tmpArr.length;i++){
                            // if(tmpArr[i].words){
                                json={};
                                // console.log("数据",i)
                                json.id=tmpArr[i].id;
                                json.sortId=i+1;
                                tmpWords=tmpArr[i].words;
                                json.wordsCount=0;
                                json.word_app_content_id=tmpArr[i].word_app_content_id
                                if(tmpWords!=null){
                                    json.wordsCount=tmpArr[i].words.length;                                    
                                    for(let j=0;j<tmpWords.length;j++){
                                        tmpWords[j].parentId=tmpArr[i].id;
                                    }
                                }
                                json.tableData=tmpWords||[];                                
                                json.delete=[];
                                jsonArr[i]=json
                            // }
                        }
                        self.caseCards=jsonArr;
                        setTimeout(() => {
                            console.log(jsonArr)
                            let voidArr=[{id:self.caseCards[0].id,sortId:self.caseCards.length+1,wordsCount:null,delete:[],tableData:[]}];
                            self.caseCards=self.caseCards.concat(voidArr)
                            self.cardsLength=self.caseCards.length-1;
                            self.noVoidLen=self.caseCards.length-1;
                            if(self.caseCards.length>1){
                                self.ifBan=true
                            }
                        }, 100);
                    }
                  })
            }
            
        }
    }
</script>

<style scoped>
    .caseManage {
        width: 100%;
        padding: 0 10px;
        overflow:auto;
        height: calc(100% - 350px);
        box-sizing: border-box;
        padding-bottom: 20px;
        position: relative;
    }


    /* 没有数据时的页面展示 */
    .caseManage .no-dataShow{
        width: 350px;
        height: 350px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -175px;
        margin-left: -175px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }


    .caseManage  .no-dataShow .import-img{
        width: 193px;
        height: 133px;
        background: url('../../../../../../assets/importData.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .caseManage .no-dataShow .func-openModel{
        font-size: 14px;
        color: #999;
        margin-top: 30px;
    }

    .caseManage .no-dataShow .func-openModel .highLight{
        color: #319bd7;
        text-decoration: underline;
        cursor: pointer;
    }

    /* 正常有数据展示 */
    .caseManage .btn-wrap {
        width: 100%;
        height: 32px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
    }
    .el-input {
        display: inline-block;
        width: 245px;
        height: 30px;
        font-size: 14px;
        color: #999;
        border:none;
        border: 1px solid #eee;
        padding: 5px;
        box-sizing: border-box;
    }


    .confirm.el-button {
        width: 51px;
        height: 32px;
        border: 1px solid #eee;
        padding: 0 !important;
        margin-left: 5px;
    }

    .oneTouch.el-button {
        width: 150px;
        height: 32px;
        border: 1px solid #eee;
        padding: 0 !important;
    }

    .customsPass.el-button {
        width: 120px;
        height: 32px;
        border: 1px solid #eee;
        padding: 0 !important;
    }


    /* 卡片视图 */

    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 0;
    }

    .box-card {
        /* padding:0 10px; */
        padding-right:10px;
        height: 100%;
        padding-bottom: 10px;

    }

    .card-wrap {}

    .el-card {
        border: 1px solid #e6ebf5;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        color: #2d2f33;
        border-radius: 4px;
        overflow: hidden;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }

    .ifNone{
        display: none;
    }

    .card-title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #319bd7;
        font-size:14px;
        display: flex;
        justify-content: space-between;
        border-bottom:1px solid #eee;
    }
    .card-logos,.card-str{
        flex:50%;
    }
    .card-logos{
        text-align: right;
        padding-right: 20px;
    }
    .card-logos i{
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
    }

    .fixed-btm{
        width: inherit;
        height: 40px;
        padding:  0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f4fafb;
    }
    .fixed-btm div.left-add {
        color: #319bd7;
        font-size: 14px;
        cursor: pointer;
    }
    .fixed-btm div.right-remove {
        color: #999;
        font-size: 14px;
        cursor: pointer;
    }
    .fixed-btm div.right-remove:hover i{
        color: #ff0000
    }
    .fixed-btm div.right-remove:hover span{
        color: #fe0000
    }
    .addself{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    /* 新增关卡 */
    .addNewWords{
        width: 120px;
        height: 32px;
        border: 1px solid #eee;
        border-radius: 5px;
        line-height: 32px;
        font-size: 14px;
        color:#666;
        cursor: pointer;
    }

    /* 一键生成关卡 */
    .oneKeyCase{
        width: 100%;
    }
    .oneKeyCase .wrap-select{
        width: 100%;
        padding: 0 20px;
        text-align: left;        
    }
    .oneKeyCase .radios{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: flex-start;
        padding-top: 16px;
        height: 100px;
        padding-bottom: 36px;
    }
    .oneKeyCase .btns{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .oneKeyCase .btns>div{
        width: 160px;
        height: 32px;
        text-align: center;
        border-radius: 5px;
        color: #fff;
        line-height: 32px;
        font-size: 14px;   
        cursor: pointer;     
    }
    .oneKeyCase .btns div.confirm{
        background-color: #319bd7;
    }
    .oneKeyCase .btns div.cancel{
        width: 160px;
        height: 32px;
        text-align: center;
        border: 1px solid #eee;
        color: #999;
    }
    

    /* 单个卡片的多选部分 */
    .caseManage .card-list{
        width:100%;
        height:200px;
        overflow:auto;
    }
    .caseManage .card-list .row{
        width:100%;
        height:44px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 20px;
        box-sizing: border-box;
    }
    .caseManage .card-list .row:hover{
        /* background:#eaf5fb; */
        background-color:#eaf5fb !important;
    }

    .caseManage .card-list .row:nth-child(odd){
        width:100%;
        background:#fff;
    }
    .caseManage .card-list .row:nth-child(even){
        width:100%;
        background:#fafafa;
    }


</style>

