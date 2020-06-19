import Vue from 'vue'
import VueRouter from 'vue-router'


const SearchPage = () => import( '@/pages/SearchPage.vue')
const LoginPage = () => import( '@/pages/LoginPage.vue')
const RegisterPage = () => import( '@/pages/RegisterPage.vue')
const DocumentPage = () => import('@/pages/DocumentPage.vue')

import store from '@/store/index';


Vue.use(VueRouter)

const rootUrl = `${process.env.VUE_APP_APP_ROOT_URL}`

const router = new VueRouter({
  base: rootUrl,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: SearchPage,
      name: 'search'
    },
    {
      path: '/register',
      component: RegisterPage,
      name: 'register'
    },
    {
      path: '/login',
      component: LoginPage,
      name: 'login'
    },
    {
      path: '/documents/:docId',
      component: DocumentPage,
      name: 'document',
      props: true
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.fullPath.indexOf("/edit") > -1) {
    if (!store.state.user.current_user) {
      next('/login');
    }
  }
  next();
});

export default router;