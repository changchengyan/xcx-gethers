<template>
<div class="add-word">
    <el-dialog  :title="selfWordInfo.editWord==0?'新增单词':'修改单词'" :visible.sync="ShowAddModel.showModel" width="514px">
      <div>
        <el-form ref="selfWordInfo"  label-width="90px" label-position="right" :rules="rules" :model="selfWordInfo">
          <div class="select-box">
               <el-form-item label="关卡:">
                  <el-select v-model="checkPoint.id" placeholder="请选择关卡">
                    <el-option :label='item.level_name' :value="item.id" v-for="item in checkPoint" :key='item.id'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="单元:" label-width="60px">
                  <el-input v-model="selfWordInfo.unit_name" placeholder="请填选单元"></el-input>
                  <!-- <el-select v-model="selfWordInfo.unit_name" placeholder="请选择单元">
                    <el-option v-for="item in 10" :key='item' :label="item" :value="item"></el-option>
                  </el-select> -->
                </el-form-item>
          </div>
          <div class="needRequire">
            <span class="required">*</span>        
            <el-form-item label="单词:">
              <el-input v-model="selfWordInfo.word_name"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="音标:">
            <el-input v-model="selfWordInfo.ipa"></el-input>
          </el-form-item>
          <div class="needRequire">
            <span class="required">*</span>        
            <!-- <el-form-item label="音频:"  class="upload-music">
              <el-upload
                class="upload-demo"
                ref="upload"
                :v-model="selfWordInfo.word_mp3_url"
                action="http://filecloud.test.codebook.com.cn/api/Files/UploadFileToTence"
                :file-list="fileList"
                :auto-upload="true"
                :multiple="false"
                :limit='1'
                :on-change="matchFormte"
                :on-success="successEvent"
                :on-progress="progressEvent"
                @clearFiles="removeList"
                :on-error="errorUp"
                placeholder="请输入内容"
              >
                <template v-if="reLoadfile==false" >
                  <el-button size="small" type="primary" slot="trigger">点击上传</el-button>                
                </template>
                <template v-else>
                  <el-button size="small" type="primary" slot="trigger" @click='reLoadOneFile'>重新选择</el-button>                                
                </template>
              </el-upload>
            </el-form-item> -->
            <template>
                <form>
                  <div class='add_sound'>
                    <el-form-item label="上传音频:">
                        <el-input v-model="selfWordInfo.word_mp3_url" :disabled="true" class="up-sound"/></el-input>
                         <input @change='upSound'  type="file" class="up-sound-input">
                    </el-form-item>
                    <!-- <div class="upload-str"></div> -->
                   
                   
                  </div>
                </form>							
              </template>

        </div>
          <div class="needRequire">
            <span class="required tops">*</span>
            <el-form-item label="中文释义:">
              <el-input type="textarea" v-model="selfWordInfo.translation" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
            </el-form-item>
            <div class="showIptNum">
              <template v-if="selfWordInfo.translation">
                {{selfWordInfo.translation.length}}/500                
              </template>
            </div>
          </div>
        </el-form>
      </div>
      <!-- slot="footer" -->
      <div  class="dialog-footer">
        <el-button type="primary" @click="submitUpload($event)">确 定</el-button>
        <el-button @click="submitUploadCountiue">确定并新增</el-button>
        <el-button @click="hiddenSelf">取 消</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { getLevels, returnDataUrl } from "static/js/toAjax";
export default {
  props: ["ShowAddModel", "wordInfo", "word_app_content_id"],
  data() {
    return {
      selfWordInfo: {
        editWord: 0,
        unit_name: "",
        ipa: "",
        word_name: "",
        translation: ""
      },
      noWordInfo: {
        editWord: 0,
        unit_name: "",
        ipa: "",
        word_name: "",
        translation: ""
      },
      checkPoint: [{ level_name: "请选择关卡" }],
      reLoadfile: false,
      fileList: [],
      file: [],
      // wordInfo: {
      //   ipa:"",
      //   translation:"",
      //   unit_name:"",
      //   word_mp3_url:"",
      //   word_name:"",
      // },
      uploadFormate: false,
      clickSubmit: false,
      rules: {
        "selfWordInfo.word_name": [
          {
            required: true,
            message: "*请输入单词",
            trigger: "blur"
          }
        ],
        "selfWordInfo.translation": [
          {
            required: true,
            message: "*请写中文解释",
            trigger: "blur"
          }
        ],
        "selfWordInfo.fileList": [
          {
            required: true,
            message: "*请写中文解释",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    //     fileList() {
    // 　　　　return this.selfWordInfo.fileList
    // 　　}
  },
  watch: {
    wordInfo: function() {
      this.changeData();
    }
  },
  methods: {
    onSubmit() {
      let that = this;

      that.dialogVisible = !that.dialogVisible;
    },

    submitUpload() {
      let that = this;
      that.beforeU();
      that.hiddenSelf();
    },
    beforeU() {
      this.clickSubmit = true;
      let that = this;
      let flag = this.uploadFormate;
      console.log("this.uploadFormate", this.uploadFormate);
      if (
        this.selfWordInfo.word_name !== "" &&
        this.selfWordInfo.translation != "" &&
        this.selfWordInfo.fileList != ""
      ) {
      }
      if (flag) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("uid", 1);
        formData.append("code", 12);
        formData.append("file", this.file);
        returnDataUrl(formData).then(function(res) {
          console.log("returnDataUrl",res)
          if (res.success) {
            that.selfWordInfo.word_mp3_url = res.data.source_url;
            let postWordInfo = {};
            postWordInfo.word = Object.assign({}, that.selfWordInfo);
            delete postWordInfo.word.added;
            delete postWordInfo.word.isTrusted;
            delete postWordInfo.word.editWord;
            delete postWordInfo.word.is_delete;
            delete postWordInfo.word.topsize;
            delete postWordInfo.word.word_level_id;
            delete postWordInfo.word.word_level_relation_id;
            postWordInfo.word.word_duration = 1;
            postWordInfo.word.word_app_content_id = that.word_app_content_id;
            console.log("that.selfWordInfo", that.selfWordInfo);
            that.upLoad(postWordInfo)
          }
        });
      } else {
        this.$message.error("您上传的文件格式有误！");
      }
    },
    upLoad: function(postWordInfo) {
      let that = this;
      if (that.selfWordInfo.editWord == 1) {
          //修改
          postWordInfo.word_level_relation_id =
            postWordInfo.word_level_relation_id || -1;
          postWordInfo.word_level_id = that.checkPoint.id || -1;
        } else {
          //新增
          postWordInfo.word.id = 0;
          postWordInfo.word_level_id = that.checkPoint.id || -1;
        }
         this.$emit("saveWord", postWordInfo);
         this.$message.success("成功");
    },
    submitUploadCountiue: function() {
      let that = this;
      that.beforeU();
      that.selfWordInfo = Object.assign({}, this.noWordInfo);
    },
    upSound: function(event) {
      let that = this;
      let reader = new FileReader();
      let sound = event.target.files[0];
      this.file = sound;
      this.changeImg = true;
      reader.readAsDataURL(sound);
      reader.onloadend = function() {
        // self.form.app_pic = reader.result;
      };
      that.matchFormte(sound);
      // console.log(event);
    },


    hiddenSelf() {
      this.ShowAddModel.showModel = false;
      
    },
    matchFormte(file) {
      console.log("file", file);
      if (
        file.name.endsWith("mp3") ||
        file.name.endsWith("wav") ||
        file.name.endsWith("ogg")
      ) {
        this.uploadFormate = true;
      } else {
        this.uploadFormate = false;
      }
    },
    //处理接受的数据
    changeData() {
      let that = this;
      console.log("changeData", this.wordInfo.editWord);
      if (this.wordInfo.editWord == 1) {
        this.selfWordInfo = Object.assign({}, this.wordInfo);
      } else {
        console.log("新增");
        this.selfWordInfo = Object.assign({}, this.noWordInfo);
      }
    }
  },
  created: function() {
    //获取新建的所有关卡
    let that = this;
    getLevels(that.word_app_content_id).then(function(res) {
      that.checkPoint = res.data;
      console.log(that.checkPoint);
    });
  },
  updated() {
    // console.log(this.fileList)
  }
};
</script>
<style scoped>
.add-word {
  display: inline-block;
}
/* .upload-demo  {
    display: inline-block;
    margin-left: 15px;
  } */

.el-form-item__content {
  width: 272px;
}
.el-upload--text {
  display: inline;
}

.add-word .el-upload--text {
  display: inline;
}
.add-word .el-form-item {
  font-size: 14px;
  color: #333;
}

.add-word .needRequire {
  width: 100%;
  position: relative;
}
.add-word .needRequire .required {
  position: absolute;
  top: 12px;
  left: 36px;
  color: #ff0101;
}
.add-word .needRequire .tops {
  left: 7px;
}
</style>
