<template>
  <div class="container">
    <div class="search-page-container">
      <div class="columns">
        <div class="column">
          <button
            v-show="!showLeftSideBar"
            class="button advanced-search-btn"
            @click="toggleLeftSideBar"
          >
            Afficher les filtres
          </button>
          <document-list />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import DocumentList from "@/components/sections/DocumentList";
import SearchBox from "@/components/SearchBox.vue";
import background_image from "@/assets/images/about.jpg";

export default {
  name: "SearchPage",
  components: {
    DocumentList,
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showLeftSideBar"]),
    ...mapState("search", ["documents", "loadingStatus"]),
    ...mapState("search", ["selectedPlaceFrom","selectedPlaceTo","selectedPlaceCited"]),
    ...mapActions("placenames", ["fetchAll"]),
  },
  watch: {
  },
  async created() {
    if (!this.loadingStatus) {
        //await this.fetchAll;
        /*console.log("SearchPage created this.fetchAllPersons")
        await this.fetchAllPersons();
        console.log("SearchPage created this.fetchAllPlaces")
        await this.fetchAllPlaces();*/
        console.log("SearchPage created this.performSearch")
        await this.performSearch();
    }
  },
  /*mounted() {
    this.$store.dispatch("placenames/fetchAllPlacenames");
    this.$store.dispatch("placenames/fetchRoles");
    this.$store.dispatch("placenames/getPlacenameById");
    this.thistest()

  },*/
  beforeDestroy() {
    console.log("clear state on leave")
    this.resetSearchState();
    this.$store.state.layout.showLeftSideBar = false;
  },
  methods: {
    ...mapActions("search", ["performSearch", "resetSearchState"]),
    ...mapActions("layout", ["toggleLeftSideBar"]),
    ...mapActions("persons", {fetchAllPersons: "fetchAll"}),
    ...mapActions("placenames", {fetchAllPlaces: "fetchAll"}),
    /*...mapActions("placenames", [
      "getPlacenameById",
      "performSearch",
      "fetchPlacenamesHavingRoles",
      "fetchAllPlacenames"
    ]),*/
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
