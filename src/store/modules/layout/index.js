
const state = {
  showLeftSideBar: true,
  showRightSideBar: false,
};


const mutations = {
  SET_LEFT_SIDEBAR(state, v) {
    state.showLeftSideBar = v;
  },
  SET_RIGHT_SIDEBAR(state, v) {
    state.showRightSideBar = v;
  }
};

const actions = {
  showLeftSideBar({commit}) {
    commit('SET_LEFT_SIDEBAR', true);
  },
  hideLeftSideBar({commit}) {
    commit('SET_LEFT_SIDEBAR', false);
  },
  toggleLeftSideBar({commit, state}) {
    commit('SET_LEFT_SIDEBAR', !state.showLeftSideBar);
  },

  showRightSideBar({commit}) {
    commit('SET_RIGHT_SIDEBAR', true);
  },
  hideRightSideBar({commit}) {
    commit('SET_RIGHT_SIDEBAR', false);
  },
  toggleRightSideBar({commit, state}) {
    commit('SET_RIGHT_SIDEBAR', !state.showRightSideBar);
  }
};

const getters = {

};

const layoutModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default layoutModule;
