<template>
  <div>
    <b-table
      :data="data"
      :loading="isLoading"
      striped
      paginated
      backend-pagination
      :total="totalCount"
      :per-page="perPage"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      backend-sorting
      :default-sort-direction="defaultSortOrder"
      :default-sort="[sortField, sortOrder]"
      @page-change="onPageChange"
      @sort="onSort"
    >
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>Aucun historique de modification pour ce document</p>
          </div>
        </section>
      </template>

      <template slot-scope="props">
        <b-table-column
          field="docId"
          label="Document"
          sortable
          width="100"
        >
          <router-link
            :to="{name: 'document', params: {docId: props.row.docId}}"
            class="tag document-preview-card__doc-tag"
          >
            <span>Document {{ props.row.docId }}</span>
          </router-link>
        </b-table-column>
        <b-table-column
          field="date"
          label="Date"
          width="200"
          sortable
        >
          <span v-html="props.row.date" />
        </b-table-column>
        <b-table-column
          field="user"
          label="Utilisateur"
          width="200"
          sortable
        >
          <span v-html="props.row.user" />
        </b-table-column>

        <b-table-column
          field="description"
          label="Description"
        >
          <span>{{ props.row.description }}
          </span>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";

export default {
    name: "Changelog",
    components: {
      
    },
    props: {
      perPage: {type: Number, default: 25},
      docId: {type: Number, default: null},
    },
    data() {
      return {
        data: [
        ],
        sortField: 'date',
        sortOrder: 'desc',
        defaultSortOrder: 'desc',
        page: 1,
      }
    },
    computed: {
      ...mapState('user', ['current_user']),
      ...mapState('changelog', ['fullChangelog', 'isLoading', 'totalCount']),

    },
    watch: {
      fullChangelog() {
        this.data = this.fullChangelog.map( c => {
          return {
            docId: c.data.attributes['object-id'],
            date: c.data.attributes['event-date'],
            user: c.user.username,
            description: c.data.attributes.description
          }
        })
      }
    },
    mounted() {
      this.loadAsyncData()
    },
    created() {
    },
    methods: {
      ...mapActions('changelog', ['fetchFullChangelog']),
       /*
        * Load async data
        */
      loadAsyncData() {
        let filters = ''
        if (this.docId) {
          filters = `filter[object-type]=document&filter[object-id]=${this.docId}`
        }
        this.fetchFullChangelog({
          pageId: this.page,
          pageSize: this.perPage,
          filters : filters
        });
      },
      /*
       * Handle page-change event
       */
      onPageChange(page) {
        this.page = page
        this.loadAsyncData()
      },
      /*
       * Handle sort event
       */
      onSort(field, order) {
        this.sortField = field
        this.sortOrder = order
        this.loadAsyncData()
      }
           
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>