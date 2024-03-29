import {http_with_auth} from '../../../modules/http-common';

export const getInstitution = function (included) {
  let found = included.find(item => item.type === 'institution');
  return found ? { id: found.id, ...found.attributes} : {id: null}
};

const state = {

  currentWitness: null,

};

const mutations = {

  UPDATE_ONE (state, payload) {
    console.log("UPDATE CURRENT WITNESS");
    state.currentWitness = payload;
  }

};

const actions = {

  fetchOne ({ commit, rootState }, id) {
    const http = http_with_auth(rootState.user.jwt);
    return http.get(`/witnesses/${id}?include=institution`).then( response => {
      const witness = {
        id: response.data.data.id,
        ...response.data.data.attributes,
        institution: getInstitution(response.data.included)
      };
      commit('UPDATE_ONE', witness);
      return witness;
    });
  }
};

const getters = {



};

const witnessesModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default witnessesModule;
