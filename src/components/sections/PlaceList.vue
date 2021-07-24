<template>
  <div class="section">
    searchTerm: {{ searchTerm }}
    <br />
    items: {{ items }}
    <div>Environ {{ totalCount }} résultat(s)</div>
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
          label="id"
          :td-attrs="columnTdAttrs"
          sortable
        >
          {{ props.row.id }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="label"
          label="Nom"
          :td-attrs="columnTdAttrs"
          sortable
        >
          {{ props.row.label }}
        </b-table-column>

        <b-table-column v-slot="props" field="ref" label="Ref" :td-attrs="columnTdAttrs">
          {{ props.row.ref }}
        </b-table-column>

        <template #empty>
          <div class="has-text-centered">Aucun résultat</div>
        </template>

        <template #detail="props">
          {{ props.row }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "PlaceList",
  components: {},
  props: {},
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ...mapState("placenames", [
      "placenamesHavingRoles",
      "documents",
      "loadingStatus",
      "numPage",
      "pageSize",
      "totalCount",
      "sorts",
      "searchTerm",
    ]),
    ...mapState("placenames", { items: "documents" }),

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
  },
  watch: {
    documents() {
      this.loadAsyncData();
    },
  },
  created() {
    //this.setSearchTerm("relationships.placename_function:donjon");
    this.setSearchTerm("label.keyword:Caen");

    this.performSearch();
    this.loadAsyncData();
  },
  methods: {
    ...mapActions("placenames", [
      "setNumPage",
      "performSearch",
      "setSorts",
      "setSearchTerm",
    ]),

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

      this.performSearch();
      this.loadAsyncData();
    },

    async loadAsyncData() {
      if (this.documents) {
        this.tableData = await Promise.all(
          this.documents.map(async (d) => {
            return {
              //placeFunction: d.attributes.function,
              //placename: d.placename,
              // placenameRole: d.role,

              id: d.id,
              label: d.attributes.label,
              ref: d.attributes.ref,
            };
          })
        );
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

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.section {
  width: 100%;
}
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
</style>
