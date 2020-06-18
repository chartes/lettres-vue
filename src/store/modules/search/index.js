import Vue from "vue";

const state = {
  searchTerm: [],
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
    commit("SET_NUM_PAGE", 1);
  },
  clearSearchTerm({commit}, term) {
    commit('SET_SEARCH_TERM', null)
  },
  setNumPage({commit}, num) {
    commit('SET_NUM_PAGE', num)
  },
  performSearch({commit, state, dispatch}, term) {
    //commit("SET_SEARCH_TERM", term);
    if (state.searchTerm.length > 1) {
      dispatch("document/fetchSearch", {
        pageId: state.numPage,
        pageSize: state.pageSize,
        query: state.searchTerm
      }, {root: true});
    } else {
      //commit("SET_NUM_PAGE", 1);
      dispatch("document/fetchAll", {
        pageId: state.numPage,
        pageSize: state.pageSize
      }, {root: true});
      //this.goToDocPage(1);
    }
  }
};

const getters = {


};

const searchModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default searchModule;
