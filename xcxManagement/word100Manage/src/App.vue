<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
@import "../static/css/main.css";
@import "../static/css/color-dark.css"; /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
@import "../static/css/iconfont.css";

/* 登录 */
.login-wrap .el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 0px;
  border: none;
  border-bottom: 1px solid #999;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #999;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 1;
  outline: 0;
  padding: 0 55px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.login-wrap .el-input__inner:hover {
  border-bottom: 1px solid #319bd7;
}

.login-wrap .el-form-item.is-success .el-input__inner,
.login-wrap .el-form-item.is-success .el-input__inner:focus,
.login-wrap .el-form-item.is-success .el-textarea__inner,
.login-wrap .el-form-item.is-success .el-textarea__inner:focus {
  border-color: #319bd7;
}

.login-wrap .el-form-item__error {
  padding-left: 10px;
}

/* 重置表单控件的样式 */
/* 单词列表 */
.word-list .el-input__inner {
  height: 32px;
  width: 242px;
}
.word-list .el-button {
  padding: 0;
}
.word-list .el-table th {
  background: #eee;
  font-size: 14px;
  color: #666;
}
.word-list .el-table::before {
  height: 0;
}
.word-list .el-table td,
.el-table th {
  padding: 7px 0;
}
.word-list .change-page .el-input__inner {
  width: 42px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.word-list .change-page .el-button--primary {
  height: 32px;
  width: 50px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #fff;
  color: #666;
  margin-left: 20px;
}
.word-list .el-pager li.active {
  background: #319bd7;
  color: #fff;
  border: 1px solid #319bd7;
}

.word-list .el-pager li:hover {
  background: #5aafdf;
  color: #fff;
  border: 1px solid #5aafdf;
}
.word-list .el-pager li {
  min-width: 32px;
  border: 1px solid #ddd;
  border-right: 0;
}
.word-list .el-pagination .btn-prev,
.word-list .el-pagination .btn-next {
  min-width: 32px;
  border: 1px solid #ddd;
  border-right: 0;
  padding-left: 8px;
  padding-right: 8px;
}
.word-list .el-pagination .btn-next {
  border-right: 1px solid #ddd;
}
.word-list .el-table tr:nth-last-of-type(1) td {
  border-bottom:0
}
/* 新增单词列表 */
/* .add-word .el-upload--text {
  display: inline;
}
.add-new-word .el-dialog__header {
  text-align: left;
  font-size: 12px;
  color: #319bd7;
  border-bottom: 1px solid #eee;
}
.add-new-word .upload-demo {
  position: relative;
  width: 100%;
  margin-left: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
}
.add-new-word .el-upload--text {
  background-color: #fff;
  border: none;
  border-radius: 6px;
  box-sizing: border-box;
  width: 0px;
  height: 0px;
  width: auto;
  height: auto;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-new-word .el-upload-list {
  width: 200px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.add-new-word .el-dialog__title {
    font-size: 16px;
    color: #319bd7;
    font-weight: 600;
} */
.wrap-upload .avatar-uploader .el-upload--text {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  width: 150px !important;
  height: 150px !important;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.wrap-upload .avatar-uploader .el-upload--text img {
  width: 150px;
  height: 150px;
}
.wrap-upload .avatar-uploader-icon[data-v-576ed7e8] {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

/* 重置导入数据的模态框 */
.import-model{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.importModel .import-model .el-dialog__header {
  padding: 0;
  line-height: 40px;
  font-size: 16px;
  text-align: left;
  padding-left: 20px;
  border-bottom: 1px solid #eee;
}
.importModel .import-model .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 500px;
  border-radius: 10px;
}
.caseManage .import-model .import-model .el-dialog__body {
    color: #5a5e66;
    line-height: 24px;
    font-size: 14px;
    padding: 30px 20px;
    padding-top: 0;
    padding-bottom: 0;
}
.importModel .import-model .el-dialog__header .el-dialog__title {
  color: #319bd7;
  font-weight: 600;
}

.importModel  .import-model .el-upload--text {
  background-color: #fff;
  border: none;
  border-radius: 6px;
  box-sizing: border-box;
  width: 100px;
  height: 32px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.importModel .import-model .upload-demo {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
}
.importModel .import-model .el-upload-list {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 302px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #eee;
  padding: 4px 15px;
  border-radius: 4px;
  height: 22px;
}
.importModel .import-model .el-upload-list__item {
  -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  color: #333;
  margin-top: 0px !important;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
}


.importModel .import-model .wrap-importBtn .el-button{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.importModel .import-model .wrap-importBtn .el-button .icon-wenjianjia{
  display: inline-block;
  margin-right: 3px;
  color: #b0e5ff;
}

/* 新增单词的弹窗 */
.newWords .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 1028px;
}
.newWords .el-input {
    width: 365px;;
}
.newWords .el-form-item__content {
    text-align: left
}
.newWords .el-textarea {
    width: 365px;
}
.newWords .el-dialog__header,
.oneKeyCase .el-dialog__header {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 0;
}
.newWords  .up-sound {
  width: 240px;
  display:inline-block;
}
.newWords .up-sound-input {
  width: 60px;
  display:inline-block;
}
.newWords .select-box  .el-form-item{
    display: inline-block;
    width: 245px;
}
.newWords .select-box .el-input {
    width: 143px;
}
.lessonManage .newWords .el-dialog__body {
  padding: 20px 10px 30px;
}
.lessonManage .newWords .el-form-item .el-input__inner {
  height: 32px;
}
.lessonManage .newWords .dialog-footer {
  padding-top: 37px;
}
.lessonManage .newWords .el-button {
  padding: 0;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
}

.lessonManage .newWords .upload-demo {
  width: 365px;
  margin-left: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
}

.lessonManage .newWords .el-upload--text {
  background-color: #fff;
  border: none;
  border-radius: 6px;
  box-sizing: border-box;
  width: 0px;
  height: 0px;
  width: auto;
  height: auto;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.lessonManage .newWords .el-upload-list__item:first-child {
  margin-top: 0px;
  height: 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(to right, #d3efff, #edfaff);
}

.lessonManage .newWords .el-upload-list {
  width: 265px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.lessonManage .newWords .el-upload-list__item .el-icon-close {
  top: 9px;
}
.lessonManage .newWords .upload-demo {
  position: relative;
}
.lessonManage .newWords .upload-demo:hover .success-icon {
  display: none;
}
.lessonManage .newWords .upload-demo .success-icon {
  position: absolute;
  top: 0;
  right: 110px;
  z-index: 1;
}
.lessonManage .newWords .el-upload-list__item-status-label {
  position: absolute;
  right: 5px;
  top: 4px;
  line-height: inherit;
  display: none;
}

.lessonManage .newWords .showIptNum {
  position: absolute;
  bottom: 5px;
  right: 47px;
}
.lessonManage .newWords .el-dialog__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
  box-sizing: border-box;
}
.lessonManage .newWords .el-dialog__title {
  font-size: 16px;
  color: #319bd7;
  font-weight: 600;
}
.lessonManage .newWords .el-dialog__header {
  top: 12px;
}
/* 一键生成关卡 */
.oneKeyCase .el-dialog,
.caseManage .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 416px;
}
.oneKeyCase .el-dialog__header {
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.oneKeyCase .el-dialog__header .el-dialog__title {
  font-size: 16px;
  color: #319bd7;
  font-weight: 600;
  /* line-height: 40px; */
}
.oneKeyCase .el-dialog__headerbtn {
  position: absolute;
  top: 10px;
  right: 15px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 16px;
}
.oneKeyCase .el-radio + .el-radio {
  margin-left: 0px;
}
.oneKeyCase .el-dialog__body {
  padding: 10px 20px;
  color: #5a5e66;
  font-size: 14px;
  color: #319bd7;
  text-align: left;
  padding-bottom: 20px;
}

/* 修改课程弹窗 */
.editBrief-model .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 50%;
}
.editBrief-model .el-dialog .el-dialog__header,
.caseManage .el-dialog__header {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

/* 案例管理弹窗重置 and 单词管理删除弹框重置 */
 .ifConfirm .el-dialog__body {
  padding: 0;
  padding-top: 58px;
  padding-bottom: 40px;
  color: #5a5e66;
  line-height: 24px;
  font-size: 14px;
}

 .ifConfirm .el-dialog__footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

 .ifConfirm .el-button {
  padding: 12px 40px;
}


/* 重置案例卡片中  没有数据的  新增单词的弹框 */

.caseManage .addCaseCard  .el-button{
  padding: 0;
  background-color: #fff;
  border: none;
}



/* 重置案例管理中的新增关卡弹窗 */
.caseManage .wordList .el-dialog{
  width: 80%;
}
</style>
