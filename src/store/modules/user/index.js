import http_with_csrf_token,  {http} from '../../../modules/http-common';
import {baseApiURL} from '../../../modules/http-common';
import {getRoles, getUserRoles} from '../../../modules/user-helpers';
import { deleteCookie, getCookie } from '../../../modules/cookies-helpers';

const state = {
  current_user: null,
  isUserLoaded: false,

  usersSearchResults: [],
};

const mutations = {
  /*
  UPDATE_USER (state, {data, included}) {
    console.log('UPDATE_USER', data);
    if (!data) {
      state.current_user = null;
    } else {
      const roles = getRoles({included});
      state.current_user = {
        id: data.id,
        ...data.attributes,
        roles: roles,
        isAdmin: roles.filter(r => r.name === "admin").length === 1
      };
    }
    state.isUserLoaded = true;
  },
  */
  CLEAR_USER_DATA(state) {
    localStorage.removeItem('user')
    deleteCookie('csrf_access_token')
    deleteCookie('csrf_refresh_token')
    location.reload()
  },
  SET_USER_DATA (state, userData) {
    //const roles = getRoles({});
    state.current_user = {
      ...userData,
      isAdmin: userData.roles.indexOf("admin") > -1
    }
    localStorage.setItem('user', JSON.stringify(state.current_user))
    console.log("cookies", document.cookie);
    //const access_token =  getCookie('csrf_access_token');
    //console.log("saving csrf_access_token", access_token)
    //http.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
  },

  /*
  RESET_USER(state) {
    state.isUserLoaded = false;
  },
  */

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
    const http = http_with_csrf_token();
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

  login ({ commit }, credentials) { 
    return http
      .post('login', credentials)
      .then(({ data }) => {
        console.log("LOGIN user data is:", data)
        commit('SET_USER_DATA', data)
      }).catch(({error}) => {
        console.log("LOGIN ERROR", error)
        return error
      })
  },
  logout({commit}) {
    commit('CLEAR_USER_DATA')
  },

  register({commit}) {
    console.log("Register: not yet implemented")
  },

  search({commit}, what) {
    console.log('user search', what);
    commit('SEARCH_RESULTS', {users: [], included: []});
    http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__users&include=roles`).then(response => {
      commit('SEARCH_RESULTS', {users: response.data.data, included: response.data.included});
    });
  }
  /*
  save ({ commit, rootGetters }, data) {
    return http.put(`/documents`, { data: data })
      .then(response => {
        commit('UPDATE_DOCUMENT', response.data.data);
        resolve(response.data)
      })
      .catch(error => {
        console.error("error", error);
        reject(error)
      })
  },
  */
};

const getters = {
  loggedIn(state) {
    return !!state.current_user
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
