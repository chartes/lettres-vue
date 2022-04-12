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

    if (userData) {
      state.current_user = {
        ...userData,
        isAdmin: userData.roles.indexOf("admin") > -1
      }
      console.log('THEEEEEEEN', state)

    } else {
      state.current_user = null
    }
  },

  SET_JWT_TOKEN(state, token) {
    if (token) {
      localStorage.tokenLettres = token;
    } else {
      localStorage.removeItem("tokenLettres");
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
  setUserData({ commit }, userData) {
    commit('SET_USER_DATA', userData)
  },
  login ({ commit }, credentials) { 
    return http
      .post('login', credentials)
      .then(({ data }) => {
        commit('SET_USER_DATA', data.user_data)
        commit('SET_JWT_TOKEN', data.token)
        return data
      })  },

  async logout({commit}) {
    await http.get('logout')
    commit('SET_USER_DATA', null)
    commit('SET_JWT_TOKEN', null)
  },

  register({commit}) {
    console.log("Register: not yet implemented")
  },

  async save({dispatch}, userData) {
    try {
      const newData = await http.post('update-user', userData)
      const loginResponse = await dispatch('login', {
        email: newData.data.email,
        password: userData.password
      })
      if (loginResponse.errors) {
        return {
          error: loginResponse.errors.details
        }
      } else {
        return {
          error : null,
        } 
      }
    } catch (e) {
      return {
        error : e,
      } 
    }
  },

  async inviteUser({state}, {email, role}) {
    try {
      const response = await http.post('invite-user', {email, role})  
      return {
        error: response.error
      }
    } catch (e) {
      return {
        error: e
      }
    }
  },

  async sendPasswordResetLink(_, {email}) {
    await http.post('send-password-reset-link', {email})
  },

  async resetPassword({commit}, {token, password, password2}) {
    return await http.post('reset-password', {token, password, password2})
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
  isAuthenticated(state) {
    return !!state.current_user && isValidJwt(state.jwt)
  },
};
const userModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default userModule;
