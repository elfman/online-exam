/**
 * Created by luoxiongwen on 2018/1/7.
 */
import Vue from 'vue';
import Router from 'vue-router';
import MyPapers from './components/pages/MyPapers.vue';
import Login from './components/pages/Login.vue';
import Register from './components/pages/Register.vue';

Vue.use(Router);

const routes = [
    {
        path: '/',
        name: 'mypapers',
        component: MyPapers,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
    }
];

export default new Router({
    routes,
});