<template>
  <div
      class="section"
      :class="toggleCssClass"
  >
    <div class="document-list-header is-flex is-justify-content-space-between is-align-items-center">
      <div class="is-inline-block">
        <div class="results-count">
          <span class="total-count">{{ totalCount }}</span> résultat(s)
        </div>
      </div>
      <div class="is-inline-block">
        <div class="control">
          <div class="switch-button-div">
            <div
              class="switch-button"
              :class="toggleCssClass"
              @click="toggle"
            >
              <input
                class="switch-button-checkbox"
                type="checkbox"
              >
              <label
                class="switch-button-label"
                for=""
              >
                <span class="switch-button-label-span">TABLEAU</span>
              </label>
            </div>
          </div>
        </div><!-- v-model="isResultTableMode"-->
      </div>
    </div>

    <div
      v-if="totalPages"
      class="pagination-controls"
    >
      <a
        :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
        @click="currentPage <= 1 ? null : currentPage = 1"
      >
      </a>
      <a
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
        :class="currentPage < totalPages ? 'button next-page' : 'button next-page disabled'"
        @click="currentPage < totalPages ? ++currentPage : null"
      >
      </a>
      <a
        :class="currentPage < totalPages ? 'button last-page' : 'button last-page disabled'"
        @click="currentPage < totalPages ? currentPage = totalPages : null"
      >
      </a>
    </div>

    <div :class="toggleCssClass">
      <b-table
        ref="multiSortTable"
        :data="tableData"

        :loading="loadingStatus"
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
        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
      >
        <b-table-column
          field="id"
          label="Lettre"
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
                <span class="icon button multi-sort-cancel-icon">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down"></i>
                </span>
                <span class="icon button">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
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
            <document-tag-bar
              :doc-id="props.row.id"
              :with-status="withStatus"
              :preview="true"
            />
          </template>
        </b-table-column>

        <b-table-column
          field="creation"
          label="Date de rédaction"
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
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down"></i>
                </span>
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
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
            {{ props.row.creation }}
          </template>
        </b-table-column>

        <b-table-column
          field="title"
          label="Titre"
          :td-attrs="columnTdAttrs"
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
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down">
                  <i class="fas fa-arrow-down"></i>
                </span>
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                  <button
                    class="delete is-small multi-sort-cancel-icon"
                    type="button"
                    @click.stop="sortingPriorityRemoved(column.field)"
                  />
                </span>
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
            <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
              <h2
                v-if="searchTerm && searchTerm.length > 0"
                class="document-preview-card__title"
                v-html="highlight(props.row.title)"
              />
              <h2
                v-else
                class="document-preview-card__title"
                v-html="props.row.title"
              />
            </router-link>
          </template>
        </b-table-column>

        <b-table-column
            field="expéditeur"
            label="Expéditeur"
            :td-attrs="columnTdAttrs"
            sortable
        >
          <template v-slot="props">
            <p>(personne) {{ props.row.sender }}</p>
          </template>
        </b-table-column>

        <b-table-column
            field="destinataire"
            label="Destinataire"
            :td-attrs="columnTdAttrs"
            sortable
        >
          <template v-slot="props">
            <p>(personnes) {{ props.row.recipient }}</p>
          </template>
        </b-table-column>

        <b-table-column
            field="lieu-expedition"
            label="Lieu d'expédition"
            :td-attrs="columnTdAttrs"
            sortable
        >
          <template v-slot="props">
            <p>(lieu) {{ props.row.origin }}</p>
          </template>
        </b-table-column>

        <b-table-column
            field="lieu-destination"
            label="Lieu de destination"
            :td-attrs="columnTdAttrs"
            sortable
        >
          <template v-slot="props">
            <p>(lieu) {{ props.row.destination }}</p>
          </template>
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">
            Aucun résultat
          </div>
        </template>

        <template #detail="props">
          <document
            class="document-page"
            :doc-id="props.row.id"
            :preview="true"
          />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import escapeRegExp from "lodash/escapeRegExp";

export default {
  name: "DocumentList",
  components: {
    DocumentTagBar: () => import("@/components/document/DocumentTagBar"),
    Document: () => import("@/components/sections/Document")
  },
  props: {},
  data() {
    return {
      tableData: [],
      p: 1,
      isActive: true,
    };
  },
  computed: {
    ...mapState("search", ["searchTerm", "documents", "loadingStatus", "numPage", "pageSize", "totalCount", "withStatus", "sorts"]),
    ...mapState("user", ["current_user"]),

    sortingPriority: {
      get: function() {
        return this.sorts
      },

      set: function (value) {
        this.setSorts(value)
      }
    },

    currentPage: {
        get: function () {
          return this.numPage
        },
        set: function (newValue, oldValue) {
          newValue = parseInt(newValue)
          if (newValue && newValue !== oldValue) {
            this.p = newValue
            this.setNumPage(newValue)
            this.performSearch(this.sortingPriority)
            this.loadAsyncData()
          }
        }
    },
    totalPages: function() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    toggleCssClass: function() {
      return this.isActive ? 'is-active' : 'is-inactive';
    },
  },
  watch: {
    documents() {
      this.loadAsyncData()
    }
  },
  created() {
    this.loadAsyncData()
  },
  methods: {
    ...mapActions("search", ["setNumPage", "performSearch", "setSorts"]),
    highlight(text) {
      if (this.searchTerm.length > 0) {
        const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
        const re = new RegExp(`(${terms.join("|")})`)
        return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
      }
    },
    resetPriority(){
      console.log('reset')
      this.$refs.multiSortTable.resetMultiSorting()
      // reset local backend sorting
      if(this.backendSortingEnabled) {
        this.sortingPriority = []
        this.performSearch()
        this.loadAsyncData()
      }
    },

    // Backend sorting
    sortingPriorityRemoved(field){
      const newPriority = this.sortingPriority.filter((priority) => priority.field !== field )
      this.sortingPriority = [...newPriority]
      console.log(newPriority, this.sortingPriority)
      this.performSearch()
      this.loadAsyncData()
    },

    sortPressed(field, order, event) {
      if((this.customKey && event[this.customKey]) || !this.customKey) {
        let existingPriority = this.sortingPriority.filter(i => i.field === field)[0]
        if(existingPriority) {
          existingPriority.order = existingPriority.order === 'desc' ? 'asc' : 'desc'
        } else {
          // request sorted data from backend
          this.sortingPriority.push({field, order})
        }
        this.setSorts(this.sortingPriority)
      } else {
        // request regular sorted data from backend
        this.sortingPriority = [] // [{field, order}]
        this.setSorts([])
      }
      
      this.performSearch()
      this.loadAsyncData()
    },

    async loadAsyncData() {
      if (this.documents) {
        this.tableData = await Promise.all(this.documents.map(async d => {
        return {
          id: d.id,
          title:  d.attributes.title,
          creation:  d.attributes.creation,
        }
        }));
      }
    },
    toggle() {
      if (this.isActive === true) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
    columnTdAttrs(row, column) {
      if (column.label === 'Titre') {
        return {
          class: '',
          style: {
            'max-width': '550px'
          }
        }
      }
      else if (column.label === 'Date de rédaction') {
        return {
          class: '',
          style: {
            'max-width': '300px'
          }
        }
      } else {
        return null
      }
    },
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

.section {
  width: 100%;
  padding: 70px 0 0 !important;
}
progress {
  margin-top: 30px;
}
.switch-button {
  background-color: lightgrey;
  border-radius: 30px;
  overflow: hidden;
  width: 240px;
  height: 35px;
  text-align: center;
  position: relative;
  padding-right: 120px;

  font-family: $family-primary;
  font-size: 14px;

  color: white;
  transition: all ease-in-out 300ms;

  &.is-active {
    color: grey;
    .switch-button-label-span {
      color: white;
    }
  }

  &.is-inactive {
    color: white;
    .switch-button-label-span {
      color: grey;
    }
  }

  &:before {
    content: "DEPLIE";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 120px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    pointer-events: none;
  }

  &-checkbox {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;

    &:checked + .switch-button-label:before {
      transform: translateX(120px);
      transition: transform 300ms linear;
    }

    & + .switch-button-label {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      pointer-events: none;
      height: 100%;

      &:before {
        content: "";
        background: rgb(255, 0, 83);
        height: 35px;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 30px;
        transform: translateX(0);
        transition: transform 300ms;
      }

      .switch-button-label-span {
        position: relative;
      }
    }
  }
}
.pagination-controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
  & > input[type=number],
  & > input[type=text] {
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

</style>
