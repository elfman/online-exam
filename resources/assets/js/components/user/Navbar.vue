<template>
  <div class="container">
    <div class="logo">
      Test Paper
    </div>
    <el-menu :default-active="defaultIndex" class="navbar-inner" mode="horizontal" :router="true">
      <el-menu-item index="mypapers" route="mypapers">我的试卷</el-menu-item>
      <el-menu-item index="myscores" route="myscores">我的成绩</el-menu-item>
    </el-menu>
    <div class="right">
      <template>
        <div class="user-info" v-if="token">
          <img :src="avatar" alt="">
          <span>{{ username }}</span>
        </div>
        <div v-else>
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data() {
      let index;
      switch (this.$route.name) {
        case 'mypapers':
          index = 'mypapers';
          break;
        case 'myscores':
          index = 'myscores';
          break;
        default:
          index = null;
          break;
      }
      return {
        defaultIndex: index,
      }
    },
    computed: {
      ...mapState({
        token: state => state.user.token,
        username: state => state.user.name,
        avatar: state => state.user.avatar,
      })
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
  }
  .logo {
    display: flex;
    width: 150px;
    justify-content: center;
    align-items: center;
  }
  .right {
    display: flex;
    margin-left: auto;
    justify-content: center;
    align-items: center;
    padding-right: 10px;
  }
  .user-info {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
</style>