import http_with_auth,  {http} from '../../../modules/http-common';
import {getUserRoles} from '../../../modules/user-helpers';

import { authenticate, register,  isValidJwt, EventBus } from '@/modules/http-common'

const state = {
  current_user: null,
  jwt: localStorage.getItem('tokenLettres'),

  usersSearchResults: [],
};

const mutations = {

  SET_USER_DATA (state, userData) {
    //console.log('setUserData payload = ', userData)
    if (userData) {
      state.current_user = {
        ...userData,
        isAdmin: userData.roles.indexOf("admin") > -1
      }
    }
    else {
      state.current_user = null
    }
  },
  SET_JWT_TOKEN (state, token) {
    //console.log('setJwtToken payload = ', token)
    if (token) {
      localStorage.tokenLettres = token
    } else {
      localStorage.removeItem('tokenLettres')
    }
    state.jwt = token
  },


  SEARCH_RESULTS(state, {users, included}) {
    state.usersSearchResults = users.map( u => {
      const roles = getUserRoles(users, included, u);
      return  {
        id: u.id,
        ...u.attributes,
        roles: roles,
        isAdmin: roles.filter(r => r.name === "admin").length === 1
      }
    });
  }
};

const actions = {

  fetchCurrent ({ commit }) {
    /*
    commit('RESET_USER');
    const http = http_with_auth();
    return http.get("token/refresh")
      .then(response => {
        if (response.data && response.data.user) {
          const user_api_url = response.data.user.replace(baseApiURL, '');
          return http.get(`${user_api_url}?include=roles&without-relationships`).then( response => {
            commit('UPDATE_USER', response.data);
          })
        } else {
          commit('UPDATE_USER', {data: null});
        }
      }).catch(error => {
        console.warn(error);
        commit('UPDATE_USER', {data: null});
      });
      */
  },
  setUserData({commit}, userData) {
    commit('SET_USER_DATA', userData)
  },
  login ({commit}, userData) {
    return authenticate(userData)
      .then(response => {
        commit('SET_USER_DATA', response.data.user_data)
        commit('SET_JWT_TOKEN', response.data.token)
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.$emit('failedAuthentication', error)
      })
  },
  logout({commit}) {
    commit('SET_JWT_TOKEN', null)
    commit('SET_USER_DATA', null)
  },
  register ({dispatch}, userData) {
    return register(userData)
      .then(dispatch('login', userData))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.$emit('failedRegistering: ', error)
      })
  },

  search({commit, state}, what) {
    console.log('user search', what);
    commit('SEARCH_RESULTS', {users: [], included: []});
    const http = http_with_auth(state.jwt);
    http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__users&include=roles`).then(response => {
      commit('SEARCH_RESULTS', {users: response.data.data, included: response.data.included});
    });
  }
  
};

const getters = {
  isAuthenticated (state) {
    return state.current_user && isValidJwt(state.jwt)
  }
};
const userModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default userModule;
