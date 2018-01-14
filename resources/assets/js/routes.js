/**
 * Created by luoxiongwen on 2018/1/7.
 */
import Vue from 'vue';
import Router from 'vue-router';
import MyPapers from './components/pages/MyPapers.vue';
import Login from './components/pages/Login.vue';
import Paper from './components/pages/Paper.vue';
import PaperEditor from './components/pages/PaperEditor.vue'
import Register from './components/pages/Register.vue';

const routes = [
    {
        path: '/',
        name: 'mypapers',
        component: MyPapers,
        alias: '/mypapers'
    }, {
        path: '/login',
        name: 'login',
        component: Login,
    }, {
        path: '/register',
        name: 'register',
        component: Login,
    }, {
        path: '/papers/:id/edit',
        name: 'editPaper',
        component: PaperEditor,
    }, {
        path: '/papers/create',
        name: 'createPaper',
        component: PaperEditor,
    }, {
        path: '/papers/:id',
        name: 'paper',
        component: Paper,
    }
];

export default routes;