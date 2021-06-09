import {debounce} from 'lodash';
import {http} from "@/modules/http-common";


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
]

function getMonthNumber(month) {
  const idx =  monthLabels.indexOf(month)
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
    if (day) {
      throw new Error(`Cannot format the date because the month is null: ${year, month, day}`, )
    }
    formatted = year.toString()
  }

  return formatted
}

const state = {

  searchTerm: null,
  
  sorts: [{field: 'creation', order: 'asc'}],

  creationDateFrom: {
    ...creationDateTemplate,
    year:'1577', 
    selection: {
      ...creationDateTemplate.selection,
      year: '1577'
    }
  },
  creationDateTo: {...creationDateTemplate},

  withStatus: false,
  withDateRange: false,

  selectedCollectionId: 1,

  numPage: 1,
  pageSize: 30,

  loadingStatus: false,
  documents: [],
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
    state.creationDateTo = Object.assign({}, state.creationDateTo, to)
  },
  SET_LOADING_STATUS(state, s) {
    state.loadingStatus = s;
  },
  SET_SELECTED_COLLECTION_ID(state, id) {
    state.selectedCollectionId = id > 0 ? id : 1;
  },
  UPDATE_ALL (state, {documents, totalCount, links}) {
    state.documents = documents;
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
  setSorts({commit}, sorting) {
    commit('SET_NUM_PAGE', 1)
    commit('SET_SORTS', sorting)
  },
  setWithStatus({commit}, status) {
    commit('SET_WITH_STATUS', status)
  },
  setWithDateRange({commit}, status) {
    commit('SET_WITH_DATE_RANGE', status)
  },
  setCreationDateFrom({commit}, from) {
    commit('SET_CREATION_DATE_FROM', from)
  },
  setCreationDateTo({commit}, to) {
    commit('SET_CREATION_DATE_TO', to)
  },
  setSelectedCollectionId({commit}, id) {
    commit('SET_SELECTED_COLLECTION_ID', id)
    commit('SET_NUM_PAGE', 1)
  },
  performSearch: debounce(async ({commit, state, rootState}) => {
    commit('SET_LOADING_STATUS', true);

    /* =========== filters =========== */
    let query = `collections.id:${state.selectedCollectionId}`


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
      console.error(e)
      console.log('cdf', cdfFormatted, 'cdt', cdtFormatted)
    }

    let creationDateRange = ''
    if (cdfFormatted) {
      if (state.withDateRange && cdtFormatted) {
        // between from and to 
        creationDateRange = `&range[creation]=gte:${cdfFormatted},lte:${cdtFormatted}`
      } else {
        // single date (from)
        creationDateRange = `&range[creation]=gte:${cdfFormatted},lte:${cdfFormatted}`
      }
    }

   
    let filters = `${creationDateRange}`

    /* =========== execution =========== */
    try {
      const toInclude = []; //['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      const includes = toInclude.length ? `&include=${[].join(',')}` : ''; 
      
      const response = await http.get(`/search?query=${query}${filters}${includes}&without-relationships&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
      const {data, links, meta} = response.data

      commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links});
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

export default searchModule;
