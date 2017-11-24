<template>
    <div class="ifConfirm">
        <el-dialog
        :visible.sync="showModel.confirm"
        >
        <i class="el-icon-warning colors"></i>
        <span class="colors" >{{selfModelStr}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="showModel.confirm = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <!-- showModel.confirm = false -->
        </span>
        </el-dialog>
    </div>
</template>


<script>
export default {
  props: ["showModel", "selfModelStr"],
  data() {
    return {};
  },
  methods: {
    confirm() {
      if (this.selfModelStr == "发布成功") {
        this.showModel.confirm = false;
        this.$emit("configRelease", "发布成功了");
      } else {
        this.$emit("killSelf", {index:this.showModel.deleteIndex,ifVoid:this.showModel.ifVoid,delName:this.selfModelStr});
        this.showModel.confirm = false;
      }
    }
  },
  filters: {},
  created() {
    console.log("我是弹窗");
  }
};
</script>


<style scoped>
.ifConfirm .colors {
  color: #319bd7;
  font-size: 16px;
}
</style>
