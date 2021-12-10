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
            <p>Vous n'avez aucun favori pour le moment.</p>
          </div>
        </section>
      </template>
      <b-table-column v-slot="props" field="id" label="Document" sortable width="400">
        <document-tag-bar :key="props.row.id" :doc-id="props.row.id" />
      </b-table-column>
      <b-table-column v-slot="props" field="title" label="Titre" width="500" sortable>
        <span v-html="props.row.title" />
      </b-table-column>

      <b-table-column v-slot="props" field="witnesses" label="Témoins">
        <ul>
          <li v-for="witness in props.row.witnesses" :key="witness.id">
            <span style="font-size: 0.8em" v-html="witness.attributes.content" />
          </li>
        </ul>
      </b-table-column>
    </b-table>
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
      sortField: "id",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      page: 1,
      perPage: 20,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("bookmarks", ["userBookmarks", "totalCount", "isLoading"]),
    ...mapGetters("document", []),
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
      );
    },
  },
  mounted() {
    this.loadAsyncData();
  },
  methods: {
    ...mapActions("bookmarks", ["fetchUserBookmarks"]),
    /*
     * Load async data
     */
    loadAsyncData() {
      this.fetchUserBookmarks({
        userId: this.current_user.id,
        pageId: this.page,
        pageSize: this.perPage,
        filters: "",
      });
    },
    /*
     * Handle page-change event
     */
    onPageChange(page) {
      this.page = page;
      this.loadAsyncData();
    },
    /*
     * Handle sort event
     */
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.loadAsyncData();
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
