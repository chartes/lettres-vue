import Vue from 'vue';
import Vuex from 'vuex';

import collections from './modules/collections';
import persons from './modules/persons';
import placenames from './modules/placenames';
import document from './modules/document';
import institutions from './modules/institutions';
import languages from './modules/languages';
import user from './modules/user';
import changelog from './modules/changelog';
import locks from './modules/locks';
import witnesses from './modules/witnesses';
import bookmarks from './modules/bookmarks';
import notes from './modules/notes';
import search from './modules/search';
import layout from './modules/layout';

Vue.use(Vuex);

const VueInputMask = require('vue-inputmask').default
Vue.use(VueInputMask)


export default new Vuex.Store({
    modules: {
      collections,
      persons,
      placenames,
      document,
      institutions,
      languages,
      user,
      changelog,
      locks,
      witnesses,
      bookmarks,
      notes,
      search,
      layout
    }
});
