<template>
  <div class="section">
    <div class="container">
      <b-table
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

        detail-key="id"
        show-detail-icon
        :narrowed="true"
        :hoverable="true"

        :mobile-cards="true"
        @page-change="onPageChange"
      >
        <b-table-column
          v-slot="props"
          field="id"
          label="Document"
          width="40"
        >
          <span
            class="tags has-addons document-tag-bar"
          >
            <router-link
              :to="{name: 'document', params: {docId: props.row.id}}"
              class="tag document-preview-card__doc-tag"
            >
              <span>Document {{ props.row.id }}</span>
            </router-link>
          </span>
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="date"
          label="Date de rédaction"
          :td-attrs="columnTdAttrs"
        >
          {{ props.row.date }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="title"
          label="Titre"
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
          <document-preview-card
            :doc-id="props.row.id"
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
    DocumentPreviewCard: () => import("../document/DocumentPreviewCard")
  },
  props: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    ...mapState("search", ["documents", "loadingStatus", "numPage", "pageSize", "totalCount"]),
    ...mapState("user", ["current_user"]),

    currentPage: {
        get: function () {
          return this.numPage
        },
        set: function (newValue) {
          console.log("setting new page")
          this.setNumPage(newValue)
          this.performSearch()
          this.loadAsyncData()
        }
    }
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
    ...mapActions("search", ["setNumPage", "performSearch"]),

    async loadAsyncData() {
      this.tableData = await Promise.all(this.documents.map(async d => {
        //const witnesses = await http.get(`documents/${d.id}/witnesses?without-relationships`)
        return {
          id: d.id,
          title :d.attributes.title,
          date : d.attributes.creation,
          //witnesses: witnesses.data.data
        }
      }));
    },
    columnTdAttrs(row, column) {
      if (column.label === 'Date de rédaction') {
        return {
          class: '',
          style: {
            'min-width': '180px'
          }
        }
      }
      else {
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

.section {
  width: 100%;
}
progress {
  margin-top: 30px;
}
</style>
