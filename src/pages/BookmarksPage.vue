<template>
  <div>
    <b-table
      :data="data"
      :loading="isLoading"
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
      <template slot-scope="props">
        <b-table-column
          field="id"
          label="Document"
          sortable
          width="400"
        >
          <document-tag-bar
            :key="props.row.id"
            :doc-id="props.row.id"
          />
        </b-table-column>
        <b-table-column
          field="title"
          label="Titre"
          width="500"
          sortable
        >
          <span v-html="props.row.title" />
        </b-table-column>

        <b-table-column
          field="witnesses"
          label="Témoins"
        >
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
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from "vuex";
import DocumentTagBar from "@/components/document/DocumentTagBar"

export default {
    name: "BookmarksPage",
    components: {
      DocumentTagBar
    },
    filters: {
            /**
        * Filter to truncate string, accepts a length parameter
        */
            truncate(value, length) {
                return value.length > length
                    ? value.substr(0, length) + '...'
                    : value
            }
        }
    ,
     data() {
            return {
                data: [
                ],
                sortField: 'id',
                sortOrder: 'desc',
                defaultSortOrder: 'desc',
                page: 1,
                perPage: 20
            }
        },
    computed: {
      ...mapState('user', ['current_user']),
      ...mapState('bookmarks', ['userBookmarks', 'totalCount', 'isLoading'])
 
    },
    watch: {
      userBookmarks() {
        this.data = this.userBookmarks.map( b => {
                  return {
                    id: b.id,
                    title: b.attributes.title,
                    witnesses: b.witnesses
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
      ...mapActions('bookmarks', ['fetchUserBookmarks']),
       /*
        * Load async data
        */
      loadAsyncData() {
        this.fetchUserBookmarks({
          userId: this.current_user.id,
          pageId: this.page,
          pageSize: this.perPage,
          filters : ""
        })
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