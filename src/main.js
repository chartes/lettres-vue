import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from '@/plugins/vuetify' // path to vuetify export
import router from './routes/index';

import './assets/sass/main.scss'

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  vuetify,
  render(h) {
    return h(App, {})
  }
});
