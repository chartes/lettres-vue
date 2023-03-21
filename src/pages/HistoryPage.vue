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
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/components/_search_results_table.scss";
@import "@/assets/sass/components/_search_results_pagination.scss";
</style>
