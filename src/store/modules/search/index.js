import {debounce} from 'lodash';
import {http_with_auth} from "@/modules/http-common";
import {cloneDeep} from 'lodash';
import store from "@/store";


const creationDateTemplate = {
  year: '', 
  month: '',
  day: '',
  selection: {
    year: null,
    month: null,
    day: null
  }
}

const monthLabels = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
  'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
].map(m => m.toLowerCase())

function getNextMonthLabel(month) {
  let next = monthLabels.indexOf(month.toLowerCase()) + 1
  if (next >= monthLabels.length) {
    next = 1
  }
  console.log("get next month label", month, monthLabels[next])
  return monthLabels[next]
}

function getMonthNumber(month) {
  const idx =  monthLabels.indexOf(month.toLowerCase())
  if (idx === -1) {
    throw new Error('bad month label:', month)
  }
  return (idx + 1).toString().padStart(2, '0')
}

function formatDate(year, month, day) {
  /* 
    handling the following date formats:
    yyyy, yyyy-MM and yyyy-MM-dd
  */

  if (!year) {
    throw new Error(`Cannot format the date because the year is null: ${year, month, day}`)
  }

  let formatted = ''
  
  if (month) {
    const monthNum = getMonthNumber(month)
    formatted = `${year.toString()}-${monthNum}`
    if (day) {
      formatted = `${formatted}-${day.toString()}`
    }
  } else {
    day = day > 31 ? 1 : day
    if (day) {
      throw new Error(`Cannot format the date because the month is null: ${year, month, day}`)
    }
    formatted = year.toString()
  }
  console.log('formatted', formatted)
  return formatted
}
const replaceAllObjKeys = (obj, getNewKey) => {

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      replaceAllObjKeys(obj[i], getNewKey);
    }
  }
  else if (typeof obj === "object") {
    for (const key in obj) {
      const newKey = getNewKey(key);
      obj[newKey] = obj[key];
      if (key !== newKey) {
        delete obj[key];
      }
      replaceAllObjKeys(obj[newKey], getNewKey);
    }
  }

  return obj;
};
function sortMethodAsc(a, b) {
    return a == b ? 0 : a > b ? 1 : -1;
}

function sortMethodWithDirection(direction) {
    if (direction === undefined || direction == "asc") {
        return sortMethodAsc;
    } else {
        return function(a, b) {
            return -sortMethodAsc(a, b);
        }
    }
}

function sortMethodWithDirectionByColumn(columnName, direction){
    const sortMethod = sortMethodWithDirection(direction)
    return function(a, b){
        if (columnName === 'sender' || columnName === 'recipients') {
            return sortMethod(a[columnName][0].label, b[columnName][0].label);
        } else {
            return sortMethod(a[columnName], b[columnName]);
        }
    }
}
function sortMethodWithDirectionMultiColumn(sortArray) {
    //sample of sortArray
    // sortArray = [
    //     { column: "column5", direction: "asc" },
    //     { column: "column3", direction: "desc" }
    // ]
    console.log("sortArray", sortArray)
    const sortMethodsForColumn = (sortArray || []).map( item => sortMethodWithDirectionByColumn(item.field, item.order) );
    return function(a,b) {
        let sorted = 0;
        let index = 0;
        while (sorted === 0 && index < sortMethodsForColumn.length) {
            sorted = sortMethodsForColumn[index++](a,b);
        }
        return sorted;
    }
}


/* Replaced by function replaceAllObjKeys
const toCamel = (str) => {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.replace('-', '_')
  });
};

const isObject = function (obj) {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';
};

const keysToCamel = function (obj) {
  if (isObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => {
      return keysToCamel(i);
    });
  }

  return obj;
};*/
const state = {

  searchTerm: null,
  searchType: null,

  sorts: [{field: 'creation', order: 'asc'}],
  //sorts: [{field: '', order: 'asc'}],

  creationDateFrom: {
    ...cloneDeep(creationDateTemplate),
    //year:'1577', 
    //selection: {
    //  ...creationDateTemplate.selection,
      //year: '1577'
    //}
  },
  creationDateTo: cloneDeep(creationDateTemplate),

  withStatus: false,
  withDateRange: false,

  selectedCollections: [],
  selectedPlaceFrom: [],
  selectedPlaceTo: [],
  selectedPlaceCited: [],
  selectedPersonFrom: [],
  selectedPersonTo: [],
  selectedPersonCited: [],
  currentFilters: '',
  currentQuery: '',
  numPage: 1,
  pageSize: 30,

  loadingStatus: false,
  errorStatus: false,
  documents: [],
  included: [],
  totalCount: 0,
  links: [],
  documents_total: null,
  firstDocId: null,
  lastDocId : null,
  docIdList : []


};

const initial_State = {

  searchTerm: null,
  searchType: null,

  sorts: [{field: 'creation', order: 'asc'}],
  //sorts: [{field: '', order: 'asc'}],

  creationDateFrom: {
    ...cloneDeep(creationDateTemplate),
    //year:'1577',
    //selection: {
    //  ...creationDateTemplate.selection,
      //year: '1577'
    //}
  },
  creationDateTo: {...cloneDeep(creationDateTemplate)},

  withStatus: false,
  withDateRange: false,

  selectedCollections: [],
  selectedPlaceFrom: [],
  selectedPlaceTo: [],
  selectedPlaceCited: [],
  selectedPersonFrom: [],
  selectedPersonTo: [],
  selectedPersonCited: [],
  currentFilters: '',
  currentQuery: '',
  numPage: 1,
  pageSize: 30,

  loadingStatus: false,
  errorStatus: false,
  documents: [],
  included: [],
  totalCount: 0,
  links: [],
  documents_total: null,
  firstDocId: null,
  lastDocId : null,
  docIdList : []

};

const mutations = {
  RESET_SEARCH_STATE(state, initial_State) {
    Object.assign(state, initial_State);
    console.log('RESET_SEARCH_STATE', initial_State)
  },

  SET_SEARCH_SCOPE(state, scope) {
    state.documents_total = scope.documentsTotal,
    state.firstDocId = scope.firstDocId,
    state.lastDocId = scope.lastDocId,
    state.docIdList = scope.docIdList
  },
  SET_SEARCH_TYPE(state, type) {
    state.searchType = type;
  },

  SET_SEARCH_TERM(state, term) {
    state.searchTerm = term;
  },
  SET_NUM_PAGE(state, num) {
    state.numPage = num;
  },
  SET_PAGE_SIZE(state, size) {
    state.pageSize = size;
  },
  SET_SORTS(state, sorts) {
    state.sorts = sorts;
  },
  SET_WITH_DATE_RANGE(state, b) {
    state.withDateRange = b;
  },
  SET_WITH_STATUS(state, b) {
    state.withStatus = b;
  },
  SET_CREATION_DATE_FROM(state, from) {
    state.creationDateFrom = Object.assign({}, state.creationDateFrom, from)
  },
  SET_CREATION_DATE_TO(state, to) {
    console.log('SET_CREATION_DATE_TO', to)
    state.creationDateTo = Object.assign({}, state.creationDateTo, to)
    console.log('state.creationDateTo', to)
  },
  SET_LOADING_STATUS(state, s) {
    state.loadingStatus = s;
  },
  SET_ERROR_STATUS(state, s) {
    state.errorStatus = s;
  },
  SET_SELECTED_COLLECTIONS(state, colls) {
    state.selectedCollections = colls;
  },
  SET_SELECTED_PLACE_FROM(state, placeFrom) {
    state.selectedPlaceFrom = placeFrom;
  },
  SET_SELECTED_PLACE_TO(state, placeTo) {
    state.selectedPlaceTo = placeTo;
  },
  SET_SELECTED_PLACE_CITED(state, placeCited) {
    state.selectedPlaceCited = placeCited;
  },
  SET_SELECTED_PERSON_FROM(state, personFrom) {
    state.selectedPersonFrom = personFrom;
  },
  SET_SELECTED_PERSON_TO(state, personTo) {
    state.selectedPersonTo = personTo;
  },
  SET_SELECTED_PERSON_CITED(state, personCited) {
    state.selectedPersonCited = personCited;
  },
  CURRENT_SEARCH_FILTERS(state, filters) {
    state.currentFilters = filters;
  },
  CURRENT_SEARCH_QUERY(state, query) {
    state.currentQuery = query;
  },
  UPDATE_ALL (state, {documents, totalCount, links, included}) {
    state.documents = documents;
    state.included = included
    state.links = links;
    state.totalCount = totalCount;
  },
  RESET_ALL (state) {
    state.documents = [];
    state.included = []
    state.links = [];
    state.totalCount = 0;
  },

};

const actions = {
  resetSearchState({commit}) {
    commit('RESET_SEARCH_STATE', initial_State);
  },
  setSearchScope({commit}, scope) {
    commit('SET_SEARCH_SCOPE', scope);
  },
  setSearchType({commit}, type) {
    commit('SET_SEARCH_TYPE', type);
  },

  setSearchTerm({commit}, term) {
    commit('SET_SEARCH_TERM', term);
  },
  clearSearchTerm({commit}) {
    commit('SET_SEARCH_TERM', null)
  },
  setNumPage({commit}, num) {
    commit('SET_NUM_PAGE', num)
  },
  setPageSize({commit}, size) {
    commit('SET_PAGE_SIZE', size)
  },
  setSorts({commit}, sorting) {
    commit('SET_NUM_PAGE', 1)
    commit('SET_SORTS', sorting)
  },
  setWithStatus({commit}, status) {
    commit('SET_WITH_STATUS', status)
  },
  setWithDateRange({commit}, status) {
    commit('SET_WITH_DATE_RANGE', status)
    commit('SET_NUM_PAGE', 1)
  },
  setCreationDateFrom({commit}, from) {
    commit('SET_CREATION_DATE_FROM', from)
    commit('SET_NUM_PAGE', 1)
  },
  setCreationDateTo({commit}, to) {
    commit('SET_CREATION_DATE_TO', to)
    commit('SET_NUM_PAGE', 1)
  },
  setSelectedCollections({commit}, colls) {
    commit('SET_SELECTED_COLLECTIONS', colls)
    commit('SET_NUM_PAGE', 1)
  },
  setSelectedPlaceFrom({commit}, placeFrom) {
    commit('SET_SELECTED_PLACE_FROM', placeFrom)
    commit('SET_NUM_PAGE', 1)
    console.log('SET_SELECTED_PLACE_FROM', placeFrom)
  },
  setSelectedPlaceTo({commit}, placeTo) {
    commit('SET_SELECTED_PLACE_TO', placeTo)
    commit('SET_NUM_PAGE', 1)
    console.log('SET_SELECTED_PLACE_TO', placeTo)
  },
  setSelectedPlaceCited({commit}, placeCited) {
    commit('SET_SELECTED_PLACE_CITED', placeCited)
    commit('SET_NUM_PAGE', 1)
    console.log('SET_SELECTED_PLACE_CITED', placeCited)
  },
  setSelectedPersonFrom({commit}, personFrom) {
    commit('SET_SELECTED_PERSON_FROM', personFrom)
    commit('SET_NUM_PAGE', 1)
    console.log('SET_SELECTED_PERSON_FROM', personFrom)
  },
  setSelectedPersonTo({commit}, personTo) {
    commit('SET_SELECTED_PERSON_TO', personTo)
    commit('SET_NUM_PAGE', 1)
    console.log('SET_SELECTED_PERSON_TO', personTo)
  },
  setSelectedPersonCited({commit}, personCited) {
    commit('SET_SELECTED_PERSON_CITED', personCited)
    commit('SET_NUM_PAGE', 1)
    console.log('SET_SELECTED_PERSON_CITED', personCited)
  },
  async getCounts({rootState}){
    const http = http_with_auth(rootState.user.jwt);
    let url = '/count';
    if (!rootState.user.current_user){
      url += "?published=true";
    }
    const response = await http.get(url);
    return response["data"];
  },
  async getDocumentsTotal ({commit, rootState}) {
    const http = http_with_auth(rootState.user.jwt);
    const response = await http.get(`/all-documents`);
    let docIdList = response.data.data;
    if (!rootState.user.current_user){
      docIdList = docIdList.filter(d => d.is_published === true)
    }
    let documentsTotal = docIdList.length;
    let lastDocId = docIdList[docIdList.length - 1].id
    let firstDocId = docIdList[0].id
    commit('SET_SEARCH_SCOPE', {documentsTotal: documentsTotal, firstDocId: firstDocId, lastDocId: lastDocId, docIdList: docIdList});
    return {documentsTotal: documentsTotal, firstDocId: firstDocId, lastDocId: lastDocId, docIdList: docIdList};
  },
  performSearch: debounce(async ({commit, state, rootState}, type) => {
    commit('SET_LOADING_STATUS', true);
    commit('SET_ERROR_STATUS', false);

    /* =========== filters =========== */
    let query ='';
    let highlights = false;
    let published = '';
    let searchType = 'paratext';


    /*if (state.selectedCollections && state.selectedCollections.length > 1) {
      let selectedCollectionsIds = state.selectedCollections.map((coll) => coll.id);
      console.log("selectedCollectionsIds", selectedCollectionsIds)
      let selectedCollectionsWithChildren = store.getters["collections/flattenedCollectionsTree"](selectedCollectionsIds);
      console.log("selectedCollectionsWithChildren", selectedCollectionsWithChildren)

      query = '' + '(' + selectedCollectionsWithChildren.map(c => `(collections.id:${c.id})`).join(' OR ') + ')';
    } else {
      let selectedCollectionsIds = state.selectedCollections.map((coll) => coll.id);
      console.log("selectedCollectionsIds", selectedCollectionsIds);
      let selectedCollectionsWithChildren = store.getters["collections/flattenedCollectionsTree"](selectedCollectionsIds);
      console.log("selectedCollectionsWithChildren", selectedCollectionsWithChildren)

      if (selectedCollectionsWithChildren && selectedCollectionsWithChildren.length > 1) {
        query = '' + '(' + selectedCollectionsWithChildren.map(c => `(collections.id:${c.id})`).join(' OR ') + ')'
      } else {
        query = '' + selectedCollectionsWithChildren.map(c => `(collections.id:${c.id})`).join(' OR ');
      }
      console.log('collection query', query);
    }*/
    //new
    let collectionsSelectedFacets = [];
    if (state.selectedCollections.length > 0) {
      console.log('selectedCollections', state.selectedCollections);
      let selectedCollectionsIds = state.selectedCollections.map((coll) => coll.id);
      console.log("selectedCollectionsIds", selectedCollectionsIds);
      let selectedCollectionsWithChildren = store.getters["collections/flattenedCollectionsTree"](selectedCollectionsIds);
      console.log("selectedCollectionsWithChildren", selectedCollectionsWithChildren)
      state.selectedCollections.forEach((coll) => {
        let selectedLabel = coll.title // replace by id
        collectionsSelectedFacets.push(selectedLabel)
      })
      selectedCollectionsWithChildren.forEach((coll) => {
        let selectedLabel = coll.title // replace by id
        collectionsSelectedFacets.push(selectedLabel)
      })
      collectionsSelectedFacets = [...new Set(collectionsSelectedFacets)]
      console.log('query with collectionsSelectedFacets', collectionsSelectedFacets);
    } else {
      console.log('query without selectedCollections')
    }
    // remove and use directly collectionsSelectedFacets in url build below as for other facets
    let collectionsFacets = {"collections": collectionsSelectedFacets.length > 0 ? collectionsSelectedFacets : ''}



    if (state.searchTerm && state.searchTerm.length > 0 && state.searchType === 'isFullTextSearch') {
      //highlights = true
      searchType = 'fulltext'
      if (query.length === 0) {
        query = `(${state.searchTerm})`
      } else {
        query = `(${query} AND (${state.searchTerm})`
      }
    } else if (state.searchTerm && state.searchTerm.length > 0 && state.searchType === 'isParatextSearch') {
      //highlights = false;
      if (query.length === 0) {
        query = `(${state.searchTerm})`
      } else {
        query = `(${query} AND (${state.searchTerm}))`
      }
    }


    /*if (!query || query.length === 0) {
      query = '*'
    }*/

    //old
    let place_query_from='';
    //new
    let placesFromSelectedFacets = [];

    if (state.selectedPlaceFrom.length > 0) {
      console.log('selectedPlaceFrom', state.selectedPlaceFrom);
      /*old
      place_query_from = 'location_dates_from.label:(' + state.selectedPlaceFrom.map(c => `${c.label}`).join(' || ') + ')';
      //query = '(' + query + ' AND (location-date-from.id:(' + state.selectedPlaceFrom.map(c => `${c.placename_id}`).join(' || ') + ')))';
      console.log('query with selectedPlaceFrom', place_query_from)
      */

      //new
      state.selectedPlaceFrom.forEach((origin) => {
        placesFromSelectedFacets.push(`${origin.placename_id}###${origin.label}`)
      })
      console.log('query with placesFromSelectedFacets', placesFromSelectedFacets);
    } else {
      console.log('query without selectedPlaceFrom')
    }
    //old
    let place_query_to = '';
    //new
    let placesToSelectedFacets = [];

    if (state.selectedPlaceTo.length > 0) {
      console.log('selectedPlaceTo', state.selectedPlaceTo);
      /*old
      place_query_to = 'location_dates_to.label:(' + state.selectedPlaceTo.map(c => `${c.label}`).join(' || ') + ')';
      //query = '(' + query + ' AND (' + state.selectedPlaceTo.map(c => `location-date-to.id:${c.placename_id}`).join(' OR ') + '))';
      console.log('query with selectedPlaceTo', place_query_to)
      */

      //new
      state.selectedPlaceTo.forEach((destination) => {
        placesToSelectedFacets.push(`${destination.placename_id}###${destination.label}`)
      })
      console.log('query with placesToSelectedFacets', placesToSelectedFacets);
    } else {
      console.log('query without selectedPlaceTo')
    }
    //old
    let place_query_cited = '';
    //new
    let placesCitedSelectedFacets = [];

    if (state.selectedPlaceCited.length > 0) {
      console.log('selectedPlaceCited', state.selectedPlaceCited);
      /*old
      place_query_cited =  'locations_inlined.label:(' + state.selectedPlaceCited.map(c => `${c.label}`).join(' || ') + ')';
      //query = '(' + query + ' AND (' + state.selectedPlaceCited.map(c => `location-inlined.id:${c.placename_id}`).join(' OR ') + '))';
      console.log('query with selectedPlaceCited', place_query_cited)
      */

      //new
      state.selectedPlaceCited.forEach((cited) => {
        placesCitedSelectedFacets.push(`${cited.placename_id}###${cited.label}`)
      })
      console.log('query with placesCitedSelectedFacets', placesCitedSelectedFacets);
    } else {
      console.log('query without selectedPlaceCited')
    }
    // combine places criteriae :
    /*old
    let place_query = ''
    if (place_query_from.length > 0 || place_query_to.length > 0 || place_query_cited.length > 0) {
      place_query = [place_query_from, place_query_to, place_query_cited].filter(Boolean).join(' AND ');
    }
    */
    /*new 2023 11 09: replaced directly in URL construct further below
    let placesFacets = {location_dates_from: placesFromSelectedFacets.length > 0 ? placesFromSelectedFacets : '',
                            location_dates_to: placesToSelectedFacets.length > 0 ? placesToSelectedFacets : '',
                            locations_inlined: placesCitedSelectedFacets.length > 0 ? placesCitedSelectedFacets : ''}*/

    //old
    let person_query_from = '';
    //new
    let personsFromSelectedFacets = [];
    if (state.selectedPersonFrom.length > 0) {
      console.log('selectedPersonFrom', state.selectedPersonFrom);
      /*old
      person_query_from = 'senders.label:(' + state.selectedPersonFrom.map(sender => `${sender.label}`).join(' || ') + ')';
      //query = '(' + query + ' AND (senders.id:(' + state.selectedPersonFrom.map(c => `${c.person_id}`).join(' || ') + '))';
      console.log('query with selectedPersonFrom', person_query_from);
      */

      //new
      state.selectedPersonFrom.forEach((sender) => {
        personsFromSelectedFacets.push(`${sender.person_id}###${sender.label}`)
      })
      console.log('query with personsFromSelectedFacets', personsFromSelectedFacets);
    } else {
      console.log('query without selectedPersonFrom')
    }
    //old
    let person_query_to= '';
    //new
    let personsToSelectedFacets = [];
    if (state.selectedPersonTo.length > 0) {
      console.log('selectedPersonTo', state.selectedPersonTo);
      /*old
      person_query_to = 'recipients.label:(' + state.selectedPersonTo.map(recipient => `${recipient.label}`).join(' || ') + ')';
      //query = '(' + query + ' AND (' + state.selectedPersonTo.map(c => `recipients.id:${c.person_id}`).join(' OR ') + '))';
      console.log('query with selectedPersonTo', person_query_to);
      */

      //new
      state.selectedPersonTo.forEach((recipient) => {
      personsToSelectedFacets.push(`${recipient.person_id}###${recipient.label}`)
      })
      console.log('query with personsToSelectedFacets', personsToSelectedFacets);
    } else {
      console.log('query without selectedPersonTo')
    }
    //old
    let person_query_cited = '';
    //new
    let personsCitedSelectedFacets = [];
    if (state.selectedPersonCited.length > 0) {
      console.log('selectedPersonCited', state.selectedPersonCited);
      /*old
      person_query_cited = 'persons_inlined.label:(' + state.selectedPersonCited.map(c => `${c.label}`).join(' || ') + ')';
      //query = '(' + query + ' AND (' + state.selectedPersonCited.map(c => `person-inlined.id:${c.person_id}`).join(' OR ') + '))';
      console.log('query with selectedPersonCited', person_query_cited);
      */

      //new
      state.selectedPersonCited.forEach((cited) => {
        personsCitedSelectedFacets.push(`${cited.person_id}###${cited.label}`)
      })
      console.log('query with personsCitedSelectedFacets', personsCitedSelectedFacets);
    } else {
      console.log('query without selectedPersonCited')
    }
    // combine persons criteriae :

    /* old
    let person_query = '';
    if (person_query_from.length > 0 || person_query_to.length > 0 || person_query_cited.length > 0) {
      person_query = [person_query_from, person_query_to, person_query_cited].filter(Boolean).join(' AND ');
    }*/

    /*new 2023 11 09: replaced directly in URL construct further below
    let personsFacets = {senders: personsFromSelectedFacets.length > 0 ? personsFromSelectedFacets : '',
                            recipients: personsToSelectedFacets.length > 0 ? personsToSelectedFacets : '',
                            persons_inlined: personsCitedSelectedFacets.length > 0 ? personsCitedSelectedFacets : ''}*/

    // combine query, places and persons criteriae :
    /*old
    if (place_query.length > 0 || person_query.length > 0) {
          query = query + ' AND (' + [place_query, person_query].filter(Boolean).join(' AND ')+ ')';
    }
    */

    if (!rootState.user.current_user){
      published = true
      //query = `${query} AND (is-published:true)`
    }

    /* =========== sorts ===========*/
    let sorts = state.sorts.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`)
    //sorts = sorts.length ? sorts.join(',') : 'creation'
    if (sorts.length === 1 && sorts[0] === 'score') {
      sorts = ''
    } else if (sorts.length > 1 && sorts.some(s => s === 'score')) {
      sorts = sorts.filter(s => s !== 'score')
      sorts = sorts.join(',')
    } else {
      sorts = sorts.length ? sorts.join(',') : ''
    }

    /* =========== date ranges ===========*/
    const cdf = state.creationDateFrom.selection
    //console.log('cdf', cdf)
    const cdt = state.creationDateTo.selection
    //console.log('cdto', cdt)
    let cdfFormatted = null
    let cdtFormatted = null
    //console.log('state.creationDateFrom, state.creationDateTo',state.creationDateFrom, state.creationDateTo)

    try {
      cdfFormatted = formatDate(cdf.year, cdf.month, cdf.day)
      //console.log('cdfFormatted', cdfFormatted)
    } catch (ecdf) {
      cdfFormatted = null
      //console.log('ecdf', ecdf)
    }
    try {
      cdtFormatted = formatDate(cdt.year, cdt.month, cdt.day)
      //console.log('cdto Formatted', cdtFormatted)
    } catch (ecdt) {
      cdtFormatted = null
      //console.log('ecdt', ecdt)
    }

    let creationDateRange = '';

    try {
      if (cdfFormatted) {
        if (/*state.withDateRange && */cdtFormatted) {
          // between from and to
          //console.log('between from and to')
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
          creationDateRange = `&range[creation_range]=gte:${cdfFormatted},${upperOp}:${upperBound}`
        } else {
          // single date (from)
          //console.log('single date (from)')
          let upperBound = cdfFormatted
          /*let upperOp = 'lt'
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
          }*/
          //creationDateRange = `&range[creation]=gte:${cdfFormatted},${upperOp}:${upperBound}`
          creationDateRange = `&range[creation_range]=gte:${cdfFormatted}`
        }
      } else {
        if (cdtFormatted) {
          // single date (to)
          //console.log('single date (to)')
          let upperBound = cdtFormatted
          let upperOp = 'lt'
          if (cdf.month === null) {
            // search a single and whole year
            // between 1577 and 1578
            upperBound = formatDate(parseInt(cdt.year) + 1, cdt.month, cdt.day)
          }/* else if (cdf.day === null) {
            // between 1577-01 and 1577-02
            upperBound = formatDate(cdf.year, getNextMonthLabel(cdf.month), cdf.day)
          } else {
            // a single day: 1577-11-10
            upperOp = 'lte'
          }*/
          //creationDateRange = `&range[creation]=gte:${cdfFormatted},${upperOp}:${upperBound}`
          creationDateRange = `&range[creation_range]=${upperOp}:${upperBound}`
        }
      }
    } catch (e) {
      console.log(e)
      creationDateRange = ''
    }
    
    let filters = `${creationDateRange}`
    if (type === 'simple') {
      filters = ''
    }

    /* =========== execution =========== */
    try {
      const toInclude = []; //2023-10-10 ['persons-having-roles', 'persons', 'placenames-having-roles', 'placenames'] //['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      const includes = toInclude.length ? `&include=${[toInclude].join(',')}` : '';
      
      const http = http_with_auth(rootState.user.jwt);

      let url = `/search?query=${query}&searchtype=${searchType}&highlight=${highlights}&page[size]=${state.pageSize}&page[number]=${state.numPage}&without-relationships`;
      if (published) {
        url += `&published=${published}`
      }
      if (collectionsFacets.collections.length > 0) { //(collectionsSelectedFacets.length > 0)
        url += `&collectionsfacets=${encodeURIComponent(JSON.stringify(collectionsFacets))}` // url += `&collectionsfacets=${JSON.stringify(collectionsSelectedFacets)}`
      }
      if (personsFromSelectedFacets.length > 0) {
        url += `&senders=${encodeURIComponent(personsFromSelectedFacets)}`
      }
      if (personsToSelectedFacets.length > 0) {
        url += `&recipients=${encodeURIComponent(JSON.stringify(personsToSelectedFacets))}`
      }
      if (personsCitedSelectedFacets.length > 0) {
        url += `&persons_inlined=${encodeURIComponent(JSON.stringify(personsCitedSelectedFacets))}`
      }
      if (placesFromSelectedFacets.length > 0) {
        url += `&location_dates_from=${encodeURIComponent(placesFromSelectedFacets)}`
      }
      if (placesToSelectedFacets.length > 0) {
        url += `&location_dates_to=${encodeURIComponent(JSON.stringify(placesToSelectedFacets))}`
      }
      if (placesCitedSelectedFacets.length > 0) {
        url += `&locations_inlined=${encodeURIComponent(JSON.stringify(placesCitedSelectedFacets))}`
      }
      if (filters.length > 0) {
        url += `${filters}`
      }
      if (includes.length > 0) {
        url += `${includes}`
      }
      if (sorts.length > 0) {
        url += `&sort=${sorts}`
      }
      const response = await http.get(url);
      //2023 11 09 const response = await http.get(`/search?query=${query}&published=${published}&collectionsfacets=${encodeURIComponent(JSON.stringify(collectionsFacets))}&placesfacets=${JSON.stringify(placesFacets)}&searchtype=${searchType}${filters}${includes}&sort=${sorts}&highlight=${highlights}&page[size]=${state.pageSize}&page[number]=${state.numPage}&without-relationships`);
      //const response = await http.get(`/search?query=${query}${filters}${includes}&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
      const {data, links, meta, included} = response.data
      /*const hyphensToUnderscore = (key) => key.replace("-", "_");
      console.log('hyphensToUnderscore : ', replaceAllObjKeys(cloneDeep(data), hyphensToUnderscore))
      const phr = [];*/
      let datawithPersons = []
      if (data.filter(
          function (d) {
            return Object.hasOwn(d, 'score');
          }
          ).length > 0) {
        datawithPersons = data.map(({
                                            id,
                                            score,
                                            attributes: {
                                              title,
                                              argument,
                                              creation,
                                              creation_not_after,
                                              creation_label,
                                              is_published,
                                              transcription,
                                              senders,
                                              recipients,
                                              location_dates_from,
                                              location_dates_to
                                            },
                                            relationships
                                          }) => ({
          id,
          score: parseFloat(score).toFixed(2),
          title,
          argument,
          creation,
          creation_not_after,
          creation_label,
          is_published,
          transcription,
          sender: senders.map(sender => {
            return {...sender, role: 1};
          }),
          recipients: recipients.map(recipient => {
            return {...recipient, role: 2};
          }),
          origin: location_dates_from.map(origin => {
            return {...origin, role: 1};
          }),
          destinations: location_dates_to.map(destination => {
            return {...destination, role: 2};
          })
        }));
      } else {
        datawithPersons = data.map(({
          id,
          attributes: {
            title,
            argument,
            creation,
            creation_not_after,
            creation_label,
            is_published,
            transcription,
            senders,
            recipients,
            location_dates_from,
            location_dates_to
          },
          relationships
        }) => ({
          id,
          title,
          argument,
          creation,
          creation_not_after,
          creation_label,
          is_published,
          transcription,
          sender: senders.map(sender => {
            return {...sender, role: 1};
          }),
          recipients: recipients.map(recipient => {
            return {...recipient, role: 2};
          }),
          origin: location_dates_from.map(origin => {
            return {...origin, role: 1};
          }),
          destinations: location_dates_to.map(destination => {
            return {...destination, role: 2};
          })
        }));
      }


      /*const datawithPersons = replaceAllObjKeys(cloneDeep(data), hyphensToUnderscore).map(({
        id,
        attributes: {title, argument, creation, creation_not_after, creation_label, is_published, transcription},
        relationships: {person_roles, persons, placename_roles, placenames}
      }) => ({
        id,
        title,
        argument,
        creation,
        creation_not_after,
        creation_label,
        is_published,
        transcription,
        sender: persons.data.map(function(item, index) {
          return {id: item.id, role: person_roles.data[index].id, label: included.find(p => p.id === item.id && p.type === "person").attributes.label}
        }).filter(s => s.role === 1),
        recipients: persons.data.map(function(item, index) {
          return {id: item.id, role: person_roles.data[index].id, label: included.find(p => p.id === item.id && p.type === "person").attributes.label}
        }).filter(s => s.role === 2),
        origin: placenames.data.map(function(item, index) {
          return {id: item.id, role: placename_roles.data[index].id}
        }).filter(o => o.role === 1),
        destinations: placenames.data.map(function (item, index) {
          return {id: item.id, role: placename_roles.data[index].id}
        }).filter(d => d.role === 2)
        /*admin: {
          username: included.find(({type, id: adminId}) => type === "user" && adminId === admin.data.id).attributes.username
        }*/
      /*}));*/
      console.log('datawithPersons', datawithPersons)

      if (type !== 'simple' && (query !== state.currentQuery || filters !== state.currentFilters))
      {
        // fetch collections associated with search criteriae :
        if (Object.keys(rootState.collections.collectionsById).length === 0) {
          console.log("loading collectionsById")
          await store.dispatch("collections/fetchAll").then(
              (response) => {
              }
          )
        }

        let CollectionsFacets = []
        response.data.buckets.collections.forEach((facet_coll) => {
          let CollectionFacet = Object.values(rootState.collections.collectionsById).filter(coll => (coll.title === facet_coll.key))[0]
          CollectionFacet.resultsCount = facet_coll.doc_count
          CollectionsFacets.push(CollectionFacet)
        })
        console.log("CollectionsFacets", CollectionsFacets);

        let CollectionsFacetsParents = []
        CollectionsFacets.forEach((facet_coll) => {
          let loop_coll = facet_coll
          while(loop_coll.parent !== null) {
            let CollectionFacetParent = Object.values(rootState.collections.collectionsById).filter(coll => (coll.id === loop_coll.parent))[0]
            CollectionsFacetsParents.push(CollectionFacetParent)
            loop_coll = CollectionFacetParent
          }
        })
        console.log("CollectionsFacetsParents", CollectionsFacetsParents);

        let collectionsTags = [...new Set([...CollectionsFacets ,...CollectionsFacetsParents])];
        console.log('collectionsTags', collectionsTags);

        /*
        const searchScopeCollections = await http.get(`/search?query=${query}&searchtype=${searchType}&facade=hierarchy&${filters}&groupby[doc-type]=collection&groupby[field]=collections.id`);
        let searchScopeCollectionsIds = searchScopeCollections.data.data.reduce((c, v) => c.concat(v), []).map(o => o.id);
        console.log("searchScopeCollectionsIds", searchScopeCollectionsIds);

        // fetch upward tree Ids for collections from relationships:
        const uniqueSearchScopeCollectionsParentsId = searchScopeCollections.data.data.flatMap(({relationships}) => relationships.parents.data.map(({id}) => id));
        console.log('uniqueSearchScopeCollectionsParentsId', uniqueSearchScopeCollectionsParentsId);
        let uniqueSearchScopeCollectionsIds = [...new Set([...searchScopeCollectionsIds ,...uniqueSearchScopeCollectionsParentsId])];
        console.log('uniqueSearchScopeCollectionsIds', uniqueSearchScopeCollectionsIds);
        */

        /* fetch upward tree Ids for collections from attributes if included in response (modified facade) :
        const uniqueSearchScopeCollectionsParentsId = searchScopeCollections.data.data.flatMap(({attributes}) => attributes.parents.map((id) => id));
        console.log('uniqueSearchScopeCollectionsParentsId', uniqueSearchScopeCollectionsParentsId);
        let uniqueSearchScopeCollectionsIds = [...new Set([...searchScopeCollectionsIds ,...uniqueSearchScopeCollectionsParentsId])];
        console.log('uniqueSearchScopeCollectionsIds', uniqueSearchScopeCollectionsIds);*/

        // fetch actual collections :
        /*let collectionsTags = Object.values(store.state.collections.collectionsById).filter(({id}) => uniqueSearchScopeCollectionsIds.includes(id));
        console.log('collectionsTags', collectionsTags);
        */

        // update state collections
        commit('collections/SET_COLLECTIONS_TAGS', collectionsTags, {root: true})

        // fetch persons associated with search criteriae :
        let PersonsFromFacets = response.data.buckets.senders.map((
            {key, doc_count}) =>
            ({
              role_id: 1,
              person_id: key.split("###")[0],
              count: doc_count,
              label: key.split("###")[1]
            })
        )
        console.log("PersonsFromFacets", PersonsFromFacets);

        let PersonsToFacets = response.data.buckets.recipients.map((
            {key, doc_count}) =>
            ({
              role_id: 2,
              person_id: key.split("###")[0],
              count: doc_count,
              label: key.split("###")[1]
            })
        )
        console.log("PersonsToFacets", PersonsToFacets);

        let PersonsCitFacets = response.data.buckets.persons_inlined.map((
            {key, doc_count}) =>
            ({
              role_id: 3,
              person_id: key.split("###")[0],
              count: doc_count,
              label: key.split("###")[1]
            })
        )
        console.log("PersonsCitFacets", PersonsCitFacets);

        /*const searchScopePersonsFrom = await http.get(`/search?query=${query}&searchtype=${searchType}${filters}&groupby[doc-type]=person&groupby[field]=senders.id&without-relationships`);
        const searchScopePersonsTo = await http.get(`/search?query=${query}&searchtype=${searchType}${filters}&groupby[doc-type]=person&groupby[field]=recipients.id&without-relationships`);
        const searchScopePersonsCit = await http.get(`/search?query=${query}&searchtype=${searchType}${filters}&groupby[doc-type]=person&groupby[field]=person-inlined.id&without-relationships`);
        console.log('searchScopePersonsFrom', searchScopePersonsFrom)
        let uniqueSearchScopePersonsFrom = searchScopePersonsFrom.data.data.map(({
                                                                                   id,
                                                                                   type,
                                                                                   attributes,
                                                                                   meta,
                                                                                   links
                                                                                 }) =>
            ({
              role_id: 1,
              person_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePersonsFrom', uniqueSearchScopePersonsFrom)

        let uniqueSearchScopePersonsTo = searchScopePersonsTo.data.data.map(({
                                                                               id,
                                                                               type,
                                                                               attributes,
                                                                               meta,
                                                                               links
                                                                             }) =>
            ({
              role_id: 2,
              person_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePersonsTo', uniqueSearchScopePersonsTo)

        let uniqueSearchScopePersonsCit = searchScopePersonsCit.data.data.map(({
                                                                                 id,
                                                                                 type,
                                                                                 attributes,
                                                                                 meta,
                                                                                 links
                                                                               }) =>
            ({
              role_id: 3,
              person_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePersonsCit', uniqueSearchScopePersonsCit)*/

        // update state persons
        const persons_roles = [
          {role_id: "Expéditeur", persons: PersonsFromFacets},
          {role_id: "Destinataire", persons: PersonsToFacets},
          {role_id: "Personne citée", persons: PersonsCitFacets}
        ]
        console.log('persons_roles : ', persons_roles)
        commit('persons/SET_PERSONS_ROLES', persons_roles, {root: true})

        let personsSuggestions = [...new Set([...PersonsFromFacets ,...PersonsToFacets, ...PersonsCitFacets])];
        personsSuggestions = personsSuggestions.sort(
            (person_x, person_y) => (person_x.count > person_y.count) ? -1 : 1)
        console.log("personsSuggestions", personsSuggestions);

        // fetch placenames associated with search criteriae :
        let PlacesFromFacets = response.data.buckets.location_dates_from.map((
            {key, doc_count}) =>
            ({
              role_id: 1,
              placename_id: key.split("###")[0],
              count: doc_count,
              label: key.split("###")[1]
            })
        )
        console.log("PlacesFromFacets", PlacesFromFacets);

        let PlacesToFacets = response.data.buckets.location_dates_to.map((
            {key, doc_count}) =>
            ({
              role_id: 2,
              placename_id: key.split("###")[0],
              count: doc_count,
              label: key.split("###")[1]
            })
        )
        console.log("PlacesToFacets", PlacesToFacets);

        let PlacesCitFacets = response.data.buckets.locations_inlined.map((
            {key, doc_count}) =>
            ({
              role_id: 3,
              placename_id: key.split("###")[0],
              count: doc_count,
              label: key.split("###")[1]
            })
        )
        console.log("PlacesCitFacets", PlacesCitFacets);


        /*const searchScopePlacesFrom = await http.get(`/search?query=${query}&searchtype=${searchType}${filters}&groupby[doc-type]=placename&groupby[field]=location-date-from.id&without-relationships`);
        const searchScopePlacesTo = await http.get(`/search?query=${query}&searchtype=${searchType}${filters}&groupby[doc-type]=placename&groupby[field]=location-date-to.id&without-relationships`);
        const searchScopePlacesCit = await http.get(`/search?query=${query}&searchtype=${searchType}${filters}&groupby[doc-type]=placename&groupby[field]=location-inlined.id&without-relationships`);
        console.log('searchScopePlacesFrom', searchScopePlacesFrom)
        let uniqueSearchScopePlacesFrom = searchScopePlacesFrom.data.data.map(({
                                                                                 id,
                                                                                 type,
                                                                                 label,
                                                                                 attributes,
                                                                                 meta,
                                                                                 links
                                                                               }) =>
            ({
              role_id: 1,
              placename_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePlacesFrom', uniqueSearchScopePlacesFrom)

        let uniqueSearchScopePlacesTo = searchScopePlacesTo.data.data.map(({
                                                                             id,
                                                                             type,
                                                                             label,
                                                                             attributes,
                                                                             meta,
                                                                             links
                                                                           }) =>
            ({
              role_id: 2,
              placename_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePlacesTo', uniqueSearchScopePlacesTo)

        let uniqueSearchScopePlacesCit = searchScopePlacesCit.data.data.map(({
                                                                               id,
                                                                               type,
                                                                               label,
                                                                               attributes,
                                                                               meta,
                                                                               links
                                                                             }) =>
            ({
              role_id: 3,
              placename_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePlacesCit', uniqueSearchScopePlacesCit)*/

        // update state placenames
        const places = [
          {role_id: "Lieu d'expédition", places: PlacesFromFacets},
          {role_id: "Lieu de destination", places: PlacesToFacets},
          {role_id: "Lieu mentionné", places: PlacesCitFacets}
        ]
        //console.log('places : ', places)
        commit('placenames/SET_ALL', places, {root: true})
      }

      /*if (included) {
        // find persons involved in search filter
        let searchScopePersons = included.filter(p => p.type === "person")
        console.log('searchScopePersons', searchScopePersons)

        // find persons' relationships (roles) involved in search filter
        let searchScopeRelationships = included.filter(rel => rel.type === "person-has-role")
        console.log('searchScopeRelationships', searchScopeRelationships)

        // Map persons data (name) within relationships type Sender
        let searchScopePersonsFrom = searchScopeRelationships.map(({
                                                                     id, // unused
                                                                     relationships
                                                                   }) => ({
          //rel_id: id,
          role_id: relationships['person-role'].data.id,
          person_id: relationships.person.data.id,
          label: searchScopePersons.find(p => p.id === relationships.person.data.id).attributes.label
        })).filter((p) => p.role_id === 1)
        //console.log('searchScopePersonsFrom', searchScopePersonsFrom)
        // dedupe
        let uniqueSearchScopePersonsFrom = [...new Map(searchScopePersonsFrom.map(item => [item.person_id, item])).values()]
        console.log('uniqueSearchScopePersonsFrom', uniqueSearchScopePersonsFrom)

        // Map persons data (name) within relationships type Recipient
        let searchScopePersonsTo = searchScopeRelationships.map(({
                                                                   id, // unused
                                                                   relationships
                                                                 }) => ({
          //rel_id: id,
          role_id: relationships['person-role'].data.id,
          person_id: relationships.person.data.id,
          label: searchScopePersons.find(p => p.id === relationships.person.data.id).attributes.label
        })).filter((p) => p.role_id === 2)
        //console.log('searchScopePersonsTo', searchScopePersonsTo)
        // dedupe
        let uniqueSearchScopePersonsTo = [...new Map(searchScopePersonsTo.map(item => [item.person_id, item])).values()]
        console.log('uniqueSearchScopePersonsTo', uniqueSearchScopePersonsTo)

        // Map persons data (name) within relationships type cited inline
        let searchScopePersonsCit = searchScopeRelationships.map(({
                                                                    id, // unused
                                                                    relationships
                                                                  }) => ({
          //rel_id: id,
          role_id: relationships['person-role'].data.id,
          person_id: relationships.person.data.id,
          label: searchScopePersons.find(p => p.id === relationships.person.data.id).attributes.label
        })).filter((p) => p.role_id === 3)
        //console.log('searchScopePersonsCit', searchScopePersonsCit)
        // dedupe
        let uniqueSearchScopePersonsCit = [...new Map(searchScopePersonsCit.map(item => [item.person_id, item])).values()]
        console.log('uniqueSearchScopePersonsCit', uniqueSearchScopePersonsCit)

        // update state persons
        const persons_roles = [
          {role_id: "Expéditeur", persons: uniqueSearchScopePersonsFrom},
          {role_id: "Destinataire", persons: uniqueSearchScopePersonsTo},
          {role_id: "Personne citée", persons: uniqueSearchScopePersonsCit}
        ]
        //console.log('persons_roles : ', persons_roles)
        if (included.length > 0) {
          commit('persons/SET_PERSONS_ROLES', persons_roles, {root: true})
        }


        // find places involved in search filter
        let searchScopePlaces = included.filter(p => p.type === "placename")
        console.log('searchScopePlaces', searchScopePlaces)

        // find places' relationships (roles) involved in search filter
        let searchScopePlacesRelationships = included.filter(rel => rel.type === "placename-has-role")
        console.log('searchScopePlacesRelationships', searchScopePlacesRelationships)

        // Map places data (name) within relationships type placeFrom
        let searchScopePlacesFrom = searchScopePlacesRelationships.map(({
                                                                          id, // unused
                                                                          relationships
                                                                        }) => ({
          //rel_id: id,
          role_id: relationships['placename-role'].data.id,
          placename_id: relationships.placename.data.id,
          label: searchScopePlaces.find(pl => pl.id === relationships.placename.data.id).attributes.label
        })).filter((p) => p.role_id === 1)
        //console.log('searchScopePlacesFrom', searchScopePlacesFrom)
        // dedupe
        let uniqueSearchScopePlacesFrom = [...new Map(searchScopePlacesFrom.map(item => [item.placename_id, item])).values()]
        console.log('uniqueSearchScopePlacesFrom', uniqueSearchScopePlacesFrom)

        // Map places data (name) within relationships type placeTo
        let searchScopePlacesTo = searchScopePlacesRelationships.map(({
                                                                        id, // unused
                                                                        relationships
                                                                      }) => ({
          //rel_id: id,
          role_id: relationships['placename-role'].data.id,
          placename_id: relationships.placename.data.id,
          label: searchScopePlaces.find(pl => pl.id === relationships.placename.data.id).attributes.label
        })).filter((p) => p.role_id === 2)
        //console.log('searchScopePlacesTo', searchScopePlacesTo)
        // dedupe
        let uniqueSearchScopePlacesTo = [...new Map(searchScopePlacesTo.map(item => [item.placename_id, item])).values()]
        console.log('uniqueSearchScopePlacesTo', uniqueSearchScopePlacesTo)

        // Map places data (name) within relationships type place cited inline
        let searchScopePlacesCit = searchScopePlacesRelationships.map(({
                                                                         id, // unused
                                                                         relationships
                                                                       }) => ({
          //rel_id: id,
          role_id: relationships['placename-role'].data.id,
          placename_id: relationships.placename.data.id,
          label: searchScopePlaces.find(pl => pl.id === relationships.placename.data.id).attributes.label
        })).filter((p) => p.role_id === 3)
        //console.log('searchScopePlacesCit', searchScopePlacesCit)
        // dedupe
        let uniqueSearchScopePlacesCit = [...new Map(searchScopePlacesCit.map(item => [item.placename_id, item])).values()]
        console.log('uniqueSearchScopePlacesCit', uniqueSearchScopePlacesCit)

        // update state placenames
        const places = [
          {role_id: "Lieu d'expédition", places: uniqueSearchScopePlacesFrom},
          {role_id: "Lieu de destination", places: uniqueSearchScopePlacesTo},
          {role_id: "Lieu mentionné", places: uniqueSearchScopePlacesCit}
        ]
        //console.log('places : ', places)
        if (included.length > 0) {
          commit('placenames/SET_ALL', places, {root: true})
        } else {
          if (query.length >1) {
            // multisearch with no Persons and no Places
            const persons_roles = [
              {role_id: "Expéditeur", persons: []},
              {role_id: "Destinataire", persons: []},
              {role_id: "Personne citée", persons: []}
            ]
            commit('persons/SET_PERSONS_ROLES', persons_roles, {root: true});
            const places = [
              {role_id: "Lieu d'expédition", places: []},
              {role_id: "Lieu de destination", places: []},
              {role_id: "Lieu mentionné", places: []}
            ]
            commit('placenames/SET_ALL', places, {root: true});
          } else {
            console.log("search no included : store.dispatch('persons/fetchAll'")
            await store.dispatch('persons/fetchAll', null, {root: true});
            console.log("search no included : store.dispatch('placenames/fetchAll'")
            await store.dispatch('placenames/fetchAll', null, {root: true});
          }
        }
      } else {
        // no included returned
        if (query.length > 1 || meta['total-count'] === 0) {
          // search with no Persons and no Places or no results
          const persons_roles = [
            {role_id: "Expéditeur", persons: []},
            {role_id: "Destinataire", persons: []},
            {role_id: "Personne citée", persons: []}
          ]
          commit('persons/SET_PERSONS_ROLES', persons_roles, {root: true});
          const places = [
            {role_id: "Lieu d'expédition", places: []},
            {role_id: "Lieu de destination", places: []},
            {role_id: "Lieu mentionné", places: []}
          ]
          commit('placenames/SET_ALL', places, {root: true});
        }
      }*/
      // Local sorting
      // const sortMethod = sortMethodWithDirectionMultiColumn(state.sorts);
      // let sortedData = datawithPersons.sort(sortMethod);
      // console.log("sortedData", sortedData)


      commit('CURRENT_SEARCH_FILTERS', filters);
      commit('CURRENT_SEARCH_QUERY', query +
          JSON.stringify(personsFromSelectedFacets) +
          JSON.stringify(personsToSelectedFacets) +
          JSON.stringify(personsCitedSelectedFacets) +
          JSON.stringify(placesFromSelectedFacets) +
          JSON.stringify(placesToSelectedFacets) +
          JSON.stringify(placesCitedSelectedFacets)
      ); // add JSON.stringify(collectionsSelectedFacets)?

      commit('UPDATE_ALL', {documents: datawithPersons, totalCount: meta['total-count'] , links, included: included || []});
      //commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links, included: included || []});
      commit('SET_LOADING_STATUS', false);
    } catch (reason) {
      console.warn('cant search:', reason);
      commit('SET_LOADING_STATUS', false);
      commit('SET_ERROR_STATUS', true);
      commit('RESET_ALL');
    }
   
  }, 500)
};

const getters = {
  totalPageNum: (state) => {
      //console.log("totalPageNum totals", state.documents.length, state.totalCount, state.pageSize,  parseInt(Math.ceil(state.totalCount / state.pageSize)))
      return state.documents.length === 0 ? 1 : parseInt(Math.ceil(state.totalCount / state.pageSize))
  }
};

const searchModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export const templates = { 
  creationDateTemplate
}

export const labels = {
  monthLabels
}

export {
  getNextMonthLabel,
  formatDate,
};

export default searchModule;
