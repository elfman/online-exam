import axios from 'axios';

import * as type from '../mutationTypes';

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
            axios.post('api/login', data).then(response => {
                let data = response.data;
                if (!data.errors) {
                    window.localStorage.setItem('token', JSON.stringify(data));
                    commit(type.LOGIN_SUCCESS, data);
                } else {
                    commit(type.LOGIN_FAILED, data);
                }
            })
        });
    },
    register({ commit }, data) {
        return new Promise(function () {
            axios.post('api/register', data).then(response => {
                let data = response.data;
                if (!data.errors) {
                    window.localStorage.setItem('token', JSON.stringify(data));
                    commit(type.REGISTER_SUCCESS, data);
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
    [type.REGISTER_SUCCESS](state, data) {
        state.token = data.token;
        state.expires = Date.now() + data.expires_in * 1000;
        state.email = data.user.email;
        state.avatar = data.user.avatar;
        state.name = data.user.name;
        state.id = data.user.id;
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
}