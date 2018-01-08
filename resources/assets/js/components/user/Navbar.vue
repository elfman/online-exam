<template>
    <el-menu :default-active="activeIndex" class="navbar-inner" mode="horizontal" >
        <el-menu-item class="logo" index="logo">
            <div>
                Test Paper
            </div>
        </el-menu-item>
        <el-menu-item index="paper">我的试卷</el-menu-item>
        <el-menu-item index="score">我的成绩</el-menu-item>
        <el-menu-item index="3" class="right">
            <div class="user-info" v-if="token">
                <img :src="avatar" alt="">
                <span>{{ username }}</span>
            </div>
            <div v-else>
                <router-link to="login">登录</router-link>
                <router-link to="register">注册</router-link>
            </div>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        props: {
            token: String,
            avatar: String,
            username: String,
//            activeIndex: { type: String, default: 'paper' },
        },
        data() {
            return {
                activeIndex: 'paper'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .right {
        float: right;
    }
</style>