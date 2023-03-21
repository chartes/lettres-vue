<template>
  <div class="section">
    <div class="document-list-header">
      <div class="results-count">
        <span class="total-count">{{ totalCount }}</span> résultat(s)
      </div>
    </div>

    <span
      v-if="totalCount"
      class="pagination-goto"
    >
      <input
        v-model="currentPage"
        name="page"
        class="input"
        type="text"
        placeholder="Page..."
        @change.prevent="currentPage = parseInt(p)"
      >
      <span class="label-sur-page">sur</span>
      <span class="total-pages">{{ totalPages }}</span>
    </span>

    <div class="">
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
        @sort="sortPressed"

        @sorting-priority-removed="sortingPriorityRemoved"
        @page-change="onPageChange"
      >
        <b-table-column
          v-slot="props"
          field="id"
          label="Lettre"
          :td-attrs="columnTdAttrs"
          sortable
        >
          <document-tag-bar
            :doc-id="props.row.id"
            :with-status="withStatus"
          />
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="creation"
          label="Date de rédaction"
          :td-attrs="columnTdAttrs"
          sortable
        >
          {{ props.row.creation }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="title"
          label="Titre"
          :td-attrs="columnTdAttrs"
        >
          <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
            <h2
              class="document-preview-card__title"
              v-html="props.row.title"
            />
          </router-link>
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

export default {
  name: "DocumentList",
  components: {
    DocumentTagBar: () => import("@/components/document/DocumentTagBar"),
    Document: () => import("@/components/sections/Document")
  },
  props: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    ...mapState("search", ["documents", "loadingStatus", "numPage", "pageSize", "totalCount", "withStatus", "sorts"]),
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
            this.setNumPage(newValue)
            this.performSearch(this.sortingPriority)
            this.loadAsyncData()
          }
        }
    },
    totalPages: function() {
      return Math.ceil(this.totalCount / this.pageSize)
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
         /*
        * Handle page-change event
        */
            onPageChange(page) {
                this.currentPage = page
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
</style>
