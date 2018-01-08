<template>
    <el-container class="container">
        <el-header>
            <navbar></navbar>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    import Vue from 'vue';
    import Navbar from './user/Navbar.vue';
    import ElementUI from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'

    Vue.use(ElementUI);

    export default {
        components: {
            Navbar,
        },
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
</style>