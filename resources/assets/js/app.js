/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from './store/store';
import routes from './routes';
import App from './components/App.vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import lodash from 'lodash';
import types from './store/mutationTypes';
import 'element-ui/lib/theme-chalk/index.css';

Vue.component('paper-component', require('./components/pages/Paper.vue'));
Vue.component('paper-editor', require('./components/pages/PaperEditor.vue'));
Vue.component('question', require('./components/Question.vue'));

Object.defineProperty(Vue.prototype, '$axios', {value: axios});
Object.defineProperty(Vue.prototype, '$_', {value: lodash});

axios.interceptors.response.use(res => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    app.$router.push({ name: 'login', query: { redirect: app.$route.fullPath } });
  }
  return res;
}, error => {
  console.log(error);
  return Promise.reject(error);
});

Vue.use(VueRouter);
Vue.use(ElementUI);

const router = new VueRouter({
  routes,
});

global.app = new Vue({
  el: '#app',
  store,
  router,
  template: '<App />',
  components: {App},
  beforeCreate: function () {
    if (localStorage.token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
      if (isTokenExpires()) {
        axios.post('api/auth/refresh', {token: localStorage.token}).then(res => {
          let data = res.data;
          if (!data.errors) {
            app.$store.commit(types.SET_AUTH_INFO, data);
            app.$store.commit(types.SET_USER_INFO, data.user);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
          } else {
            localStorage.removeItem('token');
            router.push({path: '/login'});
          }

        }).catch(error => {
          if (error.response.status === 401) {
            this.$router.push({path: 'login'});
          }
        });
      } else {
        axios.get('/api/auth/me').then(res => {
          const data = res.data;
          if (!data.errors) {
            app.$store.commit(types.SET_AUTH_INFO, {
              token: localStorage.getItem('token'),
              expires: localStorage.getItem('expires')
            });
            app.$store.commit(types.SET_USER_INFO, data);
          }
        });
      }
    }
  }
});

function isTokenExpires() {
  return localStorage.getItem('expires') - Date.now() < 24 * 60 * 60 * 1000
}
