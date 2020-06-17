import http_with_csrf_token from '../../../modules/http-common';
import {getUser} from "../../../modules/change-helpers";
import Vue from "vue";

const state = {
  fullLocks: [],
  links: [],

  currentLock: null,
  lockOwner: {}
};



const mutations = {

  RESET_LOCK_OWNER(state, {docId}) {

  }
};

const actions = {
  removeLock({commit}, lock) {

  }
};

const getters = {


};

const searchModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default searchModule;
