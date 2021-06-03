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
          :td-attrs="columnTdAttrs"
        >
          <document-tag-bar
            :doc-id="props.row.id"
            :preview-data="props.row.tagData"
            :with-status="withStatus"
          />
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
            :preview-data="props.row.previewData"
          />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "DocumentList",
  components: {
    DocumentTagBar: () => import("@/components/document/DocumentTagBar"),
    DocumentPreviewCard: () => import("../document/DocumentPreviewCard")
  },
  props: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    ...mapState("search", ["documents", "loadingStatus", "numPage", "pageSize", "totalCount", "withStatus"]),
    ...mapState("user", ["current_user"]),

    currentPage: {
        get: function () {
          return this.numPage
        },
        set: function (newValue) {
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
        const attrs = d.data.attributes
       
        return {
          id: d.data.id,
          title: attrs.title,
          date: attrs.creation,

          tagData: {
            currentLock: d.currentLock,
            isPublished: attrs['is-published'],
            isBookmarked: await attrs['is-bookmarked']
          }
          //witnesses: witnesses.data.data
        }
      }));
    },
    columnTdAttrs(row, column) {
      if (column.label === 'Date de rédaction') {
        return {
          class: '',
          style: {
            'min-width': '160px'
          }
        }
      } else  if (column.label === 'Document') {
        return {
          class: '',
          style: {
            
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
