<template>
  <div class="search-page-container">
    <div class="columns">
      <div class="column is-one-quarter">
        <aside class="collection-navbar">
          <div class="">
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
        </aside>
      </div>
      <div class="column">
        <p
          v-if="selectedCollection"
          class="collection-description"
        >
          {{ selectedCollection.description }}
        </p>
        <document-list />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import CollectionTreeNode from "@/components/CollectionTreeNode";
import DocumentList from '@/components/sections/DocumentList'

export default {
    name: "SearchPage",
    components: {
      CollectionTreeNode,
      DocumentList
    },
    computed: {
      ...mapState('user', ['current_user']),
      ...mapState('collections', {
        'collectionTree': 'fullHierarchy',
        'isCollectionLoading': 'isLoading'
      }),
      ...mapState('search', ['selectedCollectionId', 'documents', 'loadingStatus']),
      ...mapGetters('collections', ['searchWithinTree']),

      selectedCollection() {
        if (this.selectedCollectionId) {
          return this.searchWithinTree(this.selectedCollectionId)
        } else {
          return null;
        }
      }

    },
    watch: {
      selectedCollection() {
        this.performSearch()
      }
    },
    created() {
      this.fetchCollections()
    },
    methods: {
      ...mapActions('search', ['performSearch', 'setSelectedCollectionId']),
      ...mapActions('collections', {'fetchCollections': 'fetchAll'}),

    },
}
</script>

<style  scoped lang="scss">
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
.collection-navbar {
  display: block;
  height: 100%;
  width: 100%;

  border: 1px solid lightgrey;
  border-left: none;
  border-top: none;
  border-bottom: none;

  padding-top: 20px;
}
.progress-container {
  margin: 20px;
}
.collection-description {
  margin-top: 50px;
  padding-left: 30px;
}
</style>