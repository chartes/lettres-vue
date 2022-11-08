<template>
  <div>
    <span class="column" v-for="c in allCollectionsWithParents" :key="c.id">
      <collection-card :collection-id="String(c.id)" :editable="true" class="m-3" />
    </span>
  </div>
</template>

<script>
import CollectionCard from "@/components/CollectionCard.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "CollectionsPage",
  components: { CollectionCard },
  computed: {
    ...mapState("collections", {
      collectionTree: "fullHierarchy",
      isCollectionLoading: "isLoading",
      allCollectionsWithParents: "allCollectionsWithParents",
    }),
  },
  created() {
    this.fetchCollections();
  },
  methods: {
    ...mapActions("search", ["performSearch"]),
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
</style>
