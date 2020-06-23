import http_with_csrf_token from '../../../modules/http-common';
import {debounce} from 'lodash';

const state = {

  userBookmarks: {},
  links: [],
  totalCount: 0,
  isLoading: false
};

const mutations = {
  UPDATE_USER_BOOKMARKS (state, {documents, meta, links}) {
    console.log("UPDATE_USER_BOOKMARKS", documents);
    state.links = links;
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
  fetchUserBookmarks:  debounce(async({ commit }, {userId, pageId, pageSize, filters}) => {
    commit('SET_LOADING', true)
    
    const http = http_with_csrf_token();
    const response = await  http.get(`users/${userId}/bookmarks?without-relationships&sort=title&page[size]=${pageSize}&page[number]=${pageId}${filters ? '&'+filters : ''}`)
    
    response.data.data.sort((d1, d2) => {return d1.attributes["title"] - d2.attributes["title"]})
    const docs = response.data;
 
    commit('UPDATE_USER_BOOKMARKS', {
          documents: docs.data,
          links: docs.links,
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

  }, 250),

  deleteUserBookmark({ commit }, {userId, docId}) {
    const http = http_with_csrf_token();
    const dataToRemove = {
      data: [
        {id: docId, type: "document"}
      ]
    };
    return http.delete(`users/${userId}/relationships/bookmarks`, {data: dataToRemove});
  },

  postUserBookmark({ commit }, {userId, docId}) {
    const http = http_with_csrf_token();
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
