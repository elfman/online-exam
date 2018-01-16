/**
 * Created by luoxiongwen on 2018/1/7.
 */
import MyPapers from './components/pages/MyPapers.vue';
import Login from './components/pages/Login.vue';
import Test from './components/pages/Test.vue';
import PaperEditor from './components/pages/PaperEditor.vue';
import Scores from './components/pages/Scores.vue';

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
    alias: '/register',
  // }, {
  //   path: '/register',
  //   name: 'register',
  //   component: Login,
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
    component: Test,
  }, {
    path: '/myscores',
    name: 'myscores',
    component: Scores,
  }
];

export default routes;