import axios from 'axios';

import types from '../mutationTypes';

const state = {
  token: null,
  expires: null,
  id: null,
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
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          commit(types.SET_AUTH_INFO, data);
          commit(types.SET_USER_INFO, data.user);
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
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          commit(types.SET_AUTH_INFO, data);
          commit(types.SET_USER_INFO, data.user);
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
        commit(types.CLEAR_USER_INFO);
        app.$router.push('/login');
      }
    })
  }
};

const mutations = {
  [types.SET_AUTH_INFO](state, data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('expires', Date.now() + data.expires_in * 1000);
    state.token = data.token;
    state.expires = Date.now() + data.expires_in * 1000;
  },
  [types.SET_USER_INFO](state, data) {
    state.email = data.email;
    state.avatar = data.avatar;
    state.name = data.name;
    state.id = data.id;
  },
  [types.CLEAR_USER_INFO](state) {
    state.email = null;
    state.avatar = null;
    state.name = null;
    state.id = null;
  },
  [types.CLEAR_AUTH_INFO](state) {
    state.token = null;
    state.expires = null;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
}