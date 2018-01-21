/**
 * Created by luoxiongwen on 2018/1/7.
 */
import MyPapers from './pages/MyPapers.vue';
import Login from './pages/Login.vue';
import Test from './pages/Test.vue';
import PaperEditor from './pages/PaperEditor.vue';
import Scores from './pages/Scores.vue';
import ExamStatus from './pages/ExamStatus.vue';

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
    alias: '/papers',
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
    path: '/scores',
    name: 'myscores',
    component: Scores,
    beforeEnter: requireAuth,
  }, {
    path: '/papers/:id/status',
    name: 'examStatus',
    component: ExamStatus,
    beforeEnter: requireAuth,
  }
];

export default routes;