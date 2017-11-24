<template>
 
   	<div class="lessonBriefEdit" ref="form" :model="form">
      <div class="lesson-name">
        <div class="wrap-strName">
          <span class="required">*</span>
          <span class="str-name">课程名称：</span>
        </div>
        <div class="wrap-ipt">
          <el-input v-model="form.app_content_name" placeholder="请输入课程名字"></el-input>
          <div class="after-num">{{form.app_content_name.length}}/20</div>
        </div>
      </div>
      <template v-if="form.app_content_name&&form.app_content_name.length>25">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能超过50个字符</span>								
        </div>
      </template>
      <template v-if="form.app_content_name==''&&btnClick==true">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能为空</span>								
        </div>
      </template>
      <div class="lesson-price">
        <div class="wrap-strName">
          <span class="required">*</span>
          <span class="str-name">价格：</span>
        </div>
        <el-input v-model="form.price" placeholder="正数，保留两位小数"></el-input>
        <span>元</span>
      </div>
      <template v-if="form.price&&form.price.split('.')[1]&&form.price.split('.')[1].length>2">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>必须是正数，且最多保留两位小数</span>								
        </div>
      </template>
      <template v-if="form.price&&plusFlag==false&&btnClick==true">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能是负数</span>								
        </div>
      </template>
      <template v-if="form.price==null&&btnClick==true">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能为空</span>								
        </div>
      </template>
      <div class="lesson-tag">
        <div class="wrap-strName">
          <span class="required">*</span>
          <span class="str-name">课程标签：</span>
        </div>
        <div class="course">
          <span class="str-name color999">学科</span>
          <el-select v-model="form.subject_dict_data_id" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in subject_list" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="schoolYear">
          <span class="str-name color999">学年</span>
          <el-select v-model="form.term_dict_data_id" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in term_list" :key="item.id"></el-option>
          </el-select>
        </div>
        <div class="purpose">
          <span class="str-name color999">目的</span>
          <el-select v-model="form.target_dict_data_id" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in target_list" :key="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <template v-if="(form.subject_dict_data_id==''||form.term_dict_data_id==''||form.target_dict_data_id=='')&&btnClick==true">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能为空</span>								
        </div>
      </template>
      <div class="upload-pic">
        <div class="wrap-strName">
          <span class="required">*</span>
          <span class="str-name">课程封面：</span>
        </div>
          <div class="wrap-upload">
            <!-- <el-upload
            class="avatar-uploader"
            ref="upload"
            action="http://filecloud.test.codebook.com.cn/api/Files/UploadFileToTence?uid=1&code=12"
            :show-file-list="false"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :auto-upload='false'
            :multiple='false'
            :limit='1'
            > -->
            <!-- :before-upload="beforeAvatarUpload" -->
            
              <!-- <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
            
              <template v-if="form.app_pic==''">
                <form>
                  <div class='add_img'>
                    <i class="el-icon-plus"></i>
                    <div class="upload-str">上传图片</div>
                    <input @change='add_img'  type="file">
                  </div>
                </form>							
              </template>
            <template v-if="form.app_pic">
              <div class="add_img showed-img">
                <img :src="form.app_pic" alt="">
              </div>
            </template>
            <template v-if="form.app_pic">
            <div class="hoverBtn">
              <div class="delete" @click="deleteSelfImg"> <i class="el-icon-delete"></i> </div>
              <div class="edit" > 
                <i class="el-icon-edit-outline"></i>
                <input type="file" @change='add_img' >
              </div>
            </div>						
            </template>
          </div>	
          <div class="upload-tip">
            <span>图片尺寸800px*800px</span>
            <span>图片格式支持PNG，JPG，JPEG，GIF</span>					
          </div>
      </div>
      <template v-if="form.imageUrl==''&&btnClick==true">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能为空</span>								
        </div>
      </template>
      <div class="lesson-description">
        <div class="wrap-strName">
          <span class="required">*</span>
          <span class="str-name">课程简介：</span>
        </div>
        <div class="textArea">
          <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.app_desc"
          :autosize="{ minRows: 4, maxRows: 9}"
          >
          </el-input>
          <div class="limit-words">
            {{form.app_desc.length}}/500
          </div>
        </div>
      </div>
      <template v-if="form.app_desc&&form.app_desc.length>500">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能超过500个字符</span>								
        </div>
      </template>
      <template v-if="form.app_desc==''&&btnClick==true">
        <div class="show-error">
          <i class="el-icon-error"></i>
          <span>不能为空</span>								
        </div>
      </template>
      <div class="eventService" v-if="activitys.length>0">
        <div class="wrap-strName">
          <span class="str-name">活动服务：</span>
        </div>
        <div class="wrap-rightStr" v-for="(item,index) in activitys" :key="item.id">
            <el-checkbox value="item.id"  v-model="activitysChecked[index]">{{item.activity_title}}</el-checkbox>
            <div class="eventTime-tip">
              <span>活动时间 {{item.starttime}} 至 {{item.endtime}}
      {{item.desc}}</span>
            </div>
            
        </div>
      </div>
        <div class="btns">
          <!-- <button @click="submitForm()" style="position:absolute;top:0px;left:0;z-index:100;">提交</button>										 -->
           <el-button @click="submitForm($event,'save')">保存</el-button>
            <el-button class="btn-bg" @click="submitForm($event,'next')" v-if="id==0">下一步</el-button>
            <el-button class="btn-bg" @click="cancel" v-else>取消</el-button>
        </div>
    </div>
</template>


<script>
import {
  returnDataUrl,
  getLessonContent,
  importWord,
  getActivitys,
  getDictData,
  saveWordAppContent
} from "static/js/toAjax";
export default {
  props: ["id"],
  data() {
    return {
      form: {
        app_content_name: "",
        price: null,
        subject_dict_data_id: "",
        term_dict_data_id: "",
        target_dict_data_id: "",
        app_desc: "",
        app_pic: ""
      },
      activitys: [],
      activitysChecked:[],
      checked: true,
      btnClick: false,
      plusFlag: true,
      fileList: [],
      file: "",
      subject_list: [],
      term_list: [],
      target_list: [],
      imgChange: false
    };
  },
  methods: {
    submitForm(even, todo) {
      let self = this;
      self.btnClick = true;
      event.preventDefault();
      if (
        self.form.app_content_name != "" &&
        self.form.price != null &&
        self.form.subject_dict_data_id != "" &&
        self.form.term_dict_data_id != "" &&
        self.form.target_dict_data_id != "" &&
        self.form.app_desc != "" &&
        self.form.app_pic != ""
      ) {
        if (self.id == 0) {
          //新增课程
          self.submitImg().then(function() {
            self.postLessonContent();
            if (todo == "next") {
              self.$emit("gotoDatabaseEditer");
            }
          });
        } else {
          //修改课程
          if (self.imgChange) {
            self.submitImg().then(function() {
              self.postLessonContent();
              self.$emit("closeBriefModel");
            });
          } else {
            self.postLessonContent();
            self.$emit("closeBriefModel");
          }
        }
      } else {
        self.$message.error("请填写完整信息");
      }
    },
    submitImg() {
       let self = this;
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("uid", 1);
        formData.append("code", 12);
        formData.append("file", this.file);
        returnDataUrl(formData).then(function(res) {
          if (res.success) {
            self.form.app_pic = res.data.source_url;
            console.log("self.form.app_pic",self.form.app_pic)
            resolve(true);
          } else {
            reject(error);
          }
        });
      });
    },
    handleAvatarSuccess(response, file, fileList) {
      console.log(response);
    },
    add_img(even) {
      let self = this;
      let reader = new FileReader();
      let img1 = event.target.files[0];
      this.file = img1;
      reader.readAsDataURL(img1);
      reader.onloadend = function() {
        self.form.app_pic = reader.result;
      };
      self.imgChange = true;
      console.log(even);
    },
    limitStr(even) {
      console.log(even);
    },
    deleteSelfImg() {
      this.form.app_pic = "";
    },
    postLessonContent() {
      let that = this;
      let CONTENT = {};
      CONTENT.content = this.form;
       CONTENT.activitys=[]
      for(let i=0;i<that.activitysChecked.length;i++){
        if(that.activitysChecked[i]){
          console.log("that.activitys[i]",that.activitys[i])
           CONTENT.activitys.push(that.activitys[i].id)
        }
      }
      CONTENT.content.id = this.id;
      CONTENT.content.adviser_id = 1;
      delete CONTENT.content.activitys;
      delete CONTENT.content.create_time;
      delete CONTENT.content.examine;
      delete CONTENT.content.is_delete;
      delete CONTENT.content.level_count;
      delete CONTENT.content.word_count;
      console.log("CONTENT", CONTENT);
      saveWordAppContent(CONTENT).then(function(res) {
        that.$emit("upDataBrief");
      });
    },

    //取消
    cancel() {
      this.$emit("closeBriefModel");
    }
  },
  computed: {},
  filters: {},
  created() {
    let that = this;
    //获取课程信息
    if (that.id != 0) {
      getLessonContent(1, that.id).then(function(res) {
        //如果后台传过来的价格没有保留两位小数
        if (res.data[0] && res.data[0].price.toString().length < 10) {
          res.data[0].price = res.data[0].price.toFixed(2);
        }
        console.log("课程详细信息", res);
        that.form = res.data[0];
      });
    }
    //getDictData目前是3,4,5
    getDictData(3)
      .then(function(res) {
        console.log("getDictData1", res);
        that.subject_list = res.data;
      })
      .then(function() {
        getDictData(4).then(function(res) {
          console.log("getDictData2", res);
          that.term_list = res.data;
        });
      })
      .then(function() {
        getDictData(5).then(function(res) {
          console.log("getDictData3", res);
          that.target_list = res.data;
        });
      });
    getActivitys().then(function(res) {
      console.log("getActivitys", res);
      that.activitys = res.data;
    });
  }
};
</script>


<style scoped>
.lessonBriefEdit {
  width: 100%;
  padding-top: 40px;
  padding-left: 20px;
  font-size: 12px;
}
.lessonBriefEdit > div {
  margin-bottom: 20px;
}
.show-error {
  margin-top: -15px;
  color: #ff0000;
  font-size: 12px;
  text-align: left;
  padding-left: 100px;
}
.required {
  font-size: 12px;
  color: #ff0000;
}
.wrap-strName {
  width: 100px;
  text-align: right;
}
.str-name {
  font-size: 12px;
  color: #666;
}
.color999 {
  color: #999;
}
.lesson-name,
.lesson-price,
.lesson-tag {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.wrap-ipt {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* align-items: center; */
  position: relative;
}

.wrap-ipt .after-num {
  position: absolute;
  top: 15px;
  right: 10px;
  color: #999;
  font-size: 12px;
}

.lesson-name .el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 545px;
}
/* 价格 */
.lesson-price {
}
.lesson-price > span {
  margin-left: 5px;
}

.lesson-price .el-input,
.lesson-tag .el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 140px;
}
.lesson-price .el-input {
  width: 170px;
}
/* 课程标签 */
.course,
.schoolYear,
.purpose {
  padding-left: 10px;
}

/* 课程封面 */
.upload-pic {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.upload-pic .wrap-upload {
  width: 150px;
  height: 150px;
  position: relative;
  border: 1px dashed #eee;
  background-color: #fff;
}

/* 图片上传处理 */

.upload-pic .add_img {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ccc;
  position: relative;
  z-index: 0;
}
.upload-pic form {
  width: 100%;
  height: 100%;
}
.upload-pic .add_img i {
  /* width: 100%;
		height: 100%; */
  font-size: 24px;
  line-height: 24px;
}
.upload-pic .add_img .upload-str {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
.upload-pic .add_img input {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 99999;
  opacity: 0;
  z-index: 0;
}
.wrap-upload .showed-img img {
  width: 150px;
  height: 150px;
}

.upload-pic .wrap-upload .hoverBtn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  padding: 7px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.1);
  display: none;
}
.upload-pic .wrap-upload:hover .hoverBtn {
  display: block;
}
.upload-pic .wrap-upload .hoverBtn > div {
  width: 49%;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  float: left;
}
.upload-pic .wrap-upload .hoverBtn .delete {
  border-right: 1px solid #fff;
}
.upload-pic .wrap-upload .hoverBtn .edit {
  position: relative;
}
.upload-pic .wrap-upload .hoverBtn .edit input {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.upload-pic .upload-tip {
  width: 180px;
  padding-top: 10px;
  padding-left: 10px;
  text-align: left;
  font-size: 12px;
  color: #999;
  line-height: 18px;
}
.avatar-uploader {
  width: 150px;
  height: 150px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* 课程简介 */
.lesson-description {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.lesson-description .textArea {
  min-width: 546px;
  position: relative;
}
.lesson-description .textArea .limit-words {
  position: absolute;
  bottom: 10px;
  right: 15px;
  font-size: 12px;
  color: #999;
}

/* 活动服务 */
.eventService {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  color: #666;
  font-size: 12px;
  margin-bottom: 98px !important;
}
.eventService .wrap-rightStr {
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom:20px;
  /* justify-content: flex-start; */
  align-items: flex-start;
}
.eventTime-tip {
  color: #999;
  padding-left: 10px;
  text-align: left;
}

/* 按钮 */

.btns {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 80px;
}
.el-button {
  font-size: 14px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ddd;
  color: #333;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  padding: 15px 120px;
  border-radius: 4px;
  margin-right: 50px;
}
.btn-bg {
  background-color: #319bd7;
  color: #fff;
}
</style>
