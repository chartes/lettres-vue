<template>
  <div>
    <div v-if="$route.name === 'search'">
      <div
        class="section"
        :class="toggleScopeCssClass"
      >
        <div class="document-list-header is-flex is-justify-content-space-between is-align-items-center">
          <div class="is-inline-block">
            <div
              v-if="loadingStatus"
              class="results-count"
            >
              <span
                class="total-count fas fa-spinner fa-pulse">
              </span> résultat(s)
            </div>
            <div
              v-else-if="loadingTable"
              class="results-count"
            >
              <span class="total-count">

              </span> Veuillez lancer la recherche
            </div>
            <div
              v-else
              class="results-count"
            >
              <span class="total-count">
                {{ totalCount }}
              </span> résultat(s)
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
                    :disabled="loadingTable"
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
        <div class="is-flex toggle-list-and-pagination is-justify-content-space-between">
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
                  <option
                    :value="sortingPriority[0].field === 'creation' && sortingPriority[0].order === 'asc'
                      ? [{field: 'creation', order: 'asc'}]
                      : sortingPriority[0].field === 'creation' && sortingPriority[0].order === 'desc'
                        ? [{field: 'creation', order: 'desc'}]
                        : [{field: 'creation', order: 'asc'}]
                    "
                  >
                    Creation
                  </option>
                  <option
                    :value="sortingPriority[0].field === 'id' && sortingPriority[0].order === 'asc'
                      ? [{field: 'id', order: 'asc'}]
                      : sortingPriority[0].field === 'id' && sortingPriority[0].order === 'desc'
                        ? [{field: 'id', order: 'desc'}]
                        : [{field: 'id', order: 'asc'}]
                    "
                  >
                    Lettre Id
                  </option>
                  <option
                    :value="sortingPriority[0].field === 'senders.label.keyword' && sortingPriority[0].order === 'asc'
                      ? [{field: 'senders.label.keyword', order: 'asc'}]
                      : sortingPriority[0].field === 'senders.label.keyword' && sortingPriority[0].order === 'desc'
                        ? [{field: 'senders.label.keyword', order: 'desc'}]
                        : [{field: 'senders.label.keyword', order: 'asc'}]
                    "
                  >
                    Expéditeur
                  </option>
                  <option
                    :value="sortingPriority[0].field === 'recipients.label.keyword' && sortingPriority[0].order === 'asc'
                      ? [{field: 'recipients.label.keyword', order: 'asc'}]
                      : sortingPriority[0].field === 'recipients.label.keyword' && sortingPriority[0].order === 'desc'
                        ? [{field: 'recipients.label.keyword', order: 'desc'}]
                        : [{field: 'recipients.label.keyword', order: 'asc'}]
                    "
                  >
                    Destinataire
                  </option>
                  <option
                    :value="sortingPriority[0].field === 'location-date-from.label.keyword' && sortingPriority[0].order === 'asc'
                      ? [{field: 'location-date-from.label.keyword', order: 'asc'}]
                      : sortingPriority[0].field === 'location-date-from.label.keyword' && sortingPriority[0].order === 'desc'
                        ? [{field: 'location-date-from.label.keyword', order: 'desc'}]
                        : [{field: 'location-date-from.label.keyword', order: 'asc'}]
                    "
                  >
                    Lieu d'expédition
                  </option>
                  <option
                    :value="sortingPriority[0].field === 'location-date-to.label.keyword' && sortingPriority[0].order === 'asc'
                      ? [{field: 'location-date-to.label.keyword', order: 'asc'}]
                      : sortingPriority[0].field === 'location-date-to.label.keyword' && sortingPriority[0].order === 'desc'
                        ? [{field: 'location-date-to.label.keyword', order: 'desc'}]
                        : [{field: 'location-date-to.label.keyword', order: 'asc'}]
                    "
                  >Lieu de destination
                  </option>
                </select>
              </div>
              <span
                v-if="sortingPriority.length > 0 && sortingPriority[0].order === 'asc'"
                class="icon button arrow-up"
                @click="sortPressed(sortingPriority[0].field, 'desc', 'escape')"
              >
              </span>
              <span
                v-else
                v-show="sortingPriority.length > 0"
                class="icon button arrow-down"
                @click="sortPressed(sortingPriority[0].field, 'asc', 'escape')"
              >
              </span>
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
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="section mb-5"
        :class="toggleCssClass"
      >
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
          <!-- Table toggle + pagination -->
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
                    <option
                      :value="sortingPriority[0].field === 'creation' && sortingPriority[0].order === 'asc'
                        ? [{field: 'creation', order: 'asc'}]
                        : sortingPriority[0].field === 'creation' && sortingPriority[0].order === 'desc'
                          ? [{field: 'creation', order: 'desc'}]
                          : [{field: 'creation', order: 'asc'}]
                      "
                    >
                      Creation
                    </option>
                    <option
                      :value="sortingPriority[0].field === 'id' && sortingPriority[0].order === 'asc'
                        ? [{field: 'id', order: 'asc'}]
                        : sortingPriority[0].field === 'id' && sortingPriority[0].order === 'desc'
                          ? [{field: 'id', order: 'desc'}]
                          : [{field: 'id', order: 'asc'}]
                      "
                    >
                      Lettre Id
                    </option>
                    <option
                      :value="sortingPriority[0].field === 'senders.label.keyword' && sortingPriority[0].order === 'asc'
                        ? [{field: 'senders.label.keyword', order: 'asc'}]
                        : sortingPriority[0].field === 'senders.label.keyword' && sortingPriority[0].order === 'desc'
                          ? [{field: 'senders.label.keyword', order: 'desc'}]
                          : [{field: 'senders.label.keyword', order: 'asc'}]
                      "
                    >
                      Expéditeur
                    </option>
                    <option
                      :value="sortingPriority[0].field === 'recipients.label.keyword' && sortingPriority[0].order === 'asc'
                        ? [{field: 'recipients.label.keyword', order: 'asc'}]
                        : sortingPriority[0].field === 'recipients.label.keyword' && sortingPriority[0].order === 'desc'
                          ? [{field: 'recipients.label.keyword', order: 'desc'}]
                          : [{field: 'recipients.label.keyword', order: 'asc'}]
                      "
                    >
                      Destinataire
                    </option>
                    <option
                      :value="sortingPriority[0].field === 'location-date-from.label.keyword' && sortingPriority[0].order === 'asc'
                        ? [{field: 'location-date-from.label.keyword', order: 'asc'}]
                        : sortingPriority[0].field === 'location-date-from.label.keyword' && sortingPriority[0].order === 'desc'
                          ? [{field: 'location-date-from.label.keyword', order: 'desc'}]
                          : [{field: 'location-date-from.label.keyword', order: 'asc'}]
                      "
                    >
                      Lieu d'expédition
                    </option>
                    <option
                      :value="sortingPriority[0].field === 'location-date-to.label.keyword' && sortingPriority[0].order === 'asc'
                        ? [{field: 'location-date-to.label.keyword', order: 'asc'}]
                        : sortingPriority[0].field === 'location-date-to.label.keyword' && sortingPriority[0].order === 'desc'
                          ? [{field: 'location-date-to.label.keyword', order: 'desc'}]
                          : [{field: 'location-date-to.label.keyword', order: 'asc'}]
                      "
                    >Lieu de destination
                    </option>
                  </select>
                </div>
                <span
                  v-if="sortingPriority.length > 0 && sortingPriority[0].order === 'asc'"
                  class="icon button arrow-up"
                  @click="sortPressed(sortingPriority[0].field, 'desc', 'escape')"
                >
                </span>
                <span
                  v-else
                  v-show="sortingPriority.length > 0"
                  class="icon button arrow-down"
                  @click="sortPressed(sortingPriority[0].field, 'asc', 'escape')"
                >
                </span>
              </div>
            </div>
            <div class="is-inline-block px-1 switch-button-parent">
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
      </div>
    </div>
    <div :class="toggleCssClass">
      <b-table
        ref="multiSortTable"
        :class="tableCssClass"
        :data="tableData"

        :loading="loadingStatus || loadingTable"
        backend-pagination
        :total="totalCount"
        :per-page="pageSize"
        :current-page.sync="currentPage"
        pagination-position="both"

        aria-next-label="Page suivante"
        aria-previous-label="Page précédente"
        aria-page-label="Page"
        aria-current-label="Page courante"
        :opened-detailed="[]"
        detailed
        :backend-sorting="true"
        :sort-multiple="true"
        :sort-multiple-data="sortingPriority"
        detail-key="id"
        show-detail-icon


        :row-class="(row, index) => showDetailIcon(row.id) === true ? '': 'hide-arrow-icon-detail'"

        :narrowed="true"
        :mobile-cards="true"
        @sort="sortPressed"
        @sorting-priority-removed="sortingPriorityRemoved"
      >
        <b-table-column
          field="id"
          label="Lettre"
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          <template v-slot="props">
            {{ props.row.creation }}
          </template>
        </b-table-column>

        <b-table-column
          field="title"
          label="Titre"
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          <template v-slot="props">
            <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
              <h2
                v-if="searchTerm && searchTerm.length > 0"
                class="document-preview-card__title"
                v-html="cleanHTML(props.row.title)"
              /><!-- v-html="highlight(props.row.title, 'title')" -->
              <h2
                v-else
                class="document-preview-card__title"
                v-html="cleanHTML(props.row.title)"
              />
            </router-link>
          </template>
        </b-table-column>
        <b-table-column
          field="senders.label.keyword"
          label="Expéditeur(s)"
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          <template v-slot="props">
            {{ props.row.senders }}
          </template>
        </b-table-column>

        <b-table-column
          field="recipients.label.keyword"
          label="Destinataire(s)"
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          <template v-slot="props">
            {{ props.row.recipients }}
          </template>
        </b-table-column>

        <b-table-column
          field="location-date-from.label.keyword"
          label="Lieu d'expédition"
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          <template v-slot="props">
            <p>{{ props.row.origins }}</p>
          </template>
        </b-table-column>

        <b-table-column
          field="location-date-to.label.keyword"
          label="Lieu de destination"
          :th-attrs="columnThAttrs"
          :td-attrs="columnTdAttrs"
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
          <template v-slot="props">
            {{ props.row.destinations }}
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
            :can-edit="canEdit"
            :preview="true"
          />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import escapeRegExp from "lodash/escapeRegExp";

export default {
  name: "DocumentList",
  components: {
    DocumentTagBar: () => import("@/components/document/DocumentTagBar"),
    Document: () => import("@/components/sections/Document")
  },
  props: {
      "collectionId": {
          type: Number,
          default: undefined,
          required: false,
      },
    "contentType": {
      type: String,
      default: undefined,
      required: false,
    }
  },
  data() {
    return {
      canEdit: false,
      //sortingPriority: [{field: 'creation', order: 'asc'}],
      tableData: [],
      p: 1,
      isActive: true,
      isFulltext: true,
      loadingTable: false
    };
  },
  computed: {
    ...mapState("search", ["searchTerm", "searchType", "included", "documents", "loadingStatus", "numPage", "pageSize", "totalCount", "withStatus", "sorts"]),
    ...mapState("user", ["current_user"]),
    //...mapGetters("document", ["documentSender", "documentRecipients"]),


    sortingPriority: {
      get: function() {
        console.log('sortingPriority GET');
        console.log('this.sorts', this.sorts);
        return this.sorts;
        /*if (this.sorts) {
            console.log('sortingPriority GET')
            console.log('this.sorts', this.sorts)
            console.log('sortingPriority', this.sortingPriority)
            return this.sorts
        } else {
            console.log('sortingPriority GET default')
            console.log('this.sorts', this.sorts)
            console.log('sortingPriority', this.sortingPriority)
            //this.setSorts([{field: 'creation', order: 'asc'}]);
            //console.log('this.sorts2', this.sorts)
            //console.log('sortingPriority2', this.sortingPriority)
            return [{field: 'creation', order: 'asc'}];
        }*/
      },

      set: function (value) {
        console.log('sortingPriority SET');
        console.log('this.sorts', this.sorts);
        console.log('SET value', value);
        if (this.sorts !== value) {
            this.setSorts(value)
            this.performSearch()
            this.loadAsyncData()
        }
      }
    },

    currentPage: {
        get: function () {
          return this.numPage
        },
        set: function (newValue, oldValue) {
          newValue = parseInt(newValue)
          if (newValue && newValue !== oldValue) {
            this.setSorts(this.sortingPriority)
            this.p = newValue
            this.setNumPage(newValue)
            this.performSearch()
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
    toggleScopeCssClass: function() {
      this.switchSearchScope()
      return this.isFulltext ? 'is-fulltext' : 'is-notice';
    },
    hasSearchTerm: function() {
      return this.searchTerm && this.searchTerm.length > 0 ? 'has-search-term' : 'no-search-term';
    },
    tableCssClass: function() {
      return [ this.contentType, this.hasSearchTerm ].join(' ') ;
    },
  },
  watch: {
    async documents() {
      await this.loadAsyncData()
    },
    searchType(newValue, oldValue) {
      if (newValue != oldValue) {
        this.loadingTable = true
      }
    },
    searchTerm(newValue, oldValue) {
      if (newValue != oldValue) {
        this.loadingTable = true
      }
    }
  },
  async created() {
    this.setSorts([{field: 'creation', order: 'asc'}]);
    await this.loadAsyncData();
  },
  methods: {
    //...mapState("search", ["documents"]),
    ...mapActions("search", ["setSearchTerm","setNumPage", "performSearch", "setSorts", "setSelectedCollections"]),
    showDetailIcon(rowDocId) {
      let showIcon = false
      if (!this.loadingTable) {
        if (!this.loadingStatus && this.searchType === "isParatextSearch"){
          showIcon = true
          /*let searchDocuments = this.$store.state.search.documents
          if (searchDocuments.length > 0) {
            let currRowDocument = searchDocuments.filter(d => d.id === rowDocId)
            if (currRowDocument && currRowDocument.length > 0) {
              console.log("currRowDocument :", currRowDocument)
              if (currRowDocument[0].witnesses.length > 0 || currRowDocument[0].argument) {
                showIcon = true
              }
            }
          }*/
        } else {
          if (!this.loadingStatus && this.searchTerm && this.searchTerm.length > 0) {
            let searchDocuments = this.$store.state.search.documents
            if (searchDocuments.length > 0) {
              let currRowDocument = searchDocuments.filter(d => d.id === rowDocId)
              if (currRowDocument && currRowDocument.length > 0) {
                console.log("currRowDocument :", currRowDocument)
                if (currRowDocument[0].transcription && currRowDocument[0].transcription.highlight) {
                  showIcon = true
                } else if (currRowDocument[0].argument && this.highlight(currRowDocument[0].argument).includes('mark')) {
                  console.log("list currRowDocument[0].id, argument", currRowDocument[0].id, currRowDocument[0].argument)
                  console.log("this.highlight(currRowDocument[0].argument)", this.highlight(currRowDocument[0].argument))
                  showIcon = true;
                }/* else {
                  return showIcon
                }
                return showIcon*/
              }/* else {
                return showIcon
              }*/
            }/* else {
              return showIcon
            }*/
            //return showIcon
          }/* else {
          return showIcon
        }*/
        }
        console.log("showIcon", showIcon)

      } return showIcon
    },
    searchCollection() {
      //console.log("searchCollection / this.$store.state.search.selectedCollections", this.$store.state.search.selectedCollections);
      this.$store.state.layout.showLeftSideBar = true
    },
    cleanHTML(text) {
      // remove notes from Titles in search results table
      if (text && text.length > 0) {
        return text.replace(/<a[^>]+>[^<]+<\/a>/ig,'');
      }
    },
    highlight(text, type) {
      // function called only if this.searchTerm && this.searchTerm.length > 0
      // split search terms (by space) if multiple
      // if (/^"".*""$/.test(text)) {TODO Victor : implement enclosed in quotes ?
      // previous rule : const terms = this.searchTerm.split(new RegExp("\\s+")).map(escapeRegExp).filter(term => term !== "")
      const terms = this.searchTerm.replaceAll(/^"|"$/g, "").split(new RegExp("[,;:.\\s+]+")).map(escapeRegExp).filter(term => term !== "");

      if (terms && terms.length > 0) {
        const re = new RegExp(`(${terms.join("|")})`);
        if (type === 'title') {
          // if title : only remove notes
          text = this.cleanHTML(text);
          return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
        } else {
          // if argument, parse pseudo HTML if required
          if (text.includes('<p>')) {
            // if source is pseudo HTML (has tags)
            let div = document.createElement("div");
            div.innerHTML = text;
            let textWithoutHTML = div.textContent || div.innerText || "";
            text = textWithoutHTML;
            console.log("list highlight doc id cleanhtml text", text)
            return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
          } else {
            return text.replace(new RegExp(re, 'gi'), (match => `<mark>${match}</mark>`))
          }
        }
      } else {
        return text
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
      if (this.sortingPriority.length > 0) {
          console.log(newPriority, this.sortingPriority);
      } else {
          // default sorting on ascending creation date
          this.sortingPriority = [{ field: "creation", order: "asc" }];
          console.log("Default sorting new Priority", newPriority, this.sortingPriority);
      }
      this.performSearch()
      this.loadAsyncData()
    },

    sortPressed(field, order, event) {
        if((this.customKey && event[this.customKey]) || !this.customKey) {
          let existingPriority = this.sortingPriority.filter(i => i.field === field)[0]
          if(existingPriority) {
            console.log("existingPriority", existingPriority)
            // UPDATE SORTING
            //console.log("existingPriority", existingPriority);
            if (existingPriority.order === "asc") {
              // SORTING WAS 'asc' UPDATED TO 'desc'
              existingPriority.order = "desc";
            } else if (existingPriority.order === "desc" && event !== 'escape') {
              // SORTING WAS 'desc' UPDATED TO unset
              console.log('sortingPriorityRemoved')
              this.sortingPriorityRemoved(field);
            } else {
              existingPriority.order = "asc"; // unused scenario
            }
            // existingPriority.order = existingPriority.order === "asc" ? "desc" : existingPriority.order === "desc" ? this.sortingPriorityRemoved(field) : "asc" ;
          } else {
            // NO SORTING : request sorted data (note Document List is backend sorted from Store Sorts property (updated via setSorts)
            // default sorting here, need to be equivalent to default sortingPriority :
            // here default is 'asc', hence a new priority needs to be asc so that clicks follows asc -> desc -> unset -> etc
            this.sortingPriority.push({field, order: "asc"})
            console.log("sortingPriority", this.sortingPriority)
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
      this.loadingTable = true
      if (this.documents) {
        const phr = [];
        this.tableData = await Promise.all(this.documents.map(async d => {
        return {
          id: d.id,
          title:  d.title,
          creation:  d.creation,
          senders: this.included.length > 0 ? d.sender.map(sender => (this.included.find(item => item.id === sender.id & item.type === 'person')).attributes.label).filter(Boolean).join(", ") : '',
          recipients: this.included.length > 0 ? d.recipients.map(recipient => (this.included.find(item => item.id === recipient.id & item.type === 'person')).attributes.label).filter(Boolean).join(", ") : '',
          origins: this.included.length > 0 ? d.origin.map(origin => (this.included.find(item => item.id === origin.id & item.type === 'placename')).attributes.label).filter(Boolean).join(", ") : '',
          destinations: this.included.length > 0 ? d.destinations.map(destination => (this.included.find(item => item.id === destination.id & item.type === 'placename')).attributes.label).filter(Boolean).join(", ") : '',
          /* previous logic fails on collection page if this.$store.state.persons.persons_roles/placenames.places have not been loaded
          previous senders: d.sender.map(sender => (this.$store.state.persons.persons_roles[1].persons.find(p => p.person_id === sender.id) || {}).label).filter(Boolean).join(", "),
          recipients: d.recipients.map(recipient => (this.$store.state.persons.persons_roles[1].persons.find(p => p.person_id === recipient.id) || {}).label).filter(Boolean).join(", "),
          origins: d.origin.map(origin => (this.$store.state.placenames.places[0].places.find(p => p.placename_id === origin.id) || {}).label).filter(Boolean).join(", "),
          destinations: d.destinations.map(destinations => (this.$store.state.placenames.places[1].places.find(p => p.placename_id === destinations.id) || {}).label).filter(Boolean).join(", ")*/
        }
        }));
      } this.loadingTable = false
    },
    toggle() {
      if (this.isActive === true) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
      if (this.sorts[0].field !== 'creation' || this.sorts[0].order !== 'asc') {
        this.setSorts([{field: 'creation', order: 'asc'}]);
        this.performSearch();
        this.loadAsyncData();
      }
    },
    switchSearchScope() {
      this.isFulltext = !this.isFulltext
    },
    toggleScope() {
      if (this.searchTerm) {
        this.performSearch();
        this.loadAsyncData();
      }
    },
    columnThAttrs(row, column) {
      if (this.contentType) {
        return {
          class: 'th-' + this.contentType
        }
      }
    },
    columnTdAttrs(row, column) {
      if (column.label === 'Titre') {
        return {
          class: this.contentType ? 'td-' + this.contentType : '',
          style: {
            'max-width': '550px'
          }
        }
      }
      else if (column.label === 'Date de rédaction') {
        return {
          class: this.contentType ? 'td-' + this.contentType : '',
          style: {
            'min-width': '130px',
            'max-width': '300px'
          }
        }
      } else {
        return {
          class: this.contentType ? 'td-' + this.contentType : ''
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/elements/_select.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";

.section {
  width: 100%;
  padding: 70px 0 0 !important;
}
progress {
  margin-top: 30px;
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

  @include on-mobile {
    width: 160px;
  }

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

    @include on-mobile {
      width: 80px;
    }
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

      @include on-mobile {
        transform: translateX(80px);
      }
    }

    & + .switch-button-label {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      pointer-events: none;
      height: 100%;

      @include on-mobile {
        width: 90px;
      }

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
.switch-button-scope {
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

  @include on-mobile {
    width: 160px;
  }

  &.is-fulltext {
    color: grey;
    .switch-button-label-span {
      color: white;
    }
  }

  &.is-notice {
    color: white;
    .switch-button-label-span {
      color: grey;
    }
  }

  &:before {
    content: "NOTICE";
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

    @include on-mobile {
      width: 80px;
    }
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

      @include on-mobile {
        transform: translateX(80px);
      }
    }

    & + .switch-button-label {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      pointer-events: none;
      height: 100%;

      @include on-mobile {
        width: 90px;
      }

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
.toggle-list-and-pagination {

  @include on-small-tablet {
    flex-wrap: wrap;
    gap: 10px;

    .switch-button-parent {
      flex: 100% 0 0 !important;
      padding: 0;
      margin: 10px 0;
    }
  }

  .icon.button {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    margin: 0 4px 10px 0 !important;
    padding: 0 !important;

    &.arrow-down::after,
    &.arrow-up::after {
      content: '';
      display: inline-block;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      transform-origin: 50% 50%;
      background-image: url(#{$image-path}/icons/tri-fleche.svg);
    }

    &.arrow-down::after {
      transform: rotate(180deg);
    }
    i {
      display: none;
    }
  }
}

.select-parent {
  margin: 0 5px;
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
