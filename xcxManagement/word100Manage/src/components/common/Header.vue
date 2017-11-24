<template>
    <div class="header">
        <div class="user-info">
                    <span class="el-dropdown-link">上午好！{{username}}编辑</span>
                    <span @click="handleCommand" class="login-out">退出</span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: 'ycc'
            }
        },
        computed: {
            username() {
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods: {
            handleCommand() {
                // if (command == 'loginout') {
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                // }
            }
        }
    }
</script>

<style scoped>
    .header {
        width: 100%;
        height: 40px;
        font-size: 22px;
        line-height: 40px;
        color: #fff;
    }

    .user-info {
        padding-right: 50px;
        font-size: 16px;
        color: #666;
        font-size: 12px;
        display: flex;
        justify-content: flex-end;
    }

    .user-info .el-dropdown-link {
        display: inline-block;
        padding-right: 50px;
        cursor: pointer;
        vertical-align: middle;
    }
    .login-out{

    }


    /* .user-info .user-logo {
            position: absolute;
            left: 0;
            top: 15px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        } */

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
