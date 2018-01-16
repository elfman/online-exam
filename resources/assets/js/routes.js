/**
 * Created by luoxiongwen on 2018/1/7.
 */
import MyPapers from './components/pages/MyPapers.vue';
import Login from './components/pages/Login.vue';
import Test from './components/pages/Test.vue';
import PaperEditor from './components/pages/PaperEditor.vue';
import Scores from './components/pages/Scores.vue';

function requireAuth(to, from, next) {
  if (!localStorage.token) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}

const routes = [
  {
    path: '/',
    name: 'mypapers',
    component: MyPapers,
    alias: '/mypapers',
    beforeEnter: requireAuth,
  }, {
    path: '/login',
    name: 'login',
    component: Login,
    alias: '/register',
  }, {
    path: '/papers/:id/edit',
    name: 'editPaper',
    component: PaperEditor,
    beforeEnter: requireAuth,
  }, {
    path: '/papers/create',
    name: 'createPaper',
    component: PaperEditor,
    beforeEnter: requireAuth,
  }, {
    path: '/papers/:id',
    name: 'paper',
    component: Test,
    beforeEnter: requireAuth,
  }, {
    path: '/myscores',
    name: 'myscores',
    component: Scores,
    beforeEnter: requireAuth,
  }
];

export default routes;