<template>
  <div class="container">
    <!--<router-link
      :to="{ name: 'collections' }"
      class="mt-5 mb-5"
    >
      <i class="fas fa-arrow-left ml-1 mr-3" />
      Toutes les collections
    </router-link>-->
    <router-link
      v-if="current_user && current_user.isAdmin"
      v-slot="{ navigate }"
      to="create"
      custom
      append
    >
      <b-button
        type="is-primary"
        label="Créer une sous-collection"
        @click="navigate"
      />
    </router-link>

    <!--<b-button @click="showHierarchy = !showHierarchy" class="ml-auto">
      Hiérarchie
    </b-button>-->
    <div>
      <collection-interactive-card
        :collection-id="collectionId"
        :editable="true"
        class="m-3"
      />
      <b-sidebar
        v-model="showHierarchy"
        position="fixed"
        :right="true"
        :fullheight="true"
        class="m-3"
        style="width: 500px"
      >
        <div class="m-3">
          <p class="menu-label">
            Hiérarchie
          </p>
          <collection-hierarchy
            :collection-id="collectionId"
          />
        </div>
      </b-sidebar>
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
            v-if="totalPageNum"
            class="has-text-centered"
          >
            <span class="pagination-goto">
              <span
                :class="currentPage === 1 ? 'button first-page disabled' : 'button first-page'"
                @click="currentPage === 1 ? null : goToPage(1)"
              >
                <i class="fas fa-angle-double-left" />
              </span>
              <span
                :class="currentPage === 1 ? 'button previous-page disabled' : 'button previous-page'"
                @click="currentPage === 1 ? null : goToPage(--currentPage)"
              >
                <i class="fas fa-arrow-left" />
              </span>
              <span class="pagination__button__input-box">
                <input
                  v-model="currentPage"
                  name="page"
                  type="number"
                  min="1"
                  :max="totalPageNum"
                  placeholder="Page..."
                  class="input is-medium"
                  @change.prevent="currentPage = parseInt(p)"
                >
                <span>sur</span>
                <span class="page-count">{{ totalPageNum }}</span>
              </span>
              <span
                :class="currentPage < totalPageNum ? 'button next-page' : 'button next-page disabled'"
                @click="currentPage < totalPageNum ? goToPage(++currentPage) : null"
              >
                <i class="fas fa-arrow-right" />
              </span>
              <span
                :class="currentPage < totalPageNum ? 'button last-page' : 'button last-page disabled'"
                @click="currentPage < totalPageNum ? goToPage(totalPageNum) : null"
              >
                <i class="fas fa-angle-double-right" />
              </span>
            </span>
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
            <!--<Toggle
              id="ToggleTableau"
              on-label="Tableau"
              off-label="Déplié"
              v-model="isResultTableMode"
              :width="120"
            />-->
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
            <!--<button
              class="ui button toggle"
              :class="[isActive ? 'active' : '']"
              @click="toggle"
            >
              Tableau
            </button>
            <button
              class="ui button toggle"
              :class="[!isActive ? 'active' : '']"
              @click="toggle"
            >
              Déplié
            </button>-->
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
          @page-change="onPageChange"
        >
          <b-table-column
            v-slot="props"
            field="id"
            label="Lettre"
            :th-attrs="columnHeaderAttr"
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
            :th-attrs="columnHeaderAttr"
            sortable
          >
            {{ props.row.creation }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="title"
            label="Titre"
            :td-attrs="columnHeaderAttr"
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
    CollectionHierarchy,
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
      totalPageNum: 0,
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
        if (newValue && newValue !== oldValue && newValue >=1 && newValue <= this.totalPageNum ) {
          this.numPage = newValue;
          await this.fetchData();
        }
      },
    },
    ...mapState("user", ["current_user"]),
  },
  watch: {
    collectionId: async function () {
      console.log("Watch")
      await this.fetchData();
    },
  },
  async created() {
    console.log("Created")
    await this.fetchData();
    this.totalPageNum = this.fetchedData.totalCount === 0 ? 1 : parseInt(Math.ceil(this.fetchedData.totalCount / this.pageSize))
    console.log("this.totalPageNum : ", this.totalPageNum)
  },
  methods: {
    ...mapActions("collections", ["fetchOne", "fetchAll"]),
    columnHeaderAttr(row, column) {
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
    async goToPage(num) {
      if (!parseInt(num)) {
        num = 1;
      }

      if (num > this.totalPageNum) {
        num = this.totalPageNum;
      } else if (num < 1) {
        num = 1;
      }
      this.currentPage = num;

      if (this.numPage !== num) {
        //await this.fetchData();
      }
    },
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
     */
    onPageChange(page) {
      console.log("page change")
      this.currentPage = page;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

::v-deep .sidebar-content {
  width: 500px;
}

.pagination-goto {
  display: flex;
  float: right;
  position: relative;
  margin-left: 50px;
}
progress {
  margin-top: 30px;
}
span {
  margin: 0 5px;
  font-family: "Barlow", sans-serif;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
  color: #979797;
  text-transform: uppercase;
}
.pagination__button__input-box .input,
span.page-count,
span.button {
  height: 47px !important;
  width: 47px !important;
  margin: 0 5px !important;
}
span.button {
  color: #FFF;
  background-color: #C3C3C3;
}
span.button.disabled {
  cursor: not-allowed !important;
}
::v-deep .lettre span {
    background-color: red;
}
/*span.button > i {
  display: none;
}*/
/*span.button.first-page {
  background: url(../assets/images/page_debut.svg) center / cover no-repeat;
}
span.button.previous-page {
  background: url(../assets/images/page_avant.svg) center / cover no-repeat;
}
span.button.next-page {
  background: url(../assets/images/page_suivant.svg) center / cover no-repeat;
}
span.button.last-page {
  background: url(../assets/images/page_fin.svg) center / cover no-repeat;
}*/
.page-count {
  display: inline-block;
  border: solid 1px #dbdbdb;
  background-color: #DFDFDF;
  border-radius: 4px;
  color: #9B9B9B;
  vertical-align: middle;
  line-height: 45px;
}
.pagination__button__input-box {
  margin: 0 5px;
}
span.page-count,
.pagination__button__input-box .input {
  font-family: "Barlow", sans-serif;
  font-size: 24px;
  font-weight: 800;
}
.pagination__button__input-box .input {
  color: #B9192F;
  border: solid 1px #B9192F;
  line-height: 1;
  padding-left: 2px;
  padding-right: 2px;
  text-align: center;
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
.button.toggle {
  background-color: rgb(255, 0, 83);
  border-color: rgb(255, 0, 83);
  border-left-radius: 24px;
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
