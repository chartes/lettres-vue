<template>
  <div class="place-list">
    <div class="search-container">
      <section>
        <header />
        <div class="searchbox-container">
          <b-field label="Lieu">
            <div class="field has-addons">
              <div class="control">
                <input
                  v-model="inputTerm"
                  class="input"
                  type="text"
                  placeholder="Paris"
                  @keyup.enter="search"
                />
              </div>
              <div class="control">
                <a class="button pl-5 pr-5" @click="search">
                  <span class="icon">
                    <i v-if="loadingStatus" class="fas fa-spinner fa-pulse" />
                    <i v-else class="fas fa-search" />
                  </span>
                </a>
              </div>
            </div>
          </b-field>

          <b-field label="Dates de lieu">
            <b-field>
              <b-checkbox v-model="fromPlace" type="is-info"> Expédition </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="toPlace" type="is-info"> Réception </b-checkbox>
            </b-field>
          </b-field>

          <b-field label="Parties du document">
            <b-field>
              <b-checkbox v-model="inArgument" type="is-info"> Analyse </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="inTranscription" type="is-info">
                Transcription
              </b-checkbox>
            </b-field>
          </b-field>
        </div>
      </section>

      <section class="filterbox-container">
        <header>
          <div class="heading divider is-left">Filtres</div>
        </header>
        Document, personne, date, collection
      </section>
    </div>

    <p class="mt-4 mb-1">Environ {{ totalCount }} résultat(s)</p>
    <div class="result-container">
      <span class="pagination-goto">
        <span> Page : </span>
        <input
          v-model="currentPage"
          name="page"
          class="input"
          type="text"
          placeholder="Page..."
          @change.prevent="currentPage = parseInt(p)"
        />
      </span>

      <b-table
        ref="multiSortTable"
        :data="tableData"
        :loading="loadingStatus"
        paginated
        backend-pagination
        :total="totalCount"
        :per-page="pageSize"
        :current-page.sync="currentPage"
        pagination-position="both"
        aria-next-label="Page suivante"
        aria-previous-label="Page précédente"
        aria-page-label="Page"
        aria-current-label="Page courante"
        detailed
        :backend-sorting="true"
        :sort-multiple="true"
        :sort-multiple-data="sortingPriority"
        detail-key="id"
        show-detail-icon
        :narrowed="true"
        :mobile-cards="true"
        :selected.sync="selected"
        focusable
        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
        @page-change="onPageChange"
      >
        <b-table-column
          v-slot="props"
          field="id"
          label="Id"
          :td-attrs="columnTdAttrs"
          sortable
        >
          {{ props.row.id }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="label.keyword"
          label="Lieu"
          :td-attrs="columnTdAttrs"
          sortable
        >
          {{ props.row.label }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="ref"
          label="Identifiant de référence"
          :td-attrs="columnTdAttrs"
        >
          {{ props.row.ref }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="coords"
          label="Localisation"
          :td-attrs="columnTdAttrs"
        >
          {{ props.row.coords }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="documents"
          label="Documents"
          :td-attrs="columnTdAttrs"
        >
          <span v-if="placenameCounts[props.row.id] === 0">-</span>
          <span v-else
            >{{ placenameCounts[props.row.id] }} document
            <span v-if="placenameCounts[props.row.id] > 1">(s)</span>
          </span>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">Aucun résultat</div>
        </template>

        <template #detail="props">
          <div class="detail-td">
            <div v-if="fromPlace" class="columns ref-section-heading">
              <div class="column is-one-quarter section-title">
                <span class="heading">
                  Dates de lieu d'expédition ({{ props.row.fromPlace.length }})
                </span>
              </div>
              <div class="column">
                <document-title-bar
                  v-for="item in props.row.fromPlace"
                  :key="item.docId"
                  :doc-id="item.docId"
                  :title="item.docTitle"
                  :creation-label="item.docCreationLabel"
                />
              </div>
            </div>
            <div v-if="toPlace" class="columns ref-section-heading">
              <div class="column is-one-quarter section-title">
                <span class="heading">
                  Dates de lieu de réception ({{ props.row.toPlace.length }})
                </span>
              </div>
              <div class="column">
                <document-title-bar
                  v-for="item in props.row.toPlace"
                  :key="item.docId"
                  :doc-id="item.docId"
                  :title="item.docTitle"
                  :creation-label="item.docCreationLabel"
                />
              </div>
            </div>
            <div v-if="inArgument" class="columns ref-section-heading">
              <div class="column is-one-quarter section-title">
                <span class="heading"> Analyse({{ props.row.inArgument.length }}) </span>
              </div>
              <div class="column">
                <document-title-bar
                  v-for="item in props.row.inArgument"
                  :key="item.docId"
                  :doc-id="item.docId"
                  :title="item.docTitle"
                  :creation-label="item.docCreationLabel"
                />
              </div>
            </div>
            <div v-if="inTranscription" class="columns ref-section-heading">
              <div class="column is-one-quarter section-title">
                <span class="heading">
                  Transcription ({{ props.row.inTranscription.length }})
                </span>
              </div>
              <div class="column">
                <document-title-bar
                  v-for="item in props.row.inTranscription"
                  :key="item.docId"
                  :doc-id="item.docId"
                  :title="item.docTitle"
                  :creation-label="item.docCreationLabel"
                />
              </div>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTitleBar from "../forms/place/DocumentTitleBar.vue";

export default {
  name: "PlaceList",
  components: {
    DocumentTitleBar,
  },
  emit: ["manage-place-data"],

  props: {},
  data() {
    return {
      selected: null,
      tableData: [],
      placenameCounts: {},

      inputTerm: "Paris",
      fromPlace: true,
      toPlace: true,
      inArgument: true,
      inTranscription: true,

      isDocListOpen: false,
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

    sortingPriority: {
      get: function () {
        return this.sorts;
      },

      set: function (value) {
        this.setSorts(value);
      },
    },

    currentPage: {
      get: function () {
        return this.numPage;
      },
      set: function (newValue, oldValue) {
        newValue = parseInt(newValue);
        if (newValue && newValue !== oldValue) {
          this.setNumPage(newValue);
          this.performSearch(this.sortingPriority);
          this.loadAsyncData();
        }
      },
    },

    labeledInputTerm() {
      return `label:*${this.inputTerm}*`;
    },
  },
  watch: {
    placenames() {
      this.loadAsyncData();
    },
    inputTerm() {
      this.setSearchTerm(this.labeledInputTerm);
    },

    fromPlace() {
      this.recomputeCounts();
    },
    toPlace() {
      this.recomputeCounts();
    },
    inArgument() {
      this.recomputeCounts();
    },
    inTranscription() {
      this.recomputeCounts();
    },

    selected() {
      if (this.selected) {
        this.managePlaceData({ action: { name: "set-place" }, data: this.selected });
      }
    },
    "$attrs.place"() {
      if (
        !this.$attrs.place ||
        !this.selected ||
        this.$attrs.place.id === this.selected.id
      ) {
        console.log("keep selection", this.$attrs.place);
      } else {
        console.log("unselect");
        this.selected = null;
      }
    },
  },
  async created() {
    await this.$store.dispatch("placenames/fetchRoles");
    this.setSearchTerm(this.labeledInputTerm);
    this.search();
  },
  methods: {
    ...mapActions("placenames", [
      "setNumPage",
      "performSearch",
      "setSorts",
      "setSearchTerm",
    ]),

    managePlaceData(evt) {
      this.$emit("manage-place-data", evt);
    },

    search() {
      this.performSearch();
      this.loadAsyncData();
    },

    count(pId) {
      const s_pId = pId.toString();
      let countSet = new Set([]);

      // fromPlace
      if (this.placenamesHavingRoles.fromPlace[s_pId] && this.fromPlace) {
        const fromSet = new Set(
          this.placenamesHavingRoles.fromPlace[s_pId].map((i) => i.docId)
        );
        for (let elem of fromSet) {
          countSet.add(elem);
        }
      }
      // toPlace
      if (this.placenamesHavingRoles.toPlace[s_pId] && this.toPlace) {
        const toSet = new Set(
          this.placenamesHavingRoles.toPlace[s_pId].map((i) => i.docId)
        );
        for (let elem of toSet) {
          countSet.add(elem);
        }
      }
      // inArgument
      if (this.placenamesHavingRoles.inArgument[s_pId] && this.inArgument) {
        const argSet = new Set(
          this.placenamesHavingRoles.inArgument[s_pId].map((i) => i.docId)
        );
        for (let elem of argSet) {
          countSet.add(elem);
        }
      }
      // inTranscription
      if (this.placenamesHavingRoles.inTranscription[s_pId] && this.inTranscription) {
        const trSet = new Set(
          this.placenamesHavingRoles.inTranscription[s_pId].map((i) => i.docId)
        );
        for (let elem of trSet) {
          countSet.add(elem);
        }
      }

      this.placenameCounts[s_pId] = countSet.size || 0;

      return countSet.size;
    },

    recomputeCounts() {
      this.placenameCounts = {};
      for (let p of this.placenames) {
        this.count(p.id);
      }
    },

    resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        this.performSearch();
        this.loadAsyncData();
      }
    },

    // Backend sorting
    sortingPriorityRemoved(field) {
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      console.log(newPriority, this.sortingPriority);
      this.performSearch();
      this.loadAsyncData();
    },

    sortPressed(field, order, event) {
      if ((this.customKey && event[this.customKey]) || !this.customKey) {
        let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        if (existingPriority) {
          existingPriority.order = existingPriority.order === "desc" ? "asc" : "desc";
        } else {
          // request sorted data from backend
          this.sortingPriority.push({ field, order });
        }
        this.setSorts(this.sortingPriority);
      } else {
        // request regular sorted data from backend
        this.sortingPriority = []; // [{field, order}]
        this.setSorts([]);
      }

      this.search();
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
              fromPlace: this.placenamesHavingRoles.fromPlace[p.id] || [],
              toPlace: this.placenamesHavingRoles.toPlace[p.id] || [],
              inArgument: this.placenamesHavingRoles.inArgument[p.id] || [],
              inTranscription: this.placenamesHavingRoles.inTranscription[p.id] || [],

              id: p.id,
              label: p.attributes.label,
              ref: p.attributes.ref,
              coords:
                p.attributes.long !== null && p.attributes.lat !== null
                  ? [p.attributes.long, p.attributes.lat]
                  : null,
            };
          })
        );
        this.recomputeCounts();
      }
    },
    columnTdAttrs(row, column) {
      if (column.label === "Titre") {
        return {
          class: "",
          style: {
            "max-width": "550px",
          },
        };
      } else if (column.label === "Date de rédaction") {
        return {
          class: "",
          style: {
            "max-width": "300px",
          },
        };
      } else {
        return null;
      }
    },
    /*
     * Handle page-change event
     */
    onPageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";

.place-list {
  .pagination-goto {
    display: flex;
    float: right;
    position: relative;
    width: 120px;
    margin-left: 50px;
    span {
      width: 100px;
      align-self: center;
    }
    input {
      margin-left: 4px;
      display: inline;
    }
  }
  progress {
    margin-top: 30px;
  }

  .checkbox {
    display: inline-flex;
  }
  .search-container {
    margin-bottom: 70px;
  }
  .searchbox-container {
    display: flex;

    .field {
      margin-right: 32px;
    }
  }
  .ref-section-heading {
    border-bottom: 1px solid $nice-grey;
  }
  .section-title {
    background-color: $light;
  }
  .detail {
    td {
      padding: 0;
    }
  }
  .detail-container {
    padding: 0 !important;

    .columns {
      margin: 0px;
    }
  }
}
</style>
