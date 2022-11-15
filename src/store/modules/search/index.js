import {debounce} from 'lodash';
import {http_with_auth} from "@/modules/http-common";
import {cloneDeep} from 'lodash';


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
  selectedPlaceFrom: null,
  selectedPlaceTo: null,
  selectedPersonFrom: null,
  selectedPersonTo: null,

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
    state.creationDateTo = Object.assign({}, state.creationDateTo, to)
  },
  SET_LOADING_STATUS(state, s) {
    state.loadingStatus = s;
  },
  SET_SELECTED_COLLECTIONS(state, colls) {
    state.selectedCollections = colls;
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
  performSearch: debounce(async ({commit, state, rootState}) => {
    commit('SET_LOADING_STATUS', true);

    /* =========== filters =========== */
    let query =  '' + state.selectedCollections.map(c => `collections.id:${c.id}`).join(' OR ');
    //let query = `collections.id:${state.selectedCollectionId}`

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
      //console.log(e)
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
      const toInclude = []; //['collections', 'persons', 'persons-having-roles', 'roles', 'witnesses', 'languages'];
      const includes = toInclude.length ? `&include=${[].join(',')}` : ''; 
      
      const http = http_with_auth(rootState.user.jwt);
      const response = await http.get(`/search?query=${query}${filters}${includes}&without-relationships&sort=${sorts}&page[size]=${state.pageSize}&page[number]=${state.numPage}`);
      const {data, links, meta, included} = response.data

      commit('UPDATE_ALL', {documents: data, totalCount: meta['total-count'] , links, included: included || []});
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
