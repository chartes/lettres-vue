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
    state.fullLocks = locks;
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

  async fetchFullLocks ({ rootState, commit }, {user, sortingPriority, pageSize, numPage, filters}) {
    const http = http_with_auth(rootState.user.jwt);

    /* =========== sorts ===========*/
    if (numPage !== null) {
      let lockFields = ["username", "description", "event_date", "expiration_date"]
      let sorts = sortingPriority ? sortingPriority.map(s => `${s.order === 'desc' ? '-' : ''}${lockFields.includes(s.field) ? 'lock.' + s.field : s.field}`) : []
        sorts = `&sort=${sorts.length ? sorts.join(',') : '-lock.expiration_date'}`
      console.log('sorts criteriae : ', sorts)

      let query = `lock:*`;
      let query_user = '';
      let query_desc = '';
      let query_id = '';
      let query_date = '';
      let query_expiration = '';

      let collectionFilter = filters && filters.some(item => item.collections) ? filters.filter(item => item.collections) : '';
      console.log("collectionFilter : ", collectionFilter);

      if (filters && filters.length > 0) {
        console.log("filters : ", filters);
        if (filters.some(item => item.id)) {
            query_user = 'id:(' + filters.filter(item => item.id)[0].id + ')';
        }
        if (filters.some(item => item.user_id)) {
            query_user = 'lock.user_id:(' + filters.filter(item => item.user_id)[0].user_id.join(' OR ') + ')';
        }
        if (filters.some(item => item.description)) {
            query_desc = 'lock.description:*' + filters.filter(item => item.description)[0].description + '*';
        }
        if (filters.some(item => item.event_date)) {
            query_date = 'lock.event_date:*' + filters.filter(item => item.event_date)[0].event_date + '*';
        }
        if (filters.some(item => item.expiration_date)) {
            query_expiration = 'lock.expiration_date:*' + filters.filter(item => item.expiration_date)[0].expiration_date + '*';
        }
        query = query_id.length + query_user.length + query_desc.length + query_date.length + query_expiration.length > 0
            ? [query_user, query_desc, query_id, query_date, query_expiration].filter(Boolean).join(' AND ')
            : query;
      }

      let url = `/search?facade=lock&query=${query}&searchtype=&highlight=&page[size]=10&page[number]=1&without-relationships`

      let filteredCollections = []
      if (collectionFilter) {
          let filter = collectionFilter[0].collections.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
          //console.log("collectionFilter parsed", filter)
          filteredCollections = Object.values(rootState.collections.collectionsById)
              .filter(colls => colls.title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filter))
              .map(coll => coll.id);
          //console.log("filteredCollections", filteredCollections)
        }
      let collectionsFacets = {"collections": filteredCollections.length > 0 ? filteredCollections : ''};

      url += `&collectionsfacets=${encodeURIComponent(JSON.stringify(collectionsFacets))}`

      if (sorts.length > 0) {
        url += `${sorts}`
      }
      let locksResponse = await http.get(url);

      console.log("locksResponse : ", locksResponse);
      let locksWithCollections = locksResponse.data.data.map((d) =>  {
            return {
              id: d.id,
              description: d.attributes.lock[0].description,
              event_date: d.attributes.lock[0].event_date,
              expiration_date: d.attributes.lock[0].expiration_date,
              is_active: d.attributes.lock[0].is_active,

              user_id: d.attributes.lock[0].user_id,
              username: d.attributes.lock[0].username,
              collections: d.attributes.collections,
              witnesses: d.attributes.witnesses,
            };
          })
        console.log("locksWithCollections", locksWithCollections)

        let locks = locksResponse.data.data.map((d) =>  {
            return {
                id: d.id,
                description: d.attributes.lock[0].description,
                "object-id": d.attributes.lock[0].id,
                "event-date": d.attributes.lock[0].event_date,
                "expiration-date": d.attributes.lock[0].expiration_date,
                "is-active": d.attributes.lock[0].is_active,
                "witnesses": d.attributes.witnesses,
                relationships:
                    {
                        user:
                            {
                                user_id: d.attributes.lock[0].user_id,
                                username: d.attributes.lock[0].username
                            }
                    },
                user:
                    {
                        user_id: d.attributes.lock[0].user_id,
                        username: d.attributes.lock[0].username
                    }
                }
        });

        commit('UPDATE_FULL_LOCKS', {
          locks: locks,
          included: locksResponse.data.included,
          links: locksResponse.data.links,
          meta: locksResponse.data.meta
        });
        //let locks = state.fullLocks;
        return {locksWithCollections, totalCount: locksResponse.data.meta['total-count']}
      ;
    }
  },

  async fetchLockOwner({ rootState, commit}, {docId, lockId}) {
    const http = http_with_auth(rootState.user.jwt);
    let lockOwnerUser = await http.get(`/locks/${lockId}/user`).then(response => response.data.data)
    let fetchedLockOwner = {docId: docId, user: lockOwnerUser}
    commit('FETCH_LOCK_OWNER',  fetchedLockOwner)
    return fetchedLockOwner
  },

  async saveLock({ rootState, commit, dispatch}, lock) {
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`/locks`, {data: lock}).then(response => {
      //console.log('saved lock resp : ', response.data.data)
      dispatch("fetchLockOwner",
        {docId: response.data.data.attributes['object-id'],
        lockId: response.data.data.id})
      commit('SAVE_LOCK', response.data.data);
    });
  },

  async updateLock({ rootState, commit}, lock) {
    const http = http_with_auth(rootState.user.jwt);
    let updated_lock = await http.patch(`/locks/${lock.id}`, {data: lock}).then(response => {
      //console.log('updated lock resp : ', response)
      commit('REMOVE_LOCK');
    });
    return updated_lock
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
