<template>
  <div v-if="!isLoading">
    <div
      v-for="rootCollection of rootCollections"
      :key="rootCollection.id"
      class="column"
    >
      <!-- Collection card -->
      <collection-list-item
        :collection-id="rootCollection.id"
      />
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState} from "vuex";
import CollectionListItem from "@/components/CollectionListItem.vue"

export default {
  name: "CollectionsPage",
  components: {CollectionListItem},
  computed: {
    ...mapState("collections", ["isLoading"]),
    ...mapGetters("collections", ["rootCollections"]),
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
