import { getUrlParameter } from "@/modules/utils";
import {debounce} from 'lodash';
import {http} from "@/modules/http-common";

const state = {
  searchTerm: null,
  numPage: 1,
  pageSize: 20,

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
  UPDATE_ALL (state, payload) {
    console.log('UPDATE_ALL', payload);
    state.documents = payload.data;
    state.links = payload.links;
    state.totalCount = payload.meta["total-count"];
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
  },
  performSearch: debounce(async ({commit, state, rootState}) => {
    let query = `collections.id:${state.selectedCollectionId}`
    if (state.searchTerm && state.searchTerm.length > 0) {
      query = `(${query} AND (${state.searchTerm}))`
    }
 
    commit('SET_LOADING_STATUS', true);
  
    const incs = ['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      
    let filters = ''
    if (!query || query.length === 0) {
      query = '*'
    }
    if (!rootState.user.current_user){
      query = `${query} AND (is-published:true)`
    }
  
    try {
      const response = await http.get(`/search?query=${query}&sort=id&include=${incs.join(',')}&without-relationships&page[size]=${state.pageSize}&page[number]=${state.numPage}${filters}`);
      commit('UPDATE_ALL', response.data);
      commit('SET_LOADING_STATUS', false);
    } catch (reason) {
      console.warn('cant search:', reason);
      commit('SET_LOADING_STATUS', false);
    }
   
  }, 500)
};

const getters = {
  totalPageNum: (state) => {
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
