<template>
  <div class="large-container">
    <div class="collection-card-parent">
      <collection-interactive-card
        :collection-id="collectionId"
        :editable="true"
      />
    </div>
    <section class="mb-5">
      <div class="is-flex">
        <span class="collection-documents">{{ totalCount }} DOCUMENTS</span>
      </div>
      <div class="is-flex is-justify-content-flex-end">
        <router-link
          :to="{ name: 'search'}"
        >
          <b-button
            class="search-collection"
            label="Rechercher dans la collection"
            @click="searchCollection"
          />
        </router-link>
      </div>
    </section>
    <section class="mb-5">
      <!-- Table toogle + pagination -->
      <div
        v-if="totalCount"
        class="is-flex toggle-list-and-pagination is-justify-content-space-between"
      >
        <div class="is-inline-block">
          <div
            v-if="totalPages"
            class="has-text-centered"
          >
            <div class="pagination-controls">
              <a
                :class="currentPage <= 1 ? 'button first-page disabled' : 'button first-page'"
                @click="currentPage <= 1 ? null : currentPage = 1 "
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
          </div>
        </div>
        <div
          v-if="!isActive"
          class="field is-inline-block px-1"
        >
          <!--v-if="!isActive && isFulltextSearch"-->
          <div class="control mb-6 block is-inline-block sort-options">
            <span> Tris </span>
            <div class="is-inline-block">
              <select
                id="tri-select"
                v-model="sortingPriority"
                name="tri"
              >
                <option value="">
                  Lettre
                </option>
                <option
                  :value="sortingPriority.includes('-')
                    ? '-metadata.author_name.keyword'
                    : 'metadata.author_name.keyword'
                  "
                >
                  Expéditeur
                </option>
                <option
                  :value="
                    1
                  "
                >
                  Date de rédaction
                </option>
                <option
                  :value="
                    2
                  "
                >
                  Période du sujet (borne inf.)
                </option>
                <option
                  :value="
                    3
                  "
                >
                  Période du sujet (borne sup.)
                </option>
              </select>
              <span
                v-if="sortingPriority"
                class="icon button"
                @click="sortingPriority = sortingPriority.replace('-', '')"
              >
                <i class="fas fa-arrow-up" />
              </span>
              <span
                v-else
                v-show="sortingPriority.length > 0"
                class="icon button"
                @click="sortingPriority = `-${sortingPriority}`"
              >
                <i class="fas fa-arrow-down" />
              </span>
            </div>
          </div>
        </div>
        <div class="is-inline-block px-1">
          <div class="control">
            <div class="switch-button-div">
              <div
                class="switch-button"
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
    </section>
    <section>
      <div class="">
        <b-table
          ref="multiSortTable"
          :data="tableData"
          backend-pagination
          :loading="isLoading"
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
                    class="icon button"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                  </span>
                </div>
                <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                  <span class="icon button">
                    <i class="fas fa-arrow-up"></i>
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
                    class="icon button"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                  </span>
                </div>
                <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                  <span class="icon button">
                    <i class="fas fa-arrow-up"></i>
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
                    class="icon button"
                  >
                    <i class="fas fa-arrows-alt-v"></i>
                  </span>
                </div>
                <div v-else-if="sortingPriority.filter(obj => obj.field === column.field)[0].order === 'asc'">
                  <span class="icon button">
                    <i class="fas fa-arrow-up"></i>
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
              <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
                <h2
                  class="document-preview-card__title"
                  v-html="props.row.title"
                />
              </router-link>
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
    </section>
  </div>
</template>

<script>
import CollectionInteractiveCard from "@/components/CollectionInteractiveCard.vue";
import { mapActions, mapState } from "vuex";
import CollectionHierarchy from "@/components/CollectionHierarchy.vue";

export default {
  name: "CollectionPage",
  components: {
    CollectionInteractiveCard,
    DocumentTagBar: () => import("@/components/document/DocumentTagBar"),
    Document: () => import("@/components/sections/Document")
  },
  props: {
    "collectionId": {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      fetchedData: [],
      tableData: [],
      sortingPriority: [{ field: "creation", order: "desc" }],
      numPage: 1,
      p: 1,
      pageSize: 30,
      totalCount: 0,
      totalPages: 0,
      isLoading: false,
      showHierarchy: false,
      isActive: true
    };
  },
  computed: {
  ...mapState("search", ["withStatus", "searchTerm"]),
    currentPage: {
      get: function () {
        return this.numPage;
      },
      set: async function (newValue, oldValue) {
        newValue = parseInt(newValue);
        if (newValue && newValue !== oldValue && newValue >=1 && newValue <= this.totalPages ) {
          this.p = newValue;
          this.numPage = newValue;
          console.log("set 1")
          await this.fetchData();
          console.log("set 2")
        }
      },
    },
    ...mapState("user", ["current_user"]),
  },
  watch: {
    collectionId: async function () {
      console.log("Watch");
      await this.fetchData();
      this.totalPages = this.fetchedData.totalCount === 0 ? 1 : parseInt(Math.ceil(this.fetchedData.totalCount / this.pageSize));
      console.log("this.totalPages : ", this.totalPages);
    },
  },
  async created() {
    console.log("Created")
    await this.fetchData();
    this.totalPages = this.fetchedData.totalCount === 0 ? 1 : parseInt(Math.ceil(this.fetchedData.totalCount / this.pageSize));
    console.log("this.totalPages : ", this.totalPages);
  },
  methods: {
    ...mapActions("collections", ["fetchOne", "fetchAll"]),
    columnTdAttrs(row, column) {
      if (row.label === 'Lettre') {
        return {
          class: 'lettre',
          /*style: {
            'background-color': 'red',
          }*/
        }
      }
    },
    searchCollection() {
      this.$store.state.search.selectedCollections = [this.$store.state.collections.collectionsById[this.collectionId]];
      this.$store.state.layout.showLeftSideBar = true
    },
    toggle() {
      if (this.isActive === true) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
    /*async goToPage(num) {
      if (!parseInt(num)) {
        num = 1;
      }

      if (num > this.totalPages) {
        num = this.totalPages;
      } else if (num < 1) {
        num = 1;
      }
      this.currentPage = num;

      if (this.numPage !== num) {
        //await this.fetchData();
      }
    },*/
    async fetchData() {
      this.isLoading = true;
      console.log("this.fetchAll()")
      await this.fetchAll();
      console.log("this.fetchOne")
      this.fetchedData = await this.fetchOne({
        id: this.collectionId,
        numPage: this.numPage,
        pageSize: this.pageSize,
        sortingPriority: this.sortingPriority,
      });
      this.loadAsyncData();
      this.isLoading = false;
    },
    async resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        await this.fetchData();
      }
    },

    // Backend sorting
    async sortingPriorityRemoved(field) {
      console.log("sorting removed")
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      console.log(newPriority, this.sortingPriority);
      await this.fetchData();
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
        }
      } else {
        // request regular sorted data from backend
        this.sortingPriority = []; // [{field, order}]
      }
      // will reload the data
      this.currentPage = 1;
    },

    loadAsyncData() {
      if (this.fetchedData) {
        this.totalCount = this.fetchedData.totalCount;
        this.tableData = this.fetchedData.documents.map((d) => {
          return {
            id: d.id,
            title: d.attributes.title,
            creation: d.attributes.creation,
          };
        });
      }
    },
    /*
     * Handle page-change event

    onPageChange(page) {
      console.log("page change")
      this.currentPage = page;
    },*/
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

::v-deep .sidebar-content {
  width: 500px;
}
.large-container {
  position: relative;
  margin-top: 60px;
}
.collection-card-parent {
  padding-bottom: 40px;
}
progress {
  margin-top: 30px;
}
::v-deep .lettre span {
    background-color: red;
}
.collection-documents {
  flex-grow: 1;
  text-align: left;
  color: #B9192F;
  margin: 5px;
  padding-left: 2px;
  padding-right: 2px;
  border-bottom: solid 1px #B9192F;
}
.search-collection {
  color: #b9192f;
  border-color: #b9192f;
  border-radius: 10px;
  margin: 5px;
  padding-left: 2px;
  padding-right: 2px;
  background-color: transparent;
}
.switch-button {
  background-color: lightgrey;
  border-radius: 30px;
  overflow: hidden;
  width: 240px;
  text-align: center;
  color: grey;
  position: relative;
  padding-right: 120px;
  position: relative;

  &:before {
    content: "DEPLIE";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 120px;
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
      padding: 15px 0;
      display: block;
      user-select: none;
      pointer-events: none;

      &:before {
        content: "";
        background: rgb(255, 0, 83);
        height: 100%;
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
        color: white;
      }
    }
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
