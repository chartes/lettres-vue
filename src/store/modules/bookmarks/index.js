import http_with_auth from '../../../modules/http-common';
import {debounce} from 'lodash';

const state = {

  userBookmarks: {},
  totalCount: 0,
  isLoading: false
};
function sortMethodAsc(a, b) {
    return a == b ? 0 : a > b ? 1 : -1;
}

function sortMethodWithDirection(direction) {
    if (direction === undefined || direction == "asc") {
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
        if (columnName === 'id') {
            return sortMethod(a[columnName], b[columnName]);
        } else {
            return sortMethod(a.attributes[columnName], b.attributes[columnName]);
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
const mutations = {
  UPDATE_USER_BOOKMARKS (state, {documents, meta}) {
    console.log("UPDATE_USER_BOOKMARKS", documents);
    state.totalCount = meta['total-count'];
    state.userBookmarks = documents.map(document => {
      return {
        id: document.id,
        type: document.type,
        attributes: {
          title: document.attributes["title"],
          'iiif-thumbnail-url' : document.attributes['iiif-thumbnail-url'],

        },
        //persons: persons,
        //witnesses: witnesses
      }
    });
  },
  SET_LOADING(state, status) {
    state.isLoading = status
  },
  UPDATE_USER_BOOKMARK (state, {docId, witnesses}) {
    console.log("UPDATE_USER_BOOKMARK", docId, witnesses);
    state.userBookmarks = state.userBookmarks.map(bookmark => {
        if (bookmark.id !== docId)
          return bookmark;
        bookmark.witnesses = witnesses;
        return bookmark;
    });
  }
};

const actions = {
  fetchUserBookmarks:  debounce(async({ rootState, commit }, {userId, numPage, pageSize, sortingPriority, filters}) => {
    commit('SET_LOADING', true)
    const http = http_with_auth(rootState.user.jwt);

    if (numPage !== null) {
      /* Backend sorting not available here (not available from backend (user route))
      let sorts = sortingPriority ? sortingPriority.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`) : []
      sorts = `&sort=${sorts.length ? sorts.join(',') : 'id'}`
      */

      // Get all favorites for user
      const response = await http.get(`users/${userId}/bookmarks?without-relationships${filters ? '&' + filters : ''}`)

      /* Backend pagination unused (not available from backend (user route))
      const response = await http.get(`users/${userId}/bookmarks?without-relationships&page[size]=${pageSize}&page[number]=${numPage}${filters ? '&' + filters : ''}`)
      */

      // Local sorting
      const sortMethod = sortMethodWithDirectionMultiColumn(sortingPriority);
      let sortedData = response.data.data.sort(sortMethod);
      console.log("sortedData", sortedData)

      /* Previous sorting only on Title
      response.data.data.sort((d1, d2) => {
        return d1.attributes["title"] - d2.attributes["title"]
      })*/
      const docs = response.data;

      commit('UPDATE_USER_BOOKMARKS', {
        documents: docs.data,
        meta: docs.meta
      });


      let promises = []
      for (let doc of docs.data) {
          promises.push(
            http.get(`documents/${doc.id}/witnesses?without-relationships`).then(witnesses => {
              commit('UPDATE_USER_BOOKMARK', {
                docId: doc.id,
                witnesses: witnesses.data.data,
                //persons: getPersons(docs.included)
              })
            })
          )
      }
      await Promise.all(promises);
      commit('SET_LOADING', false);
    }
  }, 250),

  deleteUserBookmark({ rootState, commit }, {userId, docId}) {
    const http = http_with_auth(rootState.user.jwt);
    const dataToRemove = {
      data: [
        {id: docId, type: "document"}
      ]
    };
    return http.delete(`users/${userId}/relationships/bookmarks`, {data: dataToRemove});
  },

  postUserBookmark({ rootState, commit }, {userId, docId}) {
    const http = http_with_auth(rootState.user.jwt);
    const dataToAdd = {
      data: [
        {id: docId, type: "document"}
      ]
    };
    return http.post(`users/${userId}/relationships/bookmarks`, dataToAdd);
  }
};

const getters = {


};

const bookmarksModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default bookmarksModule;
