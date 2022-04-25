<template>
  <div>
    <changelog />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Changelog from "@/components/sections/Changelog";

export default {
  name: "HistoryPage",
  components: {
    Changelog,
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
      sortField: "date",
      sortOrder: "desc",
      defaultSortOrder: "desc",
      page: 1,
      perPage: 20,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("changelog", ["fullChangelog", "isLoading", "totalCount"]),
  },
  watch: {
    fullChangelog() {
      this.data = this.fullChangelog.map((c) => {
        return {
          docId: c.data.attributes["object-id"],
          date: c.data.attributes["event-date"],
          user: c.user.username,
          description: c.data.attributes.description,
        };
      });
    },
  },
  created() {
    this.loadAsyncData();
  },
  methods: {
    ...mapActions("changelog", ["fetchFullChangelogForUser"]),
    /*
     * Load async data
     */
    loadAsyncData() {
      this.fetchFullChangelogForUser({
        pageId: this.page,
        pageSize: this.perPage,
        user: this.current_user.id,
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
