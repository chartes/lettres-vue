import http_with_auth from '../../../modules/http-common';
import findPlace from '../../../modules/ref-providers/wikidata';
import {debounce} from 'lodash';

import searchStore from '@/store/modules/search';
import {formatDate, getNextMonthLabel} from '@/store/modules/search';

const state = {

    placenamesSearchResults: null,
    placenamesWikidataSearchResults: null,
    roles: [],

    editorContentSelection: null,

    // new stuff below
    ...searchStore.state,
    sorts: [{field: 'label.keyword', order: 'asc'}],

    placenamesHavingRoles: [], //obsolete?

    placenames: [],

    places: []

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
    SET_PLACENAMES(state, payload) {
        state.placenames = payload;
    },
    SET_ALL(state, places) {
        //const placesList = Object.fromEntries(places.items.map((pl) => ([pl.id, pl])));
        state.places = places
    },
    ...searchStore.mutations
};

const actions = {

    async getPlacesTotal({rootState}) {
        const http = http_with_auth(rootState.user.jwt);
        let query ='';
        if (!query || query.length === 0) {
          query = '*'
        }
        if (!rootState.user.current_user) {
            query = `${query} AND (is-published:true)`;
        }
        // fetch persons associated with search criteriae :
        const searchScopePlaces = await http.get(`/search?query=${query}&groupby[doc-type]=placename&groupby[field]=placenames.id&without-relationships`);
        let uniqueSearchScopePlaces = searchScopePlaces.data.data.map(({
                                                                             id,
                                                                             type,
                                                                             attributes,
                                                                             meta,
                                                                             links,
                                                                             relationships
                                                                         }) =>
            ({
                placename_id: id,
                label: attributes.label
            })
        )
        console.log('uniqueSearchScopePlaces', uniqueSearchScopePlaces);
        let totalSearchPlaces = uniqueSearchScopePlaces.length;
        return totalSearchPlaces;
    },

    async fetchAll2({commit, rootState}) {
        commit('SET_LOADING', true)
        const http = http_with_auth(rootState.user.jwt);
        try {
            const response = await http.get(`/search?query=*&index=lettres__${process.env.NODE_ENV}__placenames&without-relationships`)
            const {data:placesJSON, included} = response.data;
            // Convert JSON to places
            //const roles_within = "roles-within-documents"
            const ExpPlaces = placesJSON.map(({
                id,
                attributes: {label, long, lat, ref}//,
                //relationships: {changes, roles-within-documents,documents}
            }) => ({
                id,
                label,
                /*documentCount: nb_docs,
                dateMin: date_min,
                dateMax: date_max,
                description,
                children: children.data.map((child) => child.id),
                parent: parents.data[0] !== undefined ? parents.data[0].id : null,
                roles_within: {
                    role_id: included.find(({type, id: roles_within_id}) => type === "placename-has-role" && roles_within_id === roles_within.data.id).attributes.role_id
                }*/
            }));

            const places = {
                name: "Lieu d'expédition",
                items: ExpPlaces,
            }
            console.log('places : ', places)
      //console.log('type role_within : ', typeof(placesJSON[index]['roles-within-documents']))
      commit('SET_ALL', places)
      commit('SET_LOADING', false)

    } catch(e) {
      console.error('issue with places loading', e)
      //commit('RESET');
    }
    },

    async fetchAll({commit, rootState}) {
        const http = http_with_auth(rootState.user.jwt);
        try {
            const response = await http.get(`/placenames?include=roles-within-documents@placenameHasRoleWithIds`)
            // console.log('type response : ',response.data)
            const {data:placesRolesJSON, included} = response.data;
            //building list of places and respective roles :
            const placesRoles = included.map(({
                type, // unused
                id, // unused
                attributes: {field, placename_id, document_id, role_id, document_title, document_creation_label}, // also has function (unnecessary) field causing error
            }) => ({
                //type,
                //id,
                //unused attributes : function, field, document_id, document_title, document_creation_label
                placename_id,
                // fetching placenames label from response data by placename_id:
                label: placesRolesJSON.find(({type, id: pl_id}) => type === "placename" && pl_id === placename_id).attributes.label,
                role_id,
            }));
            // building lists by roles (filtering and grouping by roles (1 = from, 2 = to, 3 = cited in transcription) :

            const AllPlacesFrom = placesRoles.filter(pl => (pl.role_id === 1));
            //console.log('AllPlacesFrom : ', AllPlacesFrom);
            const AllPlacesTo = placesRoles.filter(pl => (pl.role_id === 2));
            //console.log('AllPlacesTo : ', AllPlacesTo);
            const AllPlacesCited = placesRoles.filter(pl => (pl.role_id === 3));
            //console.log('AllPlacesCited : ', AllPlacesCited);

            const AllPlacesFromUnique = Object.values(AllPlacesFrom.reduce(
                (a, c) => {
                    a[c.placename_id] = c;
                    return a
                    }, {}
                )
            );
            const AllPlacesToUnique = Object.values(AllPlacesTo.reduce(
                (a, c) => {
                    a[c.placename_id] = c;
                    return a
                    }, {}
                )
            );
            const AllPlacesCitedUnique = Object.values(AllPlacesCited.reduce(
                (a, c) => {
                    a[c.placename_id] = c;
                    return a
                    }, {}
                )
            );
            //console.log('AllPlacesFromUnique : ', AllPlacesFromUnique);
            //console.log('AllPlacesToUnique : ', AllPlacesToUnique);
            //console.log('AllPlacesCitedUnique : ', AllPlacesCitedUnique);
            const places = [
                {role_id: "Lieu d'expédition", places : AllPlacesFromUnique},
                {role_id: "Lieu de destination", places : AllPlacesToUnique},
                {role_id: "Lieu mentionné", places : AllPlacesCitedUnique}
            ]
            //console.log('places : ', places)
            commit('SET_ALL', places)
            //commit('SET_LOADING', false)

        } catch(e) {
          console.error('issue with placeRoles loading', e);
          commit('RESET');
        }
    },

    search({commit, rootState}, what) {
        commit('SEARCH_RESULTS', [])
        const http = http_with_auth(rootState.user.jwt);
        return http.get(`/search?query=*${what}*&index=lettres__${process.env.NODE_ENV}__placenames&without-relationships&sort=label.keyword`)
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
        return http.get(`/placename-roles?without-relationships`).then(response => {
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
                    placename: element.attributes.label,
                    role: element.attributes.role
                })
            });
            commit('SET_PLACENAMES_HAVING_ROLES', phr)
            commit('SET_TOTALCOUNT', response.data.meta['total-count'])
        });
    },
    addPlace({rootState}, placename) {
        const data = {type: 'placename', attributes: {...placename}}
        const http = http_with_auth(rootState.user.jwt);
        return http.post(`placenames`, {data})
            .then(response => {
                return response.data.data
            })
    },
    async fetchAllPlacenames({commit}) {
        const http = http_with_auth();
        const response = await http.get(`all-placenames`);
        const placenames = response.data.data;
        commit('SET_PLACENAMES', placenames)
    },
    async checkIfRefExists({rootState}, ref) {
        const http = http_with_auth(rootState.user.jwt);
        const response = await http.get(`placenames?page[size]=1&without-relationships&filter[ref]=${ref}`)
        let existingPlace = {place: response.data.data[0], count: response.data.meta['total-count']}
        console.log("existingPlace", existingPlace)
        return existingPlace
    },

    async linkToDocument({commit, rootState}, {label, roleId, placenameId, func, phrId}) {
        let data = {
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
        if (!phrId) {
            const getPhr = await http.get(`/documents/${rootState.document.document.id}/placenames-having-roles`)
            const foundPhr = getPhr.data.data.find(phr => phr.relationships.placename.data.id === placenameId && phr.relationships['placename-role'].data.id === roleId)
            if (foundPhr) {
              phrId = foundPhr.id
            }
          }

        if (phrId) {
            //console.log("updating place link to doc, place relationship already exists", phrId)
            data.data.id = phrId
            const patchPhr = await http.patch(`/placenames-having-roles/${phrId}`, data).then(response => {
                    return response.data.data
                }).catch(error => console.log("patchPhr error", error))
            // if update worked, also save the document to modify indexes with appropriate data
            if (patchPhr) {
                //if update is location from or location to (inlined needs saving the RTE first) then save and update changelog
                if (roleId === 1 || roleId === 2) {
                    let attributes = {};
                    //cannot set an updated attribute : locations are not a doc attribute and relationships are not implemented, instead pass a changelog value
                    let docData = {id: rootState.document.document.id, attributes};
                    let role = {1: "lieu d'expédition", 2: "lieu de destination"}[roleId]
                    docData['changelog_msg'] = `Modification du ${role} : ${label}`
                    this.dispatch("document/save", docData)
                        .then(docSaveResponse => {
                            return docSaveResponse
                        }).catch(error => console.log("linking place : saving document error", error));
                }
            }
        } else {
            //console.log("updating place link to doc, place relationship is new")
            const postPhr = await http.post(`/placenames-having-roles`, data).then(response => {
                return response.data.data
            }).catch(error => console.log("postPhr error", error))
            if (postPhr) {
                //if addition is location from or location to (inlined needs saving the RTE first) then save and update changelog
                if (roleId === 1 || roleId === 2) {
                    let attributes = {};
                    //cannot set an updated attribute : locations are not a doc attribute and relationships are not implemented, instead pass a changelog value
                    let docData = {id: rootState.document.document.id, attributes};
                    let role = {1: "lieu d'expédition", 2: "lieu de destination"}[roleId]
                    docData['changelog_msg'] = `Ajout du ${role} : ${label}`
                    this.dispatch("document/save", docData)
                        .then(docSaveResponse => {
                            return docSaveResponse
                        }).catch(error => console.log("linking place : saving document error", error));
                }
            }
        }
    },
    async unlinkFromDocument({commit, rootState}, { label, id, relationId, roleId }) {
        const http = http_with_auth(rootState.user.jwt);
        const removePhr = await http.delete(`/placenames-having-roles/${relationId}`)
            .then((response) => {
                this.dispatch('document/removePlacename', relationId);
                return response
            })
            .catch(error => console.log("delete placenames-having-roles error", error))
        if (removePhr.status === 204) {
            //if removal is location from or location to (inlined needs saving the RTE first) then save and update changelog
            if (roleId === 1 || roleId === 2) {
                let attributes = {};
                //cannot set an updated attribute : locations are not a doc attribute and relationships are not implemented, instead pass a changelog value
                let docData = {id: rootState.document.document.id, attributes};
                let role = {1: "lieu d'expédition", 2: "lieu de destination"}[roleId]
                docData['changelog_msg'] = `Suppression du ${role} : ${label}`
                this.dispatch("document/save", docData)
                    .then(docSaveResponse => {
                        return docSaveResponse
                    }).catch(error => console.log("unlinking place : saving document error", error));
            }
        }
    },

    async updateInlinedRole({state, rootState, dispatch}, {inlined}) {
        const http = http_with_auth(rootState.user.jwt);
        await dispatch("fetchRoles");

        const inlinedRole = state.roles.find(r => r.label === 'inlined')
        
        console.log('foreach inlined found in adress and transcription...')

        for (let [placenameId, placenameField] of Object.entries(inlined)) {  

            placenameId = parseInt(placenameId)
       
            let placenamesHavingRoles = await http.get(`/documents/${rootState.document.document.id}/placenames-having-roles`)
            console.log('placenames inlined:', [placenameId, placenameField])
            console.log('placenamesHavingRoles (db)', placenamesHavingRoles.data)
            console.log('placenames inlinedRole:', inlinedRole)

            const found = placenamesHavingRoles.data.data.find(phr => {
                console.log(phr, inlinedRole)
                return phr.relationships['placename-role'].data.id === inlinedRole.id && phr.relationships.document.data.id === rootState.document.document.id && phr.relationships.placename.data.id === placenameId                
            }) 

            // le role existe deja; on met simplement à jour l'attribut field
            if (found) {
                console.log(`Inlined phr already exists (placename: ${placenameId}, field: ${placenameField}, document: ${rootState.document.document.id})`)

                http.patch(`/placenames-having-roles/${found.id}`, {
                    data: {
                        type: "placename-has-role",
                        id:found.id,
                        attributes: { field: placenameField}
                    }
                })
            } else {
                console.log(`Inlined phr does not exist(placename: ${placenameId}, field: ${placenameField}, document: ${rootState.document.document.id})`)

                // le role inlined n'existe pas encore pour ce document, on le crée et on rempli l'attribut field
                let data = {
                    data: {
                        type: 'placename-has-role',
                        attributes: {
                            field: placenameField 
                        },
                        relationships: {
                            document: {
                                data: { id: rootState.document.document.id, type: 'document' }
                            },
                            'placename-role': {
                                data: { id: inlinedRole.id, type: 'placename-role' }
                            },
                            placename: {
                                data: { id: placenameId, type: 'placename' }
                            }
                        }
                    }
                }

                http.post(`/placenames-having-roles`, data).then(response => {
                    return response.data.data
                })
            }

        }
    },

    /* ======================
        SEARCH ACTIONS
       ======================*/
    ...searchStore.actions,

    async performFunctionSearch({rootState}) {
        const http = http_with_auth(rootState.user.jwt);
        const response = await http.get(`/placenames-functions`);
        return response.data['placename-functions']
    },

    performSearch: debounce(async ({commit, state, rootState}) => {
        commit('SET_LOADING_STATUS', true);
    
        /* =========== filters =========== */
        let query =  state.searchTerm ||  '***' ; //`collections.id:${state.selectedCollectionId}`state.placenamesSearchResults.map(p => `id:${p.id}`).join(' OR ') ||
    
    
        if (!rootState.user.current_user){
          query = `${query} AND (is-published:true)`
        }
    
        /* =========== sorts ===========*/
        let sorts = state.sorts.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`)
        sorts = sorts.length ? sorts.join(',') :  'label.keyword'
      
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
          const response = await http.get(`/search?query=${query}${filters}${includes}&index=lettres__${process.env.NODE_ENV}__placenames&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
          const {data, links, meta, included} = response.data

    
          // TODO :  par exemple
          // http://localhost:5004/lettres/api/1.0/search?query=relationships.placename_function:donjon&index=lettres__development__placenames&include=roles-within-documents
          // http://localhost:9200/lettres__development__placenames/_doc/_search?q=relationships.placename_function:donjon
          // TODO: par la suite, extraire le store "search" qui permet de chercher les documents pour le rendre davantage générique
          // (ex: remplacer state.document par state.items)

          commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links, included: included || []});
          commit('SET_LOADING_STATUS', false);
        } catch (reason) {
          console.warn('cant search:', reason);
          commit('SET_LOADING_STATUS', false);
        }
       
      }, 400),

      async getPlacenameById({rootState}, id) {
        const http = http_with_auth(rootState.user.jwt);
        const resp = await http.get(`/placenames/${id}?without-relationships`)
        return resp.data.data;
      },

      async getInlinedPlacenameWithRoleById({rootState, state}, {docId, placeId}) {
        const http = http_with_auth(rootState.user.jwt);
        const response = await http.get(`/documents/${docId}?without-relationships&include=placenames-having-roles`)
        const phr = response.data.included.find(
            phr => phr.relationships.placename.data.id === parseInt(placeId) &&
                   phr.relationships['placename-role'].data.id === state.roles.find(r => r.label === 'inlined').id
        )

        if (phr) {
            const place = await http.get(`/placenames/${placeId}?without-relationships`)
            return {
                place: place.data.data.attributes,
                phr: phr.attributes,
                phrId: phr.id
            }
        }
        else {
            return null
        }
      }

};

function groupbyPlacename(phrList) {
    let _d = {}
    phrList.forEach(p => {
        if (_d[p.placenameId] === undefined) {
            _d[p.placenameId] = []
        }
        const id = p.placenameId
        delete p.placenameId;
        _d[id].push(p)
    })
    return _d
}

const getters = {

    getRoleByLabel: state => label => {
        return state.roles.find(role => role.label === label)
    },

    getFunctionsByPlacename: (state) => {
        return groupbyPlacename(state.included.filter(phr => phr.attributes.function).map(phr => {
            return {placenameId: phr.attributes.placename_id, function: phr.attributes.function}
        }))
    },

    getRolesByPlacename: (state) => {
        return groupbyPlacename(state.included.filter(phr => phr.attributes.role).map(phr => {
            return {placenameId: phr.attributes.placename_id, role: phr.attributes.role}
        }))
    },

    /* used to build the 'placename uses' section in the placename search table rows */
    getIncluded: (state)  => {
        const roles = state.roles
        let inlinedRole = roles.find(r => r.label === 'inlined')
        let fromRole = roles.find(r => r.label === 'location-date-from')
        let toRole = roles.find(r => r.label === 'location-date-to')

        function reformatPhr(phr) {
                return {
                    id: phr.id,
                    placenameId: phr.attributes.placename_id,
                    docId: phr.attributes.document_id,
                    docTitle: phr.attributes.document_title,
                    docCreationLabel: phr.attributes.document_creation_label,
                    placenameFunction: phr.attributes['function'],
                }
        }

        let fromPlace = state.included.filter(phr => phr.attributes.role_id === fromRole.id).map(reformatPhr)
        let toPlace = state.included.filter(phr => phr.attributes.role_id === toRole.id).map(reformatPhr)
        let inAddress = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('address') > -1).map(reformatPhr)
        let inArgument = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('argument') > -1).map(reformatPhr)
        let inNotes = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('note') > -1).map(reformatPhr)
        let inTranscription = state.included.filter(phr => phr.attributes.role_id === inlinedRole.id && phr.attributes.field && phr.attributes.field.indexOf('transcription') > -1).map(reformatPhr)

        const fromPlaceDict = groupbyPlacename(fromPlace)
        const toPlaceDict = groupbyPlacename(toPlace)
        const inAddressDict = groupbyPlacename(inAddress)
        const inArgumentDict = groupbyPlacename(inArgument)
        const inNotesDict = groupbyPlacename(inNotes)
        const inTranscriptionDict = groupbyPlacename(inTranscription)
        const docIds = state.included.map(phr => phr.attributes.document_id).filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
        docIds.sort();

        const documentsDict = groupbyPlacename(state.included.map(reformatPhr))

        return {
            fromPlace: fromPlaceDict,
            toPlace: toPlaceDict,
            inAddress: inAddressDict,
            inArgument: inArgumentDict,
            inNotes: inNotesDict,
            inTranscription: inTranscriptionDict,
            documents: documentsDict
        } 
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
