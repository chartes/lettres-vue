import {http_with_auth} from '../../../modules/http-common';
import {getIncludedRelation} from "../../../modules/document-helpers";

const state = {

  collectionsSearchResults: [],

  allCollectionsWithParents: [],
  fullHierarchy: [],

  isLoading: false
};

function buildTree(collections, parent, depth) {
  return collections.filter(c => c.parents.length === depth).map(c => {
    const children = buildTree(collections, c, depth + 1).filter(child => c.id === child.parents[0].id);
    if (children.length === 0)
      return c;
    else
      return {
        ...c,
        children: children
      }
  });
}

function searchId(tree, id) {
    if (!tree){
      return null;
    }
    else if (tree.id === id) {
      return tree;
    }
    else {
      if (tree.children) {
        for (let child of tree.children) {
          const found = searchId(child, id);
          if (found) {
            return found;
          }
        }
      }
      return null;
    }
}

const mutations = {

  RESET(state) {
    state.collectionsWithParents = {};
    state.collectionsSearchResults = [];
    state.fullHierarchy = [];
    state.isLoading = false;
  },

  SET_LOADING(state, b) {
    state.isLoading  = b;
  },

  SET_ALL(state, collections) {
    // build full hierarchy tree
    state.allCollectionsWithParents = Object.assign({}, state.allCollectionsWithParents, collections);
    //state.fullHierarchy = [];
    state.fullHierarchy =  buildTree(collections, null, 0);
  },
  SEARCH_RESULTS (state, payload) {
    state.collectionsSearchResults = payload;
  }

};

const actions = {

  reset({commit}) {
    commit('RESET');
  },

  fetchAll({rootState, commit}) {
    commit('SET_LOADING', true)

    const http = http_with_auth(rootState.user.jwt);
    return http.get(`/collections?include=parents`).then(async response => {

      let countPromises = [];
      response.data.data.forEach(c => {
        const newCountPromise = http.get(`/collections/${c.id}/relationships/documents`).then(docs => {
          return  {
            id: c.id,
            title: c.attributes.title,
            description: c.attributes.description,
            documentCount: docs.data.meta['total-count'],
            titleWithCount: c.parents && c.parents.length === 0 ? c.attributes.title : `${c.attributes.title} (${docs.data.meta['total-count']})`,
            //documents: getIncludedRelation(c, included, "documents"),
            parents: getIncludedRelation(c, response.data.included, "parents"),
          }
        })

        countPromises.push(newCountPromise);
      });

      const collections = await Promise.all(countPromises)
      commit('SET_ALL', collections)
      commit('SET_LOADING', false)
     
    }).catch((e) => {
      console.error('issue with collections loading', e)
      commit('RESET');
    });
  },
  /*
  search ({ commit }, what) {
    state.isLoading = true;

    console.log('collection search', what)
    commit('SEARCH_RESULTS', [])
    http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__collections&include=parents&without-relationships`).then( response => {
      const collections = response.data.data.map(coll => { return { id: coll.id, ...coll.attributes}});
      commit('SEARCH_RESULTS', collections);
      state.isLoading = false;
    });
  }
  */

};



const getters = {
  searchWithinTree: (state) => (id) => {
    return !state.fullHierarchy ? null : searchId(state.fullHierarchy[0], id);
  }
};

const collectionsModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default collectionsModule;
