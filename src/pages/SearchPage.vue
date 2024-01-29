<template>
  <div class="container">
    <div class="search-page-container">
      <div class="columns">
        <div class="column">
          <button
            v-show="!showLeftSideBar"
            class="button advanced-search-btn"
            @click="toggleLeftSideBar()"
          >
            Afficher les filtres
          </button>
          <document-list content-type="search-results" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import DocumentList from "@/components/sections/DocumentList";

export default {
  name: "SearchPage",
  components: {
    DocumentList,
  },
  computed: {
    ...mapState("layout", ["showLeftSideBar"]),
  },
  async created() {
    await this.performSearch();
  },
  beforeDestroy() {
    this.$store.state.layout.showLeftSideBar = false;
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
  width: 100%;
  padding-top: 0;
}
.advanced-search-btn {
  position: absolute;
  top: 10px;

  border: none;
  padding: 10px 0;
  font-family: $family-secondary;
  font-size: 16px;
  color: #C00055 !important;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;

  &:focus,
  &:hover {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
    background: transparent;
  }
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
