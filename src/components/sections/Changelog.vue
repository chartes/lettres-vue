<template>
  <div>
    <div class="results-count-and-pagination">
      <div class="popup-list-header is-flex is-justify-content-space-between is-align-items-center">
        <div class="results-count">
          <span class="total-count">{{ totalCount }}</span> résultat(s)
        </div>
        <div>
          <div
            v-if="totalPages"
            class="pagination-controls"
          >
            <a
              :disabled="currentPage <= 1"
              :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
              @click="currentPage <= 1 ? null : currentPage = 1"
            />
            <a
              :disabled="currentPage <= 1"
              :class="currentPage <= 1 ? 'button previous-page disabled' : 'button previous-page'"
              @click="currentPage <= 1 ? null : --currentPage"
            />
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
            />
            <a
              :disabled="currentPage >= totalPages"
              :class="currentPage < totalPages ? 'button last-page' : 'button last-page disabled'"
              @click="currentPage < totalPages ? currentPage = totalPages : null"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="result-container">
      <b-table
        ref="multiSortTable"
        :data="data"
        :loading="isLoading"
        striped

        :total="totalCount"
        :per-page="pageSize"
        :current-page.sync="currentPage"
        :backend-sorting="true"
        :sort-multiple="true"
        :sort-multiple-data="sortingPriority"
        @sort="sortPressed"
      >
        <template #empty>
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>Aucun historique de modifications</p>
            </div>
          </section>
        </template>

        <b-table-column
          field="object-id"
          label="Lettre"
          sortablef
        >
          <template v-slot:header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span class="icon button arrows-alt-v" />
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
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
          <template #default="props">
            <router-link
              :to="{ name: 'document', params: { docId: props.row.docId } }"
              class="tag document-preview-card__doc-tag"
            >
              <span>{{ props.row.docId }}</span>
            </router-link>
          </template>
        </b-table-column>
        <b-table-column
          field="event-date"
          label="Date"
          sortable
        >
          <template v-slot:header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span class="icon button arrows-alt-v" />
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
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
          <template #default="props">
            <span v-html="props.row['event-date']" />
          </template>
        </b-table-column>
        <b-table-column
          field="user_id"
          label="Utilisateur"
          sortable
        >
          <template v-slot:header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span class="icon button arrows-alt-v" />
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
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
          <template #default="props">
            <span v-html="props.row.user" />
          </template>
        </b-table-column>

        <b-table-column
          field="description"
          label="Description"
          sortable
        >
          <template v-slot:header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span class="icon button arrows-alt-v" />
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button arrow-down" />
                <span class="icon button sort-index">
                  {{ sortingPriority.findIndex(obj => obj.field === column.field) + 1 }}
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
          <template #default="props">
            <span>{{ props.row.description }} </span>
          </template>
        </b-table-column>
      </b-table>
    </div>
    <div class="results-count-and-pagination is-flex is-justify-content-flex-end is-align-items-center mt-5">
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
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Changelog",
  components: {},
  props: {
    pageSize: { type: Number, default: 30 },
    docId: { type: Number, default: null },
  },
  data() {
    return {
      data: [],
      sortingPriority: [{ field: "event-date", order: "desc" }],
      numPage: 1,
      p: 1,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("changelog", ["fullChangelog","isLoading", "totalCount"]),
    totalPages: function() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    currentPage: {
      get: function () {
        return this.numPage;
      },
      set: async function (newValue, oldValue) {
        newValue = parseInt(newValue);
        if (newValue && newValue !== oldValue && newValue >=1 && newValue <= this.totalPages ) {
          this.p = newValue;
          this.numPage = newValue;
          await this.loadAsyncData();
        }
      },
    },
  },
  watch: {
    fullChangelog() {
      this.data = this.fullChangelog.map((c) => {
        return {
          docId: c.data.attributes["object-id"],
          'event-date': c.data.attributes["event-date"],
          user: c.user.username,
          description: c.data.attributes.description,
        };
      });
    },
  },
  mounted() {
    if (this.$refs.multiSortTable.backendSorting === true) {
      console.log("la table est backendSorting")
    }
    this.loadAsyncData();
  },
  methods: {
    ...mapActions("changelog", ["fetchFullChangelog"]),
    // Backend sorting
    async sortingPriorityRemoved(field) {
      console.log("sorting removed", field)
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      if (this.sortingPriority.length > 0) {
          console.log("newPriority/sortingPriority", newPriority, this.sortingPriority);
      } else {
          // default sorting on descending event-date
          this.sortingPriority = [{ field: "event-date", order: "desc" }];
          console.log("Default sorting new Priority", newPriority, this.sortingPriority);
      }
      await this.loadAsyncData();
    },

    async sortPressed(field, order, event) {
      console.log("sorting added", field, order, event)
      //console.log("this.customKey / event[this.customKey]", this.customKey, event[this.customKey])
      if ((this.customKey && event[this.customKey]) || !this.customKey) {
        let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        if (existingPriority) {
          // UPDATE SORTING
          // console.log("existingPriority", existingPriority)
          if (existingPriority.order === "desc") {
            // SORTING WAS 'desc' UPDATED TO 'asc'
            existingPriority.order = "asc";
          } else if (existingPriority.order === "asc") {
            // SORTING WAS 'asc' UPDATED TO unset
            this.sortingPriorityRemoved(field);
          } else {
            existingPriority.order = "desc"; // unused scenario
          }
          //existingPriority.order = existingPriority.order === "desc" ? "asc" : existingPriority.order === "asc" ? this.sortingPriorityRemoved(field) : "desc" ;
        } else {
          // NO SORTING : request sorted data (note History is sorted from backend)
          // default sorting here, need to be equivalent to default sortingPriority :
          // here default is 'desc', hence a new priority needs to be 'desc' so that clicks follows desc -> asc -> unset -> etc
          this.sortingPriority.push({ field, order: "desc"});
          console.log("this.sortingPriority", this.sortingPriority)
        }
      } else {
        // request regular sorted data from backend
        this.sortingPriority = []; // [{field, order}]
      }
      // will reload the data
      this.currentPage = 1;
    },
    /*
     * Load async data
     */
    loadAsyncData() {
      let filters = "";
      if (this.docId) {
        filters = `filter[object-type]=document&filter[object-id]=${this.docId}`;
      }
      if (this.current_user.isAdmin || filters.length > 0) {
        // user is admin, can only full history (HistoryPage) or when history is related to a document (DocumentVue) then shows all users
        console.log("this.sortingPriority in query", this.sortingPriority)
          this.fetchFullChangelog({
          numPage: this.numPage,
          pageSize: this.pageSize,
          sortingPriority: this.sortingPriority,
          filters: filters,
        });
      } else {
        // user not admin, can only access his own history (HistoryPage)
        if (this.current_user) {
          filters = filters + `filter[user_id]="${this.current_user.id}"`;
        }
        this.fetchFullChangelog({
          numPage: this.numPage,
          pageSize: this.pageSize,
          sortingPriority: this.sortingPriority,
          filters: filters,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";
.result-container {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #fdb3cc;
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
    border-top: solid 1px #FDB3CC;
    border-bottom: solid 1px #C7C7C7;
    margin-bottom: 25px;

    @include on-mobile {
      flex-direction: column;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      gap: 10px;
      padding-bottom: 10px;
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

</style>
