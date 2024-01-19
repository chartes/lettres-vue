import axios from 'axios';
import Vue from 'vue'
import store from '../store'

const _baseApiURL = `${process.env.VUE_APP_API_URL}/api/1.0`;
const _baseAppURL = `/ecco`;


export const baseApiURL = _baseApiURL;
export const baseAppURL = _baseAppURL;


export const http = axios.create({
  baseURL: _baseApiURL,
  withCredentials: true
});

http.interceptors.request.use((config) => {
  const jwt = store.state.user.jwt;
  if (jwt) {
    config.headers['Authorization'] = `Bearer ${jwt}`
  }
  return config
})

/*
export const http = axios.create({
  baseURL: _baseApiURL,
  headers: {}
});
*/

export function http_with_auth(jwt) {
  return http;
}

export default http_with_auth;

export const EventBus = new Vue()

export function isValidJwt (jwt) {
  if (!jwt || jwt.split('.').length < 3) {
    return false
  }
  const data = JSON.parse(atob(jwt.split('.')[1]))
  const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
  const now = new Date()
  return now < exp
}

export function authenticate (userData) {
  return axios.post(`${_baseApiURL}/login`, userData)
}

export function getCurrentUser() {
  return http.get(`${_baseApiURL}/current-user`);
}

export function register (userData) {
  return axios.post(`${_baseApiURL}/register`, userData)
}