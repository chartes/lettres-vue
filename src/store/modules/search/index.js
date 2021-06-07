import {debounce} from 'lodash';
import {http} from "@/modules/http-common";

const state = {
  searchTerm: null,
  sorts: [{field: 'creation', order: 'asc'}],

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
  SET_SORTS(state, sorts) {
    state.sorts = sorts;
  },
  SET_WITH_STATUS(state, b) {
    state.withStatus = b;
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
  setSorts({commit}, sorting) {
    commit('SET_NUM_PAGE', 1)
    commit('SET_SORTS', sorting)
  },
  setWithStatus({commit}, status) {
    commit('SET_WITH_STATUS', status)
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
  
    const incs = []; //['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      
    let filters = ''
    if (!query || query.length === 0) {
      query = '*'
    }
    if (!rootState.user.current_user){
      query = `${query} AND (is-published:true)`
    }

    let sorts = state.sorts.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`)
    sorts = sorts.length ? sorts.join(',') : 'creation'
  
    try {
      const response = await http.get(`/search?query=${query}&sort=${sorts}&include=${incs.join(',')}&without-relationships&page[size]=${state.pageSize}&page[number]=${state.numPage}${filters}`);
      const {data, links, meta} = response.data

      commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links});
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
