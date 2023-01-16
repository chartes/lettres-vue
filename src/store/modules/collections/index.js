import {http_with_auth} from '../../../modules/http-common';
import {getIncludedRelation} from "../../../modules/document-helpers";

const state = {
  collectionsById: {},
  rootCollectionsIds: [],

  isLoading: true
};


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
    state.collectionsById = {};
    state.rootCollectionsIds = [];

    state.isLoading = false;
  },

  SET_LOADING(state, b) {
    state.isLoading  = b;
  },

  SET_ALL(state, collections) {
    const collectionsById = Object.fromEntries(collections.map((col) => ([col.id, col])));
    state.rootCollectionsIds = collections.filter(({parent}) => parent === null).map(col => col.id);

    function applyDepth(collectionId, depth) {
      const collection = collectionsById[collectionId];
      collection.depth = depth;
      for (const childCollectionId of collection.children) {
        applyDepth(childCollectionId, depth+1)
      }
    }

    for (const rootCollectionId of state.rootCollectionsIds) {
      applyDepth(rootCollectionId, 0)
    }

    state.collectionsById = collectionsById
  },

};

const actions = {

  reset({commit}) {
    commit('RESET');
  },

  async fetchAll({rootState, commit}) {
    commit('SET_LOADING', true)
    const http = http_with_auth(rootState.user.jwt);
    try {
      const response = await http.get(`/collections?facade=hierarchy&include=admin`)
      const {data:collectionsJSON, included} = response.data;

      // Convert JSON to collections
      const collections = collectionsJSON.map(({
        id,
        attributes: {title, description, nb_docs, date_min, date_max},
        relationships: {children, parents, admin}
      }) => ({
        id,
        title,
        documentCount: nb_docs,
        dateMin: date_min,
        dateMax: date_max,
        description,
        children: children.data.map((child) => child.id),
        parent: parents.data[0] !== undefined ? parents.data[0].id : null,
        admin: {
          username: included.find(({type, id: adminId}) => type === "user" && adminId === admin.data.id).attributes.username
        }
      }));

      commit('SET_ALL', collections)
      commit('SET_LOADING', false)

    } catch(e) {
      console.error('issue with collections loading', e)
      commit('RESET');
    }
  },

  fetchOne: async function({rootState, commit}, {id, numPage, pageSize, sortingPriority}) {
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
          description: collection.description,
          admin_id: collection.curatorId,
        }
      }
    }
    return await http.patch(`collections/${collection.id}`, data);
  },

  addCollection: async function({ rootState, commit }, collection) {
    const http = http_with_auth(rootState.user.jwt);
    const data = {
      data: {
        type: 'collection',
        attributes: {
          title: collection.title,
          description: collection.description,
          admin_id: collection.curatorId,
        },
      }
    }
    if (collection.parentId !== undefined) {
      data.data.relationships = {
        parent: {
          data: [
            {
              type: "collection",
              id: collection.parentId,
            }
          ]
        }
      }
    }
    try {
        const response = await http.post(`collections`, data);
        if (response.errors) {
            return {error: response.errors.details}
        }
        return response.data.data
    } catch(e) {
      console.log(e);
      return {error: e}
    }
  },
  deleteCollection: async function({rootState, commit}, collection) {
    const http = http_with_auth(rootState.user.jwt);
    try {
      const response = await http.delete(`collections/${collection.id}`);
      if (response.errors) {
        return {error: response.errors.details}
      }
      else {
        return {}
      }
    } catch(e) {
      return {error: e}
    }
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
  },
  children: (state) => (collection) => {
    return collection.children.map(childId => state.collectionsById[childId])
  },
  findRoot: (state) => (collectionId) => {
    let collection = state.collectionsById[collectionId];
    if (collection === undefined) {
      return undefined;
    }
    while(collection.parent !== null) {
      collection = state.collectionsById[collection.parent];
    }
    return collection;
  },
  flattenedCollectionsTree: (state, getters) => (collectionsIds, keepPredicate) => {
    const result = [];
    const collections = collectionsIds.map(collectionId => state.collectionsById[collectionId]);

    for (const collection of collections) {
      if (keepPredicate && !keepPredicate(collection)) {
        continue;
      }
      result.push(collection);
      for (const childCollection of getters.flattenedCollectionsTree(collection.children, keepPredicate)) {
        result.push(childCollection);
      }
    }
    return result;
  },
  rootCollections: (state) => {
    return state.rootCollectionsIds.map(collectionId => state.collectionsById[collectionId])
  },
  search: (state) => (text) => {
    const words = text.toLowerCase().trim().split(/\s+/)
    if (words.length === 1 && words[0] === "") {
      return [];
    }
    return Object.values(state.collectionsById).filter(({title, description}) => {
      return words.every(word => {
        let match = title.toLowerCase().includes(word);
        if (!match && description !== null) {
          match = description.toLowerCase().includes(word)
        }
        return match
      })
    })
  },
  path: (state, getters) => (collectionId) => {
    const collection = state.collectionsById[collectionId];
    if (collection.parent === null) {
      return [collection]
    } else {
      return [...getters.path(collection.parent), collection]
    }
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
