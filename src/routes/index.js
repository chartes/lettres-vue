import Vue from 'vue'
import VueRouter from 'vue-router'


const SearchPage = () => import('@/pages/SearchPage.vue')
const AdvancedSearchPage = () => import('@/pages/AdvancedSearchPage.vue')

const LoginPage = () => import('@/pages/LoginPage.vue')
const RegisterPage = () => import('@/pages/RegisterPage.vue')

const DocumentPage = () => import('@/pages/DocumentPage.vue')

const CollectionListPage = () => import('@/pages/CollectionListPage.vue')
const LocksPage = () => import('@/pages/LocksPage.vue')
const BookmarksPage = () => import('@/pages/BookmarksPage.vue')
const HistoryPage = () => import('@/pages/HistoryPage.vue')

const DocumentationPage = () => import('@/pages/DocumentationPage.vue')
const AboutPage = () => import('@/pages/AboutPage.vue')
const PersonsPage = () => import('@/pages/PersonsPage.vue')
const PlacesPage = () => import('@/pages/PlacesPage.vue')
const UsersPage = () => import('@/pages/UsersPage.vue')


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
      name: 'home'
    },
    {
      path: '/search',
      component: SearchPage,
      name: 'search'
    },
    {
      path: '/advanced-search',
      component: AdvancedSearchPage,
      name: 'advanced-search'
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

router.beforeEach((to, from, next) => {
  
  if (to.fullPath.indexOf("/edit") > -1 || ['history', 'bookmarks', 'locks', 'persons', 'places', 'users'].indexOf(to.name) > -1) {
      if (!store.state.user.current_user) {
        next({ name: 'login', query: { from: window.location.pathname } });
      }
  }
 
  next();
});

export default router;