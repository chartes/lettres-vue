
const state = {
  showLeftSideBar: false,
  showRightSideBar: false,
  lastSeenDocId: null,
  displayedManifestUrl: null,
  viewerMode: null,
  canvasIndex: 0,
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
  },
  SET_VIEWER_MODE(state, m) {
    state.viewerMode = m;
  },
  SET_CANVAS_INDEX(state, i) {
    state.canvasIndex = i;
  },
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
    if (state.displayedManifestUrl && url !== state.displayedManifestUrl) {
      commit('SET_CANVAS_INDEX', 0)
    } else if (url && !state.displayedManifestUrl) {
      commit('SET_CANVAS_INDEX', 0)
    } else if (!url) {
      commit('SET_CANVAS_INDEX', null)
    }
    commit('SET_DISPLAYED_MANIFEST_URL', url)
  },
  setViewerMode({commit}, mode) {
    commit('SET_VIEWER_MODE', mode)
  },
  setCanvasIndex({commit}, canvasIndex) {
    commit('SET_CANVAS_INDEX', canvasIndex)
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
