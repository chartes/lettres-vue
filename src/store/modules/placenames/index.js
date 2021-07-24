import http_with_auth from '../../../modules/http-common';
import findPlace from '../../../modules/ref-providers/wikidata';
import {debounce} from 'lodash';

import searchStore from '@/store/modules/search';
import {formatDate, getNextMonthLabel} from '@/store/modules/search';

const state = {

    placenamesSearchResults: null,
    placenamesWikidataSearchResults: null,
    roles: [],
    newPlacename: null,

    // new stuff below
    ...searchStore.state,
    sorts: [{field: 'label.keyword', order: 'asc'}],

    placenamesHavingRoles: [], //obsolete?

};

const mutations = {

    UPDATE_ROLES(state, payload) {
        state.roles = payload;
    },
    SEARCH_RESULTS(state, payload) {
        state.placenamesSearchResults = payload;
    },
    WIKIDATA_SEARCH_RESULTS(state, payload) {
        state.placenamesWikidataSearchResults = payload.map(p => {
            return {
                ...p,
                label: p.description ? `${p.name} — ${p.description}` : p.name
            }
        });
    },
    ADD_ONE(state, payload) {
        state.placenamesSearchResults = payload;
    },
    SET_PLACENAMES_HAVING_ROLES(state, payload) {
        state.placenamesHavingRoles = payload;
    },
    ...searchStore.mutations
};

const actions = {

    search({commit, rootState}, what) {
        commit('SEARCH_RESULTS', [])
        const http = http_with_auth(rootState.user.jwt);
        http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__placenames&without-relationships`)
            .then(response => {
                const placenames = response.data.data.map(inst => {
                    return {id: inst.id, ...inst}
                });
                commit('SEARCH_RESULTS', placenames)
            });
    },
    searchOnWikidata({commit}, what) {
        commit('WIKIDATA_SEARCH_RESULTS', []);
        findPlace.findPlace(what).then((result) => {
            console.log(result);
            commit('WIKIDATA_SEARCH_RESULTS', result)
        });
    },
    fetchRoles({commit, rootState}) {
        const http = http_with_auth(rootState.user.jwt);
        http.get(`/placename-roles?without-relationships`).then(response => {
            const roles = response.data.data.map(r => {
                return {id: r.id, ...r.attributes,}
            })
            commit('UPDATE_ROLES', roles)
        });
    },
    fetchPlacenamesHavingRoles({commit, rootState}) {
        const http = http_with_auth(rootState.user.jwt);
        http.get(`/placenames-having-roles?include=placename,placename-role`).then(response => {
            const phr = [];
            const included = response.data.included;
            response.data.data.forEach(element => {
                const placename = included.find(i => i.type === 'placename' && i.id === element.relationships.placename.data.id);
                const role = included.find(i => i.type === 'placename' && i.id === element.relationships['placename-role'].data.id);
                phr.push({
                    id: element.id,
                    attributes: element.attributes,
                    placename,
                    role
                })
            });
            commit('SET_PLACENAMES_HAVING_ROLES', phr)
            commit('SET_TOTALCOUNT', response.data.meta['total-count'])
        });
    },
    addOne({rootState}, placename) {
        const data = {type: 'placename', attributes: {...placename}}
        const http = http_with_auth(rootState.user.jwt);
        return http.post(`placenames`, {data})
            .then(response => {
                return response.data.data
            })
    },

    linkToDocument({commit, rootState}, {roleId, placenameId, func}) {
        const data = {
            data: {
                type: 'placename-has-role',
                attributes: {
                    function: func
                },
                relationships: {
                    document: {
                        data: {
                            id: rootState.document.document.id,
                            type: 'document'
                        }
                    },
                    'placename-role': {
                        data: {
                            id: roleId,
                            type: 'placename-role'
                        }
                    },
                    placename: {
                        data: {
                            id: placenameId,
                            type: 'placename'
                        }
                    }
                }
            }
        }
        const http = http_with_auth(rootState.user.jwt);
        return http.post(`/placenames-having-roles`, data).then(response => {
            return response.data.data
        })
            .catch(error => console.log(error))
    },
    unlinkFromDocument({commit, rootState}, {relationId}) {
        const http = http_with_auth(rootState.user.jwt);
        return http.delete(`/placenames-having-roles/${relationId}`)
            .then(() => this.dispatch('document/removePlacename', relationId))
            .catch(error => console.log(error))
    },

    ...searchStore.actions,

    performSearch: debounce(async ({commit, state, rootState}) => {
        commit('SET_LOADING_STATUS', true);
    
        /* =========== filters =========== */
        let query =  '*'; //`collections.id:${state.selectedCollectionId}`
    
    
        if (state.searchTerm && state.searchTerm.length > 0) {
          query = `(${query} AND (${state.searchTerm}))`
        }

    
        if (!query || query.length === 0) {
          query = '*'
        }
        if (!rootState.user.current_user){
          query = `${query} AND (is-published:true)`
        }
    
        /* =========== sorts ===========*/
        let sorts = state.sorts.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`)
        sorts = sorts.length ? sorts.join(',') : 'creation'
      
        /* =========== date ranges ===========*/
        const cdf = state.creationDateFrom.selection
        const cdt = state.creationDateTo.selection
        let cdfFormatted = null
        let cdtFormatted = null
        console.log(state.creationDateFrom, state.creationDateTo)
    
        try {
          cdfFormatted = formatDate(cdf.year, cdf.month, cdf.day)
          if (state.withDateRange) {
            cdtFormatted = formatDate(cdt.year, cdt.month, cdt.day)
          }
        } catch (e) {
          cdfFormatted = null
          cdtFormatted = null
          console.log(e)
        }
    
        let creationDateRange = ''
    
        try {
          if (cdfFormatted) {
            if (state.withDateRange && cdtFormatted) {
              // between from and to 
              let upperBound = cdtFormatted
              let upperOp = 'lt'
              if (cdt.month === null) {
                upperBound = formatDate(parseInt(cdt.year) + 1, cdt.month, cdt.day)
              }
              else if (cdf.day === null) {
                upperBound = formatDate(cdt.year, getNextMonthLabel(cdt.month), cdt.day)
              } else {
                upperOp = 'lte'
              }
              creationDateRange = `&range[creation]=gte:${cdfFormatted},${upperOp}:${upperBound}`
            } else {
              // single date (from)
              let upperBound = cdfFormatted
              let upperOp = 'lt'
              if (cdf.month === null) {
                // search a single and whole year
                // between 1577 and 1578
                upperBound = formatDate(parseInt(cdf.year) + 1, cdf.month, cdf.day)
              } else if (cdf.day === null) {
                // between 1577-01 and 1577-02
                upperBound = formatDate(cdf.year, getNextMonthLabel(cdf.month), cdf.day)
              } else {
                // a single day: 1577-11-10
                upperOp = 'lte'
              }
              creationDateRange = `&range[creation]=gte:${cdfFormatted},${upperOp}:${upperBound}`
            }
          }
        } catch (e) {
          console.log(e)
          creationDateRange = ''
        }
        
        let filters = `${creationDateRange}`
    
        /* =========== execution =========== */
        try {
          const toInclude = []; ['roles-within-document'];
          const includes = toInclude.length ? `&include=${[].join(',')}` : ''; 
          
          const http = http_with_auth(rootState.user.jwt);
          const response = await http.get(`/search?query=${query}${filters}${includes}&index=lettres__${process.env.NODE_ENV}__placenames&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
          const {data, links, meta} = response.data
    
          // TODO :  par exemple
          // http://localhost:5004/lettres/api/1.0/search?query=relationships.function:donjon&index=lettres__development__placenames&include=roles-within-documents
          // http://localhost:9200/lettres__development__placenames/_doc/_search?q=relationships.function:donjon
          // TODO: par la suite, extraire le store "search" qui permet de chercher les documents pour le rendre davantage générique
          // (ex: remplacer state.document par state.items)

          commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links});
          commit('SET_LOADING_STATUS', false);
        } catch (reason) {
          console.warn('cant search:', reason);
          commit('SET_LOADING_STATUS', false);
        }
       
      }, 500)
};

const getters = {

    getRoleByLabel: state => label => {
        return state.roles.find(role => role.label === label)
    },

    ...searchStore.getters

};

const placenamesModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default placenamesModule;
