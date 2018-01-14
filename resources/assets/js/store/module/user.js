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
    login({ commit }, data) {
        return new Promise(function () {
            axios.post('api/auth/login', data).then(response => {
                let data = response.data;
                if (!data.errors) {
                    window.localStorage.setItem('token', data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    commit(type.LOGIN_SUCCESS, data);
                    let redirect = global.app.$route.query.redirect;
                    if (!redirect) {
                        redirect = '/mypapers';
                    }
                    global.app.$router.push(redirect);
                } else {
                    commit(type.LOGIN_FAILED, data);
                }
            })
        });
    },
    register({ commit }, data) {
        return new Promise(function () {
            axios.post('api/auth/register', data).then(response => {
                let data = response.data;
                if (!data.errors) {
                    window.localStorage.setItem('token', data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    commit(type.SET_AUTH_INFO, data);
                } else {

                }
            })
        })
    }
};

const mutations = {
    [type.LOGIN_SUCCESS](state, data) {
        state.token = data.token;
        state.expires = Date.now() + data.expires_in * 1000;
        state.email = data.user.email;
        state.avatar = data.user.avatar;
        state.name = data.user.name;
        state.id = data.user.id;
    },
    // [type.REGISTER_SUCCESS](state, data) {
    //     state.token = data.token;
    //     state.expires = Date.now() + data.expires_in * 1000;
    //     state.email = data.user.email;
    //     state.avatar = data.user.avatar;
    //     state.name = data.user.name;
    //     state.id = data.user.id;
    // }
};

export default {
    state,
    getters,
    actions,
    mutations,
}