import Vue from 'vue'
import VueRouter from 'vue-router'

const HomePage = () => import('@/pages/HomePage.vue')

const SearchPage = () => import('@/pages/SearchPage.vue')

const LoginPage = () => import('@/pages/LoginPage.vue')
const RegisterPage = () => import('@/pages/RegisterPage.vue')

const DocumentPage = () => import('@/pages/DocumentPage.vue')

const DocumentCreationPage = () => import('@/pages/DocumentCreationPage.vue')
const CollectionListPage = () => import('@/pages/CollectionListPage.vue')
const LocksPage = () => import('@/pages/LocksPage.vue')
const BookmarksPage = () => import('@/pages/BookmarksPage.vue')
const HistoryPage = () => import('@/pages/HistoryPage.vue')

const DocumentationPage = () => import('@/pages/DocumentationPage.vue')
const AboutPage = () => import('@/pages/AboutPage.vue')
const PersonsPage = () => import('@/pages/PersonsPage.vue')
const PlacesPage = () => import('@/pages/PlacesPage.vue')
const UsersPage = () => import('@/pages/UsersPage.vue')
const WitnessesPage = () => import('@/pages/WitnessesPage.vue')


import store from '@/store/index';
import { getCurrentUser } from '@/modules/http-common';


Vue.use(VueRouter)

const rootUrl = `${process.env.VUE_APP_APP_ROOT_URL}`

const router = new VueRouter({
  base: rootUrl,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomePage,
      name: 'home'
    },
    {
      path: '/search',
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
    {
      path: '/document-creation',
      component: DocumentCreationPage,
      name: 'document-creation',
      props: true
    },
    {
      path: '/collections',
      component: CollectionListPage,
      name: 'collections',
      props: true
    },
    {
      path: '/locks',
      component: LocksPage,
      name: 'locks'
    },
    {
      path: '/bookmarks',
      component: BookmarksPage,
      name: 'bookmarks'
    },
    {
      path: '/history',
      component: HistoryPage,
      name: 'history'
    },
    {
      path: '/persons',
      component: PersonsPage,
      name: 'persons'
    },
    {
      path: '/places',
      component: PlacesPage,
      name: 'places'
    },
    {
      path: '/witnesses',
      component: WitnessesPage,
      name: 'witnesses'
    },
    {
      path: '/about',
      component: AboutPage,
      name: 'about'
    },
    {
      path: '/documentation',
      component: DocumentationPage,
      name: 'documentation'
    },
    {
      path: '/users',
      component: UsersPage,
      name: 'users'
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  
  
  if (to.fullPath.indexOf("/edit") > -1 || ['history', 'bookmarks', 'locks', 'persons', 'places', 'users'].indexOf(to.name) > -1) {
      if (!store.state.user.current_user) {
        next({ name: 'login', query: { from: window.location.pathname } });
      }
  }
  

  const jwt = store.state.user.jwt
  if (jwt) {
      try {
        const response = await getCurrentUser(jwt);
        //console.log("trying to log back with jwt:", jwt, response.data)
        store.dispatch("user/setUserData", response.data.user_data)
      } catch (e) {
        console.log(e)
        store.dispatch('user/logout')
      }

  }
 
  next();
});

export default router;