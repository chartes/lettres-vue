<template>
  <div class="search-page-container">
    <div class="columns">
      <div v-if="showAdvancedSearchForm" class="column is-one-third search-form-column">
        <aside class="advanced-search-form">
          <advanced-search-form />
        </aside>
      </div>
      <div class="column">
        <document-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import DocumentList from "@/components/sections/DocumentList";
import AdvancedSearchForm from "@/components/AdvancedSearchForm.vue";

export default {
  name: "SearchPage",
  components: {
    DocumentList,
    AdvancedSearchForm,
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showAdvancedSearchForm"]),
    ...mapState("search", ["documents", "loadingStatus"]),
  },
  watch: {},
  created() {
    if (!this.loadingStatus) this.performSearch();
  },
  methods: {
    ...mapActions("search", ["performSearch"]),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
.columns {
  height: 100%;
}
.column {
  padding-top: 0px;
}
.search-page-container {
  margin-left: -30px;
  margin-top: -30px;
  height: calc(100% + 72px);
}

.collection-selection {
  top: 50px;
  position: relative;
  padding-left: 25px;
  min-height: 170px;
}
.progress-container {
  margin: 20px;
}
.collection-description {
  margin-top: 50px;
  padding-left: 30px;
}

.search-form-column {
  border-right: 1px solid #d6d6d6;
}
</style>
