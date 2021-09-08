<template>
  <div class="wizard-center-form">
    <b-field label="Cherchez un lieu">
      <b-autocomplete
        v-model="inputTerm"
        :data="tableData"
        placeholder="e.g. Metz"
        field="label"
        :loading="isFetching"
        class="search-input"
        clearable
        open-on-focus
        @typing="search"
        @select="(option) => (selected = option)"
      >
        <template slot-scope="props">
          <div type="is-light">
            <div class="heading">{{ props.option.id }}: {{ props.option.label }}</div>
            <div class="is-size-7">
              {{ props.option.ref }}
            </div>
          </div>
        </template>
        <template #header>
          <a>
            <span> Ajouter un nouveau lieu dans l'application </span>
          </a>
        </template>
        <template v-if="inputTerm" #empty> Aucun résultat pour {{ inputTerm }} </template>
      </b-autocomplete>
    </b-field>
    <p class="content">
      {{ selected }}
    </p>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import { mapState, mapActions, mapGetters } from "vuex";

const baseURL = "https://query.wikidata.org/sparql?format=json&query=";
class SPARQLQueryDispatcher {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  query(sparqlQuery) {
    const fullUrl = this.endpoint + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { Accept: "application/sparql-results+json" };

    return fetch(fullUrl, { headers }).then((body) => body.json());
  }
}

const endpointUrl = "https://query.wikidata.org/sparql";
const sparqlQuery = `SELECT DISTINCT ?item ?nativeName ?coords WHERE {
  ?item wdt:P625 ?coords;
    wdt:P1705 ?nativeName.
  FILTER(CONTAINS(?nativeName, "Paris"))
   FILTER(LANG(?nativeName) = "fr")
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
ORDER BY ?nativeName
LIMIT 50`;

const sparqlQueryOptimized = `SELECT DISTINCT ?item ?label ?coords
WHERE
{
  SERVICE wikibase:mwapi
  {
    bd:serviceParam wikibase:endpoint "www.wikidata.org";
                    wikibase:api "Generator";
                    mwapi:generator "search";
                    mwapi:gsrsearch "inlabel:Metz";
                    mwapi:gsrlimit "max".
    ?item wikibase:apiOutputItem mwapi:title.
  }
  ?item rdfs:label ?label.
  ?item wdt:P625 ?coords;
  FILTER(LANG(?label) = "fr")
  FILTER CONTAINS(?label, "Metz")
}
LIMIT 1000`;

const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);

export default {
  name: "SelectOrCreatePlacenameForm",
  emit: ["manage-placename-data"],
  data() {
    return {
      tableData: [],
      selected: null,
      isFetching: false,
      inputTerm: "",

      sparqlQuery: `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
PREFIX wd: <http://www.wikidata.org/entity/> 
select  *
where {
        wd:Q2202883 rdfs:label ?label .
  FILTER (langMatches( lang(?label), "EN" ) )
      } 
LIMIT 1`,
    };
  },
  computed: {
    ...mapState("placenames", {
      placenames: "documents",
    }),
    ...mapState("placenames", [
      "loadingStatus",
      "numPage",
      "pageSize",
      "totalCount",
      "sorts",
      "searchTerm",
    ]),

    ...mapGetters("placenames", {
      placenamesHavingRoles: "getIncluded",
    }),
    labeledInputTerm() {
      return `label:*${this.inputTerm}*`;
    },
  },
  watch: {
    placenames() {
      this.loadAsyncData();
    },
    inputTerm() {
      this.isFetching = false;
      this.setSearchTerm(this.labeledInputTerm);
    },
  },
  async created() {
    await this.$store.dispatch("placenames/fetchRoles");
    this.managePlacenameData({
      action: { name: "set-label" },
      data: { label: "this is the label" },
    });

    queryDispatcher.query(sparqlQueryOptimized).then(console.log);
  },
  methods: {
    ...mapActions("placenames", [
      "setNumPage",
      "performSearch",
      "setSorts",
      "setSearchTerm",
    ]),

    search: debounce(function () {
      this.isFetching = true;
      this.performSearch();
      this.loadAsyncData();
      this.isFetching = false;
    }, 500),

    managePlacenameData(evt) {
      this.$emit("manage-placename-data", evt);
    },

    async loadAsyncData() {
      if (this.placenames) {
        this.tableData = await Promise.all(
          this.placenames.map(async (p) => {
            return {
              //placeFunction: d.attributes.function,
              //placename: d.placename,
              // placenameRole: d.role,
              documents: this.placenamesHavingRoles.documents[p.id] || [],
              //fromPlace: this.placenamesHavingRoles.fromPlace[p.id] || [],
              //toPlace: this.placenamesHavingRoles.toPlace[p.id] || [],
              //inArgument: this.placenamesHavingRoles.inArgument[p.id] || [],
              //inTranscription: this.placenamesHavingRoles.inTranscription[p.id] || [],

              id: p.id,
              label: p.attributes.label,
              ref: p.attributes.ref,
              //coords: [p.attributes.long, p.attributes.lat],
            };
          })
        );
        //this.recomputeCounts();
      }
    },
    async runSparqlQuery(query) {
      const response = await fetch(baseURL + encodeURI(this.sparqlQuery));
      const res = await response.json();
      return res.data.results.bindings;
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: inherit !important;
}
.wizard-center-form {
  padding-top: 65px;
  padding-left: 12px;
  width: 80%;
}
.search-input {
  max-width: 420px;
}
</style>
