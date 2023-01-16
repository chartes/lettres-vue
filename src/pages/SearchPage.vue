<template>
  <div class="search-page-container">
    <div class="columns">
      <div class="column">
        <button
          @click="toggleLeftSideBar"
          v-show="!showLeftSideBar"
          class="button is-text mt-3"
        >
          Recherche avancée
        </button>
        <document-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import DocumentList from "@/components/sections/DocumentList";

export default {
  name: "SearchPage",
  components: {
    DocumentList,
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showLeftSideBar"]),
    ...mapState("search", ["documents", "loadingStatus"]),
  },
  watch: {},
  created() {
    if (!this.loadingStatus) this.performSearch();
  },
  methods: {
    ...mapActions("search", ["performSearch"]),
    ...mapActions("layout", ["toggleLeftSideBar"]),
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
