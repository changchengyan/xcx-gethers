<template>
    <div class="sidebar">
        <div class="manage-logo">
            <img src="../../assets/elephent_logo.png" alt="">
            <span class="logo-str">单词 100</span>
        </div>
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" theme="dark" unique-opened router @click="gotoself">
            <template v-for="(item,idx) in items">
                <el-menu-item :index="item.index" :key='idx'>
                    <i :class="item.icon" style="display:inline-block;margin-right:2px;"></i>
                    <span>{{ item.title }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex:'/manage/lessonManage',
                items: [{
                        icon: 'iconfont icon-kechengguanli',
                        index: '/manage/lessonManage',
                        title: '课程管理'
                    },
                    {
                        icon: 'iconfont icon-lingdang',
                        index: '/manage/basecharts',
                        title: '消息中心'
                    }
                ]
            }
        },
        computed: {
            // activeIndex() {
            //     return this.$route.path.replace('/', '');
            // }
        },
        methods: {
            gotoself(){
                this.$route.push("/manage/lessonManage/")
            }
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        width: 180px;
        background: #fff;
        height: 100%;
    }

    .sidebar>ul {
        height: 100%;
    }

    .manage-logo {
        background-color: #319bd7;
        width: 180px;
        height: 70px;
        box-sizing: border-box;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manage-logo img {
        width: 35px;
        height: 29px;
    }

    .manage-logo .logo-str {
        font-size: 18px;
        color: #fff;
        font-weight: 600;
        display: inline-block;
        margin-left: 5px;
    }

    .el-menu-item {
        width: 100%;
        height: 52px;
        padding-left: 0 !important;
    }

    .el-menu-item.is-active {
        background: url('../../assets/item_hover_bg.png')!important;;
        background-size: 100% 100%!important;;
        padding-left: 0 !important;
    }
</style>
