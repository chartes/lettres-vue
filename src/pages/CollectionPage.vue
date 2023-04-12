<template>
  <div
    class="large-container"
    :class="toggleCssClass"
  >
    <div class="collection-card-parent">
      <collection-interactive-card
        :collection-id="collectionId"
        :editable="true"
      />
    </div>

    <section class="collection-section mb-5">
      <div class="heading is-uppercase">
        <span class="heading-content">Historique (TEST)</span>
        <span
            aria-controls="section"
            class="icon"
        >
          <i class="fas fa-angle-down"></i>
        </span>
      </div>
      <div class="collection-section-content">
        <p>Catherine de Médicis (1519-1589) est la fille du duc d’Urbino Laurent de Médicis et sde Madeleine de La Tour d’Auvergne. Épouse du duc d’orléans, second fils de François Ier, elle devient reine de France lorsque celui accède au trône de France en 1547. Trois de ses fils se succèdent ensuite comme rois de France, François II (1559-1560), Charles IX (1560-1574) et Henri III (1574-1589). Elle assure la régence du royaume à deux reprises (décembre 1560-août 1563 et février-septembre 1574), mais son influence sur le gouvernement de la France durant plus de trois décennies est très importante, ainsi qu’en témoigne sa correspondance.</p>
        <p>Ses lettres autographes reflètent la double culture de cette femme à la double culture, italienne et française. Son intense activité d’épistolière est  toutefois avant tout documentée par les très nombreuses lettres écrites pour elle par ses secrétaires à des destinataires très variés, souverains étrangers, membres de sa famille ou de la cour, mais aussi agents royaux en France et en poste en Europe.</p>
        <p>Gouverner par correspondance fut un moteur et un instrument essentiels de l’action de cette reine, puis reine-mère qui oscilla entre une politique de conciliation entre catholiques et protestants, puis une défense ferme de la monarchie contre tous ceux (réformés ou catholiques radicaux) qui menaçaient l’unité du royaume autour du souverain incarné par ses fils.</p>
      </div>
    </section>

    <section class="mb-5">
      <div class="is-flex">
        <span class="collection-documents">
          <span class="documents-count">{{ totalCount }}</span> DOCUMENTS
        </span>
      </div>
      <div class="search-collection-parent is-flex is-justify-content-flex-end">
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
        <div
          v-if="!isActive"
          class="field is-inline-block mb-0 px-1"
        >
          <!--v-if="!isActive && isFulltextSearch"-->
          <div class="control block is-flex is-align-items-center mb-0 sort-options">
            <span>Tris</span>
            <div class="is-inline-block select-parent">
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
            </div>
            <span
              v-if="sortingPriority"
              class="icon button arrow-up"
              @click="sortingPriority = sortingPriority.replace('-', '')"
            >
              <i class="fas fa-arrow-up" />
            </span>
            <span
              v-else
              v-show="sortingPriority.length > 0"
              class="icon button arrow-down"
              @click="sortingPriority = `-${sortingPriority}`"
            >
              <i class="fas fa-arrow-down" />
            </span>
          </div>
        </div>
        <div class="is-inline-block px-1">
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
    </section>
    <section>
      <div :class="toggleCssClass">
        <b-table
          ref="multiSortTable"
          :data="tableData"
          backend-pagination
          :loading="isLoading"
          :total="totalCount"
          :per-page="pageSize"
          :current-page.sync="currentPage"
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
            <template #default="props">
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
            <template #default="props">
              {{ props.row.creation }}
            </template>
          </b-table-column>

          <b-table-column
            field="title"
            label="Titre"
            :td-attrs="columnTdAttrs"
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
            <template #default="props">
              <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
                <h2
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
    toggleCssClass: function() {
      return this.isActive ? 'is-active' : 'is-inactive';
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
      console.log(this.sortingPriority)
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
    /*async resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        await this.fetchData();
      }
    },*/

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
          // default sorting on descending creation date
          this.sortingPriority = [{ field: "creation", order: "desc" }];
          console.log("Default sorting new Priority", newPriority, this.sortingPriority);
      }
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
@import "@/assets/sass/elements/_select.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

::v-deep .sidebar-content {
  width: 500px;
}


.large-container {
  position: relative;
  margin-top: 60px;

  @include on-tablet {
    margin-top: 30px;
  }
}

.collection-card-parent {
  padding-bottom: 20px;
}

::v-deep .card-footer {
  border: none !important;
}

progress {
  margin-top: 30px;
}

// Sections : Termes et contenus des metadonnées de la collection
.collection-section {

  & > .heading {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-bottom: 20px;

    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    color: #FF0052;
    letter-spacing: 0;
    text-transform: uppercase;

    .heading-content {
      order: 1;
      display: inline-block;
      white-space: pre;
    }

    span.icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url(../assets/images/icons/open_text.svg) center / 24px auto no-repeat;
      order: 3;

      i {
        display: none;
      }
    }

    &.is-closed span.icon {
      background: url(../assets/images/icons/close_text.svg) center / 18px auto no-repeat;
    }

    &::after {
      order: 2;
      display: block;
      content: '';
      width: 100%;
      border-bottom: 1px solid #FF0052;
    }
  }

  & > .collection-section-content {
    padding: 30px 140px 30px 90px;
    font-size: 20px;
    line-height: 26px;

    @include on-tablet {
      padding: 10px 20px;
      font-size: $font-size-text-tablet;
      line-height: 1.2;
    }

    @include on-mobile {
      font-size: $font-size-text-mobile;
      line-height: 1.25;
    }

    p {
      margin-bottom: 20px;
    }
  }
}



::v-deep .lettre span {
    background-color: red;
}
.collection-documents {
  display: flex;
  align-items: flex-end;
  gap: 4px;

  flex-grow: 1;
  margin: 5px 0;
  padding-left: 2px;
  padding-right: 2px;

  font-size: 14px;
  color: #FF0052;
  font-weight: 500;
  text-transform: uppercase;
  white-space: nowrap;

  &::after {
    content: '';
    display: inline-block;
    border-bottom: 1px solid #FF0052;
    width: 100%;
    transform: translateY(-2px);
  }

  span.documents-count {
    font-weight: 700;
  }
}

.search-collection-parent {
  border-bottom: 1px solid #D5D5D5;
  padding-bottom: 15px;
}

.search-collection {
  margin: 32px 5px 5px;
  padding: 10px;
  background-color: transparent;
  border: #C00055 solid 1px;
  border-radius: 5px;

  font-family: $family-primary;
  font-size: 14px;
  font-weight: 400;
  color: #C00055;
  text-transform: uppercase;
}

.sort-options {
  gap: 10px;
  margin-bottom: 0 !important;

  .icon.button {
    width: 25px;
    height: 25px;
    border: none !important;

    &::after {
      content: '';
      display: inline-block;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      transform-origin: 50% 50%;
      background-image: url(../assets/images/icons/tri-fleche.svg);
    }

    &.arrow-down {
      transform: rotate(180deg);
    }

    i {
      display: none;
    }
  }

  & > span {
    font-family: $family-primary;
    font-size: 16px;
    color: #C00055;
    font-weight: 600;
    text-transform: uppercase;
  }
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
  /*
  & > input[type=number],
  & > input[type=text] {
   */

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
