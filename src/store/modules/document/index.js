import {http_with_auth} from '@/modules/http-common';

import {
  getPersons, getLanguages, getWitnesses,
  getNotes, getCollections, getCurrentLock,  getPlacenames,
  removeContentEditableAttributesFromObject
} from '@/modules/document-helpers';

import {getInstitution} from '../witnesses'

const TRANSLATION_MAPPING = {
  'creation' : 'Date de création',
  'creation-not-after' : 'Date de création (borne supérieure)',
  'creation-label' : 'Date de création (étiquette)',
  'is-published': 'Statut de publication',
  'argument': 'Argument',
  'transcription': 'Transcription',
  'title': 'Titre',
  'address': 'Adresse'
};

const state = {

  documentLoading: false,
  document: null,
  persons: [],
  placenames: [],
  witnesses: [],
  languages: [],
  collections: [],
  notes: []
};



function makeDummyDocument(data) {
  let DUMMY_DOCUMENT = {
    data: {
      id: -1,
      type: 'document',
      attributes: {
        title: 'Ceci est le titre du nouveau document. Éditez-le !',
      },
    }
  };
  if (data) {
    if (data.attributes) {
      DUMMY_DOCUMENT.data.attributes = {
        ...DUMMY_DOCUMENT.data.attributes,
        ...data.attributes
      }
    }
    if (data.relationships) {
      DUMMY_DOCUMENT.data.relationships = {
        ...DUMMY_DOCUMENT.data.relationships,
        ...data.relationships
      }
    }
  }
  return DUMMY_DOCUMENT;
}

const dummy = makeDummyDocument();

const mutations = {

  UPDATE_DOCUMENT (state, {data, included}) {
    console.log('UPDATE_DOCUMENT', data, included);
    state.document = Object.assign({}, state.document, { ...data.attributes, id: data.id});
    state.persons = getPersons(included);
    state.placenames = getPlacenames(included);
    state.collections = getCollections(included);
    state.languages = getLanguages(included);
    state.witnesses = getWitnesses(included);
    state.notes = getNotes(included);
    state.currentLock = getCurrentLock(included);
  },
  UPDATE_DOCUMENT_DATA (state, data) {
    console.log('UPDATE_DOCUMENT_DATA', data);
    state.document = Object.assign({}, { ...data.attributes, id: data.id});
  },

  LOADING_STATUS (state, payload) {
    state.documentLoading = payload;
  },

  ADD_COLLECTION (state, payload) {
    const exists = state.collections.find(coll => coll.id === payload.id)
    if (exists) return;
    state.collections = [ ...state.collections, payload ]
  },

  UPDATE_NOTE (state, payload) {
    let no = state.notes.find(n => n.id === payload.id)
    const index = state.notes.indexOf(no)
    no = { ...payload }
    state.notes.splice(index, 1, no)
  },
  ADD_NOTE (state, payload) {
    const exists = state.notes.find(note => note.id === payload.id)
    if (exists) return;
    const before = state.notes.length;
    state.notes = [ ...state.notes, payload ]
  },
  REMOVE_NOTE (state, payload) {
    let note = state.notes.find(n => n.id === payload)
    const index = state.notes.indexOf(note)
    state.notes.splice(index, 1)
  },

  ADD_WITNESS (state, payload) {
    state.witnesses = [ ...state.witnesses, payload ]
  },
  UPDATE_WITNESS (state, payload) {
    let wit = state.witnesses.find(w => w.id === payload.id)
    const index = state.witnesses.indexOf(wit)
    wit = { ...payload }
    state.witnesses.splice(index, 1, wit)
  },
  UPDATE_WITNESS_INSTITUTION (state, { witnessId, institution }) {
    let wit = state.witnesses.find(w => w.id === witnessId)
    const index = state.witnesses.indexOf(wit)
    wit = { ...wit, institution }
    state.witnesses.splice(index, 1, wit)
  },
  REMOVE_WITNESS (state, id) {
    let wit = state.witnesses.find(w => w.id === id)
    const index = state.witnesses.indexOf(wit)
    state.witnesses.splice(index, 1)
  },
  REORDER_WITNESSES (state, payload) {
    state.witnesses = [ ...payload ]
  },
  REMOVE_COLLECTION (state, payload) {
    if (state.collections) {
      state.collections = state.collections.filter(coll => coll.id !== payload.id)
    }
  },
  REMOVE_PERSON (state, payload) {
    if (state.persons) {
      state.persons = state.persons.filter(corr => corr.relationId !== payload)
    }
  },
  ADD_PERSON (state, payload) {
    state.persons = [ ...state.persons, payload ]
  },
  REMOVE_PLACENAME(state, payload) {
    if (state.placenames) {
      state.placenames = state.placenames.filter(corr => corr.relationId !== payload)
    }
  },
  ADD_PLACENAME(state, payload) {
    state.placenames = [...state.placenames, payload]
  }
};

const actions = {
  fetch ({ rootState, commit }, id) {
    commit('LOADING_STATUS', true);

    let incs = [
      'collections', 'notes',
      'persons-having-roles', 'persons', 'person-roles',
      'placenames-having-roles', 'placenames', 'placename-roles',
      'witnesses', 'languages', 'current-lock'
    ];

    this.dispatch('languages/fetch');

    const http = http_with_auth(rootState.user.jwt);
    return http.get(`documents/${id}?include=${incs.join(',')}`).then( response => {
      commit('UPDATE_DOCUMENT', {
        data: response.data.data,
        included: response.data.included
      });
      commit('LOADING_STATUS', false)
    })
  },

  async save ({ commit, rootState, dispatch }, data) {
    const modifiedData = data.attributes || data.relationships;
    console.log('document/save', data)
    data.type = 'document';
    removeContentEditableAttributesFromObject(data.attributes)
    //
    const http = http_with_auth(rootState.user.jwt);

    const response = await http.patch(`/documents/${data.id}`, { data })
    commit('UPDATE_DOCUMENT_DATA', response.data.data);

    console.log('@@saving inlined: seeking for tags in content')
    /* 
      seek for placenames and persons in the doc attributes (argument, transcription) 
      and update the placename_has_role and person_has_role tables accordingly. 
    */
    const placenameRegexp = /(?:class="placeName" id=")(\d+)/gmi;
    const personRegexp = /(?:class="persName" id=")(\d+)/gmi;
    const attrs = response.data.data.attributes;

    /* =========== find placenames =========== */
    let IdsInArgument = [...attrs.argument.matchAll(placenameRegexp)].map(m => parseInt(m[1]))
    let IdsInTranscription = [...attrs.transcription.matchAll(placenameRegexp)].map(m => parseInt(m[1]))
  
    let uniqIds = [... new Set(IdsInArgument.concat(IdsInTranscription))]
    let inlined = {}
    
    for (let _id of uniqIds) {
      let field = ""
      if (IdsInArgument.indexOf(_id) > -1) {
        field = "argument"
      }
      if (IdsInTranscription.indexOf(_id) > -1) {
        if (field === "argument") {
          field = "argument,transcription"
        } else {
          field = "transcription"
        }
      }
      inlined[parseInt(_id)] = field
    }
    console.log('@@saving inlined placenames:', inlined);
        
    // s'il y a des matches
    // ajout / mise à jour / suppression
    if (IdsInTranscription.length > 0 || IdsInArgument.length > 0) {
      await this.dispatch('placenames/updateInlinedRole', {inlined})
    }
    let placenamesHavingRoles = await http.get(`/documents/${rootState.document.document.id}/placenames-having-roles`);
    let inlinedRole = rootState.placenames.roles.find(r => r.label === 'inlined')
    placenamesHavingRoles.data.data.forEach(async phr => {
        console.log(`looking if phr ${phr.id} is still in `)
        if (!inlined[phr.relationships.placename.data.id] && phr.relationships['placename-role'].data.id === inlinedRole.id) {
            console.log(`phr ${phr.id} no longer exists in inlined data (argument, transcription), so delete it`)
            await http.delete(`/placenames-having-roles/${phr.id}`)
        }
    })

    /* =========== find persons =========== */
    IdsInArgument = [...attrs.argument.matchAll(personRegexp)].map(m => parseInt(m[1]))
    IdsInTranscription = [...attrs.transcription.matchAll(personRegexp)].map(m => parseInt(m[1]))
    uniqIds = [... new Set(IdsInArgument.concat(IdsInTranscription))]
    inlined = {}
    
    for (let _id of uniqIds) {
      let field = ""
      if (IdsInArgument.indexOf(_id) > -1) {
        field = "argument"
      }
      if (IdsInTranscription.indexOf(_id) > -1) {
        if (field === "argument") {
          field = "argument,transcription"
        } else {
          field = "transcription"
        }
      }
      inlined[parseInt(_id)] = field
    }
    console.log('@@saving inlined persons:', inlined);
        
    // s'il y a des matches
    // ajout / mise à jour / suppression
    if (IdsInTranscription.length > 0 || IdsInArgument.length > 0) {
      await this.dispatch('persons/updateInlinedRole', {inlined})
    }

    let  personsHavingRoles = await http.get(`/documents/${rootState.document.document.id}/persons-having-roles`);
    inlinedRole = rootState.persons.roles.find(r => r.label === 'inlined')
    personsHavingRoles.data.data.forEach(async phr => {
        console.log(`looking if phr ${phr.id} is still in `)
        if (!inlined[phr.relationships.person.data.id] && phr.relationships['person-role'].data.id === inlinedRole.id) {
            console.log(`phr ${phr.id} no longer exists in inlined data (argument, transcription), so delete it`)
            await http.delete(`/persons-having-roles/${phr.id}`)
        }
    })

    // track changes
    if (state.document.id !== dummy.data.id) {
      let msg = null;
      if (modifiedData) {
        msg = `Modification de ${Object.keys(modifiedData).map(
          d => `'${TRANSLATION_MAPPING[d] ? TRANSLATION_MAPPING[d] : d}'`
        ).join(', ')}`;
      }
      this.dispatch('changelog/trackChanges', {
        objId: state.document.id,
        objType: 'document',
        userId: rootState.user.current_user.id,
        msg: msg
      });
    } 

    return 
  },

  add({commit, rootState, state}) {
    const attributes = JSON.parse(JSON.stringify(state.document));
    delete(attributes.id);
    delete(attributes['iiif-collection-url']);
    delete(attributes['iiif-thumbnail-url']);
    const newDocument = {
      data: {
        type : 'document',
        attributes: {
          ...attributes
        },
        relationships: {
          collections: {
            data: state.collections.map(c => {return {id: c.id, type: 'collection'}})
          }
        }
      }
    };

    console.warn('posting', newDocument);
    const http = http_with_auth(rootState.user.jwt);

    return http.post(`/documents`, newDocument)
        .then(response => {
          commit('UPDATE_DOCUMENT_DATA', response.data.data);
          return response.data.data
        })
  },

  publish({commit, state}, docId) {
    return this.dispatch('document/save', {
        type: 'document',
        id: docId,
        attributes: {
          'is-published' : true
        }
    });
  },

  unpublish({commit, state}, docId) {
    return this.dispatch('document/save', {
        type: 'document',
        id: docId,
        attributes: {
          'is-published': false
        }
    });
  },
  fetchWitnessInstitution ({ commit, rootState }, witnessId) {
    const http = http_with_auth(rootState.user.jwt);

    return http.get(`/witnesses/${witnessId}?include=institution`).then( response => {
      const institution = getInstitution(response.data.included)
      if (institution.id === null) return null;
      commit('UPDATE_WITNESS_INSTITUTION', { witnessId, institution })
      return institution;
    });
  },
  removeWitnessInstitution({commit, rootState}, witnessId) {
    const http = http_with_auth(rootState.user.jwt);

    return http.patch(`/witnesses/${witnessId}/relationships/institution`, {data: null});
  },
  async addWitness ({commit, rootState, state}, witness) {
    const http = http_with_auth(rootState.user.jwt);

    witness.num = Math.max.apply(null, state.witnesses.map(w => w.num)) + 1; //TODO server side

    const witnessData = { ...witness }; //TODO probably useless if the incoming variable is expandable
    removeContentEditableAttributesFromObject(witnessData) //TODO utile?
    const institutionId = witness.institution ? witness.institution.id : null;
    delete(witnessData.id);
    delete(witnessData.institution);

    if (witnessData['classification-mark']) {
      witnessData.classification_mark = witnessData['classification-mark']
      delete(witnessData['classification-mark'])
    }

    const relationships = {
      document: {
        data: {
          id: state.document.id,
          type: "document"
        }
      }
    }
    if (institutionId) {
      relationships.institution = {
        data: {
          id: institutionId,
          type: "institution"
        }
      }
    }

    if (witness.images) {
      /* first we create all the new images */
      const imagesData = witness.images.map((i, index) => {
        return {
          attributes: {'canvas-id': i, 'order-num': index+1},
          type: 'image'  
        }
      })
  
      let imagesPromises = imagesData.map(data => http.post(`/images?without-relationships`, {data}))
      const imagesCreated = await Promise.all(imagesPromises)

      relationships.images = {
        data: imagesCreated.map(r => {return {id: r.data.data.id, type: 'image'}})    
      }

      delete(witnessData.images);
    }

    const data = {
        type: "witness",
        attributes: witnessData,
        relationships
    };


    return http.post(`/witnesses?without-relationships`, {data})
      .then(response => {
        witness.id = response.data.data.id;
        commit('ADD_WITNESS', witness);
      })
  },
  async updateWitness ({commit, rootState, state}, witness) {

    console.log("update witness", witness)
    const http = http_with_auth(rootState.user.jwt);

    const attributes = {...witness}
    removeContentEditableAttributesFromObject(attributes)
    const institutionId = witness.institution ? witness.institution.id : null;
    delete (attributes.id)
    delete (attributes.institution)
    delete (attributes['manifest-url'])

    if (attributes['classification-mark']) {
      attributes.classification_mark = attributes['classification-mark']
      delete (attributes['classification-mark'])
    }

    const relationships = {
      document: {
        data: {
          id: state.document.id,
          type: "document"
        }
      }
    }
    if (institutionId) {
      relationships.institution = {
        data: {
          id: institutionId,
          type: "institution"
        }
      }
    }

    if (witness.images) {
      const imagesData = witness.images.map((i, index) => {
        return {
          attributes: {'canvas-id': i, 'order-num': index+1},
          type: 'image'  
        }
      })
  
      let imagesPromises = imagesData.map(data => http.post(`/images?without-relationships`, {data}))
      const imagesCreated = await Promise.all(imagesPromises)

      relationships.images = {
        data: imagesCreated.map(r => {return {id: r.data.data.id, type: 'image'}})    
      }

      delete(attributes.images);
    }

    const data = {
        id : witness.id,
        type: "witness",
        attributes: attributes,
        relationships
    }

    return http.patch(`witnesses/${witness.id}?without-relationships`, {data})
      .then(response => {
        commit('UPDATE_WITNESS', witness);
      })
  },
  removeWitness ({commit, rootState, state}, witness) {
    const http = http_with_auth(rootState.user.jwt);

    const data = { data: { id : witness.id, type: "witness" } }
    console.log('document store removeWitness', data, state.document.id)

    return http.delete(`/witnesses/${witness.id}`, {data})
      .then(response => {
        console.log('response', response)
        commit('REMOVE_WITNESS', witness.id);
      })
  },
  reorderWitnesses ({commit, rootState}, { witnesses }) {
    const http = http_with_auth(rootState.user.jwt);
    Promise.all(witnesses.map(w => {
      return http.patch(`/witnesses/${w.id}`, { data: {
        type: "witness",
        id: w.id,
        attributes: { num: w.num }
      }})
    })).then(() => {
      commit('REORDER_WITNESSES', witnesses)
    })
  },

  addPerson ({commit}, person) {
    commit('ADD_PERSON', person)
  },
  removePerson ({commit}, relationId) {
    commit('REMOVE_PERSON', relationId)
  },

  addPlacename({commit}, placename) {
    commit('ADD_PLACENAME', placename)
  },
  removePlacename({commit}, relationId) {
    commit('REMOVE_PLACENAME', relationId)
  },
  setIsLoading({commit}) {
    commit('LOADING_STATUS', true);
  },
  unsetIsLoading({commit}) {
    commit('LOADING_STATUS', false);
  },
  addCollection ({commit, rootState, state}, collection) {

    const data = { data: [ { id : collection.id, type: "collection" }, ] }

    const http = http_with_auth(rootState.user.jwt);
    return http.post(`/documents/${state.document.id}/relationships/collections?without-relationships`, data)
      .then(response => {
        commit('ADD_COLLECTION', collection);
        return true
      })
  },
  removeCollection ({commit, state, rootState}, collection) {
    const data = { data: { id : collection.id, type: "collection" } };

    const http = http_with_auth(rootState.user.jwt);
    return http.delete(`/documents/${state.document.id}/relationships/collections?without-relationships`, {data})
      .then(response => {
        commit('REMOVE_COLLECTION', collection);
        return true
      })
  },

  addNote ({commit, state, rootState}, note) {
    console.log('store updateNote', note)
    const data = {
      type: 'note',
      attributes: { content: note.content },
      relationships: {
        document: {
          data : [{ type: 'document', id: state.document.id }]
        }
      }
    }
    
    const http = http_with_auth(rootState.user.jwt);
    return http.post(`notes?without-relationships`, {data})
      .then(response => {
        console.log('response', response.data)
        note.id = response.data.data.id
        commit('ADD_NOTE', note);
        return note;
      })
  },
  updateNote ({commit, state, rootState}, note) {
    console.log('store updateNote', note)
    const data = {
      id: note.id,
      type: 'note',
      attributes: { content: note.content }
    }
    
    const http = http_with_auth(rootState.user.jwt);
    return http.patch(`notes/${note.id}?without-relationships`, {data})
      .then(response => {
        console.log('response', note.content)
        commit('UPDATE_NOTE', note);
        return note;
      })
  },
  removeNote ({commit, state, rootState}, noteId) {

    const http = http_with_auth(rootState.user.jwt);
    return http.delete(`notes/${noteId}?without-relationships`)
      .then(response => {
        console.log('response', response)
        commit('REMOVE_NOTE', noteId);
        return noteId;
      })
  },

  initializeDummyDocument({commit, state, rootState}, defaultData) {
    const collId = defaultData.relationships.collections.data[0].id;
    
    const http = http_with_auth(rootState.user.jwt);
    return http.get(`collections/${collId}`).then(r => {
      const collection = r.data.data;
      const dummy = makeDummyDocument(defaultData);
      commit('UPDATE_DOCUMENT', {data: dummy.data, included: [collection]});
    });
  }

};

const getters = {

  documentSender (state) {
    return state.persons ? state.persons.filter( corr => {
      if (!corr.role) return false;
      return corr.role.label === 'sender'
    }) : false
  },
  documentRecipients (state) {
    return state.persons ? state.persons.filter( corr => {
      if (!corr.role) return false;
      return corr.role.label === 'recipient'
    }) : false
  },

  locationDateFrom(state) {
    return state.placenames ? state.placenames.filter(corr => {
      if (!corr.role) return false;
      console.warn(corr.role.label);
      return corr.role.label === 'location-date-from'
    }) : false
  },
  locationDateTo(state) {
    return state.placenames ? state.placenames.filter(corr => {
      if (!corr.role) return false;
      return corr.role.label === 'location-date-to'
    }) : false
  },
  getDummyDocument: (state) => (data) => {
    // this dummy document is used as a base when creating a new document
    return makeDummyDocument(data);
  },
  getDocumentStatus: (state, getters, rootState, rootGetters) => async (id) => {
    const incs = [
      'current-lock'
    ];

    const http = http_with_auth(rootState.user.jwt);

    const response = await http.get(`documents/${id}?include=${incs.join(',')}&without-relationships&facade=status`)
    const {data, included} = response.data

    const isBookmarked = await http.get(`/users/${rootState.user.current_user.id}/relationships/bookmarks`).then(
      response => response.data.data.filter(d => d.id === id).length > 0
    )

    let status = {
      id,
      isPublished: data.attributes['is-published'],
      isBookmarked,
      currentLock: getCurrentLock(included)
    }

    return status;
  }
};

const documentModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default documentModule;
