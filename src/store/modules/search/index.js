import {debounce} from 'lodash';
import {http} from "@/modules/http-common";
import {
 getCurrentLock
} from '@/modules/document-helpers';
const state = {
  searchTerm: null,
  numPage: 1,
  pageSize: 30,

  withStatus: false,

  links: [],
  totalCount: 0,
  loadingStatus: false,
  documents: [],

  selectedCollectionId: 1
};


const mutations = {
  SET_SEARCH_TERM(state, term) {
    state.searchTerm = term;
  },
  SET_NUM_PAGE(state, num) {
    state.numPage = num;
  },
  SET_LOADING_STATUS(state, s) {
    state.loadingStatus = s;
  },
  SET_SELECTED_COLLECTION_ID(state, id) {
    state.selectedCollectionId = id > 0 ? id : 1;
  },
  UPDATE_ALL (state, {documents, totalCount, links}) {
    state.documents = documents;
    state.links = links;
    state.totalCount = totalCount;
  },

};

const actions = {
  setSearchTerm({commit}, term) {
    commit('SET_SEARCH_TERM', term);
  },
  clearSearchTerm({commit}) {
    commit('SET_SEARCH_TERM', null)
  },
  setNumPage({commit}, num) {
    commit('SET_NUM_PAGE', num)
  },
  setSelectedCollectionId({commit}, id) {
    commit('SET_SELECTED_COLLECTION_ID', id)
    commit('SET_NUM_PAGE', 1)
  },
  performSearch: debounce(async ({commit, state, rootState, dispatch}) => {
    let query = `collections.id:${state.selectedCollectionId}`
    if (state.searchTerm && state.searchTerm.length > 0) {
      query = `(${query} AND (${state.searchTerm}))`
    }
 
    commit('SET_LOADING_STATUS', true);
  
    const incs = state.withStatus ? ['current-lock', 'witnesses'] : []; //['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      
    let filters = ''
    if (!query || query.length === 0) {
      query = '*'
    }
    if (!rootState.user.current_user){
      query = `${query} AND (is-published:true)`
    }
  
    try {
      const response = await http.get(`/search?query=${query}&sort=id&include=${incs.join(',')}&without-relationships&page[size]=${state.pageSize}&page[number]=${state.numPage}${filters}`);
      const {data, included, links, meta} = response.data

      let documents = []
      data.forEach(async doc => {

        let document = {
          data: doc,
        }

        if (state.withStatus) {
          document.currentLock =  getCurrentLock(included)
          /* fetch lock user info*/
          if (rootState.user.current_user) {
            /* isBookmarked */
            document.data.attributes['is-bookmarked'] = http.get(`/users/${rootState.user.current_user.id}/relationships/bookmarks`).then(
              response => response.data.data.filter(d => d.id === doc.id).length > 0
            );
           
            /* isPublished */
            if (document.currentLock.id) {
              dispatch('locks/fetchLockOwner', {docId: doc.id, lockId: document.currentLock.id}, {root: true});
            }
          } 
        }

        documents.push(document)
      })
        
     
      commit('UPDATE_ALL', {documents, totalCount: meta['total-count'] , links});
      commit('SET_LOADING_STATUS', false);
    } catch (reason) {
      console.warn('cant search:', reason);
      commit('SET_LOADING_STATUS', false);
    }
   
  }, 500)
};

const getters = {
  totalPageNum: (state) => {
      console.log("total", state.documents.length, state.totalCount, state.pageSize,  parseInt(Math.ceil(state.totalCount / state.pageSize)))
      return state.documents.length === 0 ? 1 : parseInt(Math.ceil(state.totalCount / state.pageSize))
  }

};

const searchModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default searchModule;
