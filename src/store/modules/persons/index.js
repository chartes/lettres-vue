import http_with_auth from '../../../modules/http-common';
import findPerson from '../../../modules/ref-providers/wikidata';

import {debounce} from 'lodash';

import searchStore from '@/store/modules/search';
import {formatDate, getNextMonthLabel} from '@/store/modules/search';


const state = {

  personsSearchResults: null,
  personsWikidataSearchResults: null,
  roles: [],
  newPerson: null,

   // new stuff below
   ...searchStore.state,
   sorts: [{field: 'label.keyword', order: 'asc'}],

   personsHavingRoles: [], //obsolete?

};

const mutations = {

  UPDATE_ROLES (state, payload) {
    state.roles = payload;
  },
  SEARCH_RESULTS (state, payload) {
    state.personsSearchResults = payload;
  },
  WIKIDATA_SEARCH_RESULTS(state, payload) {
    state.personsWikidataSearchResults = payload.map(p => {
      return {
        ...p,
        label: p.description ? `${p.name} — ${p.description}` : p.name
      }
    });
  },
  ADD_ONE (state, payload) {
    state.personsHavingRoles = payload;
  },

  SET_PERSONS_HAVING_ROLES(state, payload) {
    state.personsHavingRoles = payload;
  },
  ...searchStore.mutations
};

const actions = {

  search ({ rootState, commit }, what) {
    commit('SEARCH_RESULTS', [])
    const http = http_with_auth(rootState.user.jwt);
    http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__persons&without-relationships`)
      .then( response => {
        const persons = response.data.data.map(inst => { return { id: inst.id, ...inst.attributes}});
        commit('SEARCH_RESULTS', persons)
      });
  },
  searchOnWikidata({commit}, what) {
    commit('WIKIDATA_SEARCH_RESULTS', []);
    findPerson.findPlace(what).then((result) => {
      console.log(result);
      commit('WIKIDATA_SEARCH_RESULTS', result)
    });
  },
  fetchRoles ({ rootState, commit }) {
    const http = http_with_auth(rootState.user.jwt);
    http.get(`/person-roles?without-relationships`).then( response => {
      const roles = response.data.data.map( r =>  {
        return { id: r.id, ...r.attributes, }
      })
      commit('UPDATE_ROLES', roles)
    });
  },
  fetchPersonsHavingRoles({commit, rootState}) {
    const http = http_with_auth(rootState.user.jwt);
    http.get(`/persons-having-roles?include=person,person-role`).then(response => {
        const phr = [];
        const included = response.data.included;
        response.data.data.forEach(element => {
            const person = included.find(i => i.type === 'person' && i.id === element.relationships.person.data.id);
            const role = included.find(i => i.type === 'person' && i.id === element.relationships['person-role'].data.id);
            phr.push({
                id: element.id,
                attributes: element.attributes,
                person,
                role
            })
        });
        commit('SET_PERSONS_HAVING_ROLES', phr)
        commit('SET_TOTALCOUNT', response.data.meta['total-count'])
    });
},
  addOne ({rootState, commit }, person) {
    const data = { type: 'person', attributes: { ...person }}
    const http = http_with_auth(rootState.user.jwt)
    return http.post(`persons`, {data})
      .then(response => {
        return response.data.data
      })
  },

  linkToDocument ({ commit, rootState }, {roleId, personId, func}) {
    const data = { data: {
        type: 'person-has-role',
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
          'person-role': {
            data: {
              id: roleId,
              type: 'person-role'
            }
          },
          person: {
            data: {
              id: personId,
              type: 'person',
            }
          }
        }
      }}
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`/persons-having-roles`, data).then( response => {
        return response.data.data
      })
      .catch(error => console.log(error))
  },
  unlinkFromDocument ({ commit, rootState }, {relationId, personId, roleId}) {
    const http = http_with_auth(rootState.user.jwt)
    return http.delete(`/persons-having-roles/${relationId}`)
      .then (() => this.dispatch('document/removePerson', relationId))
      .catch(error => console.log(error))
  },

  async updateInlinedRole({state, rootState}, {inlined}) {
    const http = http_with_auth(rootState.user.jwt);
    const inlinedRole = state.roles.find(r => r.label === 'inlined')
    
    console.log('foreach inlined found in argument and transcription...')

    for (let [personId, personField] of Object.entries(inlined)) {  

        personId = parseInt(personId)
   
        let personsHavingRoles = await http.get(`/documents/${rootState.document.document.id}/persons-having-roles`)
        console.log('inlined:', [personId, personField])
        console.log('personsHavingRoles (db)', personsHavingRoles.data)
        console.log('inlinedRole:', inlinedRole)

        const found = personsHavingRoles.data.data.find(phr => {
            console.log(phr.relationships['person-role'].data.id === inlinedRole.id, phr.relationships.document.data.id === rootState.document.document.id, phr.relationships.person.data.id === personId,  phr.relationships.person.data.id, personId   )
            return phr.relationships['person-role'].data.id === inlinedRole.id && phr.relationships.document.data.id === rootState.document.document.id && phr.relationships.person.data.id === personId                
        }) 

        // le role existe deja; on met simplement à jour l'attribut field
        if (found) {
            console.log(`Inlined phr already exists (person: ${personId}, field: ${personField}, document: ${rootState.document.document.id})`)

            http.patch(`/persons-having-roles/${found.id}`, {
                data: {
                    type: "person-has-role",
                    id:found.id,
                    attributes: { field: personField}
                }
            })
        } else {
            console.log(`Inlined phr does not exist(person: ${personId}, field: ${personField}, document: ${rootState.document.document.id})`)

            // le role inlined n'existe pas encore pour ce document, on le crée et on rempli l'attribut field
            let data = {
                data: {
                    type: 'person-has-role',
                    attributes: {
                        field: personField 
                    },
                    relationships: {
                        document: {
                            data: { id: rootState.document.document.id, type: 'document' }
                        },
                        'person-role': {
                            data: { id: inlinedRole.id, type: 'person-role' }
                        },
                        person: {
                            data: { id: personId, type: 'person' }
                        }
                    }
                }
            }

            http.post(`/persons-having-roles`, data).then(response => {
                return response.data.data
            })
        }


    }
},

/* ======================
    SEARCH ACTIONS
   ======================*/
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
      const toInclude = ['roles-within-documents@placenameHasRoleWithIds'];
      const includes = toInclude.length ? `&include=${[toInclude].join(',')}` : ''; 
      
      const http = http_with_auth(rootState.user.jwt);
      const response = await http.get(`/search?query=${query}${filters}${includes}&index=lettres__${process.env.NODE_ENV}__persons&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
      const {data, links, meta, included} = response.data

      // TODO :  par exemple
      // http://localhost:5004/lettres/api/1.0/search?query=relationships.person_function:donjon&index=lettres__development__persons&include=roles-within-documents
      // http://localhost:9200/lettres__development__persons/_doc/_search?q=relationships.person_function:donjon
      // TODO: par la suite, extraire le store "search" qui permet de chercher les documents pour le rendre davantage générique
      // (ex: remplacer state.document par state.items)

      commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links, included: included || []});
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

const personsModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default personsModule;
