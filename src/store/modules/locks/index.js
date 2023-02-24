import http_with_auth from '../../../modules/http-common';
import {getUser} from "../../../modules/change-helpers";
import Vue from "vue";

const state = {
  fullLocks: [],
  links: [],

  userLocks: {},
  totalCount: 0,
  isLoading: false,

  currentLock: null,
  lockOwner: {}
};


function addUserToData(data, included) {
  let dataWithUsers = [];
  for(let _d of data) {
    dataWithUsers.push({
      data: _d,
      user: getUser(_d.relationships.user.data.id, included)
    });
  }
  return dataWithUsers;
}

const mutations = {
  UPDATE_FULL_LOCKS (state, {locks, included, links, meta}) {
    console.log("UPDATE_FULL_LOCKS", locks, included);
    state.fullLocks = addUserToData(locks, included);
    state.links = links;
    state.totalCount = meta['total-count'];
  },
  /*SET_NUM_PAGE(state, num) {
    state.numPage = num;
  },
  SET_PAGE_SIZE(state, size) {
    state.pageSize = size;
  },
  SET_SORTS(state, sorts) {
    state.sorts = sorts;
  },*/

  SAVE_LOCK(state, lock) {
    state.currentLock = lock;
  },

  REMOVE_LOCK (state) {
    state.currentLock = null;
  },

  FETCH_LOCK_OWNER(state, {docId, user}) {
    console.log("FETCH_LOCK_OWNER", docId, user);
    Vue.set(state.lockOwner, docId, user);
  },

  RESET_LOCK_OWNER(state, {docId}) {
    console.log("RESET_LOCK_OWNER", docId);
    Vue.set(state.lockOwner, docId, null);
  }
};

const actions = {
  /*setNumPage({commit}, num) {
    commit('SET_NUM_PAGE', num)
  },
  setPageSize({commit}, size) {
    commit('SET_PAGE_SIZE', size)
  },
  setSorts({commit}, sorting) {
    commit('SET_NUM_PAGE', 1)
    commit('SET_SORTS', sorting)
  },*/

  fetchFullLocks ({ rootState, commit }, {user, sortingPriority, pageSize, numPage, filters}) {
    const http = http_with_auth(rootState.user.jwt);

    /* =========== sorts ===========*/
    if (numPage !== null) {
      let sorts = sortingPriority ? sortingPriority.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`) : []
        sorts = `&sort=${sorts.length ? sorts.join(',') : '-expiration-date'}`
      console.log('sorts', sorts)
      return http.get(`locks?include=user${sorts}&page[size]=${pageSize || 50}&page[number]=${numPage|| 1}${filters ? '&' + filters.join('&') : ''}`).then(response => {
        commit('UPDATE_FULL_LOCKS', {
          locks: response.data.data,
          included: response.data.included,
          links: response.data.links,
          meta: response.data.meta
        });
        let locks = state.fullLocks;
        return {locks, totalCount: response.data.meta['total-count']}
      });
    }
  },

  fetchLockOwner({ rootState, commit}, {docId, lockId}) {
    const http = http_with_auth(rootState.user.jwt);
    return http.get(`/locks/${lockId}/user`).then(response => {
      commit('FETCH_LOCK_OWNER', {docId: docId, user: response.data.data});
    });
  },

  saveLock({ rootState, commit}, lock) {
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`/locks`, {data: lock}).then(response => {
      commit('SAVE_LOCK', response.data.data);
    });
  },

  removeLock({ rootState, commit}, lock) {
    const http = http_with_auth(rootState.user.jwt);
    console.log('lock : ', lock)
    return http.delete(`locks/${lock.id}`, {data: lock}).then(response => {
      commit('REMOVE_LOCK');
      commit('RESET_LOCK_OWNER', {docId: lock['object-id']});
    });
  }
};

const getters = {


};

const locksModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default locksModule;
