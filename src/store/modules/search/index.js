import { getUrlParameter } from "@/modules/utils";
import {debounce} from 'lodash';

const state = {
  searchTerm: null,
  numPage: 1,
  pageSize: 15,

  selectedCollectionId: 1
};


const mutations = {
  SET_SEARCH_TERM(state, term) {
    state.searchTerm = term;
  },
  SET_NUM_PAGE(state, num) {
    state.numPage = num;
  },
  SET_SELECTED_COLLECTION_ID(state, id) {
    state.selectedCollectionId = id > 0 ? id : 1;
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
  performSearch: debounce(({state, dispatch}) => {
    let query = `collections.id:${state.selectedCollectionId}`
    if (state.searchTerm && state.searchTerm.length > 0) {
      query = `(${query} AND (${state.searchTerm}))`
    }
    dispatch("document/fetchSearch", {
      pageId: state.numPage,
      pageSize: state.pageSize,
      query:  query
    }, {root: true});
  }, 500)
};

const getters = {
  totalPageNum: (state, getters, rootState) => {
      return parseInt(
        rootState.document.links && rootState.document.links.last
          ? getUrlParameter(rootState.document.links.last, "page%5Bnumber%5D")
          : 1
      );
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
