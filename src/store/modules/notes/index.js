import http_with_auth from '../../../modules/http-common';

const state = {

  notes: [],
  newNote: false,

};

const mutations = {

  NEW (state, note) {
    state.newNote = note;
    state.notes.push(note);
  },
  UPDATE_ONE (state, note) {
    state.notes = [...state.notes.filter(n => n.id !== note.id), note];
  }

};

const actions = {

  add ({ commit, rootState }, newNote) {
    console.log("note add =>", newNote)
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`/notes`, { data: {...newNote}, type: 'note'})
      .then( response => {
        console.log("note add =>", response.data)
        const note = response.data.data[0];
        commit('NEW', note);
        return note
      })
  },
  update ({ rootState }, note) {
    const config = { auth: { username: rootState.user.authToken, password: undefined }};
    const theNote = {
      data: [{
        "username": rootState.user.currentUser.username,
        "id": note.id,
        "type_id": note.type_id,
        "content": note.content
      }]
    };
    const http = http_with_auth(rootState.user.jwt)

  },
  delete ({ rootState }, note) {
    const config = { auth: { username: rootState.user.authToken, password: undefined }};
    const theNote = {
      data: [{
        "username": rootState.user.currentUser.username,
        "id": note.id,
        "type_id": note.type_id,
        "content": note.content
      }]
    };
    const http = http_with_auth(rootState.user.jwt)

  }

};

const getters = {};

const notesModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default notesModule;
