/**
 * Created by luoxiongwen on 2018/1/7.
 */
import Vuex from 'vuex';
import Vue from 'vue';

import user from './module/user';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
    }
});