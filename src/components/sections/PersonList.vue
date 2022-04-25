<template>
  <div class="person-list">
    <div class="search-container">
      <section>
        <header />
        <div class="searchbox-container">
          <div class="searchbox-container">
            <b-field label="Nom" class="term-search">
              <div class="field has-addons">
                <div class="control">
                  <input
                    v-model="inputTerm"
                    class="input"
                    type="text"
                    placeholder="Catherine de Médics"
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

            <b-field v-if="false" label="Correspondants">
              <b-field>
                <b-checkbox v-model="sender" type="is-info"> Expéditeur </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="recipient" type="is-info"> Destinataire </b-checkbox>
              </b-field>
            </b-field>

            <b-field v-if="false" label="Parties du document">
              <b-field>
                <b-checkbox v-model="inAddress" type="is-info"> Adresse </b-checkbox>
              </b-field>

              <b-field>
                <b-checkbox v-model="inTranscription" type="is-info">
                  Transcription
                </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="inArgument" type="is-info"> Analyse </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="inNotes" type="is-info"> Notes </b-checkbox>
              </b-field>
            </b-field>
          </div>
        </div>
      </section>

      <section v-if="!popupMode && false" class="filterbox-container">
        <header>
          <div class="heading divider is-left">Filtres</div>
        </header>
        Document, personne, date, collection
      </section>
    </div>

    <div>
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
          @page-change="onPageChange"
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
            v-slot="props"
            field="label.keyword"
            label="Nom"
            :td-attrs="columnTdAttrs"
            sortable
          >
            {{ props.row.label }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="functions"
            label="Fonction occupée"
            :td-attrs="columnTdAttrs"
          >
            <span class="tags">
              <span v-for="func in props.row.functions" :key="func" class="tag is-light">
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
            {{ props.row.ref }}
          </b-table-column>
          <!--
          <b-table-column
            v-slot="props"
            field="documents"
            label="Documents"
            :td-attrs="columnTdAttrs"
          >
            <span v-if="personCounts[props.row.id] === 0">-</span>
            <span
              v-else
            >{{ personCounts[props.row.id] }} document
              <span v-if="personCounts[props.row.id] > 1">(s)</span>
            </span>
          </b-table-column>
          -->

          <template #empty>
            <div class="has-text-centered">Aucun résultat</div>
          </template>

          <template #detail="props">
            <div
              v-if="
                (sender && props.row.sender.length > 0) ||
                (recipient && props.row.recipient.length > 0) ||
                (inNotes && props.row.inNotes.length > 0) ||
                (inAddress && props.row.inAddress.length > 0) ||
                (inTranscription && props.row.inTranscription.length > 0) ||
                (inArgument && props.row.inArgument.length > 0)
              "
              class="detail-td"
            >
              <div
                v-if="sender && props.row.sender.length > 0"
                class="columns ref-section-heading"
              >
                <div class="column is-one-quarter section-title">
                  <span class="heading">
                    Dates de lieu d'expédition ({{ props.row.sender.length }})
                  </span>
                </div>
                <div class="column">
                  <document-title-bar
                    v-for="item in props.row.sender"
                    :key="item.docId"
                    :doc-id="item.docId"
                    :title="item.docTitle"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
              <div
                v-if="recipient && props.row.recipient.length > 0"
                class="columns ref-section-heading"
              >
                <div class="column is-one-quarter section-title">
                  <span class="heading">
                    Dates de lieu de réception ({{ props.row.recipient.length }})
                  </span>
                </div>
                <div class="column">
                  <document-title-bar
                    v-for="item in props.row.recipient"
                    :key="item.docId"
                    :doc-id="item.docId"
                    :title="item.docTitle"
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
                    :title="item.docTitle"
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
                    :title="item.docTitle"
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
                    :title="item.docTitle"
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
                    :title="item.docTitle"
                    :creation-label="item.docCreationLabel"
                  />
                </div>
              </div>
            </div>

            <div v-else class="detail-td is-flex is-align-items-center">
              <div class="m-3 mx-auto">Aucune utilisation</div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTitleBar from "../forms/place/DocumentTitleBar.vue";

export default {
  name: "PersonList",
  components: {
    DocumentTitleBar,
  },
  props: {
    popupMode: { type: Boolean, default: true },
  },
  emit: ["manage-person-data"],
  data() {
    let inputTerm = null;

    return {
      itemModification: false,
      selected: null,
      tableData: [],
      personCounts: {},

      inputTerm,
      sender: true,
      recipient: true,
      inAddress: true,
      inArgument: true,
      inNotes: true,
      inTranscription: true,
    };
  },
  computed: {
    ...mapState("persons", {
      persons: "documents",
    }),
    ...mapState("persons", [
      "loadingStatus",
      "numPage",
      "pageSize",
      "totalCount",
      "sorts",
      "searchTerm",
    ]),

    ...mapGetters("persons", {
      personsHavingRoles: "getIncluded",
      functionsByPerson: "getFunctionsByPerson",
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
      return this.inputTerm ? `label:*${this.inputTerm}*` : null;
    },
  },
  watch: {
    persons() {
      this.loadAsyncData();
    },
    inputTerm() {
      this.setSearchTerm(this.labeledInputTerm);
    },
    /*
    sender() {
      this.recomputeCounts();
    },
    recipient() {
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
      if (this.selected) {
        this.managePersonData({ action: { name: "set-person" }, data: this.selected });
      }
    },
    "$attrs.person"() {
      if (
        !this.$attrs.person ||
        !this.selected ||
        this.$attrs.person.id === this.selected.id
      ) {
        // console.log("keep selection", this.$attrs.person);
        if (this.$attrs.person.selection && !this.$attrs.person.id) {
          this.inputTerm = this.$attrs.person.selection;
        }
      } else {
        console.log("unselect");
        this.selected = null;
      }
    },
  },
  async created() {
    if (this.$attrs.person && this.$attrs.person.id) {
      const p = await this.getPersonById(this.$attrs.person.id);
      this.inputTerm = p.attributes.label;
    } else if (this.$attrs.person && this.$attrs.person.selection) {
      this.inputTerm = this.$attrs.person.selection;
    }

    console.log("WIZARD CREATION", this.inputTerm, this.$attrs.person);

    await this.$store.dispatch("persons/fetchRoles");
    this.setSearchTerm(this.labeledInputTerm);
    this.search();
  },
  methods: {
    ...mapActions("persons", [
      "setNumPage",
      "performSearch",
      "setSorts",
      "setSearchTerm",
      "getPersonById",
    ]),

    managePersonData(evt) {
      this.$emit("manage-person-data", evt);
    },

    search() {
      this.performSearch();
      this.loadAsyncData();
    },
    /*
    count(pId) {
      const s_pId = pId.toString();
      let countSet = new Set([]);

      // sender
      if (this.personsHavingRoles.sender[s_pId] && this.sender) {
        const fromSet = new Set(
          this.personsHavingRoles.sender[s_pId].map((i) => i.docId)
        );
        for (let elem of fromSet) {
          countSet.add(elem);
        }
      }
      // recipient
      if (this.personsHavingRoles.recipient[s_pId] && this.recipient) {
        const toSet = new Set(
          this.personsHavingRoles.recipient[s_pId].map((i) => i.docId)
        );
        for (let elem of toSet) {
          countSet.add(elem);
        }
      }
      // inAddress
      if (this.personsHavingRoles.inAddress[s_pId] && this.inAddress) {
        const argSet = new Set(
          this.personsHavingRoles.inAddress[s_pId].map((i) => i.docId)
        );
        for (let elem of argSet) {
          countSet.add(elem);
        }
      }
      // inArgument
      if (this.personsHavingRoles.inArgument[s_pId] && this.inArgument) {
        const argSet = new Set(
          this.personsHavingRoles.inArgument[s_pId].map((i) => i.docId)
        );
        for (let elem of argSet) {
          countSet.add(elem);
        }
      }
      // inNotes
      if (this.personsHavingRoles.inNotes[s_pId] && this.inNotes) {
        const argSet = new Set(
          this.personsHavingRoles.inNotes[s_pId].map((i) => i.docId)
        );
        for (let elem of argSet) {
          countSet.add(elem);
        }
      }
      // inTranscription
      if (this.personsHavingRoles.inTranscription[s_pId] && this.inTranscription) {
        const trSet = new Set(
          this.personsHavingRoles.inTranscription[s_pId].map((i) => i.docId)
        );
        for (let elem of trSet) {
          countSet.add(elem);
        }
      }

      this.personCounts[s_pId] = countSet.size || 0;

      return countSet.size;
    },
    
    recomputeCounts() {
      this.personCounts = {};
      for (let p of this.persons) {
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
      if (this.persons) {
        this.tableData = await Promise.all(
          this.persons.map(async (p) => {
            const functions = this.functionsByPerson[p.id]
              ? [...new Set(this.functionsByPerson[p.id].map((item) => item.function))]
              : [];

            return {
              documents: this.personsHavingRoles.documents[p.id] || [],
              sender: this.personsHavingRoles.sender[p.id] || [],
              recipient: this.personsHavingRoles.recipient[p.id] || [],
              inAddress: this.personsHavingRoles.inAddress[p.id] || [],
              inArgument: this.personsHavingRoles.inArgument[p.id] || [],
              inNotes: this.personsHavingRoles.inNotes[p.id] || [],
              inTranscription: this.personsHavingRoles.inTranscription[p.id] || [],

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

.person-list {
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
    margin-bottom: 40px;
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
