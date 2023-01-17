
const state = {
  showLeftSideBar: false,
  showRightSideBar: false,
  lastSeenDocId: null,
  displayedManifestUrl: null
};


const mutations = {
  SET_LEFT_SIDEBAR(state, v) {
    state.showLeftSideBar = v;
  },
  SET_RIGHT_SIDEBAR(state, v) {
    state.showRightSideBar = v;
  },
  SET_LAST_SEEN_DOC_ID(state, id) {
    state.lastSeenDocId = id;
  },
  SET_DISPLAYED_MANIFEST_URL(state, u) {
    state.displayedManifestUrl = u
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
  },
  setLastSeen({commit}, docId) {
    commit('SET_LAST_SEEN_DOC_ID', docId)
  },

  setDisplayedManifestUrl({commit}, url) {
    commit('SET_DISPLAYED_MANIFEST_URL', url)
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
