import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from '@/plugins/vuetify' // path to vuetify export
import router from './routes/index';


Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,

  data: {
  },

  beforeMount: function () {
    //this.section = this.$el.dataset.section;
    //this.data = JSON.parse(this.$el.dataset.data);
  },
  
  router,
  vuetify,

  render(h) {
    return h(App, {})
  }
});
