import {http_with_auth} from '../../../modules/http-common';
import {getIncludedRelation} from "../../../modules/document-helpers";
import { debounce } from "lodash";

const state = {

  collectionsSearchResults: [],

  allCollectionsWithParents: [],
  fullHierarchy: [],

  fetchDocuments: [],

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
    state.collectionsWithParents = [];
    state.collectionsSearchResults = [];
    state.fullHierarchy = [];
    state.isLoading = false;
  },

  SET_LOADING(state, b) {
    state.isLoading  = b;
  },

  SET_ALL(state, collections) {
    // build full hierarchy tree
    state.allCollectionsWithParents = collections;
    //state.fullHierarchy = [];
    //state.fullHierarchy =  buildTree(collections, null, 0);
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
    return http.get(`/collections?without-relationships`).then(async response => {
      const collections = response.data.data;
      commit('SET_ALL', collections)
      commit('SET_LOADING', false)
     
    }).catch((e) => {
      console.error('issue with collections loading', e)
      commit('RESET');
    });
  },

  fetchOne: async function({rootState, commit}, {id, numPage, pageSize, sortingPriority}) {
    commit('SET_LOADING', true)
    const http = http_with_auth(rootState.user.jwt);

    // collection
    let response = await http.get(`/collections?facade=search&filter[id]=${id}&include=parents,children,admin`)
    const c = response.data.data[0];
    const collection = {
      id: c.id,
      admin: getIncludedRelation(c, response.data.included, "admin")[0],

      title: c.attributes.title,
      titleWithCount: c.parents && c.parents.length === 0 ? c.attributes.title : `${c.attributes.title} (${c.attributes.nb_docs})`,

      description: c.attributes.description,
      documentCount: c.attributes.nb_docs,
      dateMin: c.attributes.date_min,
      dateMax: c.attributes.date_max,
      //documents: getIncludedRelation(c, included, "documents"),
      parents: getIncludedRelation(c, response.data.included, "parents"),
      children: getIncludedRelation(c, response.data.included, "children"),

    }

    // documents
    let documents = []
    if (numPage !== null) {
      let sorts = sortingPriority ? sortingPriority.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`) : []
      sorts = `&sort=${sorts.length ? sorts.join(',') : 'creation'}`

      response = await http.get(`/search?query=collections.id:${id}&page[number]=${numPage}&page[size]=${pageSize||50}${sorts}&without-relationships`);
      documents = response.data.data;
    } 
    console.log('COLLECTION DATA FETCHED', documents, collection, response.data.meta)

    commit('SET_LOADING', false)
    return {documents, collection, totalCount: response.data.meta['total-count']} 
  },

  saveCollection: async function({ rootState, commit }, collection) {
    const http = http_with_auth(rootState.user.jwt);
    const data = {
      data: {
        type: 'collection',
        id: collection.id,
        attributes: {
          title: collection.title,
          description: collection.description
        }
      }
    }
    return await http.patch(`collections/${collection.id}`, data);
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
