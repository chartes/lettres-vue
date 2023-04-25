import {debounce} from 'lodash';
import {http_with_auth} from "@/modules/http-common";
import {cloneDeep} from 'lodash';
import personsModule from "@/store/modules/persons";
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
function transformKeys(obj) {
  return Object.keys(obj).reduce(function(o, prop) {
    let value = obj[prop];
    let newProp = prop.replace('-', '_');
    o[newProp] = value;
    return o;
  }, {});
}
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
};
const state = {

  searchTerm: null,
  
  sorts: [{field: 'creation', order: 'asc'}],

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
  documents: [],
  included: [],
  totalCount: 0,
  links: [],

};


const mutations = {
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

};

const actions = {
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
  async getDocumentsTotal ({commit, rootState}) {
    const http = http_with_auth(rootState.user.jwt);
    let query ='';
    if (!query || query.length === 0) {
      query = '*'
    }
    if (!rootState.user.current_user){
      query = `${query} AND (is-published:true)`
    }
    const response = await http.get(`/search?query=${query}&without-relationships&sort=-id`);
    const documentsTotal = response.data.meta['total-count'];
    const lastDocId = response.data.data[0].id;
    const docIdList = response.data.data.map(id => id);
    return {documentsTotal: documentsTotal, lastDocId: lastDocId, docIdList: docIdList};
  },
  performSearch: debounce(async ({commit, state, rootState}, type) => {
    commit('SET_LOADING_STATUS', true);

    /* =========== filters =========== */
    let query ='';
    if (state.selectedCollections && state.selectedCollections.length > 1) {
      query = '' + '(' + state.selectedCollections.map(c => `(collections.id:${c.id})`).join(' OR ') + ')';
    } else {
      query = '' + state.selectedCollections.map(c => `(collections.id:${c.id})`).join(' OR ');
    }
    console.log('selectedCollections', state.selectedCollections);
    if (state.searchTerm && state.searchTerm.length > 0) {
      if (query.length === 0) {
        query = `(${state.searchTerm})`
      } else {
        query = `(${query} AND (${state.searchTerm}))`
      }
    }
 

    if (!query || query.length === 0) {
      query = '*'
    }

    let place_query_from='';
    if (state.selectedPlaceFrom.length > 0) {
        console.log('selectedPlaceFrom', state.selectedPlaceFrom);
        place_query_from = 'location-date-from.id:(' + state.selectedPlaceFrom.map(c => `${c.placename_id}`).join(' || ') + ')';
        //query = '(' + query + ' AND (location-date-from.id:(' + state.selectedPlaceFrom.map(c => `${c.placename_id}`).join(' || ') + ')))';
        console.log('query with selectedPlaceFrom', place_query_from)
    } else {
      console.log('query without selectedPlaceFrom')
    }
    let place_query_to = '';
    if (state.selectedPlaceTo.length > 0) {
        console.log('selectedPlaceTo', state.selectedPlaceTo);
        place_query_to = 'location-date-to.id:(' + state.selectedPlaceTo.map(c => `${c.placename_id}`).join(' || ') + ')';
        //query = '(' + query + ' AND (' + state.selectedPlaceTo.map(c => `location-date-to.id:${c.placename_id}`).join(' OR ') + '))';
        console.log('query with selectedPlaceTo', place_query_to)
    } else {
      console.log('query without selectedPlaceTo')
    }
    let place_query_cited = '';
    if (state.selectedPlaceCited.length > 0) {
        console.log('selectedPlaceCited', state.selectedPlaceCited);
        place_query_cited =  'location-inlined.id:(' + state.selectedPlaceCited.map(c => `${c.placename_id}`).join(' || ') + ')';
        //query = '(' + query + ' AND (' + state.selectedPlaceCited.map(c => `location-inlined.id:${c.placename_id}`).join(' OR ') + '))';
        console.log('query with selectedPlaceCited', place_query_cited)
    } else {
      console.log('query without selectedPlaceCited')
    }
    // combine places criteriae :
    let place_query = ''
    if (place_query_from.length > 0 || place_query_to.length > 0 || place_query_cited.length > 0) {
      place_query = [place_query_from, place_query_to, place_query_cited].filter(Boolean).join(' AND ');
    }

    let person_query_from = ''
    if (state.selectedPersonFrom.length > 0) {
      console.log('selectedPersonFrom', state.selectedPersonFrom);
      person_query_from = 'senders.id:(' + state.selectedPersonFrom.map(c => `${c.person_id}`).join(' || ') + ')';
      //query = '(' + query + ' AND (senders.id:(' + state.selectedPersonFrom.map(c => `${c.person_id}`).join(' || ') + '))';
      console.log('query with selectedPersonFrom', person_query_from);
    } else {
      console.log('query without selectedPersonFrom')
    }

    let person_query_to= ''
      if (state.selectedPersonTo.length > 0) {
      console.log('selectedPersonTo', state.selectedPersonTo);
      person_query_to = 'recipients.id:(' + state.selectedPersonTo.map(c => `${c.person_id}`).join(' || ') + ')';
      //query = '(' + query + ' AND (' + state.selectedPersonTo.map(c => `recipients.id:${c.person_id}`).join(' OR ') + '))';
      console.log('query with selectedPersonTo', person_query_to);
    } else {
      console.log('query without selectedPersonTo')
    }

    let person_query_cited = ''
    if (state.selectedPersonCited.length > 0) {
      console.log('selectedPersonCited', state.selectedPersonCited);
      person_query_cited = 'person-inlined.id:(' + state.selectedPersonCited.map(c => `${c.person_id}`).join(' || ') + ')';
      //query = '(' + query + ' AND (' + state.selectedPersonCited.map(c => `person-inlined.id:${c.person_id}`).join(' OR ') + '))';
      console.log('query with selectedPersonCited', person_query_cited);
    } else {
      console.log('query without selectedPersonCited')
    }
    // combine persons criteriae :
    let person_query = ''
    if (person_query_from.length > 0 || person_query_to.length > 0 || person_query_cited.length > 0) {
      person_query = [person_query_from, person_query_to, person_query_cited].filter(Boolean).join(' AND ');
    }

    // combine query, places and persons criteriae :
    if (place_query.length > 0 || person_query.length > 0) {
          query = query + ' AND (' + [place_query, person_query].filter(Boolean).join(' AND ')+ ')';
    }

    if (!rootState.user.current_user){
      query = `${query} AND (is-published:true)`
    }

    /* =========== sorts ===========*/
    let sorts = state.sorts.map(s => `${s.order === 'desc' ? '-' : ''}${s.field}`)
    sorts = sorts.length ? sorts.join(',') : 'creation'

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
          creationDateRange = `&range[creation]=gte:${cdfFormatted},${upperOp}:${upperBound}`
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
          creationDateRange = `&range[creation]=gte:${cdfFormatted}`
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
          creationDateRange = `&range[creation]=${upperOp}:${upperBound}`
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
      const toInclude = ['persons-having-roles', 'persons', 'placenames-having-roles', 'placenames']; //['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      const includes = toInclude.length ? `&include=${[toInclude].join(',')}` : '';
      
      const http = http_with_auth(rootState.user.jwt);
      const response = await http.get(`/search?query=${query}${filters}${includes}&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
      //const response = await http.get(`/search?query=${query}${filters}${includes}&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
      const {data, links, meta, included} = response.data
      console.log('keysToCamel(data) : ', keysToCamel(data))
      const phr = [];

      const datawithPersons = keysToCamel(data).map(({
        id,
        attributes: {title, argument, creation, creation_not_after, creation_label, is_published},
        relationships: {person_roles, persons, placename_roles, placenames}
      }) => ({
        id,
        title,
        argument,
        creation,
        creation_not_after,
        creation_label,
        is_published,
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
      }));
      console.log('datawithPersons', datawithPersons)
      console.log('included', included)

      if (type !== 'simple' && (query !== state.currentQuery || filters !== state.currentFilters))
      {

        // fetch persons associated with search criteriae :
        const searchScopePersonsFrom = await http.get(`/search?query=${query}${filters}&groupby[doc-type]=person&groupby[field]=senders.id&without-relationships`);
        const searchScopePersonsTo = await http.get(`/search?query=${query}${filters}&groupby[doc-type]=person&groupby[field]=recipients.id&without-relationships`);
        const searchScopePersonsCit = await http.get(`/search?query=${query}${filters}&groupby[doc-type]=person&groupby[field]=person-inlined.id&without-relationships`);
        console.log('searchScopePersonsFrom', searchScopePersonsFrom)
        let uniqueSearchScopePersonsFrom = searchScopePersonsFrom.data.data.map(({
                                                                                   id,
                                                                                   type,
                                                                                   attributes,
                                                                                   meta,
                                                                                   links,
                                                                                   relationships
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
                                                                               links,
                                                                               relationships
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
                                                                                 links,
                                                                                 relationships
                                                                               }) =>
            ({
              role_id: 3,
              person_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePersonsCit', uniqueSearchScopePersonsCit)

        // update state persons
        const persons_roles = [
          {role_id: "Expéditeur", persons: uniqueSearchScopePersonsFrom},
          {role_id: "Destinataire", persons: uniqueSearchScopePersonsTo},
          {role_id: "Personne citée", persons: uniqueSearchScopePersonsCit}
        ]
        console.log('persons_roles : ', persons_roles)
        commit('persons/SET_PERSONS_ROLES', persons_roles, {root: true})

        // fetch placenames associated with search criteriae :
        const searchScopePlacesFrom = await http.get(`/search?query=${query}${filters}&groupby[doc-type]=placename&groupby[field]=location-date-from.id&without-relationships`);
        const searchScopePlacesTo = await http.get(`/search?query=${query}${filters}&groupby[doc-type]=placename&groupby[field]=location-date-to.id&without-relationships`);
        const searchScopePlacesCit = await http.get(`/search?query=${query}${filters}&groupby[doc-type]=placename&groupby[field]=location-inlined.id&without-relationships`);
        console.log('searchScopePlacesFrom', searchScopePlacesFrom)
        let uniqueSearchScopePlacesFrom = searchScopePlacesFrom.data.data.map(({
                                                                                 id,
                                                                                 type,
                                                                                 label,
                                                                                 attributes,
                                                                                 meta,
                                                                                 links,
                                                                                 relationships
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
                                                                             links,
                                                                             relationships
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
                                                                               links,
                                                                               relationships
                                                                             }) =>
            ({
              role_id: 3,
              placename_id: id,
              label: attributes.label
            })
        )
        console.log('uniqueSearchScopePlacesCit', uniqueSearchScopePlacesCit)

        // update state placenames
        const places = [
          {role_id: "Lieu d'expédition", places: uniqueSearchScopePlacesFrom},
          {role_id: "Lieu de destination", places: uniqueSearchScopePlacesTo},
          {role_id: "Lieu mentionné", places: uniqueSearchScopePlacesCit}
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
      commit('CURRENT_SEARCH_QUERY', query);

      commit('UPDATE_ALL', {documents: datawithPersons, totalCount: meta['total-count'] , links, included: included || []});
      //commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links, included: included || []});
      commit('SET_LOADING_STATUS', false);
    } catch (reason) {
      console.warn('cant search:', reason);
      commit('SET_LOADING_STATUS', false);
    }
   
  }, 500)
};

const getters = {
  totalPageNum: (state) => {
      console.log("total", state.documents.length, state.totalCount, state.pageSize,  parseInt(Math.ceil(state.totalCount / state.pageSize)))
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
