<template>
  <div>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <div class="popup-list-header is-inline-block">
        <div class="results-count">
          <span class="total-count">{{ totalCount }}</span> résultat(s)
        </div>
      </div>
      <div class="is-inline-block">
        <div
          v-if="totalPages"
          class="pagination-controls"
        >
          <a
            :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
            @click="currentPage <= 1 ? null : currentPage = 1"
          />
          <a
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
            :class="currentPage < totalPages ? 'button next-page' : 'button next-page disabled'"
            @click="currentPage < totalPages ? ++currentPage : null"
          />
          <a
            :class="currentPage < totalPages ? 'button last-page' : 'button last-page disabled'"
            @click="currentPage < totalPages ? currentPage = totalPages : null"
          />
        </div>
      </div>
    </div>
    <div>
      <b-table
        ref="multiSortTable"
        :data="data"
        :loading="isLoading"
        striped

        backend-pagination
        :total="totalCount"
        :per-page="pageSize"
        :current-page.sync="currentPage"
        :backend-sorting="true"
        :sort-multiple="true"
        :sort-multiple-data="sortingPriority"
        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
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
          sortable
          width="100"
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button">
                  <i class="fas fa-arrow-up" />
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
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button">
                  <i class="fas fa-arrow-down" />
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
          width="200"
          sortable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button">
                  <i class="fas fa-arrow-up" />
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
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button">
                  <i class="fas fa-arrow-down" />
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
          <template #default="props">
            <span v-html="props.row['event-date']" />
          </template>
        </b-table-column>
        <b-table-column
          field="user_id"
          label="Utilisateur"
          width="200"
          sortable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button">
                  <i class="fas fa-arrow-up" />
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
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button">
                  <i class="fas fa-arrow-down" />
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
          <template #default="props">
            <span v-html="props.row.user" />
          </template>
        </b-table-column>

        <b-table-column
          field="description"
          label="Description"
          sortable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button">
                  <i class="fas fa-arrow-up" />
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
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'desc'">
                <span class="icon button">
                  <i class="fas fa-arrow-down" />
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
          <template #default="props">
            <span>{{ props.row.description }} </span>
          </template>
        </b-table-column>
      </b-table>
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
          console.log(newPriority, this.sortingPriority);
      } else {
          // default sorting on descending event-date
          this.sortingPriority = [{ field: "event-date", order: "desc" }];
          console.log("Default sorting new Priority", newPriority, this.sortingPriority);
      }
      await this.loadAsyncData();
    },

    async sortPressed(field, order, event) {
      console.log("sorting added", field, order, event)
      console.log("this.customKey / event[this.customKey]", this.customKey, event[this.customKey])
      if ((this.customKey && event[this.customKey]) || !this.customKey) {
        let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        if (existingPriority) {
          existingPriority.order = existingPriority.order === "desc" ? "asc" : "desc";
        } else {
          // request sorted data from backend
          this.sortingPriority.push({ field, order });
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

  .pagination-controls {
    display: flex;
    align-items: center;
    /*visibility: hidden;*/

    & > * {
      display: inline-block;
      width: 38px;
      height: 38px;
      margin-right: 4px;
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
  .popup-list-header {
    /*border-top: solid 1px #FDB3CC;
    border-bottom: solid 1px #C7C7C7;*/
    margin-bottom: 25px;

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
