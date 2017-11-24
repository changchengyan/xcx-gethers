<template>
    <div class="import-model">
         <el-dialog title="导入本地数据" :visible.sync="showImportModel.showModel">
                <!-- <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList"
                    :auto-upload="false"
                    :on-change="matchFormte"
                    :on-success="successEvent"
                    :multiple="false"
                    :limit='1'>
                    <template v-if="reUpload==false">
                      <el-button size="small" type="primary" slot="trigger"  icon="el-icon-document">点击上传</el-button>
                    </template>
                    <template v-if="reUpload==true">
                      <el-button size="small" type="primary" slot="trigger"  icon="el-icon-document">重新上传</el-button>                      
                    </template>
                </el-upload> -->
                <form enctype="multipart/form-data">
                  <div class="import-btn">
                      <div class="show-fileName">
                        <span>{{formateFileName}}</span>
                        <i class="el-icon-success" :class="{ifshow:showSuccess}"></i>
                      </div>
                      <div class="wrap-importBtn">
                        <input type="file" @change='uploadData($event)'>
                        <template v-if="fileName==''">
                          <el-button size="small"   icon=" iconfont icon-wenjianjia">选择文件</el-button>
                        </template>
                        <template v-else>
                          <el-button size="small"    icon="iconfont icon-wenjianjia">重新上传</el-button>                                                
                        </template>
                      </div>                  
                  </div>
                </form>
                <div class="tips">
                    <div class="tips-left">
                        <div class="tip-title">
                            <span class="require">*</span>
                            <span>为了让你更方便快捷的导入文件内容，请您按照以下填文件内容：</span>
                        </div>
                        <div class="sub-tip">1.请按照表单对应项输入内容</div>
                        <div class="sub-tip">2.将填好的文件放置到对应文件夹内</div>
                    </div>
                    <div class="tip-right">
                        <a href="#" class="link-download">
                            <img src="../../../assets/zip.png" alt="">
                            <div class="download-str">
                                <span>模板下载</span>
                                <i class="el-icon-download"></i>                            
                            </div>
                        </a>
                    </div>
                </div>
                <div class="importModel-btns">
                    <div class="upload-btn" @click="submitUpload($event)">确定</div>  
                    <div class="cancel-btn"  @click="hiddenSelf">取消</div>                                           
                </div>
            </el-dialog>
    </div>
</template>


<script>
import { importWord } from "static/js/toAjax";
import {returnDataUrl} from 'static/js/toAjax'
export default {
  props: ["showImportModel","word_app_content_id"],
  data() {
    return {
      fileList: [],
      uploadMatchFormate:false,
      reUpload:false,
      file:'',
      fileName:'',
      showSuccess:false
    };
  },
  methods: {
    submitUpload() {
      let that = this;
      let  flag=this.uploadMatchFormate;
      console.log("flag",flag)
      if(flag){
        event.preventDefault();
			  let formData = new FormData();				
        formData.append('file', this.file,this.file.name);
        console.log("是否有！！！",formData.get('file')); 
        formData.append("uid",1);
        formData.append("word_app_content_id",that.word_app_content_id);
         that.showImportModel.showModel = false;
         importWord(formData).then(function(res) {
            if(res.success){
                that.$message.success('导入数据成功');
                that.$emit("upData")
            }else {
               that.$message.error('导入数据失败,请重试');
                that.showImportModel.showModel = true;
            }
          });
        this.fileName=''
        }else{
            this.$message.error('您上传的文件格式有误或者没有上传文件！！！');
            this.fileName=''            
        }

    },

    hiddenSelf(){
        this.showImportModel.showModel = false
        this.fileName='';                  
    },
    uploadData(event){
      let self=this;
      let data=event.target.files[0];
      this.file=data;
      this.fileName=data.name;
       if(this.fileName.endsWith('zip')||this.fileName.endsWith('rar')){
        this.uploadMatchFormate=true
      } else{
        this.uploadMatchFormate=false;           
      }
    }

  },

  computed: {
    formateFileName(){
      return this.fileName.length>50?this.fileName.substr(0,20)+'...'+this.fileName.substr(this.fileName.length-1,3):this.fileName
    }
  },
  filters: {},
  created() {}
};
</script>


<style scoped>
/* 模态框 */
.importModel .tips {
  width: 100%;
  margin-top: 35px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  box-sizing: border-box;
}
.importModel .tips .tips-left {
  width: 302px;
  text-align: left;
}
.importModel .tips .tips-left .require {
  color: #ff0101;
}
.importModel .tips .tips-left .sub-tip {
  padding-left: 15px;
}

/* 上传输入框 */
.import-model .import-btn{
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.import-model .import-btn .show-fileName{
  width: 300px;
  height: 32px;
  border: 1px solid #eee;
  line-height: 30px;
  color: #333;
  font-size: 14px;
  text-align: left;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
}
.import-model .import-btn .show-fileName i{
  display: none;
}
.import-model .import-btn .show-fileName .ifshow{
  display: block!important;
  color: #19bd9e;
}

.import-model .import-btn .wrap-importBtn{
  position: relative;
}

.import-model .import-btn .wrap-importBtn input{
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
  width:100%;
  height:100%;
  z-index: 999;
}


.importModel .tips .tip-right {
  width: 100px;
  height: 100px;
  border: 1px solid #319bd7;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  box-sizing: border-box;
  cursor: pointer;
}

.importModel .tips .tip-right .link-download {
  display: block;
  width: 100%;
}
.importModel .tips .tip-right .download-str {
  color: #999;
  font-size: 12px;
  text-align: center;
  height: 25px;
  line-height: 25px;
}

.importModel-btns {
  width: 100%;
  padding-top: 25px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.importModel-btns > div {
  height: 32px;
  width: 200px;
  font-size: 14px;
  line-height: 32px;
  border-radius: 4px;
  cursor: pointer;
}
.importModel-btns .upload-btn {
  background-color: #319bd7;
  color: #fff;
}
.importModel-btns .cancel-btn {
  background-color: #fff;
  color: #999;
  border: 1px solid #eee;
}
</style>
