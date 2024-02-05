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
   persons: [],
   persons_roles: [],

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
  SET_PERSONS(state, payload) {
    state.persons = payload;
},
  SET_PERSONS_HAVING_ROLES(state, payload) {
    state.personsHavingRoles = payload;
  },

  SET_PERSONS_ROLES (state, persons_roles) {
    //const placesList = Object.fromEntries(places.items.map((pl) => ([pl.id, pl])));
    state.persons_roles = persons_roles
  },
  ...searchStore.mutations
};

const actions = {

  async getPersonsTotal({rootState}) {
    const http = http_with_auth(rootState.user.jwt);
    let query ='';
    let published = false;

    /*if (!query || query.length === 0) {
      query = '*'
    }*/
    if (!rootState.user.current_user) {
        published = true
        //query = `${query} AND (is-published:true)`;
    }
    // fetch persons associated with search criteriae :
    const searchScopePersons = await http.get(`/search?query=${query}&published=${published}&groupby[doc-type]=person&groupby[field]=persons.id&without-relationships`);
    let uniqueSearchScopePersons = searchScopePersons.data.data.map(({
                                                                         id,
                                                                         type,
                                                                         attributes,
                                                                         meta,
                                                                         links
                                                                     }) =>
        ({
            person_id: id,
            label: attributes.label
        })
    )
    console.log('uniqueSearchScopePersons', uniqueSearchScopePersons);
    let totalSearchPersons = uniqueSearchScopePersons.length;
    return totalSearchPersons;
  },


  async fetchAll({commit, rootState}) {
        const http = http_with_auth(rootState.user.jwt);
        try {
            const response = await http.get(`/persons?include=roles-within-documents@personHasRoleWithIds`)
            // console.log('type response : ',response.data)
            const {data:personsRolesJSON, included} = response.data;
            //building list of persons and respective roles :
            const personsRoles = included.map(({
                type, // unused
                id, // unused
                attributes: {field, person_id, document_id, role_id, document_title, document_creation_label}, // also has function (unnecessary) field causing error
            }) => ({
                //type,
                //id,
                //unused attributes : function, field, document_id, document_title, document_creation_label
                person_id,
                // fetching persons label from response data by person_id:
                label: personsRolesJSON.find(({type, id: pers_id}) => type === "person" && pers_id === person_id).attributes.label,
                role_id,
            }));
            // building lists by roles (filtering and grouping by roles (1 = from, 2 = to, 3 = cited in transcription) :

            const AllPersonsFrom = personsRoles.filter(pl => (pl.role_id === 1));
            //console.log('AllPersonsFrom : ', AllPersonsFrom);
            const AllPersonsTo = personsRoles.filter(pl => (pl.role_id === 2));
            //console.log('AllPersonsTo : ', AllPersonsTo);
            const AllPersonsCited = personsRoles.filter(pl => (pl.role_id === 3));
            //console.log('AllPersonsCited : ', AllPersonsCited);

            const AllPersonsFromUnique = Object.values(AllPersonsFrom.reduce(
                (a, c) => {
                    a[c.person_id] = c;
                    return a
                    }, {}
                )
            );
            const AllPersonsToUnique = Object.values(AllPersonsTo.reduce(
                (a, c) => {
                    a[c.person_id] = c;
                    return a
                    }, {}
                )
            );
            const AllPersonsCitedUnique = Object.values(AllPersonsCited.reduce(
                (a, c) => {
                    a[c.person_id] = c;
                    return a
                    }, {}
                )
            );
            //console.log('AllPersonsFromUnique : ', AllPersonsFromUnique);
            //console.log('AllPersonsToUnique : ', AllPersonsToUnique);
            //console.log('AllPersonsCitedUnique : ', AllPersonsCitedUnique);
            const persons_roles = [
                {role_id: "Expéditeur", persons: AllPersonsFromUnique},
                {role_id: "Destinataire", persons : AllPersonsToUnique},
                {role_id: "Personne citée", persons : AllPersonsCitedUnique}
            ]
            //console.log('persons_roles : ', persons_roles)
            commit('SET_PERSONS_ROLES', persons_roles)
            //commit('SET_LOADING', false)

        } catch(e) {
          console.error('issue with persons_roles loading', e);
          commit('RESET');
        }
    },


  search ({ rootState, commit }, what) {
    /** Gets Persons ids, labels and refs (wikidate ids)
     * @param {string}   what  search terms (label, id , etc.)
     * @returns {object} API response data (data, jsonapi, meta - incl. total-count, links) and list of persons objects ({"id": digit, "label": string, "ref": string})
     * @returns {list} list of persons objects as "personsSearchResults" in persons state
     */
    commit('SEARCH_RESULTS', []);
    const http = http_with_auth(rootState.user.jwt);
    return http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__persons&without-relationships&sort=label.keyword`)
      .then( response => {
        const persons = response.data.data.map(pers => { return { id: pers.id, ...pers.attributes}});
        commit('SEARCH_RESULTS', persons)
        return {response: response.data, persons: persons}
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
    return http.get(`/person-roles?without-relationships`).then( response => {
      const roles = response.data.data.map( r =>  {
        return { id: r.id, ...r.attributes, }
      })
      commit('UPDATE_ROLES', roles)
      console.log('UPDATE ROLES', roles)
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
  addPerson ({rootState, commit }, person) {
    const data = { type: 'person', attributes: { ...person }}
    const http = http_with_auth(rootState.user.jwt)
    return http.post(`persons`, {data})
      .then(response => {
        return response.data.data
      })
  },
  async fetchAllPersons({commit}) {
    const http = http_with_auth();
    const response = await http.get(`all-persons`);
    const persons = response.data.data;
    commit('SET_PERSONS', persons)
},
  async linkToDocument ({ commit, rootState }, {label, roleId, personId, func, phrId}) {
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
      
      if (!phrId) {
        const getPhr = await http.get(`/documents/${rootState.document.document.id}/persons-having-roles`)
        const foundPhr = getPhr.data.data.find(phr => phr.relationships.person.data.id === personId && phr.relationships['person-role'].data.id === roleId)
        if (foundPhr) {
          phrId = foundPhr.id
        }
      }

      if (phrId) {
        //console.log("updating person link to doc, person relationship already exists", phrId)
        data.data.id = phrId
        const patchPhr = await http.patch(`/persons-having-roles/${phrId}`, data).then(response => {
                return response.data.data
            }).catch(error => console.log("patchPhr error", error))
        // if update worked, also save the document to modify indexes with appropriate data
        if (patchPhr) {
            //if update is sender or recipient (inlined needs saving the RTE first) then save and update changelog
            if (roleId === 1 || roleId === 2) {
            let attributes = {}
            //cannot set an updated attribute : persons are not a doc attribute and relationships are not implemented, instead pass a changelog value
            let docData = {id: rootState.document.document.id, attributes};
            let role = {1: "de l'expéditeur", 2: "du destinataire"}[roleId]
            docData['changelog_msg'] = `Modification ${role} : ${label}`
            this.dispatch("document/save", docData)
                .then(docSaveResponse => {
                    return docSaveResponse
                }).catch(error => console.log("linking person : saving document error", error));
            }
        }
      } else {
        //console.log("updating person link to doc, person relationship is new")
        const postPhr = await http.post(`/persons-having-roles`, data).then(response => {
                return response.data.data
            }).catch(error => console.log("postPhr error", error))
        // if update worked, also save the document to modify indexes with appropriate data
        if (postPhr) {
            //if addition is sender or recipient (inlined needs saving the RTE first) then save and update changelog
            if (roleId === 1 || roleId === 2) {
                let attributes = {};
                //cannot set an updated attribute : persons are not a doc attribute and relationships are not implemented, instead pass a changelog value
                let docData = {id: rootState.document.document.id, attributes};
                let role = {1: "de l'expéditeur", 2: "du destinataire"}[roleId]
                docData['changelog_msg'] = `Ajout ${role} : ${label}`
                this.dispatch("document/save", docData)
                    .then(docSaveResponse => {
                        return docSaveResponse
                    }).catch(error => console.log("linking person : saving document error", error));
            }
        }
    }
  },
  async unlinkFromDocument ({ commit, rootState }, { label, id, relationId, roleId }) {
    const http = http_with_auth(rootState.user.jwt)
    const removePhr = await http.delete(`/persons-having-roles/${relationId}`)
      .then ((response) => {
          this.dispatch('document/removePerson', relationId);
          return response
      })
      .catch(error => console.log("delete persons-having-roles error", error))
    // if update worked, also save the document to modify indexes with appropriate data
    //console.log("unlink person saving document response", removePhr)
    if (removePhr.status === 204) {
        //if removal is sender or recipient (inlined needs saving the RTE first) then save and update changelog
        if (roleId === 1 || roleId === 2) {
            let attributes = {};
            //cannot set an updated attribute : locations are not a doc attribute and relationships are not implemented, instead pass a changelog value
            let docData = {id: rootState.document.document.id, attributes};
            let role = {1: "de l'expéditeur", 2: "du destinataire"}[roleId]
            docData['changelog_msg'] = `Suppression ${role} : ${label}`
            this.dispatch("document/save", docData)
                .then(docSaveResponse => {
                    return docSaveResponse
                }).catch(error => console.log("unlinking person : saving document error", error));
        }
    }
  },

  async checkIfRefExists({rootState}, ref) {
    const http = http_with_auth(rootState.user.jwt);
    const response = await http.get(`search?query=ref:${ref.split("/").pop()}&index=lettres__${process.env.NODE_ENV}__persons&without-relationships&page[size]=1`)
    let existingPerson = {person: response.data.data[0], count: response.data.meta['total-count']}
    return existingPerson
  },
  async updateInlinedRole({state, rootState, dispatch}, {inlined}) {
    const http = http_with_auth(rootState.user.jwt);
    await dispatch("fetchRoles");

    const inlinedRole = state.roles.find(r => r.label === 'inlined')
    
    console.log('foreach inlined found in argument and transcription...')

    for (let [personId, personField] of Object.entries(inlined)) {  

        personId = parseInt(personId)

        let personsHavingRoles = await http.get(`/documents/${rootState.document.document.id}/persons-having-roles`)
        console.log('inlined:', [personId, personField])
        console.log('personsHavingRoles (db)', personsHavingRoles.data)
        console.log('inlinedRole:', inlinedRole)
        const found = personsHavingRoles.data.data.find(phr => {
            return phr.relationships['person-role'].data.id === inlinedRole.id && phr.relationships.document.data.id === rootState.document.document.id && phr.relationships.person.data.id === personId                
        }) 

        // le role existe deja : on met simplement à jour l'attribut field
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

            // le role inlined n'existe pas encore pour ce document, on le crée et on remplit l'attribut field
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

  async getPersonById({rootState}, id) {
    const http = http_with_auth(rootState.user.jwt);
    const resp = await http.get(`/persons/${id}?without-relationships`)
    if (resp.data.data) {
    return resp.data.data;
    } else return resp.data.error
  },

  /* ======================
      SEARCH ACTIONS
    ======================*/
  ...searchStore.actions,

  async performFunctionSearch({rootState}) {
    const http = http_with_auth(rootState.user.jwt);
    const response = await http.get(`/persons-functions`);
    return response.data['person-functions']
  },

  performSearch: debounce(async ({commit, state, rootState}) => {
      //commit('SET_LOADING_STATUS', true);

      /* =========== filters =========== */
      let published = '';
      //let query =  state.searchTerm  || '***' //`collections.id:${state.selectedCollectionId}`
      let query =  state.searchTerm  || '' //`collections.id:${state.selectedCollectionId}`

      if (!rootState.user.current_user){
        published = true
        //query = `${query} AND (is-published:true)`
      }

      /* =========== sorts ===========*/
      let sorts = state.sorts.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`)
      sorts = sorts.length ? sorts.join(',') : 'label.keyword'
    
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
        const toInclude = ['roles-within-documents@personHasRoleWithIds'];
        const includes = toInclude.length ? `&include=${[toInclude].join(',')}` : ''; 
        
        const http = http_with_auth(rootState.user.jwt);
        const response = await http.get(`/search?query=${query}&published=${published}${filters}${includes}&index=lettres__${process.env.NODE_ENV}__persons&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
        const {data, links, meta, included} = response.data

        // TODO :  par exemple
        // http://localhost:5004/lettres/api/1.0/search?query=relationships.person_function:donjon&index=lettres__development__persons&include=roles-within-documents
        // http://localhost:9200/lettres__development__persons/_doc/_search?q=relationships.person_function:donjon
        // TODO: par la suite, extraire le store "search" qui permet de chercher les documents pour le rendre davantage générique
        // (ex: remplacer state.document par state.items)

        commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links, included: included || []});
        //commit('SET_LOADING_STATUS', false);
          return {documents: data, totalCount: meta['total-count'] , links, included: included || []}
      } catch (reason) {
        console.warn('cant search:', reason);
        //commit('SET_LOADING_STATUS', false);
      }
    
    }, 500),


    async getInlinedPersonsWithRoleById({rootState, state}, {docId, personId}) {
      const http = http_with_auth(rootState.user.jwt);
      const response = await http.get(`/documents/${docId}?without-relationships&include=persons-having-roles`)
      const phr = response.data.included.find(
          phr => phr.relationships.person.data.id === parseInt(personId) &&
                 phr.relationships['person-role'].data.id === state.roles.find(r => r.label === 'inlined').id
      )

      if (phr) {
          const person = await http.get(`/persons/${personId}?without-relationships`)
          return {
              person: person.data.data.attributes,
              phr: phr.attributes,
              phrId: phr.id
          }
      }
      else {
          return null
      }
    }
};


function groupByPerson(phrList) {
  let _d = {}
  phrList.forEach(p => {
      if (_d[p.personId] === undefined) {
          _d[p.personId] = []
      }
      const id = p.personId
      delete p.personId;
      _d[id].push(p)
  })
  return _d
}


const getters = {

  getRoleByLabel: state => label => {
    return state.roles.find(role => role.label === label)
  },

  getFunctionsByPerson: (state) => {
    return groupByPerson(state.included.filter(phr => phr.attributes.function).map(phr => { 
        return {personId: phr.attributes.person_id, function: phr.attributes.function}
    }))
  },

  /* used to build the 'person uses' section in the person search table rows */
  getIncluded: (state)  => {
      const roles = state.roles
      let inlinedRole = roles.find(r => r.label === 'inlined')
      let senderRole = roles.find(r => r.label === 'sender')
      let toRole = roles.find(r => r.label === 'recipient')

      function reformatPhr(phr) {
              return {
                  id: phr.id,
                  personId: phr.attributes.person_id,
                  docId: phr.attributes.document_id,
                  docTitle: phr.attributes.document_title,
                  docCreationLabel: phr.attributes.document_creation_label,
                  personFunction: phr.attributes['function'],
              }
      }

      let sender = state.included.filter(phr => phr.attributes.role_id === senderRole.id).map(reformatPhr)
      let recipient = state.included.filter(phr => phr.attributes.role_id === toRole.id).map(reformatPhr)
      let inAddress = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('address') > -1).map(reformatPhr)
      let inArgument = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('argument') > -1).map(reformatPhr)
      let inNotes = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('note') > -1).map(reformatPhr)
      let inTranscription = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('transcription') > -1).map(reformatPhr)

      const senderDict = groupByPerson(sender)
      const recipientDict = groupByPerson(recipient)
      const inAddressDict = groupByPerson(inAddress)
      const inArgumentDict = groupByPerson(inArgument)
      const inNotesDict = groupByPerson(inNotes)
      const inTranscriptionDict = groupByPerson(inTranscription)
      const docIds = state.included.map(phr => phr.attributes.document_id).filter(function(item, pos, self) {
          return self.indexOf(item) === pos;
      })
      docIds.sort();

      const documentsDict = groupByPerson(state.included.map(reformatPhr))

      return {
          sender: senderDict,
          recipient: recipientDict,
          inAddress: inAddressDict,
          inArgument: inArgumentDict,
          inNotes: inNotesDict,
          inTranscription: inTranscriptionDict,
          documents: documentsDict
      } 
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
