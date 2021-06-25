import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './routes/index';

import Buefy from 'buefy'
import './assets/sass/main.scss'
import 'buefy/dist/buefy.css'

Vue.use(Buefy, {
  defaultIconPack: 'fas' 
})


Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  created () {
   
  },
  render(h) {
    return h(App, {})
  }
});
