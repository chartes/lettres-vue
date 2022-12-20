<template>
  <div v-if="!isLoading">
    <div class="search-container">
      <b-field>
        <b-input
          v-model="searchTerm"
          placeholder="Rechercher..."
          type="search"
        />
      </b-field>
    </div>
    <div v-if="searchTerm === ''">
      <!-- Collection cards -->
      <collection-list-item
        v-for="rootCollection of rootCollections"
        :key="rootCollection.id"
        class="m-3"
        :collection-id="rootCollection.id"
      />
    </div>
    <div v-else>
      <collection-search-result
        v-for="collection of searchResults"
        :key="collection.id"
        class="m-3"
        :collection-id="collection.id"
        :search-term="searchTerm"
      />
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState} from "vuex";
import CollectionListItem from "@/components/CollectionListItem.vue"
import CollectionSearchResult from "@/components/CollectionSearchResult.vue"

export default {
  name: "CollectionsPage",
  components: {
    CollectionListItem,
    CollectionSearchResult,
  },
  data() {
    return {
      searchTerm: "",
    }
  },
  computed: {
    ...mapState("collections", ["isLoading"]),
    ...mapGetters("collections", ["rootCollections"]),
    searchResults() {
      return this.$store.getters['collections/search'](this.searchTerm)
    }
  },
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/objects/collection.scss"
</style>
