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
        @sorting-priority-removed="sortingPriorityRemoved"
      >
        <template #empty>
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>Vous n'avez aucun favori pour le moment.</p>
            </div>
          </section>
        </template>
        <b-table-column
          field="id"
          label="Lettre"
          sortable
          width="10%"
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
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
                <span class="icon button arrow-down">
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
            <document-tag-bar
              :key="props.row.id"
              :doc-id="props.row.id"
              :with-status="false"
              :preview="true"
            />
          </template>
        </b-table-column>
        <b-table-column
          field="title"
          label="Titre"
          width="40%"
          sortable
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
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
                <span class="icon button arrow-down">
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
            <span v-html="props.row.title" />
          </template>
        </b-table-column>

        <b-table-column
          field="witnesses"
          label="Témoins"
          width="50%"
        >
          <template #header="{ column }">
            <div v-if="column.sortable">
              <div v-if="sortingPriority.filter(obj => obj.field === column.field).length === 0">
                <span
                  class="icon button arrows-alt-v"
                >
                  <i class="fas fa-arrows-alt-v" />
                </span>
              </div>
              <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                <span class="icon button arrow-up">
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
                <span class="icon button arrow-down">
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
            <ul>
              <li
                v-for="witness in props.row.witnesses"
                :key="witness.id"
              >
                <span
                  style="font-size: 0.8em"
                  v-html="witness.attributes.content"
                />
              </li>
            </ul>
          </template>
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTagBar from "@/components/document/DocumentTagBar";

export default {
  name: "BookmarksPage",
  components: {
    DocumentTagBar,
  },
  filters: {
    /**
     * Filter to truncate string, accepts a length parameter
     */
    truncate(value, length) {
      return value.length > length ? value.substr(0, length) + "..." : value;
    },
  },
  data() {
    return {
      data: [],
      sortingPriority: [{ field: "id", order: "asc" }],
      pageSize: 3,
      numPage: 1,
      p: 1,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("bookmarks", ["userBookmarks", "totalCount", "isLoading"]),
    ...mapGetters("document", []),
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
    async userBookmarks() {
      this.data = await Promise.all(
        this.userBookmarks.map(async (b) => {
          return {
            id: b.id,
            title: b.attributes.title,
            witnesses: b.witnesses,
          };
        })
        // local pagination
        .slice(
          (this.numPage- 1) * this.pageSize,
          this.numPage * this.pageSize,
          )
      );
    },
  },
  mounted() {
    this.loadAsyncData();
  },
  methods: {
    ...mapActions("bookmarks", ["fetchUserBookmarks"]),
      async sortingPriorityRemoved(field) {
      console.log("sorting removed", field)
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      if (this.sortingPriority.length > 0) {
          console.log(newPriority, this.sortingPriority);
      } else {
          // default sorting on ascending docId
          this.sortingPriority = [{ field: "id", order: "asc" }];
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
      this.fetchUserBookmarks({
        userId: this.current_user.id,
        numPage: this.numPage, //unused
        pageSize: this.pageSize, //unused
        sortingPriority: this.sortingPriority,
        filters: "",
      });
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
      background: #C3C3C3 url(../assets/images/icons/page_debut.svg)  center / 28px auto no-repeat;
    }
    & > a.previous-page {
      background: #C3C3C3 url(../assets/images/icons/page_precedent.svg) center / 28px auto no-repeat;
    }
    & > a.next-page {
      background: #C3C3C3 url(../assets/images/icons/page_suivant.svg) center / 28px auto no-repeat;
    }
    & > a.last-page {
      background: #C3C3C3 url(../assets/images/icons/page_fin.svg) center / 28px auto no-repeat;
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
