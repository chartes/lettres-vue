import Vue from "vue";
import { getUrlParameter } from "@/modules/utils";

const state = {
  searchTerm: null,
  numPage: 1,
  pageSize: 25
};


const mutations = {
  SET_SEARCH_TERM(state, term) {
    state.searchTerm = term;
  },
  SET_NUM_PAGE(state, num) {
    state.numPage = num;
  }
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
  performSearch({state, dispatch}) {
    dispatch("document/fetchSearch", {
      pageId: state.numPage,
      pageSize: state.pageSize,
      query: state.searchTerm
    }, {root: true});
  }
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
