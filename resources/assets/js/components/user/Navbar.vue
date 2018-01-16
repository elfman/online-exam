<template>
  <el-menu :default-active="defaultIndex" class="container navbar-inner" mode="horizontal" :router="true">
    <div class="logo">
      线上考试系统
    </div>
      <el-menu-item index="mypapers" route="mypapers">我的试卷</el-menu-item>
      <el-menu-item index="myscores" route="myscores">我的成绩</el-menu-item>
    <div class="right">
      <template>
        <el-dropdown v-if="token" size="small" @command="handleCommand">
          <div class="user-info">
            <img :src="avatar" :alt="username">
            <span>{{ username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else>
          <router-link to="/login"><el-button type="text" size="large">登录</el-button></router-link>
          <router-link to="/register"><el-button type="text" size="large">注册</el-button></router-link>
        </div>
      </template>
    </div>
  </el-menu>
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
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'logout': {
            this.logout();
            break;
          }
        }
      },
      logout() {
        this.$store.dispatch('logout');
      }
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
    cursor: pointer;

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
</style>