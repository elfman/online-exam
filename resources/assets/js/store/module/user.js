import axios from 'axios';

import type from '../mutationTypes';

const state = {
  token: null,
  name: null,
  email: null,
  avatar: null,
};

const getters = {
  getToken: state => state.token,
};

const actions = {
  login({commit}, data) {
    return new Promise(function () {
      axios.post('api/auth/login', data).then(response => {
        let data = response.data;
        if (!data.errors) {
          window.localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          commit(type.SET_USER_INFO, data);
          let redirect = global.app.$route.query.redirect;
          if (!redirect) {
            redirect = '/mypapers';
          }
          app.$router.replace(redirect);
        }
      })
    });
  },

  register({commit}, data) {
    return new Promise(function () {
      axios.post('api/auth/register', data).then(response => {
        let data = response.data;
        if (!data.errors) {
          window.localStorage.setItem('token', data.token);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          commit(type.SET_USER_INFO, data);
          let redirect = global.app.$route.query.redirect;
          if (!redirect) {
            redirect = '/mypapers';
          }
          app.$router.replace(redirect);
        }
      })
    })
  },

  logout({ commit }) {
    axios.get('api/auth/logout').then(res => {
      let data = res.data;
      if (!data.errors) {
        window.localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
        commit(type.CLEAR_USER_INFO);
        app.$router.push('/login');
      }
    })
  }
};

const mutations = {
  [type.SET_USER_INFO](state, data) {
    state.token = data.token;
    state.expires = Date.now() + data.expires_in * 1000;
    state.email = data.user.email;
    state.avatar = data.user.avatar;
    state.name = data.user.name;
    state.id = data.user.id;
  },
  [type.CLEAR_USER_INFO](state) {
    state.token = null;
    state.expires = null;
    state.email = null;
    state.avatar = null;
    state.name = null;
    state.id = null;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
}