<template>
  <div class="place-list">
    <div>
      <section>
        <header />
        <div>
          <div class="search-container">
            <b-field
              label="Lieu"
            >
              <b-input
                v-model="inputTerm"
                class="search_input"
                type="search"
                icon-right="close-circle"
                icon-right-clickable
                @icon-right-click="inputTerm=''"
                placeholder="Paris"
                @focus="$event.target.select()"
                @keyup.native.enter="search"
              />
              <div>
                <a
                  class="button pl-5 pr-5 search_button"
                  :disabled="!inputTerm || inputTerm === ''"
                  @click="search"
                >
                  <span class="icon">
                    <i
                      v-if="loadingStatus"
                      class="fas fa-spinner fa-pulse"
                    />
                    <i
                      v-else
                      class="fas fa-search"
                    />
                  </span>
                </a>
              </div>
            </b-field>

            <b-field
              v-if="false"
              label="Dates de lieu"
            >
              <b-field>
                <b-checkbox
                  v-model="fromPlace"
                  type="is-info"
                >
                  Expédition
                </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox
                  v-model="toPlace"
                  type="is-info"
                >
                  Réception
                </b-checkbox>
              </b-field>
            </b-field>

            <b-field
              v-if="false"
              label="Parties du document"
            >
              <b-field>
                <b-checkbox
                  v-model="inAddress"
                  type="is-info"
                >
                  Adresse
                </b-checkbox>
              </b-field>

              <b-field>
                <b-checkbox
                  v-model="inTranscription"
                  type="is-info"
                >
                  Transcription
                </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox
                  v-model="inArgument"
                  type="is-info"
                >
                  Analyse
                </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox
                  v-model="inNotes"
                  type="is-info"
                >
                  Notes
                </b-checkbox>
              </b-field>
            </b-field>
          </div>
        </div>
      </section>

      <section
        v-if="!popupMode && false"
        class="filterbox-container"
      >
        <header>
          <div class="heading divider is-left">
            Filtres
          </div>
        </header>
        Document, personne, date, collection
      </section>
    </div>

    <div>
      <div class="results-count-and-pagination is-flex is-justify-content-space-between is-align-items-center">
        <div class="popup-list-header is-inline-block">
          <div class="results-count">
            <span class="total-count">{{ totalCount }}</span> résultat{{ totalCount > 1 ? "s" : "" }}
          </div>
        </div>
        <div class="is-inline-block">
          <div
            v-if="totalPages"
            class="pagination-controls"
          >
            <a
              :disabled="currentPage <= 1"
              :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
              @click="currentPage <= 1 ? null : currentPage = 1"
            >
            </a>
            <a
              :disabled="currentPage <= 1"
              :class="currentPage <= 1 ? 'button previous-page disabled' : 'button previous-page'"
              @click="currentPage <= 1 ? null : --currentPage"
            >
            </a>
            <input
              v-model="currentPage"
              name="page"
              type="number"
              min="1"
              :max="totalPages"
              placeholder="Page..."
              class="current-page"
              @change.prevent="currentPage = parseInt(p)"
            >
            <span class="label-sur-page">sur</span>
            <span class="total-pages">{{ totalPages }}</span>
            <a
              :disabled="currentPage >= totalPages"
              :class="currentPage < totalPages ? 'button next-page' : 'button next-page disabled'"
              @click="currentPage < totalPages ? ++currentPage : null"
            >
            </a>
            <a
              :disabled="currentPage >= totalPages"
              :class="currentPage < totalPages ? 'button last-page' : 'button last-page disabled'"
              @click="currentPage < totalPages ? currentPage = totalPages : null"
            >
            </a>
          </div>
        </div>
      </div>
      <div class="result-container">

        <b-table
          ref="multiSortTable"
          :data="tableData"
          :loading="loadingStatus"

          backend-pagination
          :total="totalCount"
          :per-page="pageSize"
          :current-page.sync="currentPage"

          :detailed="!popupMode"
          :backend-sorting="true"
          :sort-multiple="true"
          :sort-multiple-data="sortingPriority"
          detail-key="id"
          show-detail-icon
          :narrowed="true"
          :mobile-cards="true"
          :selected.sync="selected"
          @sort="sortPressed"
          @sorting-priority-removed="sortingPriorityRemoved"
        >
          <!--
          <b-table-column
            v-slot="props"
            field="id"
            label="Id"
            :td-attrs="columnTdAttrs"
            sortable
          >
            {{ props.row.id }}
          </b-table-column>
          -->
          <b-table-column
            field="label.keyword"
            label="Lieu"
            :td-attrs="columnTdAttrs"
            sortable
          >
            <template v-slot:header="{ column }">
              <div v-if="column.sortable">
                <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                  <span
                    class="icon button arrows-alt-v"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                  </span>
                </div>
                <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                  <span class="icon button arrow-up">
                    <i class="fas fa-arrow-up"></i>
                  </span>
                  <!--<span class="icon button">
                    {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                    <button
                      class="delete is-small multi-sort-cancel-icon"
                      type="button"
                      @click.stop="sortingPriorityRemoved(column.field)"
                    />
                  </span>-->
                </div>
                <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                  <span class="icon button arrow-down">
                    <i class="fas fa-arrow-down"></i>
                  </span>
                  <!--<span class="icon button">
                    {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                    <button
                      class="delete is-small multi-sort-cancel-icon"
                      type="button"
                      @click.stop="sortingPriorityRemoved(column.field)"
                    />
                  </span>-->
                </div>
                <span>
                  {{ column.label }}
                </span>
              </div>
              <div v-else>
                {{ column.label }}
              </div>
            </template>
            <template v-slot="props">
              {{ props.row.label }}
            </template>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="functions"
            label="Description"
            :td-attrs="columnTdAttrs"
          >
            <span class="tags is-flex-direction-column is-align-items-flex-start">
              <span
                v-for="func in props.row.functions"
                :key="func"
                class="tag is-light"
              >
                {{ func }}
              </span>
            </span>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="ref"
            label="Identifiant de référence"
            :td-attrs="columnTdAttrs"
          >
            <span v-if="props.row.ref">
              <a
                v-if="props.row.ref.startsWith('http')"
                :href="props.row.ref"
                target="_blank"
              >{{ props.row.ref }}</a>
              <span v-else>{{ props.row.ref }}</span>
            </span>
          </b-table-column>

          <!--
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
            <span
              v-else
            >{{ placenameCounts[props.row.id] }} document
              <span v-if="placenameCounts[props.row.id] > 1">(s)</span>
            </span>
          </b-table-column>
-->
          <template #empty>
            <div class="has-text-centered">
              Aucun résultat
            </div>
          </template>

          <template #detail="props">
            <div
              v-if="
                (fromPlace && props.row.fromPlace.length > 0) ||
                  (toPlace && props.row.toPlace.length > 0) ||
                  (inNotes && props.row.inNotes.length > 0) ||
                  (inAddress && props.row.inAddress.length > 0) ||
                  (inTranscription && props.row.inTranscription.length > 0) ||
                  (inArgument && props.row.inArgument.length > 0)
              "
              class="detail-td"
            >
              <div
                v-if="fromPlace && props.row.fromPlace.length > 0"
                class="columns ref-section-heading"
              >
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
                    :title="cleanHTML(item.docTitle)"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
              <div
                v-if="toPlace && props.row.toPlace.length > 0"
                class="columns ref-section-heading"
              >
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
                    :title="cleanHTML(item.docTitle)"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
              <div
                v-if="inAddress && props.row.inAddress.length > 0"
                class="columns ref-section-heading"
              >
                <div class="column is-one-quarter section-title">
                  <span class="heading">
                    Adresse ({{ props.row.inAddress.length }})
                  </span>
                </div>
                <div class="column">
                  <document-title-bar
                    v-for="item in props.row.inAddress"
                    :key="item.docId"
                    :doc-id="item.docId"
                    :title="cleanHTML(item.docTitle)"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>

              <div
                v-if="inTranscription && props.row.inTranscription.length > 0"
                class="columns ref-section-heading"
              >
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
                    :title="cleanHTML(item.docTitle)"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
              <div
                v-if="inArgument && props.row.inArgument.length > 0"
                class="columns ref-section-heading"
              >
                <div class="column is-one-quarter section-title">
                  <span class="heading">
                    Analyse ({{ props.row.inArgument.length }})
                  </span>
                </div>
                <div class="column">
                  <document-title-bar
                    v-for="item in props.row.inArgument"
                    :key="item.docId"
                    :doc-id="item.docId"
                    :title="cleanHTML(item.docTitle)"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
              <div
                v-if="inNotes && props.row.inNotes.length > 0"
                class="columns ref-section-heading"
              >
                <div class="column is-one-quarter section-title">
                  <span class="heading"> Notes ({{ props.row.inNotes.length }}) </span>
                </div>
                <div class="column">
                  <document-title-bar
                    v-for="item in props.row.inNotes"
                    :key="item.docId"
                    :doc-id="item.docId"
                    :title="cleanHTML(item.docTitle)"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
            </div>
            <div
              v-else
              class="detail-td is-flex is-align-items-center"
            >
              <div class="m-3 mx-auto">
                Aucune utilisation
              </div>
            </div>
          </template>
        </b-table>
      </div>
      <div
        v-if="!popupMode"
        class="results-count-and-pagination is-flex is-justify-content-flex-end is-align-items-center mt-5"
      >
        <div class="is-inline-block">
          <div
            v-if="totalPages"
            class="pagination-controls"
          >
            <a
              :disabled="currentPage <= 1"
              :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
              @click="currentPage <= 1 ? null : currentPage = 1"
            >
            </a>
            <a
              :disabled="currentPage <= 1"
              :class="currentPage <= 1 ? 'button previous-page disabled' : 'button previous-page'"
              @click="currentPage <= 1 ? null : --currentPage"
            >
            </a>
            <input
              v-model="currentPage"
              name="page"
              type="number"
              min="1"
              :max="totalPages"
              placeholder="Page..."
              class="current-page"
              @change.prevent="currentPage = parseInt(p)"
            >
            <span class="label-sur-page">sur</span>
            <span class="total-pages">{{ totalPages }}</span>
            <a
              :disabled="currentPage >= totalPages"
              :class="currentPage < totalPages ? 'button next-page' : 'button next-page disabled'"
              @click="currentPage < totalPages ? ++currentPage : null"
            >
            </a>
            <a
              :disabled="currentPage >= totalPages"
              :class="currentPage < totalPages ? 'button last-page' : 'button last-page disabled'"
              @click="currentPage < totalPages ? currentPage = totalPages : null"
            >
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTitleBar from "../forms/place/DocumentTitleBar.vue";

export default {
  name: "PlaceList",
  components: {
    DocumentTitleBar
  },
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-place-data"],
  data() {
    let inputTerm = null;

    return {
      itemModification: false,
      selected: null,
      tableData: [],
      p: 1,
      placenameCounts: {},

      inputTerm,
      fromPlace: true,
      toPlace: true,
      inAddress: true,
      inArgument: true,
      inNotes: true,
      inTranscription: true,
    };
  },
  computed: {
    ...mapState("placenames", {placenames: "documents"}),
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
      functionsByPlacename: "getFunctionsByPlacename",
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
          this.setSorts(this.sortingPriority)
          this.p = newValue
          this.setNumPage(newValue);
          this.performSearch(this.sortingPriority);
          this.loadAsyncData();
        }
      },
    },
    totalPages: function() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    labeledInputTerm() {
      return this.inputTerm ? `label:*${this.inputTerm}*` : null;
    },
  },
  watch: {
    placenames() {
      this.loadAsyncData();
    },
    inputTerm(newVal, OldVal) {
      this.setSearchTerm(this.labeledInputTerm);
      if (newVal === '') {
        this.selected = null;
        this.search()
      }
    },
    /*
    fromPlace() {
      this.recomputeCounts();
    },
    toPlace() {
      this.recomputeCounts();
    },
    inAddress() {
      this.recomputeCounts();
    },
    inArgument() {
      this.recomputeCounts();
    },
    inNotes() {
      this.recomputeCounts();
    },
    inTranscription() {
      this.recomputeCounts();
    },
    */

    selected() {
      //selection is enabled only in popupMode, not on route /places for now
      if (this.popupMode) {
        if (this.selected) {
          this.managePlaceData({action: {name: "set-place"}, data: this.selected});
        } else {
          this.managePlaceData({action: {name: "set-place"}, data: {}});
        }
      } else this.selected = null
    },
    "$attrs.place"() {
      if (
        !this.$attrs.place ||
        !this.selected ||
        this.$attrs.place.id === this.selected.id
      ) {
        //console.log("keep selection", this.$attrs.place);
        if (this.$attrs.place.selection && !this.$attrs.place.id) {
          this.inputTerm = this.$attrs.place.selection;
        }
      } else {
        console.log("unselect");
        this.selected = null;
      }
    },
  },
  async created() {
    if (this.$attrs.place && this.$attrs.place.id) {
      const p = await this.getPlacenameById(this.$attrs.place.id);
      this.inputTerm = p.attributes.label;
    } else if (this.$attrs.place && this.$attrs.place.selection) {
      this.inputTerm = this.$attrs.place.selection;
    }

    console.log("WIZARD CREATION", this.inputTerm, this.$attrs.place);

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
      "getPlacenameById",
    ]),
    cleanHTML(text) {
      // remove notes from Titles in results
      if (text && text.length > 0) {
        console.log("text", text)
        let parser = new DOMParser();
        let htmlToClean = parser.parseFromString(text, 'text/html').body;

        let links = htmlToClean.getElementsByTagName('a');
        console.log("links", links)
        for (let i = links.length - 1; i >= 0; --i) {
          links[i].remove();
        }
        return htmlToClean.innerHTML.toString();
      }
    },
    managePlaceData(evt) {
      this.$emit("manage-place-data", evt);
    },

    search() {
      this.setNumPage(1);
      this.performSearch();
      this.loadAsyncData();
    },
    /*
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
      // inAddress
      if (this.placenamesHavingRoles.inAddress[s_pId] && this.inAddress) {
        const argSet = new Set(
          this.placenamesHavingRoles.inAddress[s_pId].map((i) => i.docId)
        );
        for (let elem of argSet) {
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
      // inNotes
      if (this.placenamesHavingRoles.inNotes[s_pId] && this.inNotes) {
        const argSet = new Set(
          this.placenamesHavingRoles.inNotes[s_pId].map((i) => i.docId)
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
    */
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
      this.selected = null;
      if (this.placenames) {
        this.tableData = await Promise.all(
          this.placenames.map(async (p) => {
            const functions = this.functionsByPlacename[p.id]
              ? [...new Set(this.functionsByPlacename[p.id].map((item) => item.function))]
              : [];

            return {
              //placeFunction: d.attributes.function,
              //placename: d.placename,
              //placenameRole: d.role,
              documents: this.placenamesHavingRoles.documents[p.id] || [],
              fromPlace: this.placenamesHavingRoles.fromPlace[p.id] || [],
              toPlace: this.placenamesHavingRoles.toPlace[p.id] || [],
              inAddress: this.placenamesHavingRoles.inAddress[p.id] || [],
              inArgument: this.placenamesHavingRoles.inArgument[p.id] || [],
              inNotes: this.placenamesHavingRoles.inNotes[p.id] || [],
              inTranscription: this.placenamesHavingRoles.inTranscription[p.id] || [],

              id: p.id,
              label: p.attributes.label,
              ref: p.attributes.ref,
              coords:
                p.attributes.long !== null && p.attributes.lat !== null
                  ? [p.attributes.long, p.attributes.lat]
                  : null,
              functions,
            };
          })
        );
        //this.recomputeCounts();
      }
    },
    columnTdAttrs(row, column) {
      if (column.label === "Nom") {
        return {
          class: "nom",
          style: {
            "min-width": "auto",
          },
        };
      } else if (column.label === "Identifiant de référence") {
        return {
          class: "refid",
          style: {
            "min-width": this.popupMode ? "45%" : null,
          },
        };
      } else if (column.label === "Description") {
        return {
          class: "function",
          style: {
            "min-width": this.popupMode ? "auto" : null,
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

  .checkbox {
    display: inline-flex;
  }
  .search-container {
    margin-bottom: 10px;

    @include on-tablet {
      margin-bottom: 20px;
    }

    @include on-mobile {
      margin-bottom: 10px;
    }
  }
  .search-container input {
    width: 100% !important;
    vertical-align: center;
  }
  .control, .search_input {
    width: 100% !important;
    margin-right: 1px !important;
    .icon {
      padding: 0px !important;
    }
    input[type="search"] {
      //border-right-color: #FFFFFF !important;
      border-bottom-right-radius: 4px !important;
      border-top-right-radius: 4px !important;
      height: 100%;
      padding-top: 2px;
      padding-bottom: 2px;

      font-family: $family-primary;
      font-size: 18px;
      font-weight: 400;
      color: #343434;

      @include on-mobile {
        font-size: 15px;
      }
      &:hover,
      &:focus {
        border-bottom-right-radius: 4px !important;
        border-top-right-radius: 4px !important;
        //border-right-color: transparent !important;
        box-shadow: none !important;
      }
    }
  }
  .search_button {
    border-color: white !important;
    outline: none !important;
    box-shadow: none !important;
    color: rgba(127, 0, 56) !important;
    //border-bottom-left-radius: 0px !important;
    //border-top-left-radius: 0px !important;

    &.pl-5 {
      @include on-mobile {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
    }

    i.fa-search {
      text-indent: -9999px;
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url(../../assets/images/icons/loupe_header.svg) center / contain no-repeat;

      @include on-mobile {
        width: 20px;
        height: 20px;
      }
    }
 }
  .searchbox-container {
    display: flex;

    .field {
      margin-right: 24px;
    }
  }
  .ref-section-heading {
    border-bottom: 1px solid $nice-grey;
  }
  .section-title {
    background-color: $light;
  }
  td {
    &.nom {
      display: flex;
      padding: 15px 15px 15px 0px !important;
      white-space: break-spaces;
    }

    &.description {
      display: flex;
      padding: 0px 15px 0px 0px !important;

      span.tags {
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: center;
        margin: auto !important;
        padding: 4px 4px 4px 4px !important;
        text-align: center;

        span {
          display: flex;
          height: auto !important;
          margin: 4px 0px 4px 0px !important;
          padding: 4px 4px 4px 4px !important;
          text-align: center;
          white-space: break-spaces;
        }
      }
    }
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
  .pagination-controls {
    display: flex;
    align-items: center;
    /*visibility: hidden;*/

    & > * {
      display: inline-block;
      width: 38px;
      height: 38px;
      margin-right: 6px;
    }
    & > a {
      display: inline-block;
      width: 38px;
      height: 38px;
      background-color: #C3C3C3;
      border-radius: 3.2px;
    }
    & > a.disabled {
      cursor: not-allowed !important;
    }
    & > a.first-page {
      background: #C3C3C3 url(../../assets/images/icons/page_debut.svg)  center / 28px auto no-repeat;
    }
    & > a.previous-page {
      background: #C3C3C3 url(../../assets/images/icons/page_precedent.svg) center / 28px auto no-repeat;
    }
    & > a.next-page {
      background: #C3C3C3 url(../../assets/images/icons/page_suivant.svg) center / 28px auto no-repeat;
    }
    & > a.last-page {
      background: #C3C3C3 url(../../assets/images/icons/page_fin.svg) center / 28px auto no-repeat;
    }
    & > input {
      height: 38px !important;
      padding: 0 !important;
      border: 1px solid #C00055;
      border-radius: 3.2px;

      font-family: $family-primary;
      font-size: 18px;
      color: #CB2158;
      font-weight: 800;
      text-align: center;
      text-decoration: none;

      &:focus {
        outline: 1px solid #C00055;
      }
    }

    & > span.label-sur-page {
      font-family: $family-primary;
      font-size: 11px;
      line-height: 38px;
      color: #979797;
      font-weight: 500;
      text-align: center;
      text-transform: uppercase;
    }

    & > span.total-pages {
      background-color: #DFDFDF;
      border-radius: 3.2px;

      font-family: $family-primary;
      font-size: 18px;
      line-height: 38px;
      color: #818181;
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
  .results-count-and-pagination {
    @include on-mobile {
      flex-direction: column;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      margin-bottom: 20px;
    }
  }
  .popup-list-header {
    /*border-top: solid 1px #FDB3CC;
    border-bottom: solid 1px #C7C7C7;*/
    margin-bottom: 25px;

    @include on-mobile {
      margin-bottom: 10px;
    }

    .results-count {
      display: flex;
      align-items: center;
      gap: 10px;

      font-family: $family-primary;
      font-size: 14px;
      color: #6D7278;
      font-weight: 600;
      text-transform: uppercase;

      .total-count {
        font-size: 50px;
        color: #FF0052;
        text-align: center;
        font-weight: 700;

        @include on-mobile {
          font-size: 30px;
        }
      }
    }
  }
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
}
</style>
