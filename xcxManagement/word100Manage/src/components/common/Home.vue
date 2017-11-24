<template>
    <div class="wrapper">
        <el-container height="100%">
            <el-aside width="180px">
                <v-sidebar></v-sidebar>
            </el-aside>
            <el-container>
                <el-header>
                    <v-head></v-head>
                </el-header>
                <el-main>
                    <!-- <div class="content"> -->
                        <transition name="move" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    <!-- </div> -->
                </el-main>
                <!-- <el-footer>
                    <div class="greyColor"></div>
                    <div class="btns">
                        <div class="save">保存</div>
                        <div class="release">发布</div>
                    </div>
                </el-footer> -->
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components: {
            vHead,
            vSidebar,
        }
    }
</script>


<style>
    .wrapper{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
     .el-header {
    background-color: #fff;
    color: #000;
    text-align: center;
    line-height: 40px;
    height: 40px !important;

  }
  .el-aside, .el-main {
      overflow: visible;
  }
  .lessonManage .el-footer{
      width: 100%;
      /* line-height: 0px; */
      position: absolute;
      bottom: 0px;
      left: 180px;
      background-color: #fff;
      height: 52px!important;
      padding: 0;
  }
  .lessonManage .greyColor{
      width: 100%;
      height: 2px;
      background-color: #f5f5f5;
  }
  .lessonManage .btns{
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .lessonManage .btns>div{
      font-size: 14px;
      padding: 6px 60px;
      color: #333;
      border-radius: 4px;
      cursor: pointer;
  }
  .lessonManage .btns .save{
      border: 1px solid #eee;
      margin-right: 250px;
  }
  .lessonManage .btns .release{
      background-color: #319bd7;
      color: #fff;
  }


  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
   height:100%;
   overflow: hidden;
  }

  .el-main {
    height: 100%;
    background-color: #f5f5f5;
    text-align: center;
    margin-top: 20px;
    margin-left: 12px;
    margin-right: 12px;
    padding: 0 !important;
    /* box-sizing: border-box; */
    /* overflow: auto!important; */
    
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container{
      height: 100%;
  }
  .el-header{
      padding: 0 !important;
  }

  /* .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  } */
  .header{
      background: #fff;
  }
</style>

