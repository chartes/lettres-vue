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
function sortMethodAsc(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}

function sortMethodWithDirection(direction) {
    if (direction === undefined || direction === "asc") {
        return sortMethodAsc;
    } else {
        return function(a, b) {
            return -sortMethodAsc(a, b);
        }
    }
}

function sortMethodWithDirectionByColumn(columnName, direction){
    const sortMethod = sortMethodWithDirection(direction)
    return function(a, b){
        if (columnName !== 'collections') {
            return sortMethod(a[columnName], b[columnName]);
        } else if (columnName === 'username') {
            return sortMethod(a[columnName].toLowerCase(), b[columnName].toLowerCase());
        } else {
            return sortMethod(a.collections.title, b.collections.title);
        }
    }
}
function sortMethodWithDirectionMultiColumn(sortArray) {
    //sample of sortArray
    // sortArray = [
    //     { column: "column5", direction: "asc" },
    //     { column: "column3", direction: "desc" }
    // ]
    const sortMethodsForColumn = (sortArray || []).map( item => sortMethodWithDirectionByColumn(item.field, item.order) );
    return function(a,b) {
        let sorted = 0;
        let index = 0;
        while (sorted === 0 && index < sortMethodsForColumn.length) {
            sorted = sortMethodsForColumn[index++](a,b);
        }
        return sorted;
    }
}
async function getCollectionByDocId(http, locks) {

    //const http = http_with_auth(rootState.user.jwt);
    let documentsCollections = [];
    //console.log('locks.length', locks.length)
    for (let i = 0; i < locks.length; i++) {
        const response = await http.get(`documents/${locks[i]['object-id']}/collections`);
        if (response) {
            const collections =
                {
                    docId: locks[i]['object-id'],
                    collections: response.data.data.map((collection) =>
                        ({
                            collectionId: collection.id,
                            title: collection.attributes.title
                        }))
                }; documentsCollections.push(collections)
        }
        //console.log('i, documentsCollections', i, documentsCollections)
    }
    return documentsCollections;
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
      let sorts = sortingPriority ? sortingPriority.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`) : []
        sorts = `&sort=${sorts.length ? sorts.join(',') : '-expiration-date'}`
      console.log('sorts criteriae : ', sorts)

      let backendFilters = (filters && filters.filter(item => item.includes('collection')).length > 0) ? filters.filter(item => !(item.includes('collection'))) : filters;
      let collectionFilter = (filters && filters.filter(item => item.includes('collection')).length > 0) ? filters.filter(item => item.includes('collection')) : '';

      let locksResponse = await http.get(`locks?include=user${filters ? '&' + backendFilters.join('&') : ''}`) //.then(response => {

        let locksWithUsers = addUserToData(locksResponse.data.data, locksResponse.data.included);
        let locks = locksWithUsers.map(({data, user}) =>
            ({id: data.id,
            description: data.attributes.description,
            "object-id": data.attributes['object-id'],
            "event-date": data.attributes['event-date'],
            "expiration-date": data.attributes['expiration-date'],
            "is-active": data.attributes['is-active'],
            relationships: {
                user: user
            },
                user: user
            }));

      let documentsCollectionsFx = async () => {
          let documentsCollectionsFxResponse = await getCollectionByDocId(http, locks)
          return documentsCollectionsFxResponse;
      }
      let documentsCollections = await documentsCollectionsFx().then(response => response)
      //console.log("final documentsCollections", documentsCollections)

      let locksWithCollections = locksWithUsers.map((l) =>  {
            return {
              'object-id': l.data.attributes['object-id'],
              description: l.data.attributes.description,
              'event-date': l.data.attributes['event-date'],
              'expiration-date': l.data.attributes['expiration-date'],
              'is-active': l.data.attributes['is-active'],
              user_id: l.user.id,
              username: l.user.username,
              collections: documentsCollections.filter((map) => parseInt(map.docId) === l.data.attributes['object-id'])[0].collections
            };
          })
        //console.log("locksWithCollections", locksWithCollections)
        if (collectionFilter) {
            //console.log("collectionFilter", collectionFilter)
            let filter = collectionFilter[0].split("=")[1].toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
            //console.log("filter", filter)
            locksWithCollections = locksWithCollections.filter(l =>
                    l.collections.some(colls => colls.title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filter)));
            //console.log("locksWithCollectionsFiltered", locksWithCollections)
        }
        // Local sorting
        const sortMethod = sortMethodWithDirectionMultiColumn(sortingPriority);
        let sortedData = locksWithCollections.sort(sortMethod);
        //console.log("sortedData", sortedData)

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

  saveLock({ rootState, commit}, lock) {
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`/locks`, {data: lock}).then(response => {
      commit('SAVE_LOCK', response.data.data);
    });
  },

  updateLock({ rootState, commit}, lock) {
    const http = http_with_auth(rootState.user.jwt);
    return http.patch(`/locks/${lock.id}`, {data: lock}).then(response => {
      console.log('updated lock : ', lock)
      //commit('REMOVE_LOCK');
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
