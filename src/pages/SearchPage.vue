<template>
  <div class="search-page-container">
    <div class="columns">
      <div
        v-if="showAdvancedSearchForm"
        class="column is-one-third search-form-column"
      >
        <aside class="advanced-search-form">
          <advanced-search-form />
        </aside>
      </div>
      <div class="column">
        <div class="collection-selection">
          <div class="columns">
            <div class="column">
              <collection-tree-node
                v-if="!isCollectionLoading && collectionTree.length > 0"
                :collection="collectionTree[0]"
              />
              <div
                v-else
                class="progress-container"
              >
                <progress class="progress">
                  15%
                </progress>
              </div>
            </div>
            <div class="column">
              <p
                v-if="selectedCollection"
                class="collection-description"
              >
                {{ selectedCollection.description }} (paragraphe descriptif de la
                collection)
              </p>
            </div>
          </div>
        </div>
        <document-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import CollectionTreeNode from "@/components/CollectionTreeNode";
import DocumentList from "@/components/sections/DocumentList";
import AdvancedSearchForm from "@/components/AdvancedSearchForm.vue";

export default {
  name: "SearchPage",
  components: {
    CollectionTreeNode,
    DocumentList,
    AdvancedSearchForm,
  },
  computed: {
    ...mapState("user", ["current_user"]),
    ...mapState("layout", ["showAdvancedSearchForm"]),
    ...mapState("collections", {
      collectionTree: "fullHierarchy",
      isCollectionLoading: "isLoading",
    }),
    ...mapState("search", ["selectedCollectionId", "documents", "loadingStatus"]),
    ...mapGetters("collections", ["searchWithinTree"]),

    selectedCollection() {
      if (this.selectedCollectionId) {
        return this.searchWithinTree(this.selectedCollectionId);
      } else {
        return null;
      }
    },
  },
  watch: {
    selectedCollection() {
      this.performSearch();
    },
  },
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("search", ["performSearch", "setSelectedCollectionId"]),
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
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
  top: 24px;
  position: relative;
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
